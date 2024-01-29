// @ts-nocheck
import * as d3 from "d3";
import { useEffect, useMemo, useRef } from "react";
import { Buffer } from "buffer";

const colors = [
  "#3a405a",
  "#f9dec9",
  "#99b2dd",
  "#e9afa3",
  "#685044",
  "#fe5f55",
  "#e952de",
  "#ef5b5b",
  "#b10f2e",
  "#895737",
];

function drawTreeMap({ dataUri, difRef, chartData, wSize }) {
  if (!dataUri) {
    return;
  }

  difRef.innerHTML = "";

  const parents = chartData[0].parents;

  // set the dimensions and margins of the graph
  const margin = { top: 10, right: 10, bottom: 10, left: 10 };

  const width = wSize - margin.left - margin.right;
  const height = 0.8 * width - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3
    .select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // read json data
  const handler = function (data) {
    const root = d3
      .stratify()
      .id(function (d) {
        return d.name;
      }) // Name of the entity (column name is name in csv)
      .parentId(function (d) {
        return d.parent;
      })(
      // Name of the parent (column name is parent in csv)
      data,
    );
    root.sum(function (d) {
      return +d.value;
    }); // Compute the numeric value for each entity

    // Then d3.treemap computes the position of each element of the hierarchy
    d3
      .treemap()
      .size([width, height])
      .paddingTop(28)
      .paddingRight(7)
      .paddingInner(3)(root);

    // prepare a color scale
    const color = d3.scaleOrdinal().domain(parents).range(colors);

    // And a opacity scale
    const opacity = d3.scaleLinear().domain([10, 30]).range([0.5, 1]);

    // use this information to add rectangles:
    svg
      .selectAll("rect")
      .data(root.leaves())
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return d.x0;
      })
      .attr("y", function (d) {
        return d.y0;
      })
      .attr("width", function (d) {
        return d.x1 - d.x0;
      })
      .attr("height", function (d) {
        return d.y1 - d.y0;
      })
      .style("stroke", "black")
      .style("fill", function (d) {
        return color(d.parent.data.name);
      })
      .style("opacity", function (d) {
        return opacity(d.data.value);
      });

    // and to add the text labels
    svg
      .selectAll("text")
      .data(root.leaves())
      .enter()
      .append("text")
      .attr("x", function (d) {
        return d.x0 + 5;
      }) // +10 to adjust position (more right)
      .attr("y", function (d) {
        return d.y0 + 20;
      }) // +20 to adjust position (lower)
      .text(function (d) {
        return d.data.name; // d.data.name.replace('mister_', '')
      })
      .attr("font-size", "11px")
      .attr("fill", "white");

    // and to add the text labels
    svg
      .selectAll("vals")
      .data(root.leaves())
      .enter()
      .append("text")
      .attr("x", function (d) {
        return d.x0 + 5;
      }) // +10 to adjust position (more right)
      .attr("y", function (d) {
        return d.y0 + 35;
      }) // +20 to adjust position (lower)
      .text(function (d) {
        return d.data.value;
      })
      .attr("font-size", "11px")
      .attr("fill", "white");

    // Add title for the 3 groups

    svg
      .selectAll("titles")
      .data(
        root.descendants().filter(function (d) {
          return d.depth === 1;
        }),
      )
      .enter()
      .append("text")
      .attr("x", function (d) {
        return d.x0;
      })
      .attr("y", function (d) {
        return d.y0 + 21;
      })
      .text(function (d) {
        return d.data.name;
      })
      .attr("font-size", "19px")
      .attr("fill", function (d) {
        return color(d.data.name);
      });
  };

  d3.csv(dataUri).then((data) => {
    handler(data);
  });
}

export default function TreeChart({ chartData, template }) {
  const difRef = useRef(null);

  const dataUri = useMemo(() => {
    console.log(chartData[0].data);
    const data =
      chartData.length > 0 && chartData[0].data ? chartData[0].data : "";

    if (!data) {
      return null;
    }

    const uri =
      "data:text/plain;base64," + Buffer.from(data).toString("base64");

    return uri;
  }, [chartData]);

  useEffect(() => {
    drawTreeMap({
      dataUri,
      chartData,
      difRef,
      wSize: 900,
    });
  }, [dataUri, chartData]);

  return <div className="feature" id="my_dataviz" ref={difRef} />;
}
