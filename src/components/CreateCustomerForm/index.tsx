import * as yup from "yup";
import {
  Grid,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Services from "services";
import { Customer } from "protocols/entities";
import PhoneInput from "components/PhoneInput";
import { useState } from "react";

const schema = yup.object({
  name: yup.string().required("Campo obrigatório"),
  email: yup
    .string()
    .required("Campo obrigatório")
    .email("Deve ser um email válido"),
  phone: yup
    .string()
    .required("Campo obrigatório")
    .matches(/\(\d\d\) \d{4,5}\-\d{4}/, {
      message: "Deve ser um telefone válido",
    }),
  address: yup.object({
    x: yup.number().required("Deve ser um número inteiro"),
    y: yup.number().required("Deve ser um número inteiro"),
  }),
});

type Props = {
  refetch: () => void;
};

const CustomerForm = ({ refetch }: Props) => {
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: {
        x: 0,
        y: 0,
      },
    },
  });

  const createCustomer = async (
    data: Omit<Customer, "address"> & { address: { x: number; y: number } }
  ) => {
    try {
      setLoading(true);
      const phone = data.phone.replace(/[^0-9]/g, "");
      await Services.createCustomer({
        ...data,
        phone,
        address: [data.address.x, data.address.y],
      });
      enqueueSnackbar({
        message: "Cliente cadastrado com sucesso",
        variant: "success",
      });
      reset();
      refetch();
    } catch (error) {
      enqueueSnackbar({
        message: "Não foi possível cadastrar cliente",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container>
      <Grid item container spacing={2} xs={12} lg={12} xl={8}>
        <Grid item xs={12} md={2} lg={2} xl={3}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                variant="standard"
                label="Nome"
                error={Boolean(errors.name?.message)}
                helperText={errors.name?.message || ""}
                {...field}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={2} lg={2} xl={3}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                variant="standard"
                label="Email"
                error={Boolean(errors.email?.message)}
                helperText={errors.email?.message || ""}
                {...field}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={2} lg={2} xl={3}>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextField
                fullWidth
                variant="standard"
                label="Telefone"
                error={Boolean(errors.phone?.message)}
                helperText={errors.phone?.message || ""}
                {...field}
                InputProps={{ inputComponent: PhoneInput }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={4} xl={2} sx={{ position: "relative" }}>
          <Typography
            variant="caption"
            sx={{ position: "absolute", top: { xs: 0, lg: "-5px" } }}
          >
            Endereço
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Controller
                name="address.x"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    variant="standard"
                    label="x"
                    error={Boolean(errors.address?.x?.message)}
                    helperText={errors.address?.x?.message || ""}
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="address.y"
                control={control}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    variant="standard"
                    label="y"
                    error={Boolean(errors.address?.y?.message)}
                    helperText={errors.address?.y?.message || ""}
                    {...field}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={1} lg={1} xl={1}>
          <Grid container justifyContent={{ xs: "center", md: "flex-start" }}>
            <Grid item>
              {loading ? (
                <CircularProgress />
              ) : (
                <Button
                  size="large"
                  variant="contained"
                  onClick={handleSubmit(createCustomer)}
                >
                  Cadastrar
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CustomerForm;
