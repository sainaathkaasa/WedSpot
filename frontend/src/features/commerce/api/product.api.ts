import type { AxiosResponse } from "axios";
import type { Product } from "@/features/commerce/types/product.types";
import api from "@/api/axios";
import endpoints from "@/api/ApiEndpoints";

const PRODUCT_SERVICE = {
    GetAllProducts: async (): Promise<AxiosResponse<Product[]>> => {
        return api.get(endpoints.Products);
    },
    GetProductById: async (id: string): Promise<AxiosResponse<Product>> => {
        return api.get(`${endpoints.Products}/${id}`);
    },
};

export default PRODUCT_SERVICE;
