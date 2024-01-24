import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import * as Services from "services";
import CustomerForm from "./components/CreateCustomerForm";
import SectionTitle from "./components/SectionTitle";
import CustomerTable, { Filters } from "components/CustomerTable";
import { Customer } from "./protocols/entities";
import RouteMap from "components/RouteMap";
import { useSnackbar } from "notistack";

function App() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [routedCustomers, setRoutedCustomers] = useState<Customer[]>([]);
  const [filters, setFilters] = useState<Filters>({
    name: "",
    email: "",
    phone: "",
  });

  const handleChangeFilter = (k: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [k]: value }));
  };

  const { enqueueSnackbar } = useSnackbar();

  const fetchCustomers = async () => {
    try {
      const data = await Services.getCustomers(filters);

      setCustomers(data);
    } catch (error) {
      enqueueSnackbar({
        variant: "error",
        message: "Não foi possível carregar clientes",
      });
    }
  };

  const fetchPath = async () => {
    try {
      const data = await Services.getCustomerRoute();

      setRoutedCustomers(data);
    } catch (error) {
      enqueueSnackbar({
        variant: "error",
        message: "Não foi possível carregar rotas",
      });
    }
  };

  const fetchData = () => {
    fetchCustomers();
    fetchPath();
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [filters]);

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        overflow: "auto",
        padding: 5,
        boxSizing: "border-box",
      }}
    >
      <Grid container justifyContent="center">
        <Grid item>
          <Typography variant="h1">Facilita Jurídico</Typography>
        </Grid>
      </Grid>
      <Grid container justifyContent="center">
        <Grid item>
          <Typography variant="h2">Gerenciamento de Clientes</Typography>
        </Grid>
      </Grid>
      <Grid container marginY={5}>
        <Grid container>
          <Grid item xs={12}>
            <Accordion sx={{ boxShadow: 0 }}>
              <AccordionSummary expandIcon={<ArrowDownwardIcon />}>
                <Grid item xs={12}>
                  <SectionTitle title="Cadastrar cliente" />
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <CustomerForm refetch={fetchData} />

                <CustomerTable
                  data={customers}
                  filters={filters}
                  handleChangeFilter={handleChangeFilter}
                />
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Grid>
      <Grid container marginY={5}>
        <Grid container>
          <Grid item xs={12}>
            <Accordion sx={{ boxShadow: 0 }}>
              <AccordionSummary expandIcon={<ArrowDownwardIcon />}>
                <Grid item xs={12}>
                  <SectionTitle title="Rota de clientes" />
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <RouteMap customers={routedCustomers} />
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
