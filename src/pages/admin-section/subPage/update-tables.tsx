import { useState, useEffect } from "react";
import { Container, Button } from "reactstrap";
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
  Toolbar,
  ToolbarButton,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import {
  Box,
  Typography,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
  Backdrop,
} from "@mui/material";

export default function UpdateTables() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [rowsData, setRowsData] = useState([]);
  const [mappingData, setMappingData] = useState({});
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [isUpdated, setIsUpdated] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const apiRef = useGridApiRef();

  const tableNames = [
    { id: 1, value: "CaseTypes", label: "Case Types" },
    { id: 2, value: "TemplateTypes", label: "Template Types" },
  ];

  useEffect(() => {
    const timeout = setTimeout(() => {
      apiRef.current.autosizeColumns({
        includeOutliers: true,
        expand: true,
      });
    }, 100);

    return () => clearTimeout(timeout);
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
    console.log(oldRow);
    const isActive = newRow.isactive;
    newRow.isactive =
      isActive === true || isActive === "true" || isActive === "Active";

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
        ? { id: newId, name: "", isactive: true, added: true }
        : {
            id: newId,
            casetypeid: "",
            templatename: "",
            isactive: true,
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

    setLoading(true);
    axiosService
      .processPostRequest(
        `https://kagaz.ruaaventures.com/api/template/${selectedOption.value}`,
        filtered,
      )
      .then(async (resp) => {
        setIsUpdated(false);
        try {
          const { added = 0, updated = 0 } = resp;
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
      })
      .finally(() => setLoading(false));
  }

  const columns = {
    CaseTypes: [
      { field: "id", headerName: "ID", editable: false },
      { field: "name", headerName: "Case Name", editable: true },
      {
        field: "isactive",
        headerName: "Is Active",
        type: "singleSelect",
        editable: true,
        valueOptions: [
          { value: true, label: "Active" },
          { value: false, label: "Disabled" },
        ],
        valueFormatter: ({ value }) => {
          if (value != undefined) {
            return value === false || value === "false" ? "Disabled" : "Active";
          }
          return "";
        },
        renderCell: (params) =>
          params.value === true || params.value === "true"
            ? "Active"
            : "Disabled",
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
        field: "casetypeid",
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
        field: "templatename",
        headerName: "Template Name",
        editable: true,
      },
      {
        field: "price",
        headerName: "Price",
        editable: true,
        renderCell: (params) =>
          "₹" + params.value
       
      },
      {
        field: "isactive",
        headerName: "Is Active",
        type: "singleSelect",
        editable: true,
        valueOptions: [
          { value: true, label: "Active" },
          { value: false, label: "Disabled" },
        ],
        valueFormatter: ({ value }) =>
          value === false || value === "false" ? "Disabled" : "Active",
        renderCell: (params) =>
          params.value === true || params.value === "true"
            ? "Active"
            : "Disabled",
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
    if (!value?.value) return;
    setLoading(true);
    axiosService
      .processGetRequest(`https://kagaz.ruaaventures.com/api/template/getValues`)
      .then((resp) => {
        const result = resp["CaseTypes"].reduce((acc, item) => {
          acc[item.id] = item.label;
          return acc;
        }, {});
        setMappingData(result);
      })
      .catch(console.error);

    axiosService
      .processGetRequest(`https://kagaz.ruaaventures.com/api/template/${value.value}`)
      .then((resp) => {
        setIsUpdated(false);
        setRowsData(resp);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  return (
    <Container
      fluid
      style={{
        height: "100vh",
        width: "calc(100vw - 300px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "10px",
      }}
    >
      {/* Full Page Loader */}
      <Backdrop sx={{ color: "#fff", zIndex: 9999 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box sx={{ width: "100%", maxWidth: 900 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          Update Tables
        </Typography>
        <Divider sx={{ mb: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Select Table
          </Typography>
          <Select
            id="Table Selection"
            options={tableNames}
            value={selectedOption}
            onChange={updateTableName}
            isClearable
            placeholder="Choose a table..."
          />
        </Box>

        {message !== "" && (
          <Snackbar open autoHideDuration={6000} onClose={() => setMessage("")}>
            <Alert severity="info" onClose={() => setMessage("")}>
              {message}
            </Alert>
          </Snackbar>
        )}

        <Box sx={{ height: 500, width: "100%" }}>
          <Typography
            variant="subtitle2"
            sx={{ color: "text.secondary", mb: 1 }}
          >
            Table Data
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
            showToolbar={!!selectedOption}
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
              "& .MuiDataGrid-toolbarContainer": {
                padding: 1,
              },
            }}
          />
          {isUpdated && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button color="primary" onClick={updateTable}>
                Update Changes
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
}
