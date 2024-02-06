import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { get } from "../commons/http";
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from '@mui/icons-material/Category';
import PublishIcon from '@mui/icons-material/Publish';

type UserLinks = {
  accounts: Array<[string, string]>;
  dashboards: [string, string][];
};

async function getLinks(account: string | undefined): Promise<UserLinks> {
  const accounts: string[] = await get<string[]>("api/accounts");
  let dashboards: string[] = [];

  if (account) {
    dashboards = (await get("api/dashboards")) as string[];
  }

  const accs: Array<[string, string]> = accounts.map((a) => [
    `/accounts/${a}`,
    a,
  ]);
  const dbs: Array<[string, string]> = dashboards.map((d) => [
    `/accounts/${account}/dashboards/${d}`,
    d,
  ]);

  return {
    accounts: accs,
    dashboards: dbs,
  };
}

export default function SidePanel() {
  let { account } = useParams();
  let [links, setLinks] = useState<UserLinks>({ accounts: [], dashboards: [] });

  useEffect(() => {
    getLinks(account).then(setLinks);
  }, [account]);

  return (
    <>
      <List>
        <ListItem>
          <ListItemIcon>
            <AccountBalanceIcon />
          </ListItemIcon>
          <ListItemText primary="Accounts" />
        </ListItem>
        {links.accounts.map(([link, text]) => (
          <ListItem key={link} disablePadding>
            <ListItemButton to={link} component={Link}>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {links.dashboards && (
        <List>
          <Divider />
          <ListItem>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboards" />
          </ListItem>
          {links.dashboards.map(([link, text]) => (
            <ListItem key={link} disablePadding>
              <ListItemButton to={link} component={Link}>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem>
            <ListItemIcon>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemButton to={"categories"} component={Link}>
              <ListItemText primary="Categories" />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <PublishIcon />
            </ListItemIcon>
            <ListItemButton to={"import"} component={Link}>
              <ListItemText primary="Import" />
            </ListItemButton>
          </ListItem>          
        </List>
      )}
    </>
  );
}
