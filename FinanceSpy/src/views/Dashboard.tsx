// @ts-nocheck

import { useParams } from "react-router-dom";
import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { get } from "../commons/http";
import Chart from "../components/Chart";
import { useProperties } from "../context/ParametersContext";
import ParameterList from "../components/ParameterList";

const XS = [
  0, // 0 cells - invalid
  8, // 1 cell  - xs=8
  4, // 2 cells - xs=6
  3, // 3 cells - xs=4
  2, // 4 cells - xs=3
  2, // 5 cells - xs=2
  2, // 6 cells - xs=2
];

function useDashboard(rows) {
  const { account, dashboard } = useParams();
  const [data, setData] = useState({});
  const properties = useProperties();

  useEffect(() => {
    if (!rows) {
      return;
    }

    get(`/api/dashboards/${dashboard}/data`, {
      ...properties.propertyMap(),
      account,
    }).then((response) => {
      setData(response);
    });
  }, [account, dashboard, rows]);

  return data;
}

function Row({ cells, dashboard }) {
  const xsValue = XS[cells.charts.length] || 1;

  return (
    <>
      {cells &&
        cells.charts &&
        cells.charts.map((cell, i) => (
          <Grid item xs={xsValue} key={i}>
            <Chart template={cell} dashboard={dashboard} />
          </Grid>
        ))}
    </>
  );
}

const EMPTY_ROWS = [];

function useRows() {
  const { account, dashboard } = useParams();
  const [rows, setRows] = useState(EMPTY_ROWS);
  const properties = useProperties();

  useEffect(() => {
    setRows(EMPTY_ROWS);

    get(`/api/dashboards/${dashboard}`).then((response) => {
      if (response.parameters) {
        properties?.setProperties(response.parameters);
      }

      if (response.template) {
        setRows(response.template);
      }
    });
  }, [account, dashboard]);

  return rows;
}

export default function Dashboard() {
  const rows = useRows();
  const dashboard = useDashboard(rows);

  return (
    rows && (
      <>
        <ParameterList />
        <Grid container spacing={4}>
          {rows.map((row, i) => (
            <Row key={i} cells={row} dashboard={dashboard} />
          ))}
        </Grid>
      </>
    )
  );
}
