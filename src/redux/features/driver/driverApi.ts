import { baseApi } from "@/redux/baseApi";

export const driverApi = baseApi.injectEndpoints({
    endpoints: (builder) => {
        return {
            uploadImage: builder.mutation({
                query: (formData) => {
                    return {
                        url: '/driver/upload-image',
                        method: 'POST',
                        body : formData
                    }
                }
            }),

            createDriver: builder.mutation({
                query: (data) => {
                    return {
                        url: '/driver/create-driver',
                        method: 'POST',
                        body : data
                    }
                }
            }),

            driverSign: builder.mutation({
                query: (data) => ({
                    url: "/driver/sign-in-driver",
                    method: "POST",
                    body: data,
                }),
            }),

            registerDriver: builder.mutation({
                query: (data) => ({
                    url: "/driver/temp-driver",
                    method: "POST",
                    body: data,
                }),
            }),

            getDriverProfile: builder.query({
                query: () => {
                    return {
                        url: '/driver/driver-profile',
                        method:'GET'
                    }
                }
            })

        }
    }
})


export const {useCreateDriverMutation,useUploadImageMutation,useRegisterDriverMutation,useDriverSignMutation,useGetDriverProfileQuery} = driverApi