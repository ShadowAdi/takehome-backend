import { IAddress } from "../../models/interfaces/company.interface";

export interface CreateCompanyDTO {
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
}
