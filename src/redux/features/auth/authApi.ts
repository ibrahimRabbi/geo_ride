import { baseApi } from "@/redux/baseApi";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: "/auth/sign-in",
                method: "POST",
                body: data,
            }),
        }),
    })
})

export const { useLoginMutation } = authApi