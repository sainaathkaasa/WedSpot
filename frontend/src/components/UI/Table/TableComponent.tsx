import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useTheme } from '@mui/material';
import {
  MRT_TableBodyCellValue,
  flexRender,
  type MRT_RowData,
  type MRT_TableInstance,
} from 'material-react-table';

interface TableComponentProps<TData extends MRT_RowData = MRT_RowData> {
  table: MRT_TableInstance<TData>;
}

const TableComponent = <TData extends MRT_RowData = MRT_RowData>({ table }: TableComponentProps<TData>) => {
  const theme = useTheme();

  return (
    <TableContainer sx={{ overflowX: 'auto', maxWidth: '100%', WebkitOverflowScrolling: 'touch' }}>
      <Table>
        <TableHead style={{ background: theme.palette.primary.main }}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell
                  sx={{
                    fontSize: { xs: 8, md: 10 },
                    fontWeight: 500,
                    py: 0.7,
                    px: 1,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: theme.palette.primary.contrastText || '#ffff',
                    borderLeft: `0.6px solid ${theme.dashboard?.glassBorder || '#ecf0f5'}`,
                    width: header.column.getSize() !== 150 ? `${header.column.getSize()}px` : 'auto',
                    '& .MuiCheckbox-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      p: 0.5,
                      '& .MuiSvgIcon-root': {
                        fontSize: '18px',
                      },
                    },
                    '& .MuiCheckbox-root.Mui-checked': {
                      color: '#ffffff',
                    },
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
            <TableRow key={row.id} selected={row.getIsSelected()}>
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  sx={{
                    fontSize: { xs: 8, md: 10 },
                    fontWeight: 500,
                    py: 0.5,
                    px: 1,
                    border: `1px solid ${theme.dashboard?.glassBorder || '#ecf0f5'}`,
                    color: 'text.primary',
                    width: cell.column.getSize() !== 150 ? `${cell.column.getSize()}px` : 'auto',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    '& .MuiCheckbox-root': {
                      p: 0.5,
                      '& .MuiSvgIcon-root': {
                        fontSize: '18px',
                      },
                    },
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
