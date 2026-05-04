import { useState } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    TextField,
    InputAdornment,
    Button,
    Avatar,
    alpha,
    useTheme,
    CircularProgress
} from '@mui/material';
import {
    Search as SearchIcon,
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Badge as BadgeIcon
} from '@mui/icons-material';
import DashboardHeader from '@/features/dashboard/components/DashboardHeader/DashboardHeader';
import { DashboardCard } from '@/features/dashboard';

import { useQuery } from '@tanstack/react-query';
import { USER_SERVICE } from '@/features/Users/api/user.api';

const Managers = () => {
    const theme = useTheme();
    const [searchTerm, setSearchTerm] = useState('');

    const { data: managers = [], isLoading } = useQuery({
        queryKey: ['managers'],
        queryFn: () => USER_SERVICE.getAllUsers(),
        select: (response) =>
            response.data?.filter(user => user.role?.toUpperCase() === 'MANAGER') ?? []
    });

    const filteredManagers = managers.filter(m =>
        m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ p: { xs: 2, md: 5 }, maxWidth: 1600, margin: '0 auto' }}>
            <DashboardHeader
                title="Platform Managers"
                subtitle="View and manage department managers across the WedsPot platform."
                tag="Security"
            />

            <DashboardCard>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, gap: 2, flexWrap: 'wrap' }}>
                    <TextField
                        placeholder="Search managers..."
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ width: { xs: '100%', sm: 300 } }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button variant="contained" size="small" sx={{ borderRadius: '10px' }}>Add Manager</Button>
                </Box>

                <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'transparent' }}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                                <TableCell sx={{ fontWeight: 800 }}>Manager Details</TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>Department</TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>Joined Date</TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 800 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
                                            <CircularProgress size={24} />
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : filteredManagers.map((manager) => (
                                <TableRow key={manager.id} sx={{ '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) } }}>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: theme.palette.info.main }}>
                                                <BadgeIcon fontSize="small" />
                                            </Avatar>
                                            <Box>
                                                <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>{manager.name}</Typography>
                                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>{manager.email}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }}>{manager.role}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                                            {manager.createdAt ? new Date(manager.createdAt).toLocaleDateString() : 'N/A'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={manager.enabled ? 'Active' : 'Inactive'}
                                            size="small"
                                            color={manager.enabled ? 'success' : 'default'}
                                            sx={{ fontWeight: 800, fontSize: '0.7rem' }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                                            <IconButton size="small" color="primary"><EditIcon fontSize="small" /></IconButton>
                                            <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                                            <IconButton size="small"><MoreVertIcon fontSize="small" /></IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DashboardCard>
        </Box>
    );
};

export default Managers;
