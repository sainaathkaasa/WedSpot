import React, { type JSX } from "react";
import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    useTheme,
    alpha,
    type TextFieldProps,
} from "@mui/material";

interface InputFieldProps extends Omit<TextFieldProps, "label"> {
    label?: string;
    icon?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    icon,
    sx,
    InputProps,
    ...props
}): JSX.Element => {
    const theme = useTheme();

    return (
        <Box>
            {label && (
                <Typography
                    component="label"
                    sx={{
                        ...theme.typography.body2,
                        fontWeight: 600,
                        color: theme.palette.text.secondary,
                        mb: 0.75,
                        display: "block",
                    }}
                >
                    {label}
                </Typography>
            )}
            <TextField
                fullWidth
                variant="outlined"
                size="small"
                sx={sx}
                {...props}
                InputProps={{
                    ...InputProps,
                    startAdornment: icon ? (
                        <InputAdornment position="start">
                            {icon}
                        </InputAdornment>
                    ) : (
                        InputProps?.startAdornment
                    ),
                    sx: {
                        borderRadius: theme.shape.borderRadius,
                        backgroundColor: theme.palette.background.default,
                        fontSize: theme.typography.body1.fontSize,
                        height: props.multiline ? "auto" : 48,
                        minHeight: props.multiline ? 100 : "auto",
                        alignItems: props.multiline ? "flex-start" : "center",
                        py: props.multiline ? 1.5 : 0,
                        transition: theme.dashboard.transition,
                        "&.Mui-focused": {
                            backgroundColor: theme.palette.background.paper,
                            boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`,
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: theme.palette.divider,
                            borderWidth: "1.5px",
                            transition: theme.dashboard.transition,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: alpha(theme.palette.divider, 0.8),
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: theme.palette.primary.main,
                        },
                        "&.Mui-focused svg": {
                            color: theme.palette.primary.main,
                        },
                        ...InputProps?.sx,
                    },
                }}
            />
        </Box>
    );
};

export default InputField;
