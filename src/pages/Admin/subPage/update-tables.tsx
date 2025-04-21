import { useState } from "react";
import Box from "@mui/material/Box";
import { Container } from "reactstrap";
import Select from "react-select";
import { FormGroup, Form, Label } from "reactstrap";
import { Typography } from "@mui/material";
import axiosService from "../../../services/axiosService";
import * as React from "react";
import EditIcon from "@mui/icons-material/Edit";
import {
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridActionsCellItem,
  GridRowId,
  useGridApiRef,
} from "@mui/x-data-grid";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

export default function UpdateTables() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [rowsData, setRowsData] = useState([]);
  const [mappingData, setMappingData] = useState({});
  const apiRef = useGridApiRef();
  const tableNames = [
    { id: 1, value: "CaseTypes", label: "Case Types" },
    { id: 2, value: "TemplateTypes", label: "Template Types" },
  ];
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {},
  );
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedRowId, setSelectedRowId] = React.useState<GridRowId | null>(
    null,
  );
  React.useEffect(() => {
    apiRef.current.autosizeColumns({ includeOutliers: true, expand: true });
  }, [rowsData, apiRef, rowModesModel, selectedRowId]);

  const columns = {
    CaseTypes: [
      { field: "id", headerName: "ID", editable: false },
      { field: "name", headerName: "Case Name", editable: true },
      {
        field: "isActive",
        headerName: "Is Active",
        // width: 100,
        type: "singleSelect",
        valueGetter: (value) => {
          if (value === "0" || value === 0) {
            return "Disabled";
          } else {
            return "Active";
          }
        },
        valueOptions: [0, 1],
      },
      {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        // width: 100,
        cellClassName: "actions",
        getActions: ({ id }) => {
          return [
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
            />,
          ];
        },
      },
    ],
    TemplateTypes: [
      { field: "id", headerName: "ID", width: 90, editable: false },
      {
        field: "caseTypeid",
        headerName: "Case Type",
        // width: 150,
        type: "singleSelect",
        valueOptions: Object.values(mappingData),
        valueGetter: (value) => {
          console.log(value, mappingData);
          return mappingData[value];
        },
      },
      {
        field: "templateName",
        headerName: "Template Name",
        // width: 150,
        editable: true,
      },
      {
        field: "isActive",
        headerName: "Is Active",
        // width: 100,
        type: "singleSelect",
        valueGetter: (value) => {
          if (value === "0" || value === 0) {
            return "Disabled";
          } else {
            return "Active";
          }
        },
        valueOptions: ["Active", "Disabled"],
      },
      {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        // width: 100,
        cellClassName: "actions",
        getActions: ({ id }) => {
          return [
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
            />,
          ];
        },
      },
    ],
  };

  function updateTableName(value) {
    setSelectedOption(value);
    axiosService
      .processGetRequest(`http://127.0.0.1:5000/template/getValues`)
      .then((resp) => {
        console.log(resp);
        const result = resp["CaseTypes"].reduce((acc, item) => {
          acc[item.id] = item.label;
          return acc;
        }, {});
        setMappingData(result);
      });
    axiosService
      .processGetRequest(`http://127.0.0.1:5000/template/${value.value}`)
      .then((resp) => {
        setRowsData(resp);
        apiRef.current?.updateRows(resp);
        apiRef.current?.autosizeColumns({
          expand: true,
        });
      });
  }

  const handleDialogOpen = (id: GridRowId) => {
    setSelectedRowId(id);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedRowId(null);
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    handleDialogOpen(id);
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  return (
    <Container
      fluid
      style={{
        height: "100vh",
        width: "calc(100vw - 300px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <Form style={{ width: "300px", marginBottom: "30px" }}>
        <FormGroup>
          <Label for="firstLevelSelection">
            <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
              Case Type
            </Typography>
          </Label>
          <Select
            id="Table Selection"
            options={tableNames}
            value={selectedOption}
            onChange={updateTableName}
            isClearable
          />
        </FormGroup>
      </Form>

      <Box sx={{ height: 300, width: "80%" }}>
        <DataGrid
          apiRef={apiRef}
          rows={rowsData}
          columns={selectedOption != null ? columns[selectedOption.value] : []}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
        />

        {/* Popup Dialog */}
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>Edit Row</DialogTitle>
          <DialogContent>
            {selectedRowId !== null ? (
              <div>You're now editing row ID: {selectedRowId}</div>
            ) : (
              <div>No row selected</div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleDialogClose}
              color="primary"
              variant="contained"
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}
