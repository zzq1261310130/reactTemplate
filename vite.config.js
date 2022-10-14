import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vitePluginImp from "vite-plugin-imp";

// https://vitejs.dev/config/
export default defineConfig({
  // base: "./",
  plugins: [
    react(),
    vitePluginImp({
      libList: [
        {
          libName: "antd",
          style: (name) => `antd/es/${name}/style`,
        },
      ],
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          "@primary-color": "#dc5251",
        },
      },
    },
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: `${__dirname}/src`,
      },
    ],
  },
  server: {
    port: 9696,
    proxy: {
      "/tiOrder": {
        target: "http://192.168.6.215:8000/",
        rewrite: (path) => path.replace(/^\/tiOrder/, ""),
        changeOrigin: true,
        secure: true, // 是否https接口
      },
    },
  },
});
