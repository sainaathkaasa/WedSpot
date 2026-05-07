import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useTheme, alpha, type Theme } from '@mui/material';
import {
  MRT_TableBodyCellValue,
  flexRender,
  type MRT_RowData,
  type MRT_TableInstance,
} from 'material-react-table';

interface TableComponentProps<TData extends MRT_RowData = MRT_RowData> {
  table: MRT_TableInstance<TData>;
}

const headerSx = (theme: Theme) => ({
  fontSize: theme.typography.caption.fontSize,
  fontWeight: 700,
  py: theme.spacing(1),
  px: theme.spacing(1.75),
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'text.secondary',
  borderBottom: `2px solid ${theme.palette.divider}`,
});

const cellSx = (theme: Theme) => ({
  ...theme.typography.body2,
  fontWeight: 500,
  py: theme.spacing(1),
  px: theme.spacing(1.75),
  borderBottom: `1px solid ${theme.palette.divider}`,
  color: 'text.primary',
});

const TableComponent = <TData extends MRT_RowData = MRT_RowData>({ table }: TableComponentProps<TData>) => {
  const theme = useTheme();

  return (
    <TableContainer sx={{
      overflowX: 'auto',
      maxWidth: '100%',
      WebkitOverflowScrolling: 'touch',
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 0,
    }}>
      <Table size="small">
        <TableHead sx={{ bgcolor: alpha(theme.palette.text.primary, 0.02) }}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell
                  sx={{
                    ...headerSx(theme),
                    width: header.column.getSize() !== 150 ? `${header.column.getSize()}px` : 'auto',
                  }}
                  align={header.column.id === "actions" ? "center" : "left"}
                  variant="head"
                  key={header.id}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.Header ?? header.column.columnDef.header, header.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              selected={row.getIsSelected()}
              sx={{
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) },
                '&.Mui-selected': { bgcolor: alpha(theme.palette.primary.main, 0.05) }
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  sx={{
                    ...cellSx(theme),
                    width: cell.column.getSize() !== 150 ? `${cell.column.getSize()}px` : 'auto',
                  }}
                  align={cell.column.id === "actions" ? "center" : "left"}
                  variant="body"
                  key={cell.id}
                >
                  <MRT_TableBodyCellValue cell={cell} table={table} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
