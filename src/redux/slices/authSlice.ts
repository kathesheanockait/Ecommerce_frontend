import { createSlice, type PayloadAction } from "@reduxjs/toolkit";



interface AuthState {
  role: string | null;
  token:string | null;
}

const initialState:AuthState = {
   role:localStorage.getItem('role'),
   token:localStorage.getItem('token')
}


const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers: {
        loginSuccess:(state, action:PayloadAction<{role:string; token:string}>)=>{
           state.role = action.payload.role;
           state.token= action.payload.token;
           localStorage.setItem('token',action.payload.token)
           localStorage.setItem('role',action.payload.role)
        },
        logOut:(state)=>{
        state.role = null;
        state.token = null;
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        }
    }
})

export const {logOut ,loginSuccess} = authSlice.actions;
export default authSlice.reducer;