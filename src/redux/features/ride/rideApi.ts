import { baseApi } from "@/redux/baseApi";

const rideApi = baseApi.injectEndpoints({
    endpoints: (builder) => {
        return {
            createRideReqest: builder.mutation({
                query: (data) => {
                    return {
                        url: '/ride-request/create-request',
                        method: "POST",
                        body : data
                    }
                }
            }),

            getRequestWithVehicles: builder.query({
                query: () => {
                    return {
                        url: '/ride-request/get-my-request',
                        method : 'GET'
                    }
                }
            }),


            selecetVehicle: builder.mutation({
                query: (data) => {
                    return {
                        url: '/ride-request/select-vehicle',
                        method: 'PATCH',
                        body : data
                    }
                }
            })


        }
    }
})

export const {useCreateRideReqestMutation, useGetRequestWithVehiclesQuery,useSelecetVehicleMutation}= rideApi