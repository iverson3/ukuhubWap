import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import vuexAlong from 'vuex-along'
// 业务模块
import common from './modules/common'
import activity from './modules/activity'
import music from './modules/music'

Vue.use(Vuex)

// 指定存储哪些state到Local Storage
// 默认存储所有的state状态
// vuexAlong.watch(['localNum', 'sd'], true)
// 存储在Session Storage中
// vuexAlong.watchSession(['sessionNum'], true)
// 清除所有存储的state状态数据
// vuexAlong.clean() / window.cleanVuexAlong()

// 初始化state
let initState = {

}

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state: initState,
  modules: {
    common,
    activity,
    music
  },
  strict: debug,
  plugins: debug ? [createLogger(), vuexAlong] : [vuexAlong]
})
