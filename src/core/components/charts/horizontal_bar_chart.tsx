"use client";

import toDollarFormat from "@/core/utils/toDollarFormat";
import * as d3 from "d3";
import React, { useEffect } from "react";

type BarChartProps = {
  data: { name: string; value: string; hover: string }[];
  total: number;
  developerId: string;
  onClick: (data: any) => void;
  date: string | null;
};

const BarChart: React.FC<BarChartProps> = ({
  data,
  total,
  developerId,
  onClick,
  date,
}) => {
  const svgRef = React.useRef(null);

  useEffect(() => {
    const margin = { top: 20, right: 180, bottom: 420, left: 10 };
    const width = 400;
    const height = data.length * 56;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => +d.value) as number])
      .range([0, width]);

    const y = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, height])
      .padding(0.1);

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5));

    svg
      .append("g")
      .attr("class", "y-axis")
      .call(
        d3
          .axisLeft(y)
          .tickSize(0)
          .tickFormat(() => "")
      );

    const colorScale = d3
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

    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", 1) // Add 1px space between y-axis and bars
      .attr("y", (d) => y(d.name) as number)
      .attr("width", (d) => (d.value == "0" ? 0 : x(+d.value)))
      .attr("height", y.bandwidth())
      .attr("fill", (d: any) => colorScale(d.name) as string);

    // Create legend
    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(0, ${height + 65})`);

    legend
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (d, i) => i * 24) // Increased spacing
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", (d: any) => colorScale(d.name) as string);

    legend
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", 24)
      .attr("y", (d, i) => i * 24 + 8) // Increased spacing
      .attr("dy", ".35em")
      .style("font-size", "16px")
      .each(function (d) {
        const text = d3.select(this);
        text.text(`${d.name}: ${toDollarFormat(d.value)} `);
        text
          .append("tspan")
          .attr("fill", "#111111")
          .text((d: any) => d.hover)
          .style("font-size", "12px");
      });
  }, [data]);

  return (
    <>
      <svg ref={svgRef} />
    </>
  );
};

export default BarChart;
