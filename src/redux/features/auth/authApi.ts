import { baseApi } from "@/redux/baseApi";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        login: builder.mutation({
            query: (data) => ({
                url: "/rider/sign-in",
                method: "POST",
                body: data,
            }),
        }),

        getRiderProfile: builder.query({
            query: () => {
                return {
                    url: '/rider/get-rider-profile',
                    method : 'GET',
                }
            }
        }),

        driverSign: builder.mutation({
            query: (data) => ({
                url: "/driver/sign-in",
                method: "POST",
                body: data,
            }),
        }),

    })
})

export const { useLoginMutation, useGetRiderProfileQuery } = authApi