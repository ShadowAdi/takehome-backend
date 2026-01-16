import mongoose from "mongoose";
import { IAddress, ICompany } from "./interfaces/company.interface";

const AddressSchema = new mongoose.Schema<IAddress>({
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zip: { type: String, trim: true },
    country: { type: String, trim: true }
}, { _id: false });

export const companySchema = new mongoose.Schema<ICompany>({
    company_name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    company_email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select:false
    },
    company_description: {
        type: String,
        required: true,
        trim: true,
    },
    address: AddressSchema,
    website: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
    },
    company_logo: {
        type: String,
    },
    industury: {
        type: String,
    },
    company_linkedin: {
        type: String,
    },
    founder_email: {
        type: String,
        trim: true,
    },
    founder_name: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
})

export const Company = mongoose.models.Company || mongoose.model<ICompany>("Company", companySchema)