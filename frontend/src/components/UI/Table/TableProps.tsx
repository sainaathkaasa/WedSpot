import { Box, Button, Tooltip, useTheme, alpha, IconButton, Typography } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import {
  MRT_GlobalFilterTextField,
  type MRT_RowData,
  type MRT_TableInstance,
} from 'material-react-table';
import CustomPagination from './CustomPagination';
import { handleExportExcel } from '@/utils/ExcelExport';
import ExcelImage from '@/assets/icons/excel.svg';
import { useAppSelector } from '@/store';

type ReplaceNaming = Record<string, string>;

interface ExcelDataConfig {
  data?: readonly object[];
  fileName: string;
  ignoreValues?: string[];
  keepTheSameNamingCase?: string[];
  replaceNaming?: ReplaceNaming;
}

interface TableToolbarProps<TData extends MRT_RowData = MRT_RowData> {
  HeaderText?: string;
  table: MRT_TableInstance<TData>;
  ExcelData?: ExcelDataConfig;
  isSmall?: boolean;
  hideFullScreen?: boolean;
  actionButton?: React.ReactNode;
}

export const TableBottomToolbar = <TData extends MRT_RowData = MRT_RowData>({ table }: TableToolbarProps<TData>) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        height: '36px',
        alignItems: 'center',
        padding: '0 !important',
      }}
    >
      <Box
        className="pagination-container"
        sx={{
          '& .MuiBox-root': { padding: '0px !important' },
          '& .MuiTypography-root': { fontSize: '10px !important' },
          '& .MuiTablePagination-select': { fontSize: '10px !important' },
          '& .MuiTablePagination-selectLabel': { fontSize: '10px !important', fontWeight: 600 },
          '& .MuiTablePagination-displayedRows': { fontSize: '10px !important', fontWeight: 400 },
          '& .MuiToolbar-root': {
            minHeight: '36px !important',
            height: '36px !important',
            padding: '0 8px !important',
          },
          '& .MuiTablePagination-actions .MuiButtonBase-root': {
            width: '28px !important',
            height: '28px !important',
            display: 'flex !important',
            justifyContent: 'center !important',
            alignItems: 'center !important',
          },
          '& .MuiTablePagination-actions .MuiButtonBase-root .MuiSvgIcon-root': {
            width: '22px !important',
            height: '22px !important',
            fontSize: 'unset !important',
          },
        }}
      >
        <CustomPagination table={table} />
      </Box>
    </Box>
  );
};

export const TableHeaderToolbar = <TData extends MRT_RowData = MRT_RowData>({
  HeaderText,
  table,
  ExcelData,
  actionButton,
}: TableToolbarProps<TData>) => {
  const userDateFormat = useAppSelector((state) => state.auth.user?.dateFormat);
  const theme = useTheme();
  const isSearchActive = !!table.getState().showGlobalFilter;

  return (
    <Box
      sx={{
        minHeight: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {HeaderText && (
        <Typography
          variant="h5"
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block',
            marginLeft: 1,
          }}
        >
          {HeaderText}
        </Typography>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0, ml: 'auto' }}>
        {isSearchActive && (
          <Box sx={{ width: { xs: '160px', sm: '260px' }, mr: 0.5 }}>
            <MRT_GlobalFilterTextField
              table={table}
              placeholder="Search items..."
              sx={{
                width: '100%',
                '& .MuiInputBase-root': {
                  height: '30px',
                  fontSize: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '6px',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  transition: 'border-color 0.2s ease',
                  '&:hover': {
                    borderColor: alpha(theme.palette.primary.main, 0.5),
                  },
                  '&.Mui-focused': {
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
                  },
                },
                '& .MuiInputBase-input': {
                  padding: '4px 8px',
                },
                '& .MuiSvgIcon-root': {
                  fontSize: '18px',
                  color: theme.palette.text.secondary,
                },
                '& .MuiInputAdornment-root': {
                  marginRight: '4px',
                },
              }}
            />
          </Box>
        )}

        <IconButton
          onClick={() => {
            const isShowing = !!table.getState().showGlobalFilter;
            table.setShowGlobalFilter(!isShowing);

            if (isShowing) {
              table.setGlobalFilter('');
            }
          }}
          sx={{
            p: 0.5,
            width: '32px',
            height: '32px',
            color: 'primary.main',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
            },
            '& .MuiSvgIcon-root': {
              fontSize: '20px',
            },
          }}
        >
          <SearchIcon />
        </IconButton>

        {ExcelData && (
          <Tooltip title="Excel Download">
            <Button
              onClick={() =>
                handleExportExcel(
                  ExcelData.data,
                  ExcelData.fileName,
                  userDateFormat || 'DD-MM-YYYY',
                  ExcelData.ignoreValues,
                  ExcelData.keepTheSameNamingCase,
                  ExcelData.replaceNaming,
                )
              }
              sx={{
                p: 0,
                minWidth: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  background: alpha(theme.palette.success.main, 0.05),
                },
              }}
            >
              <Box component="img" src={ExcelImage} alt="excel" sx={{ width: 18, height: 18 }} />
            </Button>
          </Tooltip>
        )}

        {!isSearchActive && actionButton && (
          <Box sx={{ ml: 1, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
            {actionButton}
          </Box>
        )}
      </Box>
    </Box>
  );
};
