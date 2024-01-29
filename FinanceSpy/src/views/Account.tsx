import DateRangeSelector from "../components/DateRangeSelector";
import Grid from "@mui/material/Grid";
import TransactionsTable from "../components/TransactionsTable";
import { useMediaQuery } from "react-responsive";

export default function Account() {
  const resolutionNormal = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  
  if (!resolutionNormal) {
    return (<div>
      <DateRangeSelector />
      <TransactionsTable />
    </div>);
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <DateRangeSelector />
      </Grid>
      <Grid item xs={8}>
        <TransactionsTable />
      </Grid>
    </Grid>
  );
}
