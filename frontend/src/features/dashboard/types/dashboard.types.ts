export interface DashboardMetric {
    label: string;
    value: string | number;
    change?: string;
    icon: React.ComponentType;
    color: string;
    progress?: number;
    trend?: 'up' | 'down';
}

export interface ChartDataPoint {
    x: string;
    y: number;
}

export interface ActivityLog {
    id: string;
    title: string;
    description: string;
    time: string;
    status: 'success' | 'warning' | 'info';
}

export interface DashboardData {
    metrics: DashboardMetric[];
    chartSeries: unknown[];
    activities: ActivityLog[];
}
