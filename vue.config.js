const path = require("path");

module.exports = {
  productionSourceMap: false,
  runtimeCompiler: true,
  devServer: {
    proxy: require("./server.config.js"),
  },
  outputDir: "../",
  publicPath: "/",
  indexPath: "index.html",
  assetsDir: "assets",
  css: {
    loaderOptions: {
      scss: {
        data: `@import "./src/assets/styles/predata/index.scss";`,
      },
    },
  },
  pwa: {
    name: "11",
    short_name: "11",
    themeColor: "#AB052D",
    msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",

    manifestOptions: {
      start_url: "/",
      display: "standalone",
      background_color: "#AB052D",
    },
    workboxOptions: {
      skipWaiting: true,
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "~": path.resolve(__dirname, "src"),
        "@components": path.resolve(__dirname, "src/components"),
        "@UI": path.resolve(__dirname, "src/components/UI"),
        "@views": path.resolve(__dirname, "src/views"),
        "@utils": path.resolve(__dirname, "src/assets/scripts/scripts.js"),
        "@widgets": path.resolve(__dirname, "src/components/widgets"),
        "@assets": path.resolve(__dirname, "src/assets"),
        "@pagesLayouts": path.resolve(__dirname, "src/components/UI/page"),
        "@plugins": path.resolve(__dirname, "src/plugins"),
      },
    },
  },
};
