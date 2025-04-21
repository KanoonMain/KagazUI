import { useEffect, useRef, useState } from "react";
import { Container, Button, Input, Spinner } from "reactstrap";
import { renderAsync } from "docx-preview";
import axiosService from "../../../services/axiosService";
import Select from "react-select";

export default function UploadFiles() {
  const [file, setFile] = useState(null);
  const [previewName, setPreviewName] = useState("");
  const [uploading, setUploading] = useState(false);
  const viewerRef = useRef(null);
   const [selectedOption, setSelectedOption] = useState(null);
    const [selectedTemplateOption, setSelectedTemplateOption] = useState(null);
    const [dataSubmitted, setDataSubmitted] = useState(false);
    const [firstLevelGroup, setFirstLevelGroup] = useState([]);
    const [secondLevelGroup, setSecondLevelGroup] = useState({});
    // const [message, setMessage] = useState("");
  
    useEffect(() => {
      if (firstLevelGroup.length == 0) {
        getDropDownDataData();
      }
    }, []);
  
    const getDropDownDataData = async () => {
      axiosService.processGetRequest(
        "http://127.0.0.1:5000/template/list-templates",
      ).then((resp) => {
        setFirstLevelGroup(resp["CaseTypes"]);
        setSecondLevelGroup(resp["TemplateTypes"]);
      });
    };
  
    function clearData() {
      setDataSubmitted(false);
      setSelectedOption(null);
      setSelectedTemplateOption(null);
      setFile(null)
      viewerRef.current.innerHTML = ""; // clear previous preview
    }
  


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
    viewerRef.current.innerHTML = ""; // clear previous preview
    await renderAsync(arrayBuffer, viewerRef.current, undefined, {
      // You can customize styles here if needed
      className: "docx-preview",
      inWrapper: true,
    });
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("caseType", selectedOption.label);
    formData.append("templateType", selectedTemplateOption.label);

    try {
      const response = await fetch("http://127.0.0.1:5000/template/upload-documents", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("File uploaded successfully!");
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
    <Container
      fluid
      style={{
        height: "100vh",
        width: "calc(100vw - 300px)",
        padding: "20px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflowY: "auto",
        gap: "20px",
      }}
    >
            <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
              <div style={{ width: "400px" }}>
                <Select
                  id="firstLevelSelection"
                  options={firstLevelGroup}
                  value={selectedOption}
                  onChange={setSelectedOption}
                  isClearable
                  placeholder="Select a Case Type"
                  isDisabled={dataSubmitted}
                />
              </div>
              <div style={{ width: "400px" }}>
                <Select
                  id="templateSelection"
                  options={secondLevelGroup[selectedOption?.value]}
                  value={selectedTemplateOption}
                  onChange={setSelectedTemplateOption}
                  isClearable
                  placeholder="Select a Template Type"
                  isDisabled={dataSubmitted}
                />
              </div>
              <Button
                variant="outlined"
                sx={{ marginLeft: "15px" }}
                onClick={clearData}
              >
                Clear
              </Button>
            </div>
      <Input
        type="file"
        accept=".docx"
        onChange={handleFileChange}
        style={{ maxWidth: "400px" }}
      />
      {previewName && <p>Previewing: {previewName}</p>}
      <Button color="primary" onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? <Spinner size="sm" /> : "Upload File"}
      </Button>
      {file != null && (
      <div
        ref={viewerRef}
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "800px",
        }}
      />)}
    </Container>
  );
}
