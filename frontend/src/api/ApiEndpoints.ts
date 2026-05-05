const endpoints = {
    Health: "/health",

    SignIn: "/auth/login",
    SignUp: "/auth/register",
    SignOut: "/auth/logout",
    ForgotPassword: "/auth/forgot-password",
    ResetPassword: "/auth/reset-password",
    VerifyToken: "/auth/verify-token",
    VerifyOtp: "/auth/verify-otp",

    User: "/user",
    Users: "/user/users",

    Products: "/products",

    ChatHistory: "/chat/history",
    AiDesign: "/ai/design",

    GetAllBookings: "/bookings",
    GetClientBookings: "/bookings/client",
    GetVendorBookings: "/bookings/vendor",
    CreateBooking: "/bookings",

    GetVendorService: "/services",
    GetVendorServiceById: "/services",
    GetVendorServicesByVendorId: "/services/vendor",
    GetVendorServiceByClientId: "/services/client",
    GetAllVendorServices: "/services",
    DeleteVendorService: "/services",
    UpdateVendorService: "/services",
    CreateVendorService: "/services",
};

export default endpoints;
