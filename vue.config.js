//vue-cli-service运行时环境参数配置
//https://cli.vuejs.org/zh/
//环境变量文件的应用
module.exports = {
  outputDir: 'admin',                                                     //生产环境构建文件的目录，默认dist
  assetsDir: '',                                                         //放置生成的静态资源的路径，默认''
  indexPath: 'index.html',                                               //指定生成的index.html的输出路径，默认 index.html
  filenameHashing: true,                                                 //生成的静态资源文件名包含hash利于控制缓存，默认true
  devServer: {
    //开发服务器配置，还可以通过 package.json 中 scripts 命令添加运行参数
    proxy: {
      '/screen': {
        target: 'http://149.129.195.73:9000/screen/',
        pathRewrite: { '^/screen': '' }
      },
    }
  },
  chainWebpack: config => {
    //调整内联文件的大小限制，设置为10kb
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => {
        return Object.assign(options, { limit: 10240 })
      })
  }
};
