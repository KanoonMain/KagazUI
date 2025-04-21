import Select from "react-select";
import UpdateMetaForm from "../../Admin/components/updateMetaData";
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
} from "@mui/material";

export default function UpdateMetaData() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedTemplateOption, setSelectedTemplateOption] = useState(null);
  const [dataSubmitted, setDataSubmitted] = useState(false);
  const [firstLevelGroup, setFirstLevelGroup] = useState([]);
  const [secondLevelGroup, setSecondLevelGroup] = useState({});
  const [formItems, setFormItems] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (firstLevelGroup.length === 0) {
      getDropDownDataData();
    }
  }, []);

  const getDropDownDataData = async () => {
    AxiosService.processGetRequest(
      "http://127.0.0.1:5000/template/list-templates",
    ).then((resp) => {
      setFirstLevelGroup(resp["CaseTypes"]);
      setSecondLevelGroup(resp["TemplateTypes"]);
    });
  };

  const clearData = () => {
    setDataSubmitted(false);
    setSelectedOption(null);
    setSelectedTemplateOption(null);
    setFormItems({});
    setMessage("");
  };

  const submitData = () => {
    if (selectedOption && selectedTemplateOption) {
      AxiosService.processPostRequest(
        "http://127.0.0.1:5000/template/get-templates-feilds",
        {
          CaseType: selectedOption.label,
          templateType: selectedTemplateOption.label,
        },
      ).then((resp) => {
        setFormItems(resp);
        setDataSubmitted(true);
        setMessage("");
      });
    }
  };

  const updateMetaData = (formData) => {
    AxiosService.processPostRequest(
      "http://127.0.0.1:5000/template/update-templates-fields",
      {
        CaseType: selectedOption.label,
        templateType: selectedTemplateOption.label,
        replacement: formData,
      },
    ).then((resp) => {
      setMessage(resp);
    });
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
              isDisabled={dataSubmitted}
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
        <Alert severity="info" sx={{ mb: 2 }}>
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
    </Box>
  );
}
