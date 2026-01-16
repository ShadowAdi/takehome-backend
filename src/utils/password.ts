import { hash } from "bcrypt";

export const hashPassword=async (password:string)=>{
    const hashedPassword=hash(password,10)
    return hashedPassword
}