import { useEffect, useRef, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";
import { renderAsync } from "docx-preview";
import axiosService from "../../../services/axiosService";
import Select from "react-select";

export default function UploadFiles() {
  const [file, setFile] = useState(null);
  const [previewName, setPreviewName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dataSubmitted, setDataSubmitted] = useState(false);

  const [firstLevelGroup, setFirstLevelGroup] = useState([]);
  const [secondLevelGroup, setSecondLevelGroup] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedTemplateOption, setSelectedTemplateOption] = useState(null);

  const viewerRef = useRef(null);

  useEffect(() => {
    if (firstLevelGroup.length === 0) {
      getDropDownDataData();
    }
  }, []);

  const getDropDownDataData = async () => {
    try {
      const resp = await axiosService.processGetRequest(
        "http://127.0.0.1:5000/template/list-templates",
      );
      setFirstLevelGroup(resp["CaseTypes"]);
      setSecondLevelGroup(resp["TemplateTypes"]);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  const clearData = () => {
    setDataSubmitted(false);
    setSelectedOption(null);
    setSelectedTemplateOption(null);
    setFile(null);
    setPreviewName("");
    if (viewerRef.current) viewerRef.current.innerHTML = "";
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      setFile(selectedFile);
      setPreviewName(selectedFile.name);
      await previewDocx(selectedFile);
    } else {
      alert("Please upload a valid .docx file.");
    }
  };

  const previewDocx = async (docFile) => {
    const arrayBuffer = await docFile.arrayBuffer();
    viewerRef.current.innerHTML = "";
    await renderAsync(arrayBuffer, viewerRef.current, undefined, {
      className: "docx-preview",
      inWrapper: true,
    });
  };

  const handleUpload = async () => {
    if (!file || !selectedOption || !selectedTemplateOption) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("caseType", selectedOption.label);
    formData.append("templateType", selectedTemplateOption.label);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/template/upload-documents",
        {
          method: "POST",
          body: formData,
        },
      );

      if (response.ok) {
        alert("File uploaded successfully!");
        clearData();
      } else {
        alert("Upload failed.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred while uploading.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "calc(100vw - 350px)",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        // gap: 3,
      }}
    >
      <Typography variant="h4" fontWeight={600}>
        Upload Word Template
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
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

        <Grid size={{ xs: 12, md: 6 }}>
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
            fullWidth
            variant="outlined"
            color="secondary"
            onClick={clearData}
          >
            Clear
          </Button>
        </Grid>
      </Grid>

      <Box>
        <input
          type="file"
          accept=".docx"
          onChange={handleFileChange}
          style={{ display: "block", marginTop: "16px" }}
        />
        {previewName && (
          <Typography variant="body1" mt={1}>
            Previewing: <strong>{previewName}</strong>
          </Typography>
        )}
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={!file || uploading}
        sx={{ width: "200px", alignSelf: "flex-start" }}
      >
        {uploading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Upload File"
        )}
      </Button>

      {file && (
        <Paper
          elevation={3}
          sx={{
            mt: 3,
            p: 3,
            backgroundColor: "#fff",
            borderRadius: 2,
            boxShadow: 1,
            maxHeight: "600px",
            overflowY: "auto",
          }}
        >
          <div ref={viewerRef} />
        </Paper>
      )}
    </Box>
  );
}
