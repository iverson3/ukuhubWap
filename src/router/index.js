import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Welcome = r => require.ensure([], () => r(require('@/views/Welcome')), 'welcome-group')

const Home = r => require.ensure([], () => r(require('@/views/Home')), 'home-group')

const Index = r => require.ensure([], () => r(require('@/views/Tabs/Index')), 'tabs-group')
const Music = r => require.ensure([], () => r(require('@/views/Tabs/Music')), 'tabs-group')
const Video = r => require.ensure([], () => r(require('@/views/Tabs/Video')), 'tabs-group')
const User = r => require.ensure([], () => r(require('@/views/Tabs/User')), 'tabs-group')

const MusicDetail = r => require.ensure([], () => r(require('@/components/Music/MusicDetail')), 'music-group')

const ActivityList = r => require.ensure([], () => r(require('@/components/Activity/ActivityList')), 'activity-group')
const ActivityDetail = r => require.ensure([], () => r(require('@/components/Activity/ActivityDetail')), 'activity-group')
const JoinActivity = r => require.ensure([], () => r(require('@/components/Activity/JoinActivity')), 'activity-group')
const CancelJoinActivity = r => require.ensure([], () => r(require('@/components/Activity/CancelJoinActivity')), 'activity-group')


const NotFound = r => require.ensure([], () => r(require('@/views/Public/NotFound')), 'home-group')

const routes = [
  {
    path: '/',
    nmame: 'Welcome',
    component: Welcome
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [
      {
        path: 'index',
        name: 'Index',
        component: Index
      },
      {
        path: 'music',
        name: 'Music',
        component: Music
      },
      {
        path: 'video',
        name: 'Video',
        component: Video
      },
      {
        path: 'user',
        name: 'User',
        component: User
      }
    ]
  },
  {
    path: '/music/detail',
    name: 'MusicDetail',
    component: MusicDetail
  },
  {
    path: '/activity/list',
    name: 'ActivityList',
    component: ActivityList
  },
  {
    path: '/activity/detail',
    name: 'ActivityDetail',
    component: ActivityDetail
  },
  {
    path: '/activity/join',
    name: 'JoinActivity',
    component: JoinActivity
  },
  {
    path: '/activity/cancel',
    name: 'CancelJoinActivity',
    component: CancelJoinActivity
  },
  {
    path: '*',
    component: NotFound
  }
]

// 自定义在路由切换时页面如何滚动 (控制滚动条滚动行为)
// savedPosition 参数只有通过点击"浏览器的【前进/后退】按钮触发"时才可用
const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    // 返回 savedPosition，在按下 后退/前进 按钮时，就会像浏览器的原生表现那样
    return savedPosition
  } else {
    const position = {}
    if (to.hash) {
      // 模拟“滚动到锚点”的行为
      return {
        selector: to.hash
      }
    }
    // 匹配路由的meta字段是否包含scrollToTop信息
    if (to.matched.some(m => m.meta.scrollToTop)) {
      // 让页面滚动到顶部
      position.x = 0
      position.y = 0
    }
    // 如果返回的是空对象，则保持当前的滚动位置
    return position
  }
}

// 实例化VueRouter 并设置相关参数
const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior,
  routes
})

export default router
