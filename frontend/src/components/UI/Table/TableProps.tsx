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
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        height: 36,
        alignItems: 'center',
        padding: 0,
      }}
    >
      <Box
        className="pagination-container"
        sx={{
          '& .MuiTypography-root': { fontSize: theme.typography.caption.fontSize },
          '& .MuiTablePagination-select': { fontSize: theme.typography.caption.fontSize },
          '& .MuiTablePagination-selectLabel': { fontSize: theme.typography.caption.fontSize, fontWeight: 600 },
          '& .MuiTablePagination-displayedRows': { fontSize: theme.typography.caption.fontSize, fontWeight: 400 },
          '& .MuiToolbar-root': {
            minHeight: 36,
            height: 36,
            padding: theme.spacing(0, 1),
          },
          '& .MuiTablePagination-actions .MuiButtonBase-root': {
            width: 28,
            height: 28,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
          '& .MuiTablePagination-actions .MuiButtonBase-root .MuiSvgIcon-root': {
            width: 22,
            height: 22,
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
        minHeight: 32,
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
            color: 'text.primary',
            marginLeft: theme.spacing(1),
          }}
        >
          {HeaderText}
        </Typography>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0, ml: 'auto' }}>
        {isSearchActive && (
          <Box sx={{ width: { xs: '160px', sm: '260px' }, mr: theme.spacing(0.5) }}>
            <MRT_GlobalFilterTextField
              table={table}
              placeholder="Search items..."
              sx={{
                width: '100%',
                '& .MuiInputBase-root': {
                  height: 30,
                  fontSize: theme.typography.body2.fontSize,
                  backgroundColor: 'background.paper',
                  borderRadius: theme.shape.borderRadius,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  transition: theme.dashboard.transition,
                  '&:hover': {
                    borderColor: alpha(theme.palette.primary.main, 0.5),
                  },
                  '&.Mui-focused': {
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
                  },
                },
                '& .MuiInputBase-input': {
                  padding: theme.spacing(0.5, 1),
                },
                '& .MuiSvgIcon-root': {
                  fontSize: 18,
                  color: 'text.secondary',
                },
                '& .MuiInputAdornment-root': {
                  marginRight: theme.spacing(0.5),
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
            p: theme.spacing(0.5),
            width: 32,
            height: 32,
            color: 'primary.main',
            transition: theme.dashboard.transition,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
            },
            '& .MuiSvgIcon-root': {
              fontSize: 20,
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
                minWidth: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: theme.dashboard.transition,
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
          <Box sx={{ ml: theme.spacing(1), display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
            {actionButton}
          </Box>
        )}
      </Box>
    </Box>
  );
};
