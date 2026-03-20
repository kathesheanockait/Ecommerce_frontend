import axiosInstance from "./axiosInstance";

export const signUp = async (data: {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
  phone: number | undefined;
}) => {
  const response = await axiosInstance.post("/users/signup", data);
  return response.data;
};

export const signIn = async (data: {
    email: string;
    password: string;
})=>{
    const response = await axiosInstance.post('/users/signin',data);
    return response.data;
}