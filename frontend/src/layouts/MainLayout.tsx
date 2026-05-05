import React, { type JSX } from "react";
import NavBar from "@/components/Layout/Navbar/NavBar";
import Footer from "@/components/Layout/Footer/Footer";
import { useAuth } from "@/features/auth";
import { useUser } from "@/features/user";
import { Navigate } from "react-router-dom";

const MainLayout = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const { isAuthenticated } = useAuth();
  const { user } = useUser();
  const role = user?.role;

  if (isAuthenticated) {
    const dashboardPath = role ? `/dashboard` : '/';
    return <Navigate to={dashboardPath} replace />;
  }

  return (
    <div className="main-layout">
      <NavBar />
      <main className="main-layout-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
