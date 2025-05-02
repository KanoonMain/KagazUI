import { useEffect, useState } from "react";
import {
  Grid,
  Button,
  FormLabel,
  OutlinedInput,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

type AddressFormProps = {
  formFields: Record<string, string>;
  setFormData: (a: any) => void;
  isLoading: boolean;
  generateTemplate: (a: any) => void;
  templateDetails: { [key: string]: string };
};

export default function AddressForm({
  formFields,
  setFormData,
  isLoading,
  generateTemplate,
  templateDetails,
}: AddressFormProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [formValues, setFormValues] = useState(
    Object.keys(formFields).reduce(
      (acc, key) => {
        acc[key] = "";
        return acc;
      },
      {} as Record<string, string>,
    ),
  );

  useEffect(() => {
    setFormData(formValues);
  }, [formValues, setFormData]);

  const handleChange =
    (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues((prev) => ({
        ...prev,
        [key]: event.target.value,
      }));
    };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const steps = ["Template Details", "Fill Form", "Review & Generate"];

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        console.log(templateDetails);
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Template Information
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              {Object.entries(templateDetails).map(([key, label]) => (
                <Box
                  key={key}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #eee",
                    py: 1,
                  }}
                >
                  <Typography variant="body2" color="textSecondary">
                    {key}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {label || "-"}
                  </Typography>
                </Box>
              ))}
            </Paper>
            <Typography variant="body2">
              This template will collect the necessary address fields. Please
              make sure you fill the form carefully.
            </Typography>
            <Button variant="contained" sx={{ mt: 4 }} onClick={handleNext}>
              Continue
            </Button>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ p: 1 }}>
            <Grid container spacing={2}>
              {Object.entries(formFields).map(([key, label]) => (
                <FormGrid size={{ xs: 12, md: 6 }} key={key}>
                  <FormLabel htmlFor={key} required>
                    {label}
                  </FormLabel>
                  <OutlinedInput
                    id={key}
                    name={key}
                    placeholder={label}
                    autoComplete={key}
                    required
                    size="small"
                    value={formValues[key]}
                    onChange={handleChange(key)}
                  />
                </FormGrid>
              ))}
            </Grid>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 4,
              }}
            >
              <Button onClick={handleBack}>Back</Button>
              <Button variant="contained" onClick={handleNext}>
                Continue
              </Button>
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Review Your Details
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
              {Object.entries(formFields).map(([key, label]) => (
                <Box
                  key={key}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #eee",
                    py: 1,
                  }}
                >
                  <Typography variant="body2" color="textSecondary">
                    {label}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {formValues[key] || "-"}
                  </Typography>
                </Box>
              ))}
            </Paper>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                alignItems: "center",
              }}
            >
              <Button onClick={handleBack}>Back</Button>
              <Button
                variant="contained"
                onClick={generateTemplate}
                disabled={isLoading}
              >
                Generate Template
              </Button>
              {isLoading && (
                <Box sx={{ ml: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Stepper always at top */}
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step Content */}
      <Box>{renderStepContent(activeStep)}</Box>
    </Box>
  );
}
