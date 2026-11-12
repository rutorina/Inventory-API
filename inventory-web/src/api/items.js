import { request } from "./client";

export const getItems = () => request("/items");
export const getItem = (id) => request(`/items/${id}`);
export const createItem = (item) =>
  request("/items", { method: "POST", body: item });
export const updateItem = (id, item) =>
  request(`/items/${id}`, { method: "PUT", body: item });
export const deleteItem = (id) => request(`/items/${id}`, { method: "DELETE" });
