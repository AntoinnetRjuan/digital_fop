import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

const user = JSON.parse(localStorage.getItem("user"))

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
}

export const register = createAsyncThunk(
    "auth/register",
    async (userData, thunkAPI) => {
        try {
            return await authService.register(userData)
        } catch (error) {
            const message = (error.response && error.response.data) ||
                error.message ||
                error.toString();
            console.error("Redux error message:", message);
            return thunkAPI.rejectWithValue(message);
        }
    }
)

export const login = createAsyncThunk(
    "auth/login",
    async (userData, thunkAPI) => {
        try {
            const response = await authService.login(userData);
            localStorage.setItem("user", JSON.stringify(response)); // Sauvegarde dans localStorage
            return response;
        } catch (error) {
            const message = (error.response && error.response.data) ||
                error.message ||
                error.toString();
            console.error("Redux error message:", message);
            return thunkAPI.rejectWithValue(message);
        }
    }
)

export const logout = createAsyncThunk(
    "auth/logout",
    async () => {
        authService.logout()
    }
)
export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async (userData, thunkAPI) => {
        try {
            return await authService.resetPassword(userData)
        } catch (error) {
            const message = (error.response && error.response.data) ||
                error.message ||
                error.toString();
            console.error("Redux error message:", message);
            return thunkAPI.rejectWithValue(message);
        }
    }
)

export const resetPasswordConfirm = createAsyncThunk(
    "auth/resetPasswordConfirm",
    async (userData, thunkAPI) => {
        try {
            return await authService.resetPasswordConfirm(userData)
        } catch (error) {
            const message = (error.response && error.response.data) ||
                error.message ||
                error.toString();
            console.error("Redux error message:", message);
            return thunkAPI.rejectWithValue(message);
        }
    }
)

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false
            state.isError = false
            state.isSuccess = false
            state.message = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.message = action.payload
                state.user = null
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.message = action.payload
                state.user = null
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null
            })
            .addCase(resetPassword.pending, (state) => {
                state.isLoading = true
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.isLoading = false
                state.isSuccess = true
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.message = action.payload
                state.user = null
            })
            .addCase(resetPasswordConfirm.pending, (state) => {
                state.isLoading = true
            })
            .addCase(resetPasswordConfirm.fulfilled, (state) => {
                state.isLoading = false
                state.isSuccess = true
            })
            .addCase(resetPasswordConfirm.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.message = action.payload
                state.user = null
            })
    }
}
)


export const { reset } = authSlice.actions

export default authSlice.reducer