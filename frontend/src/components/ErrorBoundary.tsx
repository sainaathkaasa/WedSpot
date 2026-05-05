import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Error as ErrorIcon, Refresh as RefreshIcon } from '@mui/icons-material';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('[ErrorBoundary]', error, errorInfo);
    }

    handleReset = (): void => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/';
    };

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
                    <Box sx={{ p: 4, borderRadius: 2, bgcolor: 'background.paper', boxShadow: 3 }}>
                        <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
                        <Typography variant="h5" gutterBottom color="text.primary" fontWeight={700}>
                            Something went wrong
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<RefreshIcon />}
                            onClick={this.handleReset}
                            size="large"
                        >
                            Return to Home
                        </Button>
                    </Box>
                </Container>
            );
        }

        return this.props.children;
    }
}
