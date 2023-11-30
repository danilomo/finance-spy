import DateRangeSelector from "../components/DateRangeSelector";
import Grid from "@mui/material/Grid";
import TransactionsTable from "../components/TransactionsTable";

export default function Account() {
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
