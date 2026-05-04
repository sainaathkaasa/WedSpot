import React from 'react';
import {
    Box,
    Tabs,
    Tab,
    alpha,
    useTheme
} from '@mui/material';
import type { VendorCategory } from '../types/vendor';

interface CategoryNavigationProps {
    categories: VendorCategory[];
    activeCategoryId: string;
    onCategoryChange: (id: string) => void;
}

const CategoryNavigation: React.FC<CategoryNavigationProps> = ({ categories, activeCategoryId, onCategoryChange }) => {
    const theme = useTheme();

    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        onCategoryChange(newValue);
    };

    return (
        <Box sx={{
            width: '100%',
            mb: 6,
            position: 'sticky',
            top: 0,
            zIndex: 10,
            bgcolor: alpha(theme.palette.background.default, 0.8),
            backdropFilter: 'blur(10px)',
            py: 2,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.05)}`
        }}>
            <Tabs
                value={activeCategoryId}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                    '& .MuiTabs-indicator': {
                        height: 4,
                        borderRadius: '4px 4px 0 0',
                        backgroundColor: 'primary.main',
                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    },
                    '& .MuiTab-root': {
                        textTransform: 'none',
                        minWidth: 100,
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        marginRight: 1,
                        color: 'text.secondary',
                        transition: 'all 0.3s ease',
                        '&.Mui-selected': {
                            color: 'primary.main',
                        },
                        '&:hover': {
                            color: 'primary.main',
                            bgcolor: alpha(theme.palette.primary.main, 0.03),
                            borderRadius: 2
                        }
                    },
                }}
            >
                <Tab label="All Categories" value="all" />
                {categories.map((category) => (
                    <Tab
                        key={category.id}
                        label={category.name}
                        value={category.id}
                        iconPosition="start"
                    />
                ))}
            </Tabs>
        </Box>
    );
};

export default CategoryNavigation;
