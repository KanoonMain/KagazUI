import { Container, Row, Col } from "reactstrap";
import TemplateSelector from "./templatecomponents/templateSelector";
import { useState, useEffect } from "react";
import AxiosService from "../services/axiosService";
import AddressForm from "./templatecomponents/AddressForm";
import Box from "@mui/material/Box";
import { Typography} from "@mui/material";

function CreateTemplate() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedTemplateOption, setSelectedTemplateOption] = useState(null);
  const [dataSubmitted, setDataSubmitted] = useState(false);
  const [firstLevelGroup, setFirstLevelGroup] = useState([]);
  const [secondLevelGroup, setSecondLevelGroup] = useState({});
  const [formItems, setFormItems] = useState({});
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // const firstLevelGroup = [
  //   { value: "civil_templates", label: "Civil Templates" },
  //   { value: "criminal_case_templates", label: "Criminal Templates" },
  // ];

  // const secondLevelGroup: { [key: string]: any[] } = {
  //   civil_templates: [{ value: "rental_lease_templates", label: "Rental Lease Templates" }],
  //   criminal_case_templates: [{ value: "land_case_templates", label: "Land Case Templates" }],
  // };
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

  async function generateTemplate() {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/template/generate-template-pdf",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            CaseType: selectedOption.label,
            templateType: selectedTemplateOption.label,
            replacements: formData,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("File download failed");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "GeneratedFile.pdf"; // You can make this dynamic
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (selectedOption === null && selectedTemplateOption != null) {
      setSelectedTemplateOption(null);
    }
  }, [selectedOption]);

  return (
    <Container style={{ margin: "0px" }} className="w-100 h-100" fluid={true}>
      <Row className="h-100">
        <TemplateSelector
          firstLevelGroup={firstLevelGroup}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          dataSubmitted={dataSubmitted}
          secondLevelGroup={secondLevelGroup}
          selectedTemplateOption={selectedTemplateOption}
          setSelectedTemplateOption={setSelectedTemplateOption}
          submitData={submitData}
          clearData={clearData}
        />
        <Col
          style={{
            backgroundColor: "#fcfcfc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {Object.keys(formItems).length > 0 && (
            <AddressForm
              formFields={formItems}
              setFormData={setFormData}
              isLoading={isLoading}
              generateTemplate={generateTemplate}
            />
          )}
          {Object.keys(formItems).length === 0 && dataSubmitted && (
            <Container
              fluid
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Row>
                <Typography variant="h3" sx={{ mb: 2 }}>
                  Sorry, Template not found!
                </Typography>
              </Row>
              <Row>
                <Box
                  component="img"
                  src="https://raw.githubusercontent.com/minimal-ui-kit/material-kit-react/69e780a40c455d664b2e13c525faf1d492a072a7/public/assets/illustrations/illustration-404.svg"
                  sx={{
                    width: 320,
                    height: "auto",
                    my: { xs: 5, sm: 10 },
                  }}
                />
              </Row>
            </Container>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default CreateTemplate;
