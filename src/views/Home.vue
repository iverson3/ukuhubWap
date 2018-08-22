<template>
  <div class="home">
    <van-nav-bar
        :title="tabsTitle"
        left-arrow
        :fixed="true"
        @click-left="backto()"
        @click-right="tosearch()">
      <van-icon name="wap-nav" slot="right"></van-icon>
    </van-nav-bar>

    <div class="tabsContainer">
      <router-view/>
    </div>

    <van-tabbar v-model="active" @change="tabCut">
      <van-tabbar-item icon="shop" :to="{ name: 'Index' }">主页</van-tabbar-item>
      <van-tabbar-item icon="chat" dot :to="{ name: 'Music' }">曲谱</van-tabbar-item>
      <van-tabbar-item icon="records" :to="{ name: 'Video' }">视频</van-tabbar-item>
      <van-tabbar-item icon="gold-coin" :to="{ name: 'User' }">个人中心</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { NavBar, Icon, Tabbar, TabbarItem, Toast } from 'vant'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'home',
  data () {
    return {
      tabsName: [
        '主页',
        '曲谱',
        '视频',
        '个人中心'
      ]
    }
  },
  components: {
    [NavBar.name]: NavBar,
    [Icon.name]: Icon,
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    [Toast.name]: Toast
  },
  computed: mapState({
    tabsTitle: state => state.common.tabsTitle,
    active: state => state.common.active
  }),
  methods: {
    ...mapMutations('common', [
      'changeActive',
      'changeTabsTitle'
    ]),

    backto () {
      this.$router.go(-1)
    },
    tosearch () {
      this.$toast('功能开发中')
    },
    tabCut (active) {
      console.log('tabCut')
      console.log(active)
      this.changeActive(active)
      this.changeTabsTitle(this.tabsName[active])
    },

    onCancelSearch () {
      // this.isShowSearch = false
    }
  }
}
</script>

<style scoped>
    .tabsContainer {
        margin-bottom: 50px;
        width: 100%;
        height: auto;
        min-height: 400px;
        margin-top: 47px;
    }
</style>
