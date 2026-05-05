import endpoints from "@/api/ApiEndpoints";
import api from "@/api/axios";
import type { APIResponse } from "@/api/types";
import type { VendorService } from '@/entities/vendor-service';
import type { VendorFormData } from '../types';

export const VENDOR_SERVICE = {
    getById: async (id: number): Promise<APIResponse<VendorService>> => {
        const response = await api.get(`${endpoints.GetVendorService}/${id}`);
        return response.data;
    },
    delete: async (id: number): Promise<APIResponse<void>> => {
        const response = await api.delete(`${endpoints.DeleteVendorService}/${id}`);
        return response.data;
    },
    update: async (id: number, data: VendorFormData): Promise<APIResponse<VendorService>> => {
        const response = await api.put(`${endpoints.UpdateVendorService}/${id}`, data);
        return response.data;
    },
    create: async (data: VendorFormData): Promise<APIResponse<void>> => {
        const response = await api.post(`${endpoints.CreateVendorService}`, data);
        return response.data;
    },
    getVendorServices: async (vendorId: number): Promise<APIResponse<VendorService[]>> => {
        const response = await api.get(`${endpoints.GetVendorServicesByVendorId}/${vendorId}`);
        return response.data;
    },
    getAllServices: async (): Promise<APIResponse<VendorService[]>> => {
        const response = await api.get(endpoints.GetAllVendorServices);
        return response.data;
    },
}
