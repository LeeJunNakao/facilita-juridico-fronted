import axios from "axios";
import { Customer } from "../protocols/entities";
import { Filters } from "components/CustomerTable";
import { removeNullableValues } from "components/utils/formater";

const api = axios.create({ baseURL: process.env.REACT_APP_PUBLIC_URL });

export const getCustomers = async (filters: Filters): Promise<Customer[]> => {
  const response = await api.get("customer", {
    params: removeNullableValues(filters),
  });

  return response.data;
};

export const createCustomer = async (customer: Customer): Promise<Customer> => {
  const response = await api.post("customer", customer);

  return response.data;
};

export const getCustomerRoute = async (): Promise<Customer[]> => {
  const response = await api.get("customer-route");

  return response.data;
};
