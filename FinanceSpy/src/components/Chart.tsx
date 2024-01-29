import { Colors } from "chart.js";
import { Paper, Typography } from "@mui/material";
import { useMemo } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TreeChart from "./charts/TreeChart";

import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import {
  ChartDataProps,
  ChartDataType,
  ChartTemplateProps,
} from "./Chart.types";

ChartJS.register(ArcElement, Tooltip, Legend, Colors);

function PieChart({ chartData }: ChartDataProps) {
  const labels = chartData.map(([_, label]) => label);
  const values = chartData.map(([value, _]) => value / 100.0);

  const data = useMemo(() => {
    return {
      labels,
      datasets: [
        {
          data: values,
        },
      ],
    };
  }, [chartData]);

  return <Pie data={data} />;
}

function TableChart({
  chartData,
  template,
}: ChartDataProps & ChartTemplateProps) {
  const columns = template.columns.split(",");
  const rows = chartData
    .map(([total, category]) => [total / 100.0, category])
    .filter(([total, _]) => new Number(total) > new Number(0.0));

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 300 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns.map((col, i) => (
              <TableCell key={i} align="right">
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow
              key={i}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {row.map((cell, j) => (
                <TableCell key={j} align="right">
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

type BudgetChartBarProps = {
  label: string;
  value: number;
  total: number;
};

function BudgetChartBar({ label, value, total }: BudgetChartBarProps) {
  const progress = Math.min(100.0, (value / total) * 100.0);

  let color: "success" | "warning" | "error" = "success";
  if (progress > 80.0) {
    color = "warning";
  } else if (progress < 80 && progress > 50) {
    color = "error";
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "20%" }}>
        <Typography
          variant="body2"
          color="text.secondary"
        >{`${label} - ${value}/${total}`}</Typography>
      </Box>
      <Box sx={{ width: "80%", mr: 1 }}>
        <LinearProgress variant="determinate" value={progress} color={color} />
      </Box>
    </Box>
  );
}

function BudgetChart({
  chartData,
  template,
}: ChartDataProps & ChartTemplateProps) {
  const budgets = chartData.map(([value, label]) => {
    return {
      label,
      value: value / 100.0,
      total: template.properties.budgets[label],
    };
  });

  return (
    <Box>
      {budgets.map(({ label, value, total }, idx) => (
        <BudgetChartBar label={label} value={value} total={total} key={idx} />
      ))}
    </Box>
  );
}

type DashboardProps = { dashboard: { [key: string]: ChartDataType } };

export default function Chart({
  template,
  dashboard,
}: ChartTemplateProps & DashboardProps) {
  const chartData = useMemo(() => {
    return dashboard[template.id];
  }, [template, dashboard]);

  if (!chartData) {
    return (
      <Paper>
        <Typography>{template.title}</Typography>
      </Paper>
    );
  }

  if (template.type === "pie") {
    return <PieChart chartData={chartData} />;
  }

  if (template.type === "table") {
    return <TableChart chartData={chartData} template={template} />;
  }

  if (template.type === "treemap") {
    return <TreeChart chartData={chartData} template={template} />;
  }

  if (template.type === "budget") {
    return <BudgetChart chartData={chartData} template={template} />;
  }

  return (
    <Paper>
      <Typography>{template.title}</Typography> <br />
      <Typography>
        {JSON.stringify(chartData) + "\n" + JSON.stringify(template)}
      </Typography>
    </Paper>
  );
}
