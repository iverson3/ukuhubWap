// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/store'
import VueResource from 'vue-resource'
import { currency } from './tools/currency'
import { sync } from 'vuex-router-sync'
import FastClick from 'fastclick'
import format from 'date-fns/format'
import { Lazyload } from 'vant'
// 使用本地字体文件 防止远程字体文件请求CDN超时
import 'vant/lib/vant-css/icon-local.css'
// import 'babel-polyfill'
import Navigation from 'vue-navigation'

Vue.use(Navigation, {router, store})

// 在入口文件中增加以下两句
// 可以支持非es6语法支持的浏览器，能让你的程序更健壮
require('es6-promise').polyfill()
require('isomorphic-fetch')

Vue.prototype.$format = format

let options = {
  loading: '', // 加载时的图片
  error: '', // 错误时的图片
  attempt: 3, // 尝试次数
  filter: null, // 图片url过滤
  lazyComponent: false // 是否能懒加载模块
}
// 注册自定义的图片懒加载指令
Vue.use(Lazyload, options)

/**
 * 移动设备上的浏览器默认会在用户点击屏幕大约延迟300毫秒后才会触发点击事件，这是为了检查用户是否在做双击
 * 为了能够立即响应用户的点击事件，才有了FastClick
 */
if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function () {
    FastClick.attach(document.body)
  }, false)
}

Vue.use(VueResource)

Vue.filter('currency', currency)

Vue.config.productionTip = false

// 建立store与router之间的联系 (把router相关的状态数据保存到store中)
sync(store, router)
// const unsync = sync(store, router)
// 执行这个回调函数则取消store与router之间的联系
// unsync()

// 注册Vue的全局自定义指令
Vue.directive('transclude', {
  inserted (el) {
    document.body.appendChild(el)
  },
  unbind (el) {
    el.parentNode.removeChild(el)
  }
})
Vue.directive('drag', {
  inserted: function (el) {
    el.onmousedown = function (e) {
      let l = e.clientX - el.offsetLeft
      let t = e.clientY - el.offsetTop
      document.onmousemove = function (e) {
        el.style.left = e.clientX - l + 'px'
        el.style.top = e.clientY - t + 'px'
      }
      el.onmouseup = function () {
        document.onmousemove = null
        el.onmouseup = null
      }
    }
  }
})

// VueResource api请求拦截器
Vue.http.interceptors.push((request, next) => {
  console.log('请求拦截器2')
  // console.log(request)
  // if (request.url.includes('api')) {
  //   // 设置免于登录检查的api请求
  //   if (!request.url.includes('login') && !request.url.includes('logout')) {
  //     if (store.state.user.accessToken === '') {
  //       window.alert('请先登录再进行操作')
  //       request.abort() // 终止当前请求
  //     }
  //     if (store.state.user.accessLiveTime <= (Date.parse(new Date()) / 1000)) {
  //       store.commit('user/logout')
  //       window.alert('登录信息已过期，请重新登录')
  //       request.abort() // 终止当前请求
  //     }
  //     // 为请求添加全局参数
  //     request.body.accessToken = store.state.user.accessToken
  //   }
  //
  //   next(response => {
  //     if (response.body.success) {
  //       console.log('api response success')
  //       // store.dispatch('appointmentManager/changeIsLoginStatus', false)
  //       // let isLogin = store.state.appointmentManager.isLogin
  //       // router.push('/AppointmentManager/login')
  //       // window.location.href = 'http://' + window.location.host + '/AppointmentManager?redirect=login'
  //     } else {
  //       const Errcode = 'no-login'
  //       if (response.body.error === Errcode) {
  //         window.alert('请先登录再进行操作')
  //         request.abort()
  //       }
  //     }
  //   })
  // } else {
  //   next()
  // }
  next()
})

// 全局路由守卫之 前置守卫
router.beforeEach((to, from, next) => {
  console.log('before each')

  // 在前置守卫中检查即将进入的页面是否需要登录权限
  // if (to.matched.some(record => record.meta.requiresAuth)) {
  //   // 检查是否处于登录状态，否则跳到login页面
  //   if (store.state.user.accessToken === '' ||
  //     store.state.user.accessToken === null ||
  //     store.state.user.accessLiveTime <= (Date.parse(new Date()) / 1000)) {
  //     // accessLiveTime过期但accessToken还没清除
  //     if (store.state.user.accessToken !== '') {
  //       store.commit('user/logout')
  //     }
  //     next({
  //       path: '/login',
  //       query: { redirect: to.fullPath }
  //     })
  //   } else {
  //     next()
  //   }
  // } else {
  //   next()
  // }
  next()
})

// 全局路由后置钩子
// 钩子没有 next 函数参数,也不会改变导航本身
router.afterEach((to, from) => {
  console.log('after each')
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
