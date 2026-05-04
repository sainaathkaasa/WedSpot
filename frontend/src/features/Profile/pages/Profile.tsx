import React, { useState, useCallback, useEffect } from "react";
import { Box, Grid, Fade } from "@mui/material";
import { useUser } from "@/features/user";
import { USER_SERVICE } from "@/features/Users/api/user.api";
import { useQuery, useMutation } from "@tanstack/react-query";
import { DashboardCard } from '@/features/dashboard';
import ProfileSidebarHeader from "../components/ProfileSidebarHeader";
import ProfileTopNav from "../../user/pages/Profile/ProfileTopNav";
import GeneralSection from "../components/GeneralSection";
import SecuritySection from "../components/SecuritySection";
import NotificationsSection from "../components/NotificationsSection";
import type { User } from "@/features/auth";

const TABS = ["general", "security", "notifications"] as const;
type Tab = typeof TABS[number];

const Profile: React.FC = () => {
    const { user: currentUser, setUser: updateGlobalUser } = useUser();
    const [activeTab, setActiveTab] = useState<Tab>("general");

    const { data: profile, isLoading, isError } = useQuery({
        queryKey: ["profile", currentUser?.id],
        queryFn: () => USER_SERVICE.getProfile(Number(currentUser!.id)),
        enabled: !!currentUser?.id,
        select: (response) => response.data ?? null,
    });

    useEffect(() => {
        if (profile) updateGlobalUser(profile);
    }, [profile]);

    useEffect(() => {
        if (isError) console.error("Failed to fetch profile");
    }, [isError]);

    const { mutateAsync: saveProfile } = useMutation({
        mutationFn: (data: User) =>
            USER_SERVICE.updateProfile(Number(currentUser!.id), data),
        onSuccess: (response) => {
            if (response.ok && response.data) {
                updateGlobalUser(response.data);
            }
        },
        onError: () => {
            console.error("Failed to update profile");
        },
    });

    const handleTabChange = useCallback(
        (_event: React.SyntheticEvent, newValue: number) => {
            setActiveTab(TABS[newValue]);
        },
        []
    );

    const displayUser = {
        name: profile?.name ?? currentUser?.name ?? null,
        role: profile?.role ?? currentUser?.role ?? null,
        email: profile?.email ?? currentUser?.email ?? null,
        address: profile?.address ?? currentUser?.address ?? null,
    };

    return (
        <Box
            sx={{
                p: { xs: 2, md: 2 },
                maxWidth: 1400,
                margin: "0 auto",
                animation: "fadeIn 0.6s ease-out",
            }}
        >
            <Grid container spacing={3} sx={{ alignItems: "stretch" }}>
                <Grid item xs={12} md={4} lg={3.5}>
                    <ProfileSidebarHeader {...displayUser} />
                </Grid>

                <Grid item xs={12} md={8} lg={8.5}>
                    <DashboardCard
                        noPadding
                        sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            minHeight: 550,
                        }}
                    >
                        <Box sx={{ px: 1, pt: 1, borderBottom: 1, borderColor: "divider" }}>
                            <ProfileTopNav
                                activeTab={TABS.indexOf(activeTab)}
                                onTabChange={handleTabChange}
                            />
                        </Box>

                        <Box sx={{ p: 4, flexGrow: 1 }}>
                            <Fade in={activeTab === "general"} timeout={400}>
                                <Box hidden={activeTab !== "general"}>
                                    <GeneralSection
                                        loading={isLoading}
                                        onSave={async (data: User) => { await saveProfile(data); }}
                                    />
                                </Box>
                            </Fade>
                            <Fade in={activeTab === "security"} timeout={400}>
                                <Box hidden={activeTab !== "security"}>
                                    <SecuritySection />
                                </Box>
                            </Fade>
                            <Fade in={activeTab === "notifications"} timeout={400}>
                                <Box hidden={activeTab !== "notifications"}>
                                    <NotificationsSection />
                                </Box>
                            </Fade>
                        </Box>
                    </DashboardCard>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Profile;