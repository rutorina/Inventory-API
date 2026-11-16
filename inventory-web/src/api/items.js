import { request } from "./client";

// Strip stray whitespace so " ABC-1 " and "ABC-1" aren't saved as different SKUs.
const clean = ({ name, sku, description }) => ({
  name: name.trim(),
  sku: sku.trim(),
  description: description?.trim() ?? "",
});

export const getItems = () => request("/items");
export const getItem = (id) => request(`/items/${id}`);
export const createItem = (item) =>
  request("/items", { method: "POST", body: clean(item) });
export const updateItem = (id, item) =>
  request(`/items/${id}`, { method: "PUT", body: clean(item) });
export const deleteItem = (id) => request(`/items/${id}`, { method: "DELETE" });
