import {
  MRT_TableBodyCellValue,
  flexRender,
  type MRT_ColumnDef,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Customer } from "protocols/entities";
import { phoneMask } from "components/utils/formater";

const columns: MRT_ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Telefone",
    accessorFn: (row) => <span>{phoneMask(row.phone)}</span>,
  },
  {
    accessorKey: "address",
    header: "Endereço",
    accessorFn: (row) => (
      <div>
        ({row.address[0]}, {row.address[1]})
      </div>
    ),
  },
];

export type Filters = { name: string; email: string; phone: string };

type Props = {
  data: Customer[];
  filters: Filters;
  handleChangeFilter: (k: keyof Filters, value: string) => void;
};

const CustomerTable = ({ data, filters, handleChangeFilter }: Props) => {
  const table = useMaterialReactTable({
    columns,
    data,
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
      showGlobalFilter: true,
    },
    muiPaginationProps: {
      variant: "outlined",
    },
    paginationDisplayMode: "pages",
  });

  return (
    <Stack sx={{ m: "2rem 0" }}>
      <Typography variant="caption">Filtros</Typography>
      <Grid container columnGap={2}>
        <Grid item>
          <TextField
            label="name"
            size="small"
            value={filters.name}
            onChange={(e) => handleChangeFilter("name", e.target.value)}
          />
        </Grid>

        <Grid item>
          <TextField
            label="email"
            size="small"
            value={filters.email}
            onChange={(e) => handleChangeFilter("email", e.target.value)}
          />
        </Grid>

        <Grid item>
          <TextField
            label="phone"
            size="small"
            value={filters.phone}
            onChange={(e) => handleChangeFilter("phone", e.target.value)}
          />
        </Grid>
      </Grid>

      {data.length > 0 ? (
        <Paper sx={{ marginTop: 5 }}>
          <TableContainer>
            <Table>
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableCell align="left" variant="head" key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              (header.column.columnDef.Header as any) ??
                                header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} selected={row.getIsSelected()}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell align="left" variant="body" key={cell.id}>
                        {MRT_TableBodyCellValue({ cell, table })}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        <Box marginY={5}>
          <Typography variant="h5">Nenhum cliente cadastrado</Typography>
        </Box>
      )}
    </Stack>
  );
};

export default CustomerTable;
