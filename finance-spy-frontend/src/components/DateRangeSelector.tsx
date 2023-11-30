import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import isBetweenPlugin from "dayjs/plugin/isBetween";
import { styled } from "@mui/material/styles";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import Grid from "@mui/material/Grid";
import { useMediaQuery } from "react-responsive";
import { useProperties } from "../context/ParametersContext";

dayjs.extend(isBetweenPlugin);

interface CustomPickerDayProps extends PickersDayProps<Dayjs> {}

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) =>
    prop !== "dayIsBetween" && prop !== "isFirstDay" && prop !== "isLastDay",
})<CustomPickerDayProps>(({ theme }) => ({
  ...{
    borderRadius: 0,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  ...{
    borderTopLeftRadius: "10%",
    borderBottomLeftRadius: "10%",
    borderTopRightRadius: "10%",
    borderBottomRightRadius: "10%",
  },
})) as React.ComponentType<CustomPickerDayProps>;

function Day(
  props: PickersDayProps<Dayjs> & { range?: [Dayjs, Dayjs] | null },
) {
  const { day, range, ...other } = props;
  const computed = {
    ...other,
    today: false,
    selected: false,
    disableRipple: true,
  };

  if (range == null) {
    return <PickersDay day={day} {...computed} />;
  }

  const [start, end] = range;
  const dayIsBetween = day.isBetween(start, end, null, "[]");

  if (!dayIsBetween) {
    return <PickersDay day={day} {...computed} />;
  }

  const isFirstDay = day.isSame(start, "day");
  const isLastDay = day.isSame(end, "day");

  return <CustomPickersDay {...other} day={day} />;
}

function None() {
  return <></>;
}

export default function DateRangeSelector() {
  const today = dayjs().hour(0).minute(0).second(0);
  const [range, setRange] = React.useState([today, today.add(1, "day")]);

  const properties = useProperties();

  React.useEffect(() => {
    let [start, end] = range;
    start = start.add(1, "day");
    end = end.add(1, "day");
    properties?.setValue("from", start.toISOString().substring(0, 10));
    properties?.setValue("to", end.toISOString().substring(0, 10));
  }, [range]);

  const updateRange = (date: Dayjs | null) => {
    if (date == null) {
      return;
    }
    const [start, end] = range;

    if (date.isSame(start)) {
      setRange([start, start]);
      return;
    }

    if (date.isSame(end)) {
      setRange([end, end]);
      return;
    }

    if (date.isBefore(start)) {
      setRange([date, end]);
      return;
    }

    if (date.isAfter(start) && date.isBefore(end)) {
      setRange([start, date]);
    }

    if (date.isAfter(end)) {
      setRange([start, date]);
      return;
    }
  };

  const style = {
    p: 2,
    height: "20rem",
    width: "14rem",
    fontSize: "small",
    margin: "0rem",
    padding: "0rem",
  };

  const resolutionNormal = useMediaQuery({
    query: "(min-width: 1224px)",
  });

  const resolutionBig = useMediaQuery({ query: "(min-width: 1824px)" });

  if (!(resolutionBig || resolutionNormal)) {
    return (
      <DateCalendar
        value={today}
        views={["day"]}
        onChange={updateRange}
        sx={style}
        slots={{
          day: Day,
          rightArrowIcon: None,
          leftArrowIcon: None,
        }}
        slotProps={{
          day: {
            range: range,
          } as any,
        }}
      />
    );
  }

  let nMonths = 6;
  let xs = 6;
  let months = [-2, -1, 0, 1, 2, 3];

  if (!resolutionBig) {
    nMonths = 3;
    xs = 12;
    months = [-1, 0, 1];
  }

  const items = months.map((i) => (
    <Grid  key={i} item xs={xs}>
      <DateCalendar
        value={today.add(i, "month")}
        views={["day"]}
        onChange={updateRange}
        sx={style}
        slots={{
          day: Day,
          rightArrowIcon: None,
          leftArrowIcon: None,
        }}
        slotProps={{
          day: {
            range: range,
          } as any,
        }}
      />
    </Grid>
  ));

  return (
    <div>
      <Grid container spacing={2}>
        {items}
      </Grid>
    </div>
  );
}
