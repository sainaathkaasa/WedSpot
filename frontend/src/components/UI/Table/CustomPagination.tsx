import { Box, useTheme } from '@mui/material';
import { type MRT_RowData, type MRT_TableInstance, MRT_TablePagination } from 'material-react-table';

interface CustomPaginationProps<TData extends MRT_RowData = MRT_RowData> {
  table: MRT_TableInstance<TData>;
}

const CustomPagination = <TData extends MRT_RowData = MRT_RowData>({ table }: CustomPaginationProps<TData>) => {
  const theme = useTheme();

  return (
    <Box
      className="custom-pagination-container"
      sx={{
        '& .MuiTablePagination-actions': {
          '& .MuiButtonBase-root': {
            width: 32,
            height: 32,
            padding: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
          '& .MuiSvgIcon-root': {
            width: 24,
            height: 24,
            fontSize: 24,
          },
        },
        '& .MuiTablePagination-selectLabel': {
          fontWeight: 600,
          fontSize: theme.typography.caption.fontSize,
        },
        '& .MuiTablePagination-select': {
          fontSize: theme.typography.caption.fontSize,
        },
        '& .MuiTablePagination-displayedRows': {
          fontWeight: 400,
          fontSize: theme.typography.caption.fontSize,
        },
      }}
    >
      <MRT_TablePagination table={table} />
    </Box>
  );
};

export default CustomPagination;
