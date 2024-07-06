"use client";

import React, { useEffect } from "react";
import * as d3 from "d3";
import toDollarFormat from "@/core/utils/toDollarFormat";

type DivergingStackChartProps = {
  data: { date: string; type: string; volume: number; isDebit: boolean }[];
  length: number;
};

const DivergingStackChart: React.FC<DivergingStackChartProps> = ({
  data,
  length,
}) => {
  const svgRef = React.useRef(null);

  const barWidth = 40;
  const expandedBarWidth = barWidth + 10;
  const chartWidth = length <= 15 ? 900 : length * barWidth + length * 32;

  useEffect(() => {
    d3.select(svgRef.current).selectAll("*").remove();

    const stackData = data.map((d) => ({
      date: d.date,
      type: d.type,
      volume: d.isDebit ? -d.volume : d.volume,
    }));

    const margin = { top: 20, right: 0, bottom: 20, left: 100 },
      width = chartWidth,
      height = 460 - margin.top - margin.bottom;

    const x = d3
      .scalePoint()
      .range([0, width])
      .padding(0.5)
      .domain(stackData.map((d) => d.date));

    const y = d3
      .scaleLinear()
      .range([height, 0])
      .domain([
        d3.min(stackData, (d) => d.volume),
        d3.max(stackData, (d) => d.volume),
      ] as any);

    const customColorScheme = [
      "#1ABC9C",
      "#2980B9",
      "#E74C3C",
      "#AEB6BF",
      "#DC7633",
      "#F5B041",
      "#F1C40F",
      "#8D6E63",
      "#D81B60",
    ];

    const color = d3.scaleOrdinal(customColorScheme);

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const stack = d3
      .stack()
      .keys(["volume"])
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetDiverging);

    const layers = stack(stackData as any);

    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "#ccc")
      .style("padding", "5px")
      .style("border-radius", "5px")
      .style("font-size", "12px")
      .style("z-index", "10");

    svg
      .selectAll(".layer")
      .data(layers)
      .enter()
      .append("g")
      .attr("class", "layer")
      .each(function (d) {
        d3.select(this)
          .selectAll("rect")
          .data(d)
          .enter()
          .append("rect")
          .attr(
            "x",
            (d: any, i: any) => (x as any)(stackData[i].date) - barWidth / 2
          )
          .attr("y", (d) => y(Math.max(d[0], d[1])))
          .attr("height", (d) => Math.abs(y(d[0]) - y(d[1])))
          .attr("width", barWidth)
          .attr("fill", (d, i) => color(stackData[i].type))
          .on("mouseover", function (event: any, d: any) {
            d3.select(this)
              .transition()
              .duration(300)
              .attr("width", expandedBarWidth)
              .attr("x", (x as any)(d.data.date) - expandedBarWidth / 2);

            // Get all transactions for the selected date
            const transactions = data.filter(
              (transaction) => transaction.date === d.data.date
            );

            // Generate the tooltip text
            const tooltipText = `Date: ${d.data.date}<br/>Type: ${
              d.data.type
            }<br/>Volume: ${toDollarFormat(d.data.volume)}`;

            // Show the tooltip and set its text
            tooltip.html(tooltipText);

            // Calculate the width and height of the tooltip
            const tooltipWidth =
              tooltip?.node()?.getBoundingClientRect().width ?? 0;
            const tooltipHeight =
              tooltip?.node()?.getBoundingClientRect().height ?? 0;

            // Set the position of the tooltip
            tooltip
              .style("visibility", "visible")
              .style("left", event.pageX - tooltipWidth / 2 + "px")
              .style("top", event.pageY - tooltipHeight - 10 + "px");
          })
          .on("mouseout", function (event: any, d: any) {
            d3.select(this)
              .transition()
              .duration(300)
              .attr("width", barWidth)
              .attr("x", (x as any)(d.data.date) - barWidth / 2);

            tooltip.style("visibility", "hidden");
          });
      });

    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + y(0) + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-size", "10px")
      .attr("dx", "0em")
      .attr("dy", "1em")
      .on("mouseover", function (event: any, d: any) {
        const barData = stackData.find((data) => data.date === d);

        svg
          .selectAll(".layer")
          .selectAll("rect")
          .filter((barData: any) => barData.data.date === d)
          .transition()
          .duration(300)
          .attr("width", expandedBarWidth)
          .attr("x", (x as any)(d) - expandedBarWidth / 2);

        const transactions = data.filter(
          (transaction) => transaction.date === d
        );

        // Generate the tooltip text
        let tooltipText = `Date: ${d}<br/>`;
        transactions.forEach((transaction, index) => {
          tooltipText += `${
            transaction.type != "" ? transaction.type : "N/a"
          } : ${toDollarFormat(transaction.volume)}<br/>`;
        });

        // Show the tooltip and set its text
        tooltip.html(tooltipText);

        // Calculate the width and height of the tooltip
        const tooltipWidth =
          tooltip?.node()?.getBoundingClientRect().width ?? 0;
        const tooltipHeight =
          tooltip?.node()?.getBoundingClientRect().height ?? 0;

        // Set the position of the tooltip
        tooltip
          .style("visibility", "visible")
          .style("left", event.pageX - tooltipWidth / 2 + "px")
          .style("top", event.pageY - tooltipHeight - 10 + "px");
      })
      .on("mouseout", function (event: any, d: any) {
        svg
          .selectAll(".layer")
          .selectAll("rect")
          .filter((barData: any) => barData.data.date === d)
          .transition()
          .duration(300)
          .attr("width", barWidth)
          .attr("x", (x as any)(d) - barWidth / 2);

        tooltip.style("visibility", "hidden");
      });

    svg
      .append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y).tickFormat((d: any) => toDollarFormat(d)));
  }, [data, barWidth, expandedBarWidth, length, chartWidth]);

  return (
    <>
      <svg ref={svgRef} />
    </>
  );
};

export default DivergingStackChart;
