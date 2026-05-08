import { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Button,
    alpha,
    useTheme,
    TextField,
    InputAdornment,
    LinearProgress,
    Stack,
    CircularProgress,
    Menu,
    MenuItem,
} from '@mui/material';
import {
    Add as AddIcon,
    MoreVert as MoreIcon,
    Flag as FlagIcon,
    CalendarMonth as CalendarIcon,
    CheckCircle as CheckIcon,
    RadioButtonUnchecked as UncheckIcon,
    FilterList as FilterIcon,
    Category as CategoryIcon,
    Assignment as TaskIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardCard } from '@/features/dashboard';
import { TASKS_API } from '../api/tasks.api';
import type { TaskDTO } from '../types/task.types';
import { useSnackbar } from '@/contexts/snackbarContextValue';
import { getErrorMessage } from '@/lib/error';

// Task Category Mappings
const CATEGORIES: { [key: string]: { label: string, icon: any, color: string } } = {
    venue: { label: 'Venue', icon: <CategoryIcon />, color: '#7c3aed' },
    vendor: { label: 'Vendor', icon: <TaskIcon />, color: '#0ea5e9' },
    logistics: { label: 'Logistics', icon: <FilterIcon />, color: '#f59e0b' },
    creative: { label: 'Creative', icon: <FlagIcon />, color: '#ec4899' },
};

const Tasks = () => {
    const theme = useTheme();
    const queryClient = useQueryClient();
    const { success, error: showError } = useSnackbar();
    const [searchTerm, setSearchTerm] = useState('');
    const [newTaskText, setNewTaskText] = useState('');
    const [actionMenu, setActionMenu] = useState<{ el: HTMLElement; task: TaskDTO } | null>(null);

    // Fetch Tasks
    const { data: tasks = [], isLoading, isError } = useQuery<TaskDTO[]>({
        queryKey: ['tasks'],
        queryFn: async () => {
            const response = await TASKS_API.getAll();
            return response.data || [];
        },
    });

    // Mutations
    const toggleMutation = useMutation({
        mutationFn: (id: number) => TASKS_API.toggle(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            success('Task status updated');
        },
        onError: (err) => showError(getErrorMessage(err)),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => TASKS_API.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            success('Task deleted');
        },
        onError: (err) => showError(getErrorMessage(err)),
    });

    const createMutation = useMutation({
        mutationFn: (text: string) => TASKS_API.create({
            text,
            priority: 'Medium',
            dueDate: new Date(Date.now() + 86400000).toISOString(), // Default tomorrow
            category: 'logistics',
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            setNewTaskText('');
            success('Task created');
        },
        onError: (err) => showError(getErrorMessage(err)),
    });

    const stats = useMemo(() => {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const progress = total > 0 ? (completed / total) * 100 : 0;
        return { total, completed, pending: total - completed, progress };
    }, [tasks]);

    const filteredTasks = useMemo(() => {
        if (!searchTerm.trim()) return tasks;
        const term = searchTerm.toLowerCase();
        return tasks.filter(task => 
            task.text.toLowerCase().includes(term) ||
            task.priority.toLowerCase().includes(term) ||
            (CATEGORIES[task.category]?.label || 'General').toLowerCase().includes(term)
        );
    }, [tasks, searchTerm]);

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high': return theme.palette.error.main;
            case 'medium': return theme.palette.warning.main;
            case 'low': return theme.palette.info.main;
            default: return theme.palette.secondary.main;
        }
    };

    const handleActionClick = (event: React.MouseEvent<HTMLElement>, task: TaskDTO) => {
        event.stopPropagation();
        setActionMenu({ el: event.currentTarget, task });
    };

    const handleActionClose = () => setActionMenu(null);

    const handleCreateTask = () => {
        if (newTaskText.trim()) {
            createMutation.mutate(newTaskText);
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress size={40} thickness={4} />
            </Box>
        );
    }

    if (isError) {
        return (
            <Box sx={{ textAlign: 'center', py: 10 }}>
                <Typography color="error" variant="h6">Failed to load tasks</Typography>
                <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['tasks'] })} sx={{ mt: 2 }}>Retry</Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 0, maxWidth: 1000, margin: '0 auto' }}>
            {/* Header Section */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 2 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                        Task Pipeline
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, mt: 0.5 }}>
                        Manage your wedding preparations with precision.
                    </Typography>
                </Box>

                <Stack direction="row" spacing={3} sx={{ display: { xs: 'none', md: 'flex' } }}>
                    {[
                        { label: 'Completed', value: stats.completed, color: theme.palette.success.main },
                        { label: 'Pending', value: stats.pending, color: theme.palette.warning.main },
                        { label: 'Total', value: stats.total, color: theme.palette.primary.main },
                    ].map((s, idx) => (
                        <Box key={idx} sx={{ textAlign: 'right' }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>
                                {s.label}
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 900, color: s.color, lineHeight: 1 }}>
                                {s.value}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            </Box>

            {/* Progress Bar Container */}
            <DashboardCard sx={{ mb: 4, p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Overall Readiness</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'primary.main' }}>{Math.round(stats.progress)}%</Typography>
                </Box>
                <LinearProgress 
                    variant="determinate" 
                    value={stats.progress} 
                    sx={{ 
                        height: 6, 
                        borderRadius: 3, 
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                    }} 
                />
            </DashboardCard>

            {/* Search and Add Task Input Row */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                    fullWidth
                    placeholder="Search tasks..."
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ flexGrow: 1 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <FilterIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
                            </InputAdornment>
                        )
                    }}
                />
                <TextField
                    fullWidth
                    placeholder="New requirement..."
                    size="small"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateTask()}
                    sx={{ flexGrow: 1 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <TaskIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
                            </InputAdornment>
                        )
                    }}
                />
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    disabled={createMutation.isPending || !newTaskText.trim()}
                    onClick={handleCreateTask}
                    sx={{ 
                        height: '40px', 
                        px: 3, 
                        borderRadius: '8px',
                        fontWeight: 700,
                        textTransform: 'none',
                        minWidth: { xs: '100%', sm: 'max-content' },
                    }}
                >
                    {createMutation.isPending ? 'Adding...' : 'Add Task'}
                </Button>
            </Box>

            {/* Task List */}
            <AnimatePresence mode="popLayout">
                <Stack component={motion.div} layout spacing={1.5}>
                    {filteredTasks.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <Typography sx={{ color: 'text.disabled', fontWeight: 700 }}>
                                {searchTerm ? `No tasks found for "${searchTerm}"` : "You're all caught up!"}
                            </Typography>
                        </Box>
                    ) : (
                        filteredTasks.map((task) => (
                            <motion.div
                                key={task.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        p: 2,
                                        bgcolor: 'background.paper',
                                        border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                                        borderRadius: '12px',
                                        transition: 'all 0.2s ease',
                                        cursor: 'pointer',
                                        ...(task.completed && { opacity: 0.6 }),
                                        '&:hover': { 
                                            borderColor: theme.palette.primary.main, 
                                            bgcolor: alpha(theme.palette.primary.main, 0.01)
                                        }
                                    }}
                                    onClick={() => toggleMutation.mutate(task.id)}
                                >
                                    <IconButton 
                                        size="small" 
                                        sx={{ 
                                            mr: 2,
                                            color: task.completed ? theme.palette.success.main : theme.palette.text.disabled,
                                        }}
                                        disabled={toggleMutation.isPending}
                                    >
                                        {task.completed ? <CheckIcon fontSize="medium" /> : <UncheckIcon fontSize="medium" />}
                                    </IconButton>

                                    <Box sx={{ flexGrow: 1 }}>
                                        <Stack direction="row" spacing={1.5} alignItems="center" mb={0.5}>
                                            <Typography 
                                                variant="subtitle2" 
                                                sx={{ 
                                                    fontWeight: 700, 
                                                    color: task.completed ? 'text.secondary' : 'text.primary',
                                                    textDecoration: task.completed ? 'line-through' : 'none',
                                                }}
                                            >
                                                {task.text}
                                            </Typography>
                                            <Box sx={{ 
                                                px: 1, 
                                                py: 0.25, 
                                                borderRadius: '4px', 
                                                bgcolor: alpha(CATEGORIES[task.category]?.color || theme.palette.primary.main, 0.1),
                                                color: CATEGORIES[task.category]?.color || theme.palette.primary.main,
                                                fontSize: '10px',
                                                fontWeight: 800,
                                                textTransform: 'uppercase'
                                            }}>
                                                {CATEGORIES[task.category]?.label || 'General'}
                                            </Box>
                                        </Stack>

                                        <Stack direction="row" spacing={3}>
                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                <CalendarIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                                    {new Date(task.dueDate).toLocaleDateString()}
                                                </Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                <FlagIcon sx={{ fontSize: 14, color: getPriorityColor(task.priority) }} />
                                                <Typography variant="caption" sx={{ color: getPriorityColor(task.priority), fontWeight: 700 }}>
                                                    {task.priority}
                                                </Typography>
                                            </Stack>
                                            <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 700 }}>
                                                +{task.points} pts
                                            </Typography>
                                        </Stack>
                                    </Box>

                                    <IconButton size="small" onClick={(e) => handleActionClick(e, task)}>
                                        <MoreIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </motion.div>
                        ))
                    )}
                </Stack>
            </AnimatePresence>

            {/* Action Menu */}
            <Menu
                anchorEl={actionMenu?.el}
                open={!!actionMenu}
                onClose={handleActionClose}
            >
                <MenuItem onClick={handleActionClose}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit Task
                </MenuItem>
                <MenuItem 
                    onClick={() => {
                        if (actionMenu) deleteMutation.mutate(actionMenu.task.id);
                        handleActionClose();
                    }}
                    sx={{ color: 'error.main' }}
                >
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete Task
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default Tasks;

