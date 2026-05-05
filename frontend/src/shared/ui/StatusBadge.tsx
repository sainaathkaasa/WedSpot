import { Chip } from '@mui/material';

type StatusVariant = 'booking' | 'payment' | 'user' | 'inventory' | 'request' | 'vendor' | 'bill';

const BOOKING_STATUS_MAP: Record<string, { color: 'success' | 'warning' | 'error' | 'info' | 'default'; label: string }> = {
    PENDING: { color: 'warning', label: 'Pending' },
    CONFIRMED: { color: 'success', label: 'Confirmed' },
    CANCELLED: { color: 'error', label: 'Cancelled' },
    CANCELED: { color: 'error', label: 'Cancelled' },
    COMPLETED: { color: 'info', label: 'Completed' },
};

const PAYMENT_STATUS_MAP: Record<string, { color: 'success' | 'warning' | 'error' | 'default'; label: string }> = {
    PAID: { color: 'success', label: 'Paid' },
    PARTIAL: { color: 'warning', label: 'Partial' },
    UNPAID: { color: 'error', label: 'Unpaid' },
    REFUNDED: { color: 'default', label: 'Refunded' },
};

const USER_STATUS_MAP: Record<string, { color: 'success' | 'warning' | 'error' | 'default'; label: string }> = {
    ACTIVE: { color: 'success', label: 'Active' },
    INACTIVE: { color: 'default', label: 'Inactive' },
    SUSPENDED: { color: 'error', label: 'Suspended' },
    PENDING: { color: 'warning', label: 'Pending' },
};

const INVENTORY_STATUS_MAP: Record<string, { color: 'success' | 'warning' | 'error' | 'default'; label: string }> = {
    AVAILABLE: { color: 'success', label: 'Available' },
    LOW: { color: 'warning', label: 'Low' },
    OUT: { color: 'error', label: 'Out of Stock' },
};

const REQUEST_STATUS_MAP: Record<string, { color: 'success' | 'warning' | 'error' | 'info' | 'default'; label: string }> = {
    PENDING: { color: 'warning', label: 'Pending' },
    IN_DISCUSSION: { color: 'info', label: 'In Discussion' },
    'IN DISCUSSION': { color: 'info', label: 'In Discussion' },
    ACCEPTED: { color: 'success', label: 'Accepted' },
    REJECTED: { color: 'error', label: 'Rejected' },
};

const VENDOR_STATUS_MAP: Record<string, { color: 'success' | 'warning' | 'error' | 'info' | 'default'; label: string }> = {
    ACTIVE: { color: 'success', label: 'Active' },
    INACTIVE: { color: 'default', label: 'Inactive' },
    PENDING: { color: 'warning', label: 'Pending' },
    BLOCKED: { color: 'error', label: 'Blocked' },
    ON_HOLD: { color: 'warning', label: 'On Hold' },
    'ON HOLD': { color: 'warning', label: 'On Hold' },
    UNDER_REVIEW: { color: 'info', label: 'Under Review' },
    'UNDER REVIEW': { color: 'info', label: 'Under Review' },
};

const BILL_STATUS_MAP: Record<string, { color: 'success' | 'warning' | 'error' | 'info' | 'default'; label: string }> = {
    PAID: { color: 'success', label: 'Paid' },
    PENDING: { color: 'warning', label: 'Pending' },
    OVERDUE: { color: 'error', label: 'Overdue' },
    PARTIAL: { color: 'info', label: 'Partial' },
};

const VARIANT_MAPS: Record<StatusVariant, Record<string, { color: string; label: string }>> = {
    booking: BOOKING_STATUS_MAP,
    payment: PAYMENT_STATUS_MAP,
    user: USER_STATUS_MAP,
    inventory: INVENTORY_STATUS_MAP,
    request: REQUEST_STATUS_MAP,
    vendor: VENDOR_STATUS_MAP,
    bill: BILL_STATUS_MAP,
};

interface StatusBadgeProps {
    status: string;
    variant?: StatusVariant;
    size?: 'small' | 'medium';
}

export function StatusBadge({ status, variant = 'booking', size = 'small' }: StatusBadgeProps) {
    if (!status) return null;

    const map = VARIANT_MAPS[variant];
    const config = map[status.toUpperCase()] || { color: 'default', label: status };

    return (
        <Chip
            label={config.label}
            color={config.color as any}
            size={size}
            variant="outlined"
            sx={{
                height: size === 'small' ? 22 : 28,
                fontSize: size === 'small' ? '10px' : '12px',
                fontWeight: 800,
                letterSpacing: '0.04em',
            }}
        />
    );
}
