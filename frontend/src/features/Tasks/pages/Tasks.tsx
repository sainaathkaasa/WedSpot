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
    Tooltip,
    LinearProgress,
    useMediaQuery
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
    ArrowForward as ArrowIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardCard } from '@/features/dashboard';

// Task Category Mappings
const CATEGORIES: { [key: string]: { label: string, icon: any, color: string } } = {
    venue: { label: 'Venue', icon: <CategoryIcon />, color: '#7c3aed' },
    vendor: { label: 'Vendor', icon: <TaskIcon />, color: '#0ea5e9' },
    logistics: { label: 'Logistics', icon: <FilterIcon />, color: '#f59e0b' },
    creative: { label: 'Creative', icon: <FlagIcon />, color: '#ec4899' },
};

const Tasks = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [searchTerm, setSearchTerm] = useState('');
    const [tasks, setTasks] = useState([
        { id: 1, text: 'Confirm florist availability for June wedding', priority: 'High', due: 'Today', completed: false, category: 'vendor', points: 10 },
        { id: 2, text: 'Draft contract for Blue Lagoon Venue', priority: 'Medium', due: 'Tomorrow', completed: true, category: 'venue', points: 25 },
        { id: 3, text: 'Follow up with catering team on menu changes', priority: 'High', due: 'Feb 26', completed: false, category: 'logistics', points: 15 },
        { id: 4, text: 'Schedule photography site visit', priority: 'Low', due: 'Mar 02', completed: false, category: 'creative', points: 5 },
    ]);

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
            CATEGORIES[task.category].label.toLowerCase().includes(term)
        );
    }, [tasks, searchTerm]);

    const toggleTask = (id: number) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high': return theme.palette.error.main;
            case 'medium': return theme.palette.warning.main;
            case 'low': return theme.palette.info.main;
            default: return theme.palette.secondary.main;
        }
    };

    return (
        <Box sx={{ p: 0, maxWidth: 1000, margin: '0 auto' }}>
            {/* Header Section */}
            <Box sx={{ mb: { xs: 4, md: 6 }, display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'flex-end' }, flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 4 } }}>
                <Box>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            mb: 2, 
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            display: 'inline-block'
                        }}
                    >
                        Task Pipeline
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.95rem' }}>
                        Manage your wedding preparations with precision.
                    </Typography>
                </Box>

                {/* Stats Header */}
                <Box sx={{ display: 'flex', gap: { xs: 2.5, md: 3 }, alignItems: 'center', width: { xs: '100%', md: 'auto' }, justifyContent: { xs: 'space-between', md: 'flex-end' } }}>
                    {[
                        { label: 'Completed', value: stats.completed, color: theme.palette.success.main },
                        { label: 'Pending', value: stats.pending, color: theme.palette.warning.main },
                        { label: 'Total', value: stats.total, color: theme.palette.primary.main },
                    ].map((s, idx) => (
                        <Box key={idx} sx={{ textAlign: 'right' }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                {s.label}
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 900, color: s.color, lineHeight: 1 }}>
                                {s.value}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Progress Bar Container */}
            <DashboardCard sx={{ mb: 5, p: 3, background: alpha(theme.palette.background.paper, 0.4), backdropFilter: 'blur(20px)', border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: 'text.primary' }}>Overall Readiness</Typography>
                    <Typography sx={{ fontWeight: 900, fontSize: '0.85rem', color: 'primary.main' }}>{Math.round(stats.progress)}%</Typography>
                </Box>
                <LinearProgress 
                    variant="determinate" 
                    value={stats.progress} 
                    sx={{ 
                        height: 8, 
                        borderRadius: 4, 
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        '& .MuiLinearProgress-bar': {
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            borderRadius: 4
                        }
                    }} 
                />
            </DashboardCard>

            {/* Search and Add Task Input Row */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                    fullWidth
                    placeholder="Search tasks..."
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                        flexGrow: 2,
                        '& .MuiOutlinedInput-root': {
                            height: '52px',
                            borderRadius: '16px',
                            bgcolor: 'background.paper',
                            fontWeight: 600,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                            '&:hover fieldset': { borderColor: alpha(theme.palette.primary.main, 0.5) },
                            '&.Mui-focused fieldset': { borderWidth: '2px' }
                        }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <FilterIcon sx={{ color: 'text.disabled' }} />
                            </InputAdornment>
                        )
                    }}
                />
                <TextField
                    fullWidth
                    placeholder="New requirement..."
                    variant="outlined"
                    sx={{
                        flexGrow: 1,
                        '& .MuiOutlinedInput-root': {
                            height: '52px',
                            borderRadius: '16px',
                            bgcolor: 'background.paper',
                            fontWeight: 600,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                            '&:hover fieldset': { borderColor: alpha(theme.palette.primary.main, 0.5) },
                            '&.Mui-focused fieldset': { borderWidth: '2px' }
                        }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <TaskIcon sx={{ color: 'text.disabled' }} />
                            </InputAdornment>
                        )
                    }}
                />
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    fullWidth={isMobile}
                    sx={{ 
                        height: '52px', 
                        px: 4, 
                        borderRadius: '16px',
                        fontWeight: 800,
                        textTransform: 'none',
                        whiteSpace: 'nowrap',
                        minWidth: { xs: '100%', sm: 'max-content' },
                        boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
                        '&:hover': { transform: 'translateY(-2px)', transition: '0.2s' }
                    }}
                >
                    Add Task
                </Button>
            </Box>

            {/* Task List */}
            <AnimatePresence mode="popLayout">
                <Box component={motion.div} layout sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {filteredTasks.length === 0 ? (
                        <Box
                            component={motion.div}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            sx={{ textAlign: 'center', py: 8 }}
                        >
                            <Typography sx={{ color: 'text.disabled', fontWeight: 700 }}>
                                {searchTerm ? `No tasks found for "${searchTerm}"` : "You're all caught up! No tasks left."}
                            </Typography>
                        </Box>
                    ) : (
                        filteredTasks.map((task) => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    p: 2.5,
                                    bgcolor: task.completed ? alpha(theme.palette.background.paper, 0.5) : 'background.paper',
                                    border: '1px solid',
                                    borderColor: task.completed ? alpha(theme.palette.divider, 0.1) : alpha(theme.palette.divider, 0.6),
                                    borderRadius: '20px',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    cursor: 'pointer',
                                    ...(task.completed && { opacity: 0.7 }),
                                    '&:hover': { 
                                        borderColor: theme.palette.primary.main, 
                                        transform: 'scale(1.01)',
                                        boxShadow: `0 12px 24px ${alpha(theme.palette.common.black, 0.04)}`
                                    }
                                }}
                                onClick={() => toggleTask(task.id)}
                            >
                                {/* Custom Checkbox */}
                                <Box sx={{ mr: 2.5, display: 'flex' }}>
                                    <IconButton 
                                        size="medium" 
                                        sx={{ 
                                            p: 0,
                                            color: task.completed ? theme.palette.success.main : theme.palette.text.disabled,
                                            '&:hover': { color: theme.palette.primary.main }
                                        }}
                                    >
                                        {task.completed ? <CheckIcon sx={{ fontSize: 28 }} /> : <UncheckIcon sx={{ fontSize: 28 }} />}
                                    </IconButton>
                                </Box>

                                {/* Task Details */}
                                <Box sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                                        <Typography 
                                            variant="subtitle1" 
                                            sx={{ 
                                                fontWeight: 800, 
                                                fontSize: { xs: '0.9rem', md: '1rem' },
                                                color: task.completed ? 'text.secondary' : 'text.primary',
                                                textDecoration: task.completed ? 'line-through' : 'none',
                                                letterSpacing: '-0.01em',
                                                lineHeight: 1.3
                                            }}
                                        >
                                            {task.text}
                                        </Typography>
                                        {/* Category Badge */}
                                        <Box sx={{ 
                                            px: 1.2, 
                                            py: 0.4, 
                                            borderRadius: '8px', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 0.8,
                                            bgcolor: alpha(CATEGORIES[task.category].color, 0.1),
                                            color: CATEGORIES[task.category].color
                                        }}>
                                            <Box sx={{ display: 'flex', transform: 'scale(0.8)' }}>
                                                {CATEGORIES[task.category].icon}
                                            </Box>
                                            <Typography variant="caption" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.02em', fontSize: '10px' }}>
                                                {CATEGORIES[task.category].label}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 3.5 }, flexWrap: 'wrap' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CalendarIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Deadline: {task.due}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <FlagIcon sx={{ fontSize: 13, color: getPriorityColor(task.priority) }} />
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: getPriorityColor(task.priority) }}>{task.priority}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 800 }}>+{task.points} pts</Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Action Toolbar */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Tooltip title="View Details">
                                        <IconButton size="small" sx={{ bgcolor: alpha(theme.palette.divider, 0.05), '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' } }}>
                                            <ArrowIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <IconButton size="small"><MoreIcon fontSize="small" /></IconButton>
                                </Box>
                            </Box>
                        </motion.div>
                    )))}
                </Box>
            </AnimatePresence>

            {/* Footer Tip */}
            <Box sx={{ mt: 6, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>
                    Pro Tip: High priority tasks contribute more to your Overall Readiness.
                </Typography>
            </Box>
        </Box>
    );
};

export default Tasks;
