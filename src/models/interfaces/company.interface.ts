export interface IAddress {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
}

export interface ICompany extends Document {
    company_name: string;
    company_email: string;
    password: string;

    company_description: string;
    address?: IAddress;

    website?: string;
    phone?: string;
    company_logo?: string;
    industury?: string;
    company_linkedin?: string;

    founder_email?: string;
    founder_name?: string;

    createdAt: Date;
    updatedAt: Date;
}