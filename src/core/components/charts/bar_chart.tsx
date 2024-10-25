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
    const margin = { top: 20, right: 20, bottom: 50, left: 80 };
    const width = 650 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.hover))
      .range([0, width])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => +d.value) as number])
      .range([height, 0]);

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg.append("g").attr("class", "y-axis").call(d3.axisLeft(y).ticks(5));

    const colorScale = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.hover))
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
      .attr("x", (d) => x(d.hover) as number)
      .attr("y", (d) => y(+d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(+d.value))
      .attr("fill", (d: any) => "#4288B5")
      .append("title")
      .text((d) => `Value: ${toDollarFormat(d.value)}`);
  }, [data]);

  return (
    <>
      <svg ref={svgRef} />
    </>
  );
};

export default BarChart;
