import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";



interface AuthState {
  role: string | null;
  token:string | null;
  loading:boolean;
  error:string | null
}

const initialState:AuthState = {
   role:localStorage.getItem('role'),
   token:localStorage.getItem('token'),
   loading:false,
   error:null
}

export const signInUser = createAsyncThunk("auth/signin", async(data:{email:string,password:string},thunkAPI)=>{
    try {
        const response = await axiosInstance.post("/users/signin",data);
        return response.data;
    } catch (error:any) {
        return thunkAPI.rejectWithValue( 
            error.response?.data?.message || "Login failed")
    }
})


const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers: {
        logOut:(state)=>{
        state.role = null;
        state.token = null;
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        },
    },
    extraReducers:(buliders)=>{
      buliders.addCase(signInUser.pending,(state)=>{
        state.loading =true;
        state.error =null
      })
      .addCase(signInUser.fulfilled,(state, action)=>{
           state.loading = false;
           state.role = action.payload.role;
           state.token= action.payload.access_token;
           localStorage.setItem('token',action.payload.access_token)
           localStorage.setItem('role',action.payload.role)
      })
       .addCase(signInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    }
})

export const {logOut} = authSlice.actions;
export default authSlice.reducer;