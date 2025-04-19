import { Col, FormGroup, Form, Label, Row } from "reactstrap";
import Select from "react-select";
import SitemarkIcon from "../../components/SitemarkIcon";
import { Typography, Button } from "@mui/material";

function TemplateSelector({
  firstLevelGroup,
  selectedOption,
  setSelectedOption,
  dataSubmitted,
  secondLevelGroup,
  selectedTemplateOption,
  setSelectedTemplateOption,
  submitData,
  clearData,
}) {
  return (
    <Col
      style={{
        backgroundColor: "#f5f8fc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      md={4}
    >
      <Form style={{ width: "80%" }}>
        <SitemarkIcon />
        <FormGroup>
          <Label for="firstLevelSelection">
            <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
              Case Type
            </Typography>
          </Label>
          <Select
            id="firstLevelSelection"
            options={firstLevelGroup}
            value={selectedOption}
            onChange={setSelectedOption}
            isClearable
            placeholder="Select a Case Type"
            isDisabled={dataSubmitted}
          />
        </FormGroup>
        <FormGroup>
          <Label for="templateSelection">
            {" "}
            <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
              Template Type
            </Typography>
          </Label>
          <Select
            id="templateSelection"
            options={secondLevelGroup[selectedOption?.value]}
            value={selectedTemplateOption}
            onChange={setSelectedTemplateOption}
            isClearable
            placeholder="Select a Template Type"
            isDisabled={dataSubmitted}
          />
          <Button
            variant="contained"
            sx={{ marginTop: "15px" }}
            onClick={submitData}
            disabled={dataSubmitted}
          >
            Submit
          </Button>
          <Button
            variant="outlined"
            sx={{ marginTop: "15px", marginLeft: "15px" }}
            onClick={clearData}
          >
            Clear
          </Button>
        </FormGroup>
      </Form>
    </Col>
  );
}

export default TemplateSelector;
