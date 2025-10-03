import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const BASE_URL = "https://fomo-backend-production-6d3a.up.railway.app";

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("access_token");
    }

    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.log("🚫 401 Unauthorized - redirecting to home");
          this.removeToken();
          if (typeof window !== "undefined") {
            // Only redirect if not already on admin login page
            if (!window.location.pathname.includes("/admin/login")) {
              window.location.href = "/";
            }
          }
        }
        return Promise.reject(error);
      },
    );
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token);
    }
  }

  removeToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
    }
  }

  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.request<T>(config);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "An error occurred";
      throw new Error(message);
    }
  }

  async register(data: {
    email: string;
    password: string;
    name: string;
    phone: string;
    preferred_language: string;
  }) {
    return this.request<{
      user: any;
      access_token: string;
    }>({
      url: "/api/auth/register",
      method: "POST",
      data,
    });
  }

  async login(data: { email: string; password: string }) {
    return this.request<{
      user: any;
      access_token: string;
    }>({
      url: "/api/auth/login",
      method: "POST",
      data,
    });
  }

  async logout() {
    return this.request({
      url: "/api/auth/logout",
      method: "POST",
    });
  }

  async getProfile() {
    return this.request<any>({
      url: "/api/auth/me",
      method: "GET",
    });
  }

  async updateProfile(data: {
    name?: string;
    phone?: string;
    profile_image_url?: string;
    preferred_language?: string;
  }) {
    return this.request<any>({
      url: "/api/auth/profile",
      method: "PUT",
      data,
    });
  }

  async getCourses(params?: {
    category?: string;
    level?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
  }) {
    return this.request<{
      data: any[];
      meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>({
      url: "/api/courses",
      method: "GET",
      params,
    });
  }

  async getCourse(id: string) {
    return this.request<any>({
      url: `/api/courses/${id}`,
      method: "GET",
    });
  }

  async purchaseCourse(
    id: string,
    data: {
      full_name: string;
      phone: string;
      notes?: string;
      amount: number;
      currency: string;
    },
  ) {
    return this.request<{
      payment_request_id: string;
      message: string;
    }>({
      url: `/api/courses/${id}/purchase`,
      method: "POST",
      data,
    });
  }

  async getDashboardOverview() {
    return this.request<any>({
      url: "/api/dashboard/overview",
      method: "GET",
    });
  }

  async getUserCourses() {
    return this.request<any[]>({
      url: "/api/dashboard/courses",
      method: "GET",
    });
  }

  async getMyCourses() {
    return this.request<{
      courses: any[];
      total: number;
    }>({
      url: "/api/courses/my-courses",
      method: "GET",
    });
  }

  async getCourseProgress(courseId: string) {
    return this.request<{
      id: string;
      completed_videos: number;
      total_videos: number;
      progress_percentage: number;
      last_accessed: string;
      completed_at?: string;
    }>({
      url: `/api/courses/${courseId}/progress`,
      method: "GET",
    });
  }

  async markVideoComplete(
    videoId: string,
    data: { watch_time_minutes: number },
  ) {
    return this.request<{
      message: string;
      points_earned: number;
      total_points: number;
      progress: {
        is_completed: boolean;
        completed_at: string;
        points_earned: number;
      };
    }>({
      url: `/api/videos/${videoId}/complete`,
      method: "POST",
      data,
    });
  }

  async getWorkbooks(params?: {
    category?: string;
    level?: string;
    is_free?: boolean;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  }) {
    return this.request<{
      data: any[];
      meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>({
      url: "/api/workbooks",
      method: "GET",
      params,
    });
  }

  async getMyWorkbooks() {
    return this.request<{
      workbooks: any[];
      total: number;
    }>({
      url: "/api/workbooks/my-workbooks",
      method: "GET",
    });
  }

  async purchaseWorkbook(
    workbookId: string,
    data: {
      full_name: string;
      phone: string;
      notes?: string;
      amount: number;
      currency: string;
    },
  ) {
    return this.request<{
      payment_request_id: string;
      message: string;
    }>({
      url: `/api/workbooks/${workbookId}/purchase`,
      method: "POST",
      data,
    });
  }

  async downloadWorkbook(workbookId: string) {
    return this.request<{
      download_url: string;
      expires_at: string;
    }>({
      url: `/api/workbooks/${workbookId}/download`,
      method: "GET",
    });
  }

  async getWorkbook(id: string) {
    return this.request<any>({
      url: `/api/workbooks/${id}`,
      method: "GET",
    });
  }

  async getPointsBalance() {
    return this.request<{
      current_points: number;
      total_earned: number;
      rank: number;
    }>({
      url: "/api/points/balance",
      method: "GET",
    });
  }

  async getPointsHistory(params?: { page?: number; limit?: number }) {
    return this.request<{
      data: any[];
      meta: any;
    }>({
      url: "/api/points/history",
      method: "GET",
      params,
    });
  }

  async getPointsLeaderboard(limit?: number) {
    return this.request<any[]>({
      url: "/api/points/leaderboard",
      method: "GET",
      params: { limit },
    });
  }

  async getFreeResourcesIndustries() {
    return this.request<any[]>({
      url: "/api/free-resources/industries",
      method: "GET",
    });
  }

  async downloadFreeVocabulary(industry: string) {
    return this.request<{
      download_url: string;
      title_en: string;
      title_vi: string;
    }>({
      url: `/api/free-resources/${industry}/download`,
      method: "GET",
    });
  }

  async trackDownload(data: { resource_id: string; resource_type: string }) {
    return this.request({
      url: "/api/free-resources/track-download",
      method: "POST",
      data,
    });
  }

  async getPaymentStatus(id: string) {
    return this.request<any>({
      url: `/api/payments/status/${id}`,
      method: "GET",
    });
  }

  // Admin endpoints
  async getAdminDashboardStats() {
    return this.request<{
      totalUsers: number;
      totalCourses: number;
      totalPaymentRequests: number;
      pendingPayments: number;
      completedPayments: number;
      totalRevenue: number;
    }>({
      url: "/api/admin/dashboard/stats",
      method: "GET",
    });
  }

  async getAllPaymentRequests(
    status?: "pending" | "verified" | "completed" | "failed",
  ) {
    const params = status ? { status } : {};
    return this.request<any[]>({
      url: "/api/admin/payments",
      method: "GET",
      params,
    });
  }

  async verifyPayment(data: {
    payment_request_id: string;
    status: "completed" | "failed";
    admin_notes?: string;
    bank_transfer_content?: string;
  }) {
    return this.request<any>({
      url: "/api/admin/payments/verify",
      method: "POST",
      data,
    });
  }

  async grantCourseAccess(data: {
    user_id: string;
    course_id: string;
    payment_amount: number;
    payment_currency: string;
  }) {
    return this.request<any>({
      url: "/api/admin/courses/grant-access",
      method: "POST",
      data,
    });
  }

  async getAllUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    return this.request<{
      data: any[];
      meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>({
      url: "/api/admin/users",
      method: "GET",
      params,
    });
  }

  async getUserDetails(id: string) {
    return this.request<any>({
      url: `/api/admin/users/${id}`,
      method: "GET",
    });
  }

  async updateUser(
    id: string,
    data: {
      name?: string;
      phone?: string;
      role?: string;
      points?: number;
      preferred_language?: string;
    },
  ) {
    return this.request<any>({
      url: `/api/admin/users/${id}`,
      method: "PUT",
      data,
    });
  }

  async deleteUser(id: string) {
    return this.request<any>({
      url: `/api/admin/users/${id}`,
      method: "DELETE",
    });
  }

  async getUserCourseAccess(id: string) {
    return this.request<any[]>({
      url: `/api/admin/users/${id}/courses`,
      method: "GET",
    });
  }

  async revokeCourseAccess(userId: string, courseId: string) {
    return this.request<any>({
      url: `/api/admin/users/${userId}/courses/${courseId}`,
      method: "DELETE",
    });
  }

  async getAdminCourses(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    return this.request<{
      data: any[];
      meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>({
      url: "/api/admin/courses",
      method: "GET",
      params,
    });
  }

  async createCourse(data: {
    title_en: string;
    title_vi: string;
    description_en: string;
    description_vi: string;
    price_usd: number;
    price_vnd: number;
    original_price_usd?: number;
    original_price_vnd?: number;
    level: string;
    category: string;
    duration_hours: number;
    total_videos: number;
    instructor_id?: string;
    image_url?: string;
    is_lifetime_access?: boolean;
    is_active?: boolean;
  }) {
    return this.request<any>({
      url: "/api/admin/courses",
      method: "POST",
      data,
    });
  }

  async createCourseWithContent(data: {
    title_en: string;
    title_vi: string;
    description_en: string;
    description_vi?: string;
    price_usd: number;
    price_vnd: number;
    original_price_usd?: number;
    original_price_vnd?: number;
    level: string;
    category: string;
    duration_hours: number;
    instructor_id?: string;
    image_url?: string;
    is_lifetime_access?: boolean;
    is_active?: boolean;
    sections?: Array<{
      title_en: string;
      title_vi: string;
      description_en: string;
      description_vi?: string;
      sort_order: number;
      is_active: boolean;
      videos: Array<{
        title_en: string;
        title_vi: string;
        description_en: string;
        description_vi?: string;
        video_url: string;
        quiz_url?: string;
        duration_minutes: number;
        points_reward: number;
        sort_order: number;
        is_active: boolean;
      }>;
    }>;
  }) {
    return this.request<any>({
      url: "/api/admin/courses/with-content",
      method: "POST",
      data,
    });
  }

  async updateCourse(
    id: string,
    data: {
      title_en?: string;
      title_vi?: string;
      description_en?: string;
      description_vi?: string;
      price_usd?: number;
      price_vnd?: number;
      original_price_usd?: number;
      original_price_vnd?: number;
      level?: string;
      category?: string;
      duration_hours?: number;
      total_videos?: number;
      instructor_id?: string;
      image_url?: string;
      is_lifetime_access?: boolean;
      is_active?: boolean;
    },
  ) {
    return this.request<any>({
      url: `/api/admin/courses/${id}`,
      method: "PUT",
      data,
    });
  }

  async deleteCourse(id: string) {
    return this.request<any>({
      url: `/api/admin/courses/${id}`,
      method: "DELETE",
    });
  }

  async getAdminWorkbooks(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    return this.request<{
      data: any[];
      meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>({
      url: "/api/admin/workbooks",
      method: "GET",
      params,
    });
  }

  async createWorkbook(data: {
    title_en: string;
    title_vi: string;
    description_en: string;
    description_vi: string;
    price_usd?: number;
    price_vnd?: number;
    original_price_usd?: number;
    original_price_vnd?: number;
    level: string;
    category: string;
    pages: number;
    pdf_url: string;
    cover_image_url?: string;
    is_free?: boolean;
    is_active?: boolean;
  }) {
    return this.request<any>({
      url: "/api/admin/workbooks",
      method: "POST",
      data,
    });
  }

  async updateWorkbook(
    id: string,
    data: {
      title_en?: string;
      title_vi?: string;
      description_en?: string;
      description_vi?: string;
      price_usd?: number;
      price_vnd?: number;
      original_price_usd?: number;
      original_price_vnd?: number;
      level?: string;
      category?: string;
      pages?: number;
      pdf_url?: string;
      cover_image_url?: string;
      is_free?: boolean;
      is_active?: boolean;
    },
  ) {
    return this.request<any>({
      url: `/api/admin/workbooks/${id}`,
      method: "PUT",
      data,
    });
  }

  async deleteWorkbook(id: string) {
    return this.request<any>({
      url: `/api/admin/workbooks/${id}`,
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient(BASE_URL);
