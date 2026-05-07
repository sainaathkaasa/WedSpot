import React, { type JSX } from "react";
import { Button, CircularProgress, useTheme, type ButtonProps } from "@mui/material";

interface FormButtonProps extends ButtonProps {
    loading?: boolean;
    icon?: React.ReactNode;
}

const FormButton: React.FC<FormButtonProps> = ({
    children,
    loading = false,
    icon,
    sx,
    variant = "cta",
    ...props
}): JSX.Element => {
    const theme = useTheme();

    return (
        <Button
            fullWidth
            variant={variant}
            disabled={loading || props.disabled}
            endIcon={!loading && icon}
            sx={{
                py: 1.5,
                borderRadius: theme.shape.borderRadius,
                textTransform: "none",
                fontWeight: 600,
                transition: theme.dashboard.transition,
                '&.Mui-disabled': {
                    backgroundColor: theme.palette.action.disabledBackground,
                    color: theme.palette.text.disabled,
                    boxShadow: 'none',
                },
                ...sx,
            }}
            {...props}
        >
            {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
                children
            )}
        </Button>
    );
};

export default FormButton;
