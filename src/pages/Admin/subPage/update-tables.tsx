import { useState, useEffect } from "react";
import { Container, FormGroup, Form, Label, Button, Alert } from "reactstrap";
import Select from "react-select";
import axiosService from "../../../services/axiosService";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowModes,
  GridRowModesModel,
  GridRowId,
  useGridApiRef,
} from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import { Toolbar, ToolbarButton } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";

export default function UpdateTables() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [rowsData, setRowsData] = useState([]);
  const [mappingData, setMappingData] = useState({});
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const apiRef = useGridApiRef();
  const [isUpdated, setIsUpdated] = useState(false);
  const [message, setMessage] = useState("");

  const tableNames = [
    { id: 1, value: "CaseTypes", label: "Case Types" },
    { id: 2, value: "TemplateTypes", label: "Template Types" },
  ];

  useEffect(() => {
    apiRef.current?.autosizeColumns({ includeOutliers: true, expand: true });
  }, [rowsData, rowModesModel]);

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel((prevModel) => ({
      ...prevModel,
      [id]: { mode: GridRowModes.Edit },
    }));
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel((prevModel) => ({
      ...prevModel,
      [id]: { mode: GridRowModes.View },
    }));
    setIsUpdated(true);
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel((prevModel) => ({
      ...prevModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    }));
  };

  const handleRowModesModelChange = (newModel: GridRowModesModel) => {
    setRowModesModel(newModel);
  };

  const handleProcessRowUpdate = (newRow, oldRow) => {
    setRowsData((prevRows) =>
      prevRows.map((row) =>
        row.id === newRow.id ? { ...newRow, updated: true } : row,
      ),
    );
    setIsUpdated(true);
    return newRow;
  };

  const handleAddRow = () => {
    if (!selectedOption) return;
    setIsUpdated(true);
    const newId = Math.max(0, ...rowsData.map((row) => Number(row.id))) + 1;

    const newRow =
      selectedOption.value === "CaseTypes"
        ? { id: newId, name: "", isActive: 1, added: true }
        : {
            id: newId,
            caseTypeid: "",
            templateName: "",
            isActive: 1,
            added: true,
          };

    setRowsData((prev) => [...prev, newRow]);

    setRowModesModel((prevModel) => ({
      ...prevModel,
      [newId]: { mode: GridRowModes.Edit },
    }));
  };

  function CustomToolbar() {
    return (
      <Toolbar>
        <Tooltip title="Add record">
          <ToolbarButton onClick={handleAddRow}>
            <AddIcon fontSize="small" />
          </ToolbarButton>
        </Tooltip>
      </Toolbar>
    );
  }

  function updateTable() {
    const filtered = rowsData.filter(
      (obj) => "updated" in obj || "added" in obj,
    );

    axiosService
      .processPostRequest(
        `http://127.0.0.1:5000/template/${selectedOption.value}`,
        filtered,
      )
      .then(async (resp) => {
        setIsUpdated(false);
        try {
          const { added = 0, updated = 0 } = resp; // default to 0 if missing
          setMessage(`Added ${added} Rows and Updated ${updated} Rows`);
          await updateTableName(selectedOption);
        } catch (e) {
          setMessage("An error occurred while processing the response.");
          console.error(e);
        }
      })
      .catch((error) => {
        setMessage("Failed to update the table. Please try again.");
        console.error(error);
      });
    updateTableName(selectedOption);
  }

  const columns = {
    CaseTypes: [
      { field: "id", headerName: "ID", editable: false },
      { field: "name", headerName: "Case Name", editable: true },
      {
        field: "isActive",
        headerName: "Is Active",
        type: "singleSelect",
        editable: true,
        valueOptions: [
          { value: 1, label: "Active" },
          { value: 0, label: "Disabled" },
        ],
        valueFormatter: ({ value }) => {
          if (value === 0 || value === "0") {
            return "Disabled";
          } else {
            return "Active";
          }
        },
        renderCell: (params) => {
          return params.value === 1 || params.value === "1"
            ? "Active"
            : "Disabled";
        },
      },
      {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
          if (isInEditMode) {
            return [
              <GridActionsCellItem
                icon={<SaveIcon />}
                label="Save"
                onClick={handleSaveClick(id)}
                color="primary"
              />,
              <GridActionsCellItem
                icon={<CancelIcon />}
                label="Cancel"
                onClick={handleCancelClick(id)}
                color="inherit"
              />,
            ];
          }
          return [
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              onClick={handleEditClick(id)}
              color="inherit"
            />,
          ];
        },
      },
    ],
    TemplateTypes: [
      { field: "id", headerName: "ID", editable: false },
      {
        field: "caseTypeid",
        headerName: "Case Type",
        type: "singleSelect",
        editable: true,
        valueOptions: Object.entries(mappingData).map(([id, label]) => ({
          value: id,
          label: label,
        })),
        valueFormatter: (value) => mappingData[value] || value,
      },
      {
        field: "templateName",
        headerName: "Template Name",
        editable: true,
      },
      {
        field: "isActive",
        headerName: "Is Active",
        type: "singleSelect",
        editable: true,
        valueOptions: [
          { value: 1, label: "Active" },
          { value: 0, label: "Disabled" },
        ],
        valueFormatter: ({ value }) =>
          value === 0 || value === "0" ? "Disabled" : "Active",
        renderCell: (params) => {
          return params.value === 1 || params.value === "1"
            ? "Active"
            : "Disabled";
        },
      },
      {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
          if (isInEditMode) {
            return [
              <GridActionsCellItem
                icon={<SaveIcon />}
                label="Save"
                onClick={handleSaveClick(id)}
                color="primary"
              />,
              <GridActionsCellItem
                icon={<CancelIcon />}
                label="Cancel"
                onClick={handleCancelClick(id)}
                color="inherit"
              />,
            ];
          }
          return [
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
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
    setMessage("");
    axiosService
      .processGetRequest(`http://127.0.0.1:5000/template/getValues`)
      .then((resp) => {
        const result = resp["CaseTypes"].reduce((acc, item) => {
          acc[item.id] = item.label;
          return acc;
        }, {});
        setMappingData(result);
      });

    axiosService
      .processGetRequest(`http://127.0.0.1:5000/template/${value.value}`)
      .then((resp) => {
        setIsUpdated(false);
        setRowsData(resp);
      });
  }
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
              Table Selection
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
      {message != "" && <Alert severity="info">{message}.</Alert>}
      <Box sx={{ height: 500, width: "80%" }}>
        <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
          Data Grid
        </Typography>
        <DataGrid
          apiRef={apiRef}
          rows={rowsData}
          columns={selectedOption ? columns[selectedOption.value] : []}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          processRowUpdate={handleProcessRowUpdate}
          slots={{ toolbar: selectedOption ? CustomToolbar : null }}
          showToolbar={selectedOption ? true : false}
        />
        {isUpdated && (
          <Button
            color="primary"
            onClick={updateTable}
            style={{ marginTop: "15px" }}
          >
            Update Changes
          </Button>
        )}
      </Box>
    </Container>
  );
}
