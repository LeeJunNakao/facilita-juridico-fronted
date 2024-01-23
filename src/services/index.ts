import axios from "axios";
import { Customer } from "../protocols/entities";

const api = axios.create({ baseURL: process.env.REACT_APP_PUBLIC_URL });

export const getCustomers = async (): Promise<Customer[]> => {
  const response = await api.get("customer");

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
