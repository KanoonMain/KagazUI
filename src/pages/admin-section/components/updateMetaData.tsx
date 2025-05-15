import { useState, useEffect } from "react";
import { Grid, Button, FormLabel, OutlinedInput } from "@mui/material";
import { styled } from "@mui/material/styles";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

type UpdateMetaDataProps = {
  formFields: Record<string, string>;
  generateTemplate: (a: any) => void;
};

export default function UpdateMetaData({
  formFields,
  generateTemplate,
}: UpdateMetaDataProps) {
  const [formValues, setFormValues] = useState(formFields);
  const handleChange =
    (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues((prev) => ({
        ...prev,
        [key]: event.target.value,
      }));
    };

  useEffect(() => {
    setFormValues(formFields);
  }, [formFields]);
  return (
    <Grid container spacing={3}>
      {Object.entries(formFields).map(([key]) => (
        <FormGrid size={{ xs: 12, md: 6 }} key={key}>
          <FormLabel htmlFor={key} required>
            {key}
          </FormLabel>
          <OutlinedInput
            id={key}
            name={key}
            required
            size="small"
            value={formValues[key]}
            onChange={handleChange(key)}
          />
        </FormGrid>
      ))}
      {Object.keys(formFields).length > 0 && (
        <Button
          variant="contained"
          sx={{ marginTop: "15px" }}
          onClick={() => generateTemplate(formValues)}
        >
          Update Data
        </Button>
      )}
    </Grid>
  );
}
