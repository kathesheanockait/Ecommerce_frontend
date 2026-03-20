import axiosInstance from "./axiosInstance"

export const getProduct = async()=>{
    const response = await axiosInstance.get('/products');
    return response.data
}

export const updateProduct =async (id:string , data:{
    name:string,
    price:number,
    stock:number,
    isAvailable:boolean,
    images:string[],
})=>{
    const response = await axiosInstance.put(`/products/${id}`, data);
    return response.data
}

export const createProduct = async ( data:{
    name:string,
    price:number,
    stock:number,
    isAvailable:boolean,
    images:string[],
})=>{
    const response = await axiosInstance.post(`/products`, data);
    return response.data
}

export const deleteProductById = async (id:string)=>{
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data
}

export const filterProduct = async (data:{
    name:string,
    createdAt:Date,
    minStock:number,
    isAvailable:boolean,
    maxStock:number
})=>{
    const response = await axiosInstance.get(`/products/filter`, {params:data});
    return response.data
}