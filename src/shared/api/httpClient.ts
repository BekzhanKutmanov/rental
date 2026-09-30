import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

export type ApiResponse<T = unknown> = T;

type ApiClient = Omit<AxiosInstance, "request" | "get" | "delete" | "head" | "options" | "post" | "put" | "patch"> & {
  request<T = unknown>(config: AxiosRequestConfig): Promise<ApiResponse<T>>;
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
  head<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
  options<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
};

const getAuthToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem("token");
};

const handleResponseStatus = (status: number) => {
  switch (status) {
    case 400:
      // TODO: handle 400
      break;
    case 401:
      // TODO: handle 401
      break;
    case 403:
      // TODO: handle 403
      break;
    case 404:
      console.warn('Ошибка 404')
      // TODO: handle 404
      break;
    default:
      break;
  }
};

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "",
  timeout: 15000,
  validateStatus: () => true,
});

httpClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers.Accept = "application/json";

  if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }

  const token = getAuthToken();

  // if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  // }

  return config;
});

httpClient.interceptors.response.use(
  (response) => {
    handleResponseStatus(response.status);

    return response.data;
  },
  (error: AxiosError) => Promise.reject(error),
);

export default httpClient as ApiClient;