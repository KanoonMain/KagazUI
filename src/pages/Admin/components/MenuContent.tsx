import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import { useNavigate, useLocation } from "react-router-dom";

const mainListItems = [
  { text: "Home", icon: <HomeRoundedIcon />, link: "/admin" },
  { text: "Update Tables", icon: <InfoRoundedIcon />, link: "/admin/tables" },
  {
    text: "Upload Files",
    icon: <AnalyticsRoundedIcon />,
    link: "/admin/files",
  },
  {
    text: "Update MetaData",
    icon: <SettingsRoundedIcon />,
    link: "/admin/metadata",
  },
];

export default function MenuContent() {
  let location = useLocation();
  const navigate = useNavigate();
  function navigateTo(link) {
    navigate(link);
  }

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              selected={item.link === location.pathname}
              onClick={() => navigateTo(item.link)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
