// @ts-nocheck

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  TableSortLabel,
  Toolbar, Tooltip
} from "@mui/material";
import { Edit, Delete, Save, Cancel } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

function CustomToolbar(props) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Toolbar>
      <Tooltip title="New record">
        <IconButton aria-label="new record" onClick={props.onNewRecord}>
          <AddCircleOutlineIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete selected records">
        <IconButton aria-label="delete selected records" onClick={props.onBulkDelete}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Save table as...">
        <IconButton aria-label="save table as" onClick={handleClick}>
          <SaveAltIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => { props.onExport("csv"); setAnchorEl(null); }}>CSV</MenuItem>
        <MenuItem onClick={() => { props.onExport("gnucash"); setAnchorEl(null); }}>Gnucash</MenuItem>
        <MenuItem onClick={() => { props.onExport("xml"); setAnchorEl(null); }}>XML</MenuItem>
      </Menu>
    </Toolbar>
  );
}

const DateInput = (props: any) => {
  const [value, setValue] = useState<any>(dayjs(props.value));

  const handleChange = (newValue: any) => {
    setValue(newValue);
    props.onChange("date", newValue.format('YYYY-MM-DD'));
  };

  return (
    <>
      {props.editMode ? (
        <DatePicker value={value} onChange={handleChange} />
      ) : (
        <span>
          {value ? dayjs(value).format("DD MMM YYYY") : "No date selected"}
        </span>
      )}
    </>
  );
};

const MoneyInput = (props: any) => {
  const [value, setValue] = useState(props.value);

  const handleChange = (event: any) => {
    // Ensure the value is a multiple of 0.10 and is non-negative
    const newValue = Math.max(0, Math.round(event.target.value * 10) / 10);
    setValue(newValue);
    props.onChange("value", parseInt(newValue * 100));
  };

  return (
    <>
      {props.editMode ? (
        <input
          type="number"
          id="money"
          value={value}
          onChange={handleChange}
          placeholder="0.00"
          step="0.10"
          min="0"
        />
      ) : (
        <span>{value.toFixed(2)} €</span>
      )}
    </>
  );
};

const CellValue = (props) => {
  if (props.type == "date") {
    return <DateInput onChange={props.onChange} value={props.value} editMode={props.editMode} />;
  }

  if (props.type == "value") {
    return <MoneyInput onChange={props.onChange} value={props.value} editMode={props.editMode} />;
  }

  return <span>{props.value}</span>;
};

const DataTable = ({ data, onEdit, onDelete }: any) => {
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [editModeRow, setEditModeRow] = useState("");
  const [rowChanges, setRowChanges] = useState({});
  const [newRecord, setNewRecord] = useState(null);
  const [deleteRowId, setDeleteRowId] = useState(""); 

  useEffect(() => {
    setSelected([]);
    setOrder("asc");
    setOrderBy("");
  }, [data]);

  const handleSelect = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const selectAll = () => {
    if (selected.length == data.length) {
      setSelected([]);
      return;
    }

    setSelected(data.map((row) => row.id));
  };

  const handleEdit = (id) => {
    if (editModeRow == id) {
      onEdit(rowChanges);
      setEditModeRow("");
      setRowChanges({});
      setNewRecord(null);
      return;
    }

    setNewRecord(null);
    setRowChanges({});
    setEditModeRow(id);
  };

  const handleCancelEdit = (id) => {
    setEditModeRow("");
    setRowChanges({});
    setNewRecord(null);
    setDeleteRowId("");
  }

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleDelete = (id) => {
    if (!deleteRowId) {
      setDeleteRowId(id);
      setEditModeRow("");
      setRowChanges({});
      setNewRecord(null);
      return;
    }

    onDelete(id);
    setDeleteRowId("");
    setEditModeRow("");
    setRowChanges({});
    setNewRecord(null);
  };

  let sortedData = [...data].sort((a, b) => {
    const isAsc = order === "asc";
    if (a[orderBy] < b[orderBy]) {
      return isAsc ? -1 : 1;
    }
    if (a[orderBy] > b[orderBy]) {
      return isAsc ? 1 : -1;
    }
    return 0;
  });

  if (newRecord) {
    sortedData = [newRecord, ...sortedData];
  }

  if (data.length == 0) {
    return;
  }

  const onCellChange = (row) => {
    return (col, value) => {
      const newRowChanges = { ...rowChanges };
      newRowChanges[col] = value;
      newRowChanges.id = row.id;
      setRowChanges(
        newRowChanges
      );
    }
  };

  const menuHandler = {
    onNewRecord() {
      const date = dayjs();
      setNewRecord({ id: "new", date: date, value: 0, categories: [] });
      setEditModeRow("new");
      setRowChanges({ id: "new", date: date.format('YYYY-MM-DD'), value: 0 });
    },
    onBulkDelete() {
      console.log("OnBUlkDelete")
    },
    onExport(outputType) {
      console.log("OnExport " + outputType)
    }
  };

  const tableBody = sortedData.map((row) => {
    const editMode = row["id"] == editModeRow;

    return (
      <TableRow key={row.id}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected.indexOf(row.id) !== -1}
            onChange={() => handleSelect(row.id)}
          />
        </TableCell>
        {["date", "value", "categories"]
          .map((col) => [col, row[col]])
          .map(([col, value], i) => (
            <TableCell key={i}>
              <CellValue value={value} type={col} editMode={editMode} onChange={onCellChange(row)} />
            </TableCell>
          ))}
        <TableCell>
          {!(editMode || deleteRowId) && (
            <IconButton size="small" onClick={() => handleEdit(row.id)}>
              <Edit fontSize="inherit" />
            </IconButton>
          )}
          {!(editMode) && (
            <IconButton size="small" onClick={() => handleDelete(row.id)}>
              <Delete fontSize="inherit" />
            </IconButton>
          )}
          {(editMode) && (
            <IconButton size="small" onClick={() => handleEdit(row.id)} >
              <Save fontSize="inherit" />
            </IconButton>
          )}
          {(editMode || deleteRowId) && (
            <IconButton size="small" onClick={() => handleCancelEdit(row.id)}>
              <Cancel fontSize="inherit" />
            </IconButton>
          )}
        </TableCell>
      </TableRow>
    );
  });

  return (
    <div>
      <TableContainer component={Paper}>
        <CustomToolbar {...menuHandler} />
        <Table>
          <TableHead style={{ backgroundColor: "lightgray" }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox onClick={selectAll} />
              </TableCell>
              {["Date", "Value", "Categories"].map((key) => (
                <TableCell key={key}>
                  <TableSortLabel
                    active={orderBy === key}
                    direction={orderBy === key ? order : "asc"}
                    onClick={() => handleSort(key)}
                  >
                    <span style={{ fontWeight: "bold" }}>{key}</span>
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{tableBody}</TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DataTable;
