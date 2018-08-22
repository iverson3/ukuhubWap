
const state = {
  active: 0,
  tabsTitle: '主页'
}

const getters = {

}

const actions = {

}

const mutations = {
  changeActive (state, active) {
    state.active = active
  },
  changeTabsTitle (state, title) {
    state.tabsTitle = title
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
