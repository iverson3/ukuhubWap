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
    const res = state.musiclist.filter((music) => {
      return parseInt(music.id) === parseInt(state.curId)
    })
    if (res.length > 0) {
      return res[0]
    } else {
      return {}
    }
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

      Vue.http.post(
        '/api/music/getMusicList',
        {'page': state.page, 'pagesize': state.pageSize, 'name': state.name, 'type': type, 'level': level, 'order': sort},
        {emulateJSON: true}
      )
        .then(res => res.json())
        .then(res => {
          commit('changeisLoading', false)
          commit('changeisLoadingMore', false)
          if (res.success) {
            if (!res.data.next_page_url) {
              commit('changefinished', true)
            }
            commit('changePage', state.page + 1)
            commit('getMusicListSuccess', res.data.data)
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
