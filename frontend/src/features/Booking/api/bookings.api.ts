import api from "@/api/axios"
import endpoints from "@/api/ApiEndpoints"
import type { APIResponse } from "@/api/types";
import type { Booking, BookingStatus } from "../types/bookings.types";

export interface CreateBookingPayload {
    eventDate: string;
    eventLocation: string;
    guestCount: number;
    notes?: string;
    serviceIds: number[];
}

export interface UpdateBookingStatusPayload {
    status: BookingStatus;
}

export const BOOKING_SERVICE = {
    getAllBooking: async (): Promise<APIResponse<Booking[]>> => {
        const response = await api.get(endpoints.GetAllBookings);
        return response.data;
    },

    getClientBooking: async (id: number): Promise<APIResponse<Booking[]>> => {
        const response = await api.get(`${endpoints.GetClientBookings}/${id}`);
        return response.data;
    },

    getVendorBooking: async (id: number): Promise<APIResponse<Booking[]>> => {
        const response = await api.get(`${endpoints.GetVendorBookings}/${id}`);
        return response.data;
    },

    getById: async (id: number): Promise<APIResponse<Booking>> => {
        const response = await api.get(`${endpoints.GetAllBookings}/${id}`);
        return response.data;
    },

    createBooking: async (data: CreateBookingPayload): Promise<APIResponse<Booking>> => {
        const response = await api.post(endpoints.CreateBooking, data);
        return response.data;
    },

    updateStatus: async (id: number, status: BookingStatus): Promise<APIResponse<Booking>> => {
        console.log("ID: ", id);
        console.log("Status: ", status)
        const response = await api.patch(
            `${endpoints.GetAllBookings}/${id}/status`,
            null,
            { params: { status } }
        );
        return response.data;
    },

    cancel: async (id: number): Promise<APIResponse<Booking>> => {
        const response = await api.patch(`${endpoints.GetAllBookings}/${id}/cancel`);
        return response.data;
    },
}
