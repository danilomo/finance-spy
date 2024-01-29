import SidePanel from "../components/SidePanel";
import { PropertiesContext } from "../context/ParametersContext";
import { CategoryContext } from "../context/CategoriesContext";
import {
  createBrowserRouter,
  Outlet,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import Grid from "@mui/material/Grid";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Account from "../views/Account";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Dashboard from "../views/Dashboard";

const Layout = () => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Finance SPY
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>

      <Grid
        container
        spacing={2}
        style={{
          minWidth: "100%",
          height: "100vh",
        }}
      >
        <Grid item xs={2} sx={{ p: 2 }}>
          <SidePanel />
        </Grid>
        <Grid item xs={10} sx={{ p: 2 }}>
          <Box m={2} pt={3}>
            <Outlet />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

const router = createBrowserRouter([{ path: "*", Component: Root }]);

function Root() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<div></div>} />
        <Route path="accounts/:account/" element={<Account />} />
        <Route
          path="accounts/:account/dashboards/:dashboard"
          element={<Dashboard />}
        />
      </Route>
    </Routes>
  );
}

const App = () => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <CategoryContext>
      <PropertiesContext>
        <RouterProvider router={router} />
      </PropertiesContext>
    </CategoryContext>
  </LocalizationProvider>
);

export default App;
