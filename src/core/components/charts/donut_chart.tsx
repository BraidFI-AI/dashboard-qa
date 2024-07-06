"use client";

import toDollarFormat from "@/core/utils/toDollarFormat";
import * as d3 from "d3";
import React, { useEffect } from "react";

type DonutChartProps = {
  data: { name: string; value: string; hover: string }[];
};

const DonutChart: React.FC<DonutChartProps> = ({ data }) => {
  const svgRef = React.useRef(null);

  useEffect(() => {
    const chartWidth = 700;

    d3.select(svgRef.current).selectAll("*").remove();

    const height = Math.min(chartWidth, 320);
    const radius = Math.min(chartWidth, height) / 1.4;

    const arc = d3
      .arc()
      .innerRadius(radius * 0.6)
      .cornerRadius(10)
      .outerRadius(radius - 1);

    const arcHover = d3
      .arc()
      .innerRadius(radius * 0.6)
      .cornerRadius(10)
      .outerRadius(radius + 4);

    const pie = d3
      .pie()
      .padAngle(1 / radius)
      .sort(null)
      .value((d: any) => d.hover);

    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.name))
      .range(
        d3
          .quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), data.length)
          .reverse()
          .map((color) =>
            color === "rgb(0, 0, 0)" ? "rgb(174, 173, 164)" : color
          )
      );

    const svg = d3
      .select(svgRef.current)
      .attr("width", chartWidth)
      .attr("height", height)
      .attr("viewBox", `-250 -220 ${1080} ${height * 1.2 + radius * 0.2}`);

    svg
      .append("g")
      .selectAll()
      .data(pie(data as any))
      .join("path")
      .attr("fill", (d: any) => color(d.data.name) as string)
      .attr("d", arc as any)
      .append("title")
      .text((d: any) => `${d.data.name}: ${d.data.hover.toString()}`);

    const legend = svg
      .append("g")
      .attr("transform", `translate(${chartWidth / 2.3}, 0)`)
      .selectAll(".legend")
      .data(pie(data as any))
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr(
        "transform",
        (d, i) => `translate(0,${(i - pie(data as any).length / 2) * 30})`
      );

    legend
      .append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", (d: any) => color(d.data.name) as string);

    legend
      .append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("font-size", "20px")
      .text((d: any) => `${d.data.name}: ${toDollarFormat(d.data.hover)}`);

    const arcs = svg
      .append("g")
      .selectAll()
      .data(pie(data as any))
      .join("g");

    arcs
      .append("path")
      .attr("fill", (d: any) => color(d.data.name) as string)
      .attr("d", arc as any);

    const textGroup = svg.append("g");

    arcs
      .on("mouseover", function (event, d) {
        d3.select(this)
          .select("path")
          .transition()
          .duration(300)
          .attr("d", arcHover(d as any) as any);

        const t = textGroup
          .append("text")
          .style("text-anchor", "middle")
          .attr("transform", `translate(${arcHover.centroid(d as any)})`)
          .style("font-size", "20px")
          .style("fill", "black")
          .style("pointer-events", "none");

        const hoverData = (d.data as any).hover;

        t.selectAll("tspan")
          .data(hoverData.split(" "))
          .join("tspan")
          .attr("x", 0)
          .attr("dy", "0em")
          .text((d: any) => toDollarFormat(d));
      })
      .on("mouseout", function (event, d) {
        d3.select(this)
          .select("path")
          .transition()
          .duration(300)
          .attr("d", arc(d as any) as any);

        textGroup.selectAll("text").remove();
      });
  }, [data]);

  return (
    <>
      <svg ref={svgRef} />
    </>
  );
};

export default DonutChart;
