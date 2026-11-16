import { request } from "./client";

export const getStockLevels = () => request("/stocklevels");
export const getStockLevel = (id) => request(`/stocklevels/${id}`);
export const getStockByItem = (itemId) =>
  request(`/stocklevels/item/${itemId}`);
export const getStockByLocation = (locationId) =>
  request(`/stocklevels/location/${locationId}`);
export const receiveStock = (data) =>
  request("/stocklevels/receive", { method: "POST", body: data });
export const transferStock = (data) =>
  request("/stocklevels/transfer", { method: "POST", body: data });
export const updateStockLevelQuantity = (id, quantity) =>
  request(`/stocklevels/${id}`, { method: "PUT", body: { quantity } });
export const deleteStockLevel = (id) =>
  request(`/stocklevels/${id}`, { method: "DELETE" });
