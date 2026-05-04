import { Navigate, Outlet, useSearchParams } from "react-router-dom";
import { useAuth } from "./useAuth";
import { useUser } from "@/features/user";
import { UserRole } from '@/entities/user';

interface ProtectedRouteProps {
    allowedRoles?: UserRole[];
    children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
    const { isAuthenticated } = useAuth();
    const { user } = useUser();
    const [searchParams] = useSearchParams();

    const role = user?.role;

    if (!isAuthenticated) {
        const redirectPath = window.location.pathname;
        return <Navigate to={`/login${redirectPath !== '/' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`} replace />;
    }

    if (allowedRoles && allowedRoles.length > 0) {
        const userRole = (role || "").toLowerCase();
        const hasAccess = allowedRoles.some(
            allowedRole => allowedRole.toLowerCase() === userRole
        );

        if (!hasAccess) {
            return <Navigate to="/dashboard" state={{ message: "You do not have permission to access this page." }} replace />;
        }
    }

    if (searchParams.get('session') === 'expired') {
        return <Navigate to="/login?session=expired" replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
