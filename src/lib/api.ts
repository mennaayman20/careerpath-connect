import axios from "axios";


const api = axios.create({
  baseURL: "/api/v1", // دي هتخلي Vercel هو اللي يتصرف
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log("BASE URL:", import.meta.env.VITE_API_BASE_URL);

// ديه "نقطة التفتيش" اللي لازم تزيد عشان التوكن يتبعت
api.interceptors.request.use(
  (config) => {
    // هنجيب التوكن اللي اتسيف وقت الـ Login
    
    const token = localStorage.getItem("token");

    // لو التوكن موجود، بنحطه في الـ Headers عشان الباك اند يوافق يبعت الداتا
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// لو التوكن انتهى (401)، يرجعك للـ login بدل ما يعلق في صفحة فاضية
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("Interceptor Error:", error.response?.status);
    if (error.response && error.response.status === 401 ) {
      localStorage.removeItem("token");
      // window.location.href = "/login";


      window.dispatchEvent(new Event("storage")); 

      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }



    }
    return Promise.reject(error);
  }
);

export { api };
