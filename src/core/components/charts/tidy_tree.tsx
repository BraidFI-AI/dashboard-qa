"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { useRouter } from "next/navigation";

type TidyTreeProps = {
  data: any;
};

const TidyTree: React.FC<TidyTreeProps> = ({ data }) => {
  const ref = useRef<SVGSVGElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const width = 928;
    const marginTop = 10;
    const marginRight = 10;
    const marginBottom = 10;
    const marginLeft = 40;

    d3.select(ref.current).selectAll("*").remove();

    const root: any = d3.hierarchy(data);
    const dx = 10;
    const dy = (width - marginRight - marginLeft) / (1 + root.height);

    const tree = d3.tree().nodeSize([dx, dy]);
    const diagonal: any = d3
      .linkHorizontal()
      .x((d: any) => d.y)
      .y((d: any) => d.x);

    const svg = d3
      .select(ref.current)
      .attr("width", width)
      .attr("height", dx)
      .attr("viewBox", [-marginLeft, -marginTop, width, dx])
      .attr(
        "style",
        "max-width: 100%; height: auto; font: 11px sans-serif; user-select: none;"
      );

    const gLink = svg
      .append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);

    const gNode = svg
      .append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");

    function update(event: any, source: any) {
      const duration = event?.altKey ? 2500 : 250;
      const nodes = root.descendants().reverse();
      const links = root.links();

      tree(root);

      let left = root;
      let right = root;
      root.eachBefore((node: any) => {
        if (node.x < left.x) left = node;
        if (node.x > right.x) right = node;
      });

      const height = right.x - left.x + marginTop + marginBottom;

      const transition: any = svg
        .transition()
        .duration(duration)
        .attr("height", height)
        .attr("viewBox", [
          -marginLeft,
          left.x - marginTop,
          width,
          height,
        ] as any)
        .tween(
          "resize",
          (window.ResizeObserver
            ? null
            : () => () => svg.dispatch("toggle") as any) as any
        );

      const node = gNode.selectAll("g").data(nodes, (d: any) => d.id);

      const nodeEnter: any = node
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(${source.y0},${source.x0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

      nodeEnter
        .append("circle")
        .attr("r", 2.5)
        .attr("fill", (d: any) => (d._children ? "#555" : "#999"))
        .attr("stroke-width", 10)
        .on("click", (event: any, d: any) => {
          d.children = d.children ? null : d._children;
          update(event, d);
        });

      nodeEnter
        .append("text")
        .attr("dy", "0.31em")
        .attr("x", (d: any) => (d._children ? -6 : 6))
        .attr("text-anchor", (d: any) => (d._children ? "end" : "start"))
        .text((d: any) => d.data.name)
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .attr("stroke", "white")
        .attr("paint-order", "stroke")
        .on("click", (event: any, d: any) => {
          event.stopPropagation();
          router.push(d.data.onClickLink);
        });

      const nodeUpdate = node
        .merge(nodeEnter)
        .transition(transition)
        .attr("transform", (d: any) => `translate(${d.y},${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

      const nodeExit = node
        .exit()
        .transition(transition)
        .remove()
        .attr("transform", (d) => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

      const link = gLink.selectAll("path").data(links, (d: any) => d.target.id);

      const linkEnter: any = link
        .enter()
        .append("path")
        .attr("d", (d) => {
          const o = { x: source.x0, y: source.y0 };
          return diagonal({ source: o, target: o } as any);
        });

      link.merge(linkEnter).transition(transition).attr("d", diagonal);

      link
        .exit()
        .transition(transition)
        .remove()
        .attr("d", (d) => {
          const o = { x: source.x, y: source.y };
          return diagonal({ source: o, target: o });
        });

      root.eachBefore((d: any) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    root.x0 = dy / 2;
    root.y0 = 0;
    root.descendants().forEach((d: any, i: any) => {
      d.id = i;
      d._children = d.children;
      if (d.depth > 1) d.children = null;
    });

    update(null, root);
  }, [data]);

  return <svg ref={ref}></svg>;
};

export default TidyTree;
