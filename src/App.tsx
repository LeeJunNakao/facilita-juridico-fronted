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
import CustomerTable from "components/CustomerTable";
import { Customer } from "./protocols/entities";
import RouteMap from "components/RouteMap";
import { useSnackbar } from "notistack";

function App() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [routedCustomers, setRoutedCustomers] = useState<Customer[]>([]);

  const { enqueueSnackbar } = useSnackbar();

  const fetchCustomers = async () => {
    try {
      const data = await Services.getCustomers();

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

                {customers.length > 0 ? (
                  <Paper sx={{ padding: 2, marginY: 5 }}>
                    <CustomerTable data={customers} />
                  </Paper>
                ) : (
                  <Box marginY={5}>
                    <Typography variant="h5">
                      Nenhum cliente cadastrado
                    </Typography>
                  </Box>
                )}
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
