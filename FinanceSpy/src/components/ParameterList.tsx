import { useProperties, Property } from "../context/ParametersContext";
import { Grid } from "@mui/material";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

type PropertyProps = { data: Property };

function DateProperty({ data }: PropertyProps) {
  const [value, setValue] = useState<Dayjs | null>(
    dayjs(data.value, "YYYY-MM-DD"),
  );
  const name = data.name;

  return <DatePicker label={name} defaultValue={value} />;
}

function CategoriesProperty({ data }: PropertyProps) {
  return <div>cat</div>;
}

function PropertyComponent({ data }: PropertyProps) {
  switch (data.type || "") {
    case "date":
      return <DateProperty data={data} />;
    case "category":
      return <CategoriesProperty data={data} />;
    default:
      return <></>;
  }
}

export default function ParameterList() {
  const properties = useProperties();
  const propertyList = properties?.properties() || [];

  return (
    <Grid container spacing={4}>
      {propertyList.map((property, i) => (
        <Grid item key={i} xs={2}>
          <PropertyComponent data={property} />
        </Grid>
      ))}
    </Grid>
  );
}
