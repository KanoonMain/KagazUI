import SideMenu from "./components/SideMenu";
import { useLocation } from "react-router-dom";
import UpdateTables from "./subPage/update-tables";
import UpdateMetaData from "./subPage/update-metadata";
import UploadFiles from "./subPage/upload-files";
import { Box } from "@mui/material";

export default function AdminMain() {
  let location = useLocation();

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <SideMenu />
        {/* Main content */}
        <div style={{ width: "calc(100vw -240px)", marginLeft: "20px" }}>
          <Box component="main">
            {location.pathname === "/admin" && <div>Landing Page</div>}
            {location.pathname === "/admin/tables" && <UpdateTables />}
            {location.pathname === "/admin/files" && <UploadFiles />}
            {location.pathname === "/admin/metadata" && <UpdateMetaData />}
          </Box>{" "}
        </div>
      </Box>

      {/* <SideMenu />
      <div style={{ marginLeft: "240px" }}>
        {location.pathname === "/admin/tables" && <UpdateTables />}
      </div> */}
    </>
  );
}
