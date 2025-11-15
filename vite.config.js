import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
  },
  build: {
    outDir: 'dist',
    // 优化构建
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 生产环境移除 console
      },
    },
    rollupOptions: {
      output: {
        // 代码分割
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'antd-mobile': ['antd-mobile'],
          'charts': ['echarts'],
        },
      },
    },
  },
})
