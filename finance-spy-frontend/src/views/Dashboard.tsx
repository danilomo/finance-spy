// @ts-nocheck 

import { useParams } from "react-router-dom";
import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { get } from "../commons/http";
import Chart from "../components/Chart";
import { useProperties } from "../context/ParametersContext";
import  ParameterList  from "../components/ParameterList";

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormControl, FormLabel } from '@mui/material';

const data = {
  "template": [
    {
      "charts": [
        {
          "id": "overview1",
          "title": "Overview 1",
          "size": "",
          "type": "pie",
          "formula": {
            "columns": [
              "sum",
              "cat"
            ],
            "categories": [
              "main_categories"
            ],
            "categories_exclude": [

            ],
            "filter_string": ""
          },
          "columns": "",
          "properties": {
          }
        },
        {
          "id": "overview2",
          "title": "Overview 2",
          "size": "",
          "type": "table",
          "formula": {
            "columns": [
              "sum",
              "cat"
            ],
            "categories": [
              "main_categories"
            ],
            "categories_exclude": [

            ],
            "filter_string": ""
          },
          "columns": "Category, Total",
          "properties": {

          }
        }
      ]
    },
    {
      "charts": [
        {
          "id": "overview3",
          "title": "Monthly budget",
          "size": "",
          "type": "budget",
          "formula": {
            "columns": [
              "sum",
              "cat"
            ],
            "categories": [
              "main_categories"
            ],
            "categories_exclude": [

            ],
            "filter_string": ""
          },
          "columns": "",
          "properties": {
            "budgets": {
              "food": 450,
              "shopping": 700,
              "body_and_hygiene": 100
            }
          }
        }
      ]
    }
  ],
  "parameters": [

  ],
  "account": ""
};

const XS = [
  0, // 0 cells - invalid
  8, // 1 cell  - xs=8
  4, // 2 cells - xs=6
  3, // 3 cells - xs=4
  2, // 4 cells - xs=3
  2, // 5 cells - xs=2
  2, // 6 cells - xs=2
]

function useDashboard(rows) {
  const { account, dashboard } = useParams();
  const [data, setData] = useState({});
  const properties = useProperties();

  useEffect(() => {
    if (!rows) {
      return;
    }

    get(
      `/api/dashboards/${dashboard}/data`,
      { ...properties.propertyMap(), account }
    )
      .then(response => {
        setData(response);
      });
  }, [account, dashboard, rows]);

  return data;
}

function Row({ cells, dashboard }) {
  const xsValue = XS[cells.charts.length] || 1;

  return (
    <>
      {(cells && cells.charts) && cells.charts.map(
        (cell, i) => <Grid item xs={xsValue} key={i}>
          <Chart template={cell} dashboard={dashboard} />
        </Grid>
      )}
    </>
  )
}

const EMPTY_ROWS = [];

function useRows() {
  const { account, dashboard } = useParams();
  const [rows, setRows] = useState(EMPTY_ROWS);
  const properties = useProperties();


  useEffect(() => {
    setRows(EMPTY_ROWS);

    get(`/api/dashboards/${dashboard}`)
      .then(response => {
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

  return rows && (<>
    <ParameterList />
    <Grid container spacing={4}>
      {rows.map((row, i) => <Row key={i} cells={row} dashboard={dashboard} />)}
    </Grid>
  </>);

}