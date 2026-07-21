import { baseApi } from "@/redux/baseApi";

export const vehicleApi = baseApi.injectEndpoints({
    endpoints: (builder) => {
        return {
            getAllVehicles: builder.query({
                query: () => ({
                    url: "/get-all-vehicles",
                    method: "GET",
                }),
            }),
        }
}
})

export const { useGetAllVehiclesQuery } = vehicleApi