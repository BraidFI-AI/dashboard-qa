"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useAppDispatch } from "@/redux/store/store";
import { setTitle } from "@/redux/slices/AppSlice";

const TidyTree: React.FC = () => {
  const dispatch = useAppDispatch();
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    dispatch(setTitle("Data Hierarchy"));

    const data = {
      name: "Root",
      children: [
        {
          name: "Child 1",
          children: [
            { name: "Grandchild 1" },
            { name: "Grandchild 2" },
            { name: "Grandchild 3" },
            {
              name: "Grandchild 4",
              children: [
                { name: "Grandchild 1" },
                { name: "Grandchild 2" },
                { name: "Grandchild 3" },
                { name: "Grandchild 4" },
                { name: "Grandchild 5" },
                { name: "Grandchild 6" },
                { name: "Grandchild 7" },
                { name: "Grandchild 8" },
              ],
            },
            { name: "Grandchild 5" },
            { name: "Grandchild 6" },
            { name: "Grandchild 7" },
            { name: "Grandchild 8" },
          ],
        },
        {
          name: "Child 2",
          children: [
            { name: "Grandchild 1" },
            { name: "Grandchild 2" },
            { name: "Grandchild 3" },
            { name: "Grandchild 4" },
            { name: "Grandchild 5" },
            { name: "Grandchild 6" },
            { name: "Grandchild 7" },
            { name: "Grandchild 8" },
          ],
        },
        {
          name: "Child 3",
          children: [
            { name: "Grandchild 1" },
            { name: "Grandchild 2" },
            { name: "Grandchild 3" },
            {
              name: "Grandchild 4",
              children: [
                { name: "Grandchild 1" },
                { name: "Grandchild 2" },
                { name: "Grandchild 3" },
                { name: "Grandchild 4" },
                { name: "Grandchild 5" },
                { name: "Grandchild 6" },
                { name: "Grandchild 7" },
                { name: "Grandchild 8" },
              ],
            },
            { name: "Grandchild 5" },
            { name: "Grandchild 6" },
            { name: "Grandchild 7" },
            { name: "Grandchild 8" },
          ],
        },
        {
          name: "Child 4",
          children: [
            { name: "Grandchild 1" },
            { name: "Grandchild 2" },
            { name: "Grandchild 3" },
            { name: "Grandchild 4" },
            { name: "Grandchild 5" },
            { name: "Grandchild 6" },
            { name: "Grandchild 7" },
            { name: "Grandchild 8" },
          ],
        },
        {
          name: "Child 5",
          children: [
            { name: "Grandchild 1" },
            { name: "Grandchild 2" },
            { name: "Grandchild 3" },
            { name: "Grandchild 4" },
            { name: "Grandchild 5" },
            { name: "Grandchild 6" },
            {
              name: "Grandchild 7",
              children: [
                { name: "Grandchild 1" },
                { name: "Grandchild 2" },
                { name: "Grandchild 3" },
                { name: "Grandchild 4" },
                { name: "Grandchild 5" },
                { name: "Grandchild 6" },
                { name: "Grandchild 7" },
                { name: "Grandchild 8" },
              ],
            },
            { name: "Grandchild 8" },
          ],
        },
        {
          name: "Child 6",
          children: [
            { name: "Grandchild 1" },
            { name: "Grandchild 2" },
            { name: "Grandchild 3" },
            { name: "Grandchild 4" },
            { name: "Grandchild 5" },
            { name: "Grandchild 6" },
            { name: "Grandchild 7" },
            { name: "Grandchild 8" },
          ],
        },
        {
          name: "Child 7",
          children: [
            { name: "Grandchild 1" },
            { name: "Grandchild 2" },
            { name: "Grandchild 3" },
            { name: "Grandchild 4" },
            { name: "Grandchild 5" },
            { name: "Grandchild 6" },
            { name: "Grandchild 7" },
            { name: "Grandchild 8" },
          ],
        },
        {
          name: "Child 8",
          children: [
            {
              name: "Grandchild 1",
              children: [
                { name: "Grandchild 1" },
                { name: "Grandchild 2" },
                { name: "Grandchild 3" },
                { name: "Grandchild 4" },
                { name: "Grandchild 5" },
                { name: "Grandchild 6" },
                { name: "Grandchild 7" },
                { name: "Grandchild 8" },
              ],
            },
            { name: "Grandchild 2" },
            { name: "Grandchild 3" },
            { name: "Grandchild 4" },
            { name: "Grandchild 5" },
            { name: "Grandchild 6" },
            {
              name: "Grandchild 7",
              children: [
                { name: "Grandchild 1" },
                { name: "Grandchild 2" },
                { name: "Grandchild 3" },
                { name: "Grandchild 4" },
                { name: "Grandchild 5" },
                { name: "Grandchild 6" },
                { name: "Grandchild 7" },
                { name: "Grandchild 8" },
              ],
            },
            { name: "Grandchild 8" },
          ],
        },
        {
          name: "Child 9",
          children: [
            { name: "Grandchild 1" },
            { name: "Grandchild 2" },
            { name: "Grandchild 3" },
            { name: "Grandchild 4" },
            { name: "Grandchild 5" },
            { name: "Grandchild 6" },
            { name: "Grandchild 7" },
            {
              name: "Grandchild 8",
              children: [
                { name: "Grandchild 1" },
                { name: "Grandchild 2" },
                { name: "Grandchild 3" },
                { name: "Grandchild 4" },
                { name: "Grandchild 5" },
                { name: "Grandchild 6" },
                { name: "Grandchild 7" },
                { name: "Grandchild 8" },
              ],
            },
          ],
        },
        {
          name: "Child 10",
          children: [
            { name: "Grandchild 1" },
            { name: "Grandchild 2" },
            { name: "Grandchild 3" },
            { name: "Grandchild 4" },
            { name: "Grandchild 5" },
            { name: "Grandchild 6" },
            { name: "Grandchild 7" },
            { name: "Grandchild 8" },
          ],
        },
      ],
    };

    const width = 928;
    const root: any = d3.hierarchy(data);
    const dx = 10;
    const dy = width / (root.height + 1);
    const tree = d3.tree().nodeSize([dx, dy]);

    root.sort((a: any, b: any) => d3.ascending(a.data.name, b.data.name));
    tree(root);

    let x0 = Infinity;
    let x1 = -x0;
    root.each((d: any) => {
      if (d.x > x1) x1 = d.x;
      if (d.x < x0) x0 = d.x;
    });

    const height = x1 - x0 + dx * 2;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-dy / 3, x0 - dx, width, height])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

    const link = svg
      .append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .selectAll("path")
      .data(root.links())
      .join("path")
      .attr(
        "d",
        (d3 as any)
          .linkHorizontal()
          .x((d: any) => d.y)
          .y((d: any) => d.x)
      );

    const node = svg
      .append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .selectAll("g")
      .data(root.descendants())
      .join("g")
      .attr("transform", (d: any) => `translate(${d.y},${d.x})`);

    node
      .append("circle")
      .attr("fill", (d: any) => (d.children ? "#555" : "#999"))
      .attr("r", 2.5);

    node
      .append("text")
      .attr("dy", "0.31em")
      .attr("x", (d: any) => (d.children ? -6 : 6))
      .attr("text-anchor", (d: any) => (d.children ? "end" : "start"))
      .text((d: any) => d.data.name)
      .attr("stroke", "white")
      .attr("paint-order", "stroke");
  }, []);

  return <svg ref={svgRef}></svg>;
};

export default TidyTree;
