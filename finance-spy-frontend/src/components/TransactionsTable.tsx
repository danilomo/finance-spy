import { ThemeProvider, createTheme } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import type {} from "@mui/x-data-grid/themeAugmentation";
import { useProperties } from "../context/ParametersContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { get } from "../commons/http";

const columns: GridColDef[] = [
  { field: "date", headerName: "Date", width: 120 },
  { field: "value", headerName: "Value", width: 90 },
  { field: "description", headerName: "Description", width: 120 },
  { field: "categories", headerName: "Categories", width: 120 },
];

const rows = [
  {
    id: 1,
    value: 11895,
    date: "2022-05-01",
    description: "",
    categories: ["moemax"],
  },
  {
    id: 2,
    value: 39885,
    date: "2022-05-01",
    description: "",
    categories: ["xxxlutz"],
  },
  {
    id: 3,
    value: 3791,
    date: "2022-05-03",
    description: "",
    categories: ["hit"],
  },
  {
    id: 4,
    value: 3500,
    date: "2022-05-03",
    description: "",
    categories: ["plane_ticket"],
  },
  {
    id: 5,
    value: 97233,
    date: "2022-05-03",
    description: "",
    categories: ["plane_ticket"],
  },
  {
    id: 6,
    value: 3500,
    date: "2022-05-03",
    description: "",
    categories: ["plane_ticket"],
  },
  {
    id: 7,
    value: 97233,
    date: "2022-05-03",
    description: "",
    categories: ["plane_ticket"],
  },
  {
    id: 8,
    value: 21000,
    date: "2022-05-03",
    description: "",
    categories: ["wise"],
  },
  {
    id: 9,
    value: 3500,
    date: "2022-05-03",
    description: "",
    categories: ["plane_ticket"],
  },
  {
    id: 10,
    value: 3500,
    date: "2022-05-03",
    description: "",
    categories: ["plane_ticket"],
  },
  {
    id: 11,
    value: 1946,
    date: "2022-05-05",
    description: "",
    categories: ["hit"],
  },
  {
    id: 12,
    value: 1558,
    date: "2022-05-05",
    description: "",
    categories: ["burger_king"],
  },
  {
    id: 13,
    value: 4316,
    date: "2022-05-05",
    description: "",
    categories: ["internet"],
  },
  {
    id: 14,
    value: 8665,
    date: "2022-05-07",
    description: "",
    categories: ["cosmetics"],
  },
  {
    id: 15,
    value: 9583,
    date: "2022-05-07",
    description: "",
    categories: ["aldi"],
  },
  {
    id: 16,
    value: 20247,
    date: "2022-05-07",
    description: "",
    categories: ["course_fee"],
  },
  {
    id: 17,
    value: 1000,
    date: "2022-05-08",
    description: "",
    categories: ["lebara"],
  },
  {
    id: 18,
    value: 8000,
    date: "2022-05-10",
    description: "",
    categories: ["hairfree"],
  },
  {
    id: 19,
    value: 1000,
    date: "2022-05-11",
    description: "",
    categories: ["lebara"],
  },
  {
    id: 20,
    value: 5345,
    date: "2022-05-11",
    description: "",
    categories: ["mueller"],
  },
  {
    id: 21,
    value: 1015,
    date: "2022-05-11",
    description: "",
    categories: ["day_ticket"],
  },
  {
    id: 22,
    value: 5990,
    date: "2022-05-11",
    description: "",
    categories: ["zara"],
  },
  {
    id: 23,
    value: 2999,
    date: "2022-05-11",
    description: "",
    categories: ["deichmann"],
  },
  {
    id: 24,
    value: 597,
    date: "2022-05-13",
    description: "",
    categories: ["norma"],
  },
  {
    id: 25,
    value: 9825,
    date: "2022-05-13",
    description: "",
    categories: ["hit"],
  },
  {
    id: 26,
    value: 1299,
    date: "2022-05-14",
    description: "",
    categories: ["spotify"],
  },
  {
    id: 27,
    value: 1015,
    date: "2022-05-15",
    description: "",
    categories: ["day_ticket"],
  },
  {
    id: 28,
    value: 1430,
    date: "2022-05-15",
    description: "",
    categories: ["restaurant"],
  },
  {
    id: 29,
    value: 6986,
    date: "2022-05-15",
    description: "",
    categories: ["hit"],
  },
  {
    id: 30,
    value: 18890,
    date: "2022-05-15",
    description: "",
    categories: ["zara"],
  },
  {
    id: 31,
    value: 899,
    date: "2022-05-15",
    description: "",
    categories: ["kik"],
  },
  {
    id: 32,
    value: 3550,
    date: "2022-05-16",
    description: "",
    categories: ["douglas"],
  },
  {
    id: 33,
    value: 6015,
    date: "2022-05-16",
    description: "",
    categories: ["calzedonia"],
  },
  {
    id: 34,
    value: 3730,
    date: "2022-05-17",
    description: "",
    categories: ["rossmann"],
  },
  {
    id: 35,
    value: 3131,
    date: "2022-05-18",
    description: "",
    categories: ["hit"],
  },
  {
    id: 36,
    value: 7709,
    date: "2022-05-18",
    description: "",
    categories: ["uncategorized"],
  },
  {
    id: 37,
    value: 607,
    date: "2022-05-18",
    description: "",
    categories: ["hit"],
  },
  {
    id: 38,
    value: 1198,
    date: "2022-05-22",
    description: "",
    categories: ["burger_king"],
  },
  {
    id: 39,
    value: 8320,
    date: "2022-05-22",
    description: "",
    categories: ["aldi"],
  },
  {
    id: 40,
    value: 1945,
    date: "2022-05-23",
    description: "",
    categories: ["uncategorized"],
  },
  {
    id: 41,
    value: 3222,
    date: "2022-05-23",
    description: "",
    categories: ["edeka"],
  },
  {
    id: 42,
    value: 27900,
    date: "2022-05-24",
    description: "",
    categories: ["course_fee"],
  },
  {
    id: 43,
    value: 814,
    date: "2022-05-26",
    description: "",
    categories: ["aldi"],
  },
  {
    id: 44,
    value: 900,
    date: "2022-05-26",
    description: "",
    categories: ["day_ticket"],
  },
  {
    id: 45,
    value: 900,
    date: "2022-05-26",
    description: "",
    categories: ["day_ticket"],
  },
  {
    id: 46,
    value: 1970,
    date: "2022-05-27",
    description: "",
    categories: ["restaurant"],
  },
  {
    id: 47,
    value: 634,
    date: "2022-05-27",
    description: "",
    categories: ["starbucks"],
  },
  {
    id: 48,
    value: 6465,
    date: "2022-05-28",
    description: "",
    categories: ["aldi"],
  },
  {
    id: 49,
    value: 1438,
    date: "2022-05-28",
    description: "",
    categories: ["hit"],
  },
  {
    id: 50,
    value: 1135,
    date: "2022-05-29",
    description: "",
    categories: ["rewe"],
  },
];

export default function TransactionsTable() {
  const { account } = useParams();
  const properties = useProperties();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const from = properties?.getProperty("from")?.value;
    const to = properties?.getProperty("to")?.value;

    if (! (from && to)) {
      return;
    }
    setTransactions([]);
    
    get(`api/accounts/${account}/transactions`, {from, to})
    .then(response => {
      setTransactions(response);    
    });
    
  }, [account, properties?.store]);

  return (
    <div>
      <DataGrid rows={transactions} columns={columns} autoHeight checkboxSelection />
    </div>
  );
}
