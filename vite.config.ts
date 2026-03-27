
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
  '/api': {
    target: 'https://api.upply.tech',
    changeOrigin: true,
    secure: false,
  }
}
  }
})

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from "path"

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
//   server: {
//     proxy: {
//       // أي طلب يبدأ بـ /api هيروح أوتوماتيك للسيرفر بتاعك
//       '/api': {
//         target: 'https://upply.happymoss-186d701d.francecentral.azurecontainerapps.io',
//         changeOrigin: true,
//         secure: false,
//         rewrite: (path) => path.replace(/^\/api/,'/api/v1'), // دي بتشيل /api من بداية المسار قبل ما تبعت الطلب للسيرفر
//       }
//     }
//   }
// })
