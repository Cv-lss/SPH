import Vue from 'vue'
import App from './App.vue'


//三级联动------注册全局组件
import TypeNav from '@/components/TypeNav'
//使用封装的全局组件分页器 轮播图
import Carousel from '@/components/Carousel'
//全局组件分页器
import Pagination from '@/components/Pagination'
//使用全局组件 第一个参数 全局组件的名字 第二个参数 哪一个组件
Vue.component(TypeNav.name, TypeNav)
Vue.component(Carousel.name, Carousel)
Vue.component(Pagination.name.Pagination)
//引入路由
import router from '@/router'


//引入仓库 （store）
import store from '@/store'

// //测试服务器
// import { reqCategoryList } from '@/api'
// reqCategoryList()

// import { reqGetSearchInfo } from '@/api'
// console.log(reqGetSearchInfo({}));

//引入mock模拟的服务器
import '@/mock/mockServe'

//引入swiper的样式 轮播图
import 'swiper/css/swiper.css'

//统一api
import * as API from '@/api'
Vue.config.productionTip = false

//引入饿了么ui
import { Button, MessageBox } from 'element-ui';
//使用饿了么ui
Vue.component(Button.name, Button);
//饿了么ui弹框
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
//引入表单验证
import '@/plugins/validate'
new Vue({
  render: h => h(App),
  //注册全局事件总线
  beforeCreate() {
    Vue.prototype.$bus = this;
    Vue.prototype.$API = API;
  },
  //注册路由 
  router,
  //注册仓库
  store,
}).$mount('#app')


