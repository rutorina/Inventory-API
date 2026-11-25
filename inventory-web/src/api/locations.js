import { request } from "./client";

const clean = ({ name, code }) => ({
  name: name.trim(),
  code: code.trim(),
});

export const getLocations = () => request("/locations");
export const getLocation = (id) => request(`/locations/${id}`);
export const createLocation = (location) =>
  request("/locations", { method: "POST", body: clean(location) });
export const updateLocation = (id, location) =>
  request(`/locations/${id}`, { method: "PUT", body: clean(location) });
export const deleteLocation = (id) =>
  request(`/locations/${id}`, { method: "DELETE" });
