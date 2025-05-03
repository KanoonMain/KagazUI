import Select from "react-select";
import UpdateMetaForm from "../components/updateMetaData";
import { useState, useEffect } from "react";
import AxiosService from "../../../services/axiosService";
import {
  Box,
  Grid,
  Button,
  Alert,
  Typography,
  Paper,
  Divider,
  Backdrop,
  CircularProgress,
} from "@mui/material";

export default function UpdateMetaData() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedTemplateOption, setSelectedTemplateOption] = useState(null);
  const [dataSubmitted, setDataSubmitted] = useState(false);
  const [firstLevelGroup, setFirstLevelGroup] = useState([]);
  const [secondLevelGroup, setSecondLevelGroup] = useState({});
  const [formItems, setFormItems] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // NEW

  useEffect(() => {
    if (firstLevelGroup.length === 0) {
      getDropDownDataData();
    }
  }, []);

  const getDropDownDataData = async () => {
    try {
      setLoading(true);
      const resp = await AxiosService.processGetRequest(
        "http://127.0.0.1:5000/template/list-templates",
      );
      setFirstLevelGroup(resp["CaseTypes"]);
      setSecondLevelGroup(resp["TemplateTypes"]);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearData = () => {
    setDataSubmitted(false);
    setSelectedOption(null);
    setSelectedTemplateOption(null);
    setFormItems({});
    setMessage("");
  };

  const submitData = async () => {
    if (selectedOption && selectedTemplateOption) {
      try {
        setLoading(true);
        const resp = await AxiosService.processPostRequest(
          "http://127.0.0.1:5000/template/get-templates-fields",
          {
            CaseType: selectedOption.label,
            templateType: selectedTemplateOption.label,
          },
        );
        setFormItems(resp);
        setDataSubmitted(true);
        setMessage("");
      } catch (err) {
        console.error("Submit error:", err);
        setMessage("Failed to fetch template fields.");
      } finally {
        setLoading(false);
      }
    }
  };

  const updateMetaData = async (formData) => {
    try {
      setLoading(true);
      const resp = await AxiosService.processPostRequest(
        "http://127.0.0.1:5000/template/update-templates-fields",
        {
          CaseType: selectedOption.label,
          templateType: selectedTemplateOption.label,
          replacement: formData,
        },
      );
      setMessage(resp);
    } catch (err) {
      console.error("Update metadata error:", err);
      setMessage("Failed to update metadata.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedOption === null && selectedTemplateOption !== null) {
      setSelectedTemplateOption(null);
      setMessage("");
    }
  }, [selectedOption]);

  return (
    <Box
      sx={{
        width: "calc(100vw - 350px)",
        padding: "20px",
        // margin: "auto",
        // padding: "20px",
        display: "flex",
        flexDirection: "column",
        // gap: 4,
      }}
    >
      <Typography variant="h4" fontWeight="bold">
        Update Template Metadata
      </Typography>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <Select
              id="firstLevelSelection"
              options={firstLevelGroup}
              value={selectedOption}
              onChange={setSelectedOption}
              isClearable
              placeholder="Select a Case Type"
              isDisabled={dataSubmitted}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Select
              id="templateSelection"
              options={secondLevelGroup[selectedOption?.value]}
              value={selectedTemplateOption}
              onChange={setSelectedTemplateOption}
              isClearable
              placeholder="Select a Template Type"
              isDisabled={dataSubmitted || !selectedOption}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={submitData}
              disabled={dataSubmitted}
            >
              Submit
            </Button>
          </Grid>

          <Grid size={{ xs: 12, md: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              color="secondary"
              onClick={clearData}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {message && (
        <Alert severity="info" sx={{ mt: 2 }}>
          {message}
        </Alert>
      )}

      <Divider sx={{ marginTop: "20px" }} />

      {Object.keys(formItems).length > 0 && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <UpdateMetaForm
            formFields={formItems}
            generateTemplate={updateMetaData}
          />
        </Paper>
      )}

      {/* FULL PAGE LOADER */}
      <Backdrop
        open={loading}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          color: "#fff",
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}
