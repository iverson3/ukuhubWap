import * as types from '../mutation-types'
import Vue from 'vue'

const state = {
  page: 1,
  pageSize: 5,
  name: '',
  type: '类型',
  level: '难度',
  sort: '排序',
  musiclist: [],
  curId: 0,

  fromWhere: '',
  viewsData: [],
  created_atData: [],

  isLoading: false,
  isLoadingMore: false,
  finished: false,
  sortList: {
    'mix': '综合',
    'created_at': '时间',
    'views': '热度',
    'name': '曲名'
  }
}

const getters = {
  curMusicDetail: (state) => {
    let musics = []
    // 判断从哪个曲谱列表跳转过来
    if (state.fromWhere === 'views') {
      musics = state.viewsData
    } else if (state.fromWhere === 'created_at') {
      musics = state.created_atData
    } else {
      musics = state.musiclist
    }
    console.log(musics)

    const res = musics.filter((music) => {
      return parseInt(music.id) === parseInt(state.curId)
    })
    if (res.length > 0) {
      return res[0]
    } else {
      return {}
    }
  },
  viewsDataDeal: (state) => {
    let views = []
    // 实现对象数组的深拷贝 防止后面对数据的处理影响到源数据
    state.viewsData.forEach((value, index) => {
      views[index] = Object.assign({}, value)
    })

    if (views.length === 0) {
      return []
    }
    views = views.map((value) => {
      if (value.name.length > 20) {
        value.name = value.name.substr(0, 17) + '...'
      }
      return value
    })
    return views
  },
  created_atDataDeal: (state) => {
    let views = []
    state.created_atData.forEach((value, index) => {
      views[index] = Object.assign({}, value)
    })

    if (views.length === 0) {
      return []
    }
    views = views.map((value) => {
      if (value.name.length > 20) {
        value.name = value.name.substr(0, 17) + '...'
      }
      value.created_at = value.created_at.substr(5, 5)
      return value
    })
    return views
  }
}

const actions = {
  getMusicListByFilterChange ({commit, state, dispatch}, payload) {
    commit('clearMusicList')
    commit('changePage', 1)
    commit('changefinished', false)
    dispatch('getMusicList')
  },
  /**
   store.dispatch('getDataTest2').then((res) => {
      // 成功之后需要执行的逻辑代码
   })
   */
  getMusicList: function ({commit, state}, payload) {
    commit('changeisLoading', true)
    return new Promise((resolve, reject) => {
      let page = state.page
      let pageSize = state.pageSize
      let name = state.name
      let type = state.type
      let level = state.level
      let sort = state.sort
      if (type === '类型' || type === '全部') type = ''
      if (level === '难度' || level === '全部') level = ''
      if (sort === '排序') sort = ''

      let sortList = state.sortList
      Object.keys(sortList).forEach(function (key) {
        if (sortList[key] === sort) {
          sort = key
        }
      })

      if (payload) {
        page = 1
        pageSize = 10
        name = ''
        type = ''
        level = ''
        sort = payload.order
      }

      let params = {
        page: page,
        pagesize: pageSize,
        name: name,
        type: type,
        level: level,
        order: sort
      }

      Vue.http.post(
        '/api/music/getMusicList',
        params,
        {emulateJSON: true}
      )
        .then(res => res.json())
        .then(res => {
          commit('changeisLoading', false)
          commit('changeisLoadingMore', false)
          if (res.success) {
            if (payload) {
              if (payload.order === 'views') {
                console.log(res.data.data)
                commit('setViewsData', res.data.data)
              } else if (payload.order === 'created_at') {
                console.log(res.data.data)
                commit('setCreated_atData', res.data.data)
              } else { }
            } else {
              if (!res.data.next_page_url) {
                commit('changefinished', true)
              }
              commit('changePage', state.page + 1)
              commit('getMusicListSuccess', res.data.data)
            }
            resolve('success')
          } else {
            // commit('getGoodsError', res.error)
            resolve('fail')
          }
        })
        .catch(err => {
          commit('changeisLoading', false)
          // commit('getMusicListError', err)
          reject('fail')
        })
    })
  },
  getMusicDetail: function ({commit, state}, payload) {
    return new Promise((resolve, reject) => {
      Vue.http.post(
        '/api/music/getDetail',
        {'id': state.curId},
        {emulateJSON: true}
      )
        .then(res => res.json())
        .then(res => {
          if (res.success) {
            commit('getMusicListSuccess', res.data)
            resolve('success')
          } else {
            resolve('fail')
          }
        })
        .catch(err => {
          reject('fail')
        })
    })
  },
  incrementView: function ({commit, state}, payload) {
    return new Promise((resolve, reject) => {
      Vue.http.post(
        '/api/music/incrementView',
        {'id': state.curId},
        {emulateJSON: true}
      )
        .then(res => res.json())
        .then(res => {
          if (res.success) {
            resolve('success')
          } else {
            resolve('fail')
          }
        })
        .catch(err => {
          reject('fail')
        })
    })
  },
  initData ({commit}) {
    commit('clearMusicList')
    commit('clearFilter')
    commit('changePage', 1)
    commit('changefinished', false)
  }
}

const mutations = {
  changeName (state, name) {
    state.name = name
  },
  changeType (state, type) {
    state.type = type
  },
  changeLevel (state, level) {
    state.level = level
  },
  changeSort (state, sort) {
    state.sort = sort
  },

  setCurId (state, id) {
    state.curId = id
  },

  getMusicListSuccess (state, data) {
    state.musiclist = state.musiclist.concat(data)
  },
  setFromWhere: (state, where) => {
    state.fromWhere = where
  },
  setViewsData: (state, data) => {
    state.viewsData = data
  },
  setCreated_atData: (state, data) => {
    state.created_atData = data
  },
  clearMusicList (state) {
    state.musiclist = []
  },
  clearFilter (state) {
    state.name = ''
    state.type = '类型'
    state.level = '难度'
    state.sort = '排序'
  },
  setOrderby (state, orderby) {
    state.page = 1
    state.musiclist = []
    state.sort = orderby
  },
  changePage (state, page) {
    state.page = page
  },
  changeisLoading (state, status) {
    state.isLoading = status
  },
  changefinished (state, status) {
    state.finished = status
  },
  changeisLoadingMore (state, status) {
    state.isLoadingMore = status
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
