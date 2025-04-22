import { useLocation, useNavigate } from "react-router-dom";
import UpdateTables from "./subPage/update-tables";
import UpdateMetaData from "./subPage/update-metadata";
import UploadFiles from "./subPage/upload-files";
import { Box } from "@mui/material";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, ListItem } from '@mui/material';
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import Stack from "@mui/material/Stack";
const drawerWidth = 240;

const AdminMain = () => {
  let location = useLocation();
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

  const navigate = useNavigate();
  function navigateTo(link) {
    navigate(link);
  }

  return (
    <div style={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            marginTop: "50px"
          },
        }}
      >
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
      </Drawer>
      <main style={{ flexGrow: 1, padding: '10px' }}>
      <div style={{ width: "calc(100vw -240px)", marginLeft: "20px" }}>
          <Box component="main">
            {location.pathname === "/admin" && <div>Landing Page</div>}
            {location.pathname === "/admin/tables" && <UpdateTables />}
            {location.pathname === "/admin/files" && <UploadFiles />}
            {location.pathname === "/admin/metadata" && <UpdateMetaData />}
          </Box>{" "}
        </div>
      </main>
    </div>
  );
};

export default AdminMain;
