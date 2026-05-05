import { Box } from '@mui/material';
import { type MRT_RowData, type MRT_TableInstance, MRT_TablePagination } from 'material-react-table';

interface CustomPaginationProps<TData extends MRT_RowData = MRT_RowData> {
  table: MRT_TableInstance<TData>;
}

const CustomPagination = <TData extends MRT_RowData = MRT_RowData>({ table }: CustomPaginationProps<TData>) => {
  return (
    <Box
      className="custom-pagination-container"
      sx={{
        '& .MuiTablePagination-actions': {
          '& .MuiButtonBase-root': {
            width: '32px !important',
            height: '32px !important',
            padding: '0 !important',
            display: 'flex !important',
            justifyContent: 'center !important',
            alignItems: 'center !important',
          },
          '& .MuiSvgIcon-root': {
            width: '24px !important',
            height: '24px !important',
            fontSize: '24px !important',
          },
        },
        '& .MuiTablePagination-selectLabel': {
          fontWeight: 600,
          fontSize: 10,
        },
        '& .MuiTablePagination-select': {
          fontSize: 10,
        },
        '& .MuiTablePagination-displayedRows': {
          fontWeight: 400,
          fontSize: 10,
        },
      }}
    >
      <MRT_TablePagination table={table} />
    </Box>
  );
};

export default CustomPagination;
