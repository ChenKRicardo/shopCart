module.exports = {
  lintOnSave: false, //关闭eslintre语法检查
  productionSourceMap: false,
  devServer: {
    proxy: {
      "/api": {
        target: "http://gmall-h5-api.atguigu.cn",
        ws: true, //用于支持webscoket
        changeOrigin: true, //
      },
    },
  },
};
