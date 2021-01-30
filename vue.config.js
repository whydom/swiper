const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  lintOnSave: true,
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets',resolve('src/assets'))
      .set('components',resolve('src/components'))
      // 这里只写了两个个，你可以自己再加，按这种格式.set('', resolve(''))
  },
  // 这个是cli3需要增加的，不然在natapp与ngrok的外网映射服务中会报错Invalid Host header
  devServer: {
    disableHostCheck: true,
  }
};
