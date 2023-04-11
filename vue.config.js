const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  devServer:{
    proxy:{
      // host:'0.0.0.0',
      // port:8082,
      // client:{
      //   webSocketURL: 'ws://0.0.0.0:8082/chatServer/{username}'
      // },
      // headers:{
      //   'Access-Control-Allow-Origin': '*'
      // }
      '/api/':{
        target:'ws://localhost:8082/chatServer/{username}',
        changeOrigin:true,
        ['/api/']:''
      }
    }
  }
})
