import Select from "react-select";
import UpdateMetaForm from "../../Admin/components/updateMetaData";
import { Container } from "reactstrap";
import { useState, useEffect } from "react";
import AxiosService from "../../../services/axiosService";
import { Button, Alert } from "@mui/material";

export default function UpdateMetaData() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedTemplateOption, setSelectedTemplateOption] = useState(null);
  const [dataSubmitted, setDataSubmitted] = useState(false);
  const [firstLevelGroup, setFirstLevelGroup] = useState([]);
  const [secondLevelGroup, setSecondLevelGroup] = useState({});
  const [formItems, setFormItems] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (firstLevelGroup.length == 0) {
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

  function clearData() {
    setDataSubmitted(false);
    setSelectedOption(null);
    setSelectedTemplateOption(null);
    setFormItems({});
  }

  function submitData() {
    if (selectedOption != null && selectedTemplateOption != null) {
      AxiosService.processPostRequest(
        "http://127.0.0.1:5000/template/get-templates-feilds",
        {
          CaseType: selectedOption.label,
          templateType: selectedTemplateOption.label,
        },
      ).then((resp) => {
        setFormItems(resp);
        setDataSubmitted(true);
      });
    }
  }

  function updateMetaData(formData) {
    AxiosService.processPostRequest(
      "http://127.0.0.1:5000/template/update-templates-fields",
      {
        CaseType: selectedOption.label,
        templateType: selectedTemplateOption.label,
        replacement: formData
      },
    ).then((resp) => {
      setMessage(resp)
    });
  }

  useEffect(() => {
    if (selectedOption === null && selectedTemplateOption != null) {
      setMessage("")
      setSelectedTemplateOption(null);
    }
  }, [selectedOption]);

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
      }}
    >
      {/* Top Controls */}
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
          variant="contained"
          // sx={{ marginTop: "15px" }}
          onClick={submitData}
          disabled={dataSubmitted}
        >
          Submit
        </Button>
        <Button
          variant="outlined"
          sx={{ marginLeft: "15px" }}
          onClick={clearData}
        >
          Clear
        </Button>
      </div>
      {message != "" && <Alert severity="info">{message}.</Alert>}
      {/* Main Content Box */}
      <UpdateMetaForm
        formFields={formItems}
        generateTemplate={updateMetaData}
      />
    </Container>
  );
}
