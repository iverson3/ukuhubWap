import Vue from 'vue'

const state = {
  activitylist: [],
  curId: 0,
  memberlist: [], // 活动成员

  isLoading: false,
  orderby: 'created_at'
}

const getters = {
  curActivityDetail: (state) => {
    const res = state.activitylist.filter((activity) => {
      return parseInt(activity.id) === parseInt(state.curId)
    })
    if (res.length > 0) {
      return res[0]
    } else {
      return {}
    }
  },
  memberSum: (state) => {
    return state.memberlist.length
  }
}

const actions = {
  getActivityList: function ({commit, state}, payload) {
    commit('changeisLoading', true)
    return new Promise((resolve, reject) => {
      Vue.http.post(
        '/api/activity/getActivityList',
        {'orderby': state.orderby},
        {emulateJSON: true}
      )
        .then(res => res.json())
        .then(res => {
          commit('changeisLoading', false)
          if (res.success) {
            commit('getActivityListSuccess', res.data)
            resolve('success')
          } else {
            // commit('getActivityListError', res.error)
            resolve('fail')
          }
        })
        .catch(err => {
          commit('changeisLoading', false)
          // commit('getActivityListError', err)
          reject('fail')
        })
    })
  },
  getMemberList: function ({commit, state}, payload) {
    return new Promise((resolve, reject) => {
      Vue.http.post(
        '/api/activity/getMemberList',
        {id: state.curId},
        {emulateJSON: true}
      )
        .then(res => res.json())
        .then(res => {
          if (res.success) {
            commit('getMemberListSuccess', res.data)
            resolve('success')
          } else {
            // commit('getActivityListError', res.error)
            resolve('fail')
          }
        })
        .catch(err => {
          // commit('getActivityListError', err)
          reject('fail')
        })
    })
  },

  joinActivity: function ({commit, state, dispatch}, payload) {
    return new Promise((resolve, reject) => {
      Vue.http.post(
        '/api/activity/joinActivity',
        payload,
        {emulateJSON: true}
      )
        .then(res => res.json())
        .then(res => {
          if (res.success) {
            // 操作成功后，重新获取数据，更新数据列表
            dispatch('getMemberList')
            resolve('success')
          } else {
            if (res.error === 'repeat') {
              resolve('repeat')
            } else if (res.error === 'black') {
              resolve('black')
            } else {
              resolve('fail')
            }
          }
        })
        .catch(err => {
          reject('fail')
        })
    })
  },
  searchMember: function ({commit, state}, payload) {
    return new Promise((resolve, reject) => {
      Vue.http.post(
        '/api/activity/searchMember',
        payload,
        {emulateJSON: true}
      )
        .then(res => res.json())
        .then(res => {
          if (res.success) {
            resolve(res.data)
          } else {
            resolve('fail')
          }
        })
        .catch(err => {
          reject('fail')
        })
    })
  },
  cancelActivity: function ({commit, state, dispatch}, payload) {
    return new Promise((resolve, reject) => {
      Vue.http.post(
        '/api/activity/cancelActivity',
        payload,
        {emulateJSON: true}
      )
        .then(res => res.json())
        .then(res => {
          if (res.success) {
            // 操作成功后，重新获取数据，更新数据列表
            dispatch('getMemberList')
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
  validateMemberByWechat: function ({commit, state}, payload) {
    return new Promise((resolve, reject) => {
      Vue.http.post(
        '/api/activity/validateMemberByWechat',
        {wechat: payload.wechat},
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
    commit('clearActivityList')
    commit('clearMemberList')
  },
  initDetailData ({commit}) {
    commit('clearMemberList')
  }
}

const mutations = {
  clearActivityList (state) {
    state.activitylist = []
  },
  clearMemberList (state) {
    state.memberlist = []
  },
  getActivityListSuccess (state, data) {
    state.activitylist = state.activitylist.concat(data)
  },
  changeisLoading (state, status) {
    state.isLoading = status
  },
  setCurId (state, id) {
    state.curId = id
  },
  getMemberListSuccess (state, data) {
    state.memberlist = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
