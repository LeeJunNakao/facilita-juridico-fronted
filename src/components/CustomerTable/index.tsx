import {
  MRT_GlobalFilterTextField,
  MRT_TableBodyCellValue,
  flexRender,
  type MRT_ColumnDef,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Customer } from "protocols/entities";
import { IMask } from "react-imask";
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

type Props = {
  data: Customer[];
};

const CustomerTable = ({ data }: Props) => {
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <MRT_GlobalFilterTextField table={table} />
      </Box>

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
    </Stack>
  );
};

export default CustomerTable;
