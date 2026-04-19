import axiosInstance from "../api/axiosInstance";

const facilityService = {
  getAll: () => axiosInstance.get("/facilities"),
  getById: (id) => axiosInstance.get(`/facilities/${id}`),
  search: (params) => axiosInstance.get("/facilities/search", { params }),
  create: (data) => axiosInstance.post("/facilities", data),
  update: (id, data) => axiosInstance.put(`/facilities/${id}`, data),
  delete: (id) => axiosInstance.delete(`/facilities/${id}`),
};

export default facilityService;