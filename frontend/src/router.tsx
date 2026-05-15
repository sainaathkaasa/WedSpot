import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { UserRole } from '@/entities/user';
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import { DashboardProvider } from "@/features/dashboard/context/DashboardContext";
import ProtectedRoute from "@/features/auth/context/ProtectedRoute";
import PublicRoute from "@/features/auth/context/PublicRoute";
import PrivacyPolicy from "@/pages/PrivacyPolicy/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService/TermsOfService";
import NotFound from "@/pages/NotFound/NotFound";

const Login = lazy(() => import("@/features/auth/pages/Login/Login"));
const ForgotPassword = lazy(() => import("@/features/auth/pages/ForgotPassword/ForgotPassword"));
const RegisterPage = lazy(() => import("@/features/auth/pages/SignUp/RegisterPage"));
const ChatbotPage = lazy(() => import("@/features/chat/pages/ChatbotPage"));
const Home = lazy(() => import("@/features/home/pages/Home"));
const Users = lazy(() => import("@/features/Users/pages/Users"));
const Vendors = lazy(() => import("@/features/Manager/pages/Vendors/Vendors"));
const Bookings = lazy(() => import("@/features/Booking/pages/BookingsPage"));
const BookingDetails = lazy(() => import("@/features/Booking/pages/BookingDetailsPage"));
const Analytics = lazy(() => import("@/features/Analytics/pages/Analytics"));
const Earnings = lazy(() => import("@/features/Earnings/pages/Earnings"));
const SavedVendors = lazy(() => import("@/features/vendors/pages/SavedVendors"));
const Revenue = lazy(() => import("@/features/Revenue/pages/Revenue"));
const Staff = lazy(() => import("@/features/Manager/pages/Staff/Staff"));
const Reports = lazy(() => import("@/features/Reports/pages/Reports"));
const Tasks = lazy(() => import("@/features/Tasks/pages/Tasks"));
const AddUser = lazy(() => import("@/features/Users/pages/AddUser"));
const Products = lazy(() => import("@/features/commerce/pages/Products/Products"));
const AddVendor = lazy(() => import("@/features/Manager/pages/Vendors/AddVendor"));
const AddStaff = lazy(() => import("@/features/Manager/pages/Staff/AddStaff"));
const Profile = lazy(() => import("@/features/Profile/pages/Profile"));
const BillsPage = lazy(() => import("@/features/Bills/pages/Bills"));
const PremiumVendors = lazy(() => import("@/features/vendors/pages/PremiumVendors"));
const VendorDetails = lazy(() => import("@/features/vendors/pages/VendorDetails"));
const DashboardPage = lazy(() => import("@/features/dashboard/pages/Dashboard/DashboardPage"));
const UpdateUser = lazy(() => import("./features/Users/pages/UpdateUser"));
const VendorServicesPage = lazy(() => import("./features/VendorService/pages/VendorServicesPage"));
const VendorManageDetails = lazy(() => import("./features/VendorService/components/VendorManageDetails"));

const withSuspense = (component: React.ReactNode) => (
    <Suspense fallback={<div />}>{component}</Suspense>
);

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout>{withSuspense(<Home />)}</MainLayout>,
    },
    {
        path: "bills",
        element: <BillsPage />,
    },
    { path: "/privacy", element: <MainLayout><PrivacyPolicy /></MainLayout> },
    { path: "/terms", element: <MainLayout><TermsOfService /></MainLayout> },
    { path: "*", element: <NotFound /> },
    {
        element: (
            <PublicRoute>
                <AuthLayout />
            </PublicRoute>
        ),
        children: [
            { path: "/login", element: withSuspense(<Login />) },
            { path: "/forgot-password", element: withSuspense(<ForgotPassword />) },
            { path: "/register", element: withSuspense(<RegisterPage />) },
        ],
    },
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <DashboardProvider>
                    <DashboardLayout />
                </DashboardProvider>
            </ProtectedRoute>
        ),
        children: [
            {
                path: "dashboard",
                element: withSuspense(<DashboardPage />)
            },
            {
                path: "admin",
                element: <ProtectedRoute allowedRoles={[UserRole.ADMIN]} />,
                children: [
                    { path: "users", element: withSuspense(<Users />) },
                    { path: "users/add", element: withSuspense(<AddUser />) },
                    { path: "users/:id", element: withSuspense(<UpdateUser />) },
                    { path: "bookings", element: withSuspense(<Bookings />) },
                    { path: "bookings/:id", element: withSuspense(<BookingDetails />) },
                    { path: "revenue", element: withSuspense(<Revenue />) },
                    { path: "analytics", element: withSuspense(<Analytics />) },
                ]
            },
            {
                path: "manager",
                element: <ProtectedRoute allowedRoles={[UserRole.MANAGER]} />,
                children: [
                    { path: "vendors", element: withSuspense(<Vendors />) },
                    { path: "vendors/add", element: withSuspense(<AddVendor />) },
                    { path: "bookings", element: withSuspense(<Bookings />) },
                    { path: "bookings/:id", element: withSuspense(<BookingDetails />) },
                    { path: "staff", element: withSuspense(<Staff />) },
                    { path: "staff/add", element: withSuspense(<AddStaff />) },
                    { path: "reports", element: withSuspense(<Reports />) },
                ]
            },
            {
                path: "staff",
                element: <ProtectedRoute allowedRoles={[UserRole.STAFF]} />,
                children: [
                    { path: "bookings", element: withSuspense(<Bookings />) },
                    { path: "bookings/:id", element: withSuspense(<BookingDetails />) },
                    { path: "tasks", element: withSuspense(<Tasks />) },
                    { path: "reports", element: withSuspense(<Reports />) },
                ]
            },
            {
                path: "vendor",
                element: <ProtectedRoute allowedRoles={[UserRole.VENDOR]} />,
                children: [
                    { path: "services", element: withSuspense(<VendorServicesPage />) },
                    { path: "services/add", element: withSuspense(<VendorManageDetails />) },
                    { path: "services/edit/:id", element: withSuspense(<VendorManageDetails />) },
                    { path: "bookings", element: withSuspense(<Bookings />) },
                    { path: "bookings/:id", element: withSuspense(<BookingDetails />) },
                    { path: "earnings", element: withSuspense(<Earnings />) },
                ]
            },
            {
                path: "client",
                element: <ProtectedRoute allowedRoles={[UserRole.CLIENT]} />,
                children: [
                    { path: "vendors", element: withSuspense(<PremiumVendors />) },
                    { path: "vendors/:id", element: withSuspense(<VendorDetails />) },
                    { path: "bookings", element: withSuspense(<Bookings />) },
                    { path: "bookings/:id", element: withSuspense(<BookingDetails />) },
                    { path: "saved", element: withSuspense(<SavedVendors />) },
                ]
            },
            {
                path: "products",
                element: withSuspense(<Products />),
            },
            {
                path: "products/:id",
                element: withSuspense(<VendorDetails />),
            },
            {
                path: "profile",
                element: withSuspense(<Profile />),
            },
            {
                path: "chatbot",
                element: withSuspense(<ChatbotPage />),
            },
        ],
    },
]);
