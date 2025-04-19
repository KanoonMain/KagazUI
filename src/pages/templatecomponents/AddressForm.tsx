import { useEffect, useState } from "react";
import {
  Grid,
  Button,
  FormLabel,
  OutlinedInput,
  CircularProgress,
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
};

export default function AddressForm({
  formFields,
  setFormData,
  isLoading,
  generateTemplate,
}: AddressFormProps) {
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
  }, [formValues]);

  const handleChange =
    (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues((prev) => ({
        ...prev,
        [key]: event.target.value,
      }));
    };

  return (
    <Grid container spacing={3}>
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
      <Button
        variant="contained"
        sx={{ marginTop: "15px" }}
        onClick={generateTemplate}
      >
        Generate Template
      </Button>
      {isLoading && (
        <div>
          <CircularProgress /> Fetching File
        </div>
      )}
    </Grid>
  );
}
