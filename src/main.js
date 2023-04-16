import Vue from 'vue'
import App from './App.vue'
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from "vue-router";
import router from "@/router";
import store from "@/store";
import echarts from 'echarts'
Vue.prototype.$echarts = echarts




Vue.prototype.$axios =axios;
axios.defaults.withCredentials = true
Vue.prototype.$httpUrl='http://localhost:8082'


Vue.use(VueRouter);
Vue.use(ElementUI,{size:'small'});
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
