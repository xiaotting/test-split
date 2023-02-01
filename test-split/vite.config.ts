import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import pptv, { AcceptedPlugin } from "postcss-px-to-viewport-8-plugin";
import viteCompression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";
import { chunkSplitPlugin } from "vite-plugin-chunk-split";
import tsconfigPaths from "vite-tsconfig-paths";
import vitePluginImp from "vite-plugin-imp";
import windiCSS from "vite-plugin-windicss";

const UI_WIDTH = 1440;

const loadPptv: AcceptedPlugin = pptv({
  unitToConvert: "rpx", // 要转换的单位
  viewportWidth: UI_WIDTH, // 视口的宽度
  unitPrecision: 5, // 允许 vw 单位增长到的十进制数
  propList: ["*"], // 可以从 px 更改为 vw 的属性
  viewportUnit: "vw", // 预期单位
  fontViewportUnit: "vw", // 字体的预期单位
  selectorBlackList: [], // 要忽略并保留为 px 的选择器
  minPixelValue: 1, // 设置要替换的最小像素值
  mediaQuery: false, // 允许在媒体查询中转换 px
  replace: true, // 替换包含 vw 的规则而不是添加回退
  exclude: [/\node_modules/], // 忽略一些文件
  include: [], //
  landscape: false, //
  landscapeUnit: "vw", // landscape选项的预期单位
  landscapeWidth: UI_WIDTH, // 横向的视口宽
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === "production";
  return {
    base: "./",
    plugins: [
      react({
        babel: {
          parserOpts: {
            plugins: ["decorators-legacy"],
          },
        },
      }),
      viteCompression({
        // gzip静态资源压缩配置
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: "gzip",
        ext: ".gz",
      }),
      visualizer(),
      chunkSplitPlugin({
        strategy: "single-vendor",
        customSplitting: {
          antd: ["antd"],
          axios: ["axios"],
          lodash: ["lodash"],
          moment: ["moment"],
          classnames: ["classnames"],
          mobx: ["mobx"],
          uuid: ["uuid"],
          "mobx-react": ["mobx-react"],
          "react-vendor": [
            "react",
            "react-dom",
            "react-router-dom",
            "react-beautiful-dnd",
            "react-pdf",
          ],
          "resize-observer-polyfill": ["resize-observer-polyfill"],
          "crypto-js": ["crypto-js"],
          "array.prototype.at": ["array.prototype.at"],
          "antd-theme-generator": ["antd-theme-generator"],
          "postcss-px-to-viewport-8-plugin": [
            "postcss-px-to-viewport-8-plugin",
          ],
        },
      }),
      tsconfigPaths(),
      vitePluginImp({
        libList: [
          {
            libName: "antd",
            style: (name) => `antd/es/${name}/style`,
          },
        ],
      }),
      windiCSS(),
    ],
    build: {
      sourcemap: true,
      chunkSizeWarningLimit: 1000, // 提高超大静态资源警告大小
    },
    css: {
      postcss: {
        plugins: [loadPptv],
      },
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    define: {
      "process.env": process.env,
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 8000,
      proxy: {
        "/api": {
          target: "localhost:4000//",
          changeOrigin: true,
          rewrite: (path) => {
            return path.replace(/^\/api/, "");
          },
        },
      },
    },
  };
});
