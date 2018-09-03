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
      <van-tabbar-item :to="{ name: 'Index' }">
        主页
        <img
            slot="icon"
            slot-scope="props"
            :src="props.active ? tabImgList[0].active : tabImgList[0].normal"
            class="tabbar-item-icon"
        >
      </van-tabbar-item>

      <van-tabbar-item dot :to="{ name: 'Music' }">
        曲谱
        <img
            slot="icon"
            slot-scope="props"
            :src="props.active ? tabImgList[1].active : tabImgList[1].normal"
            class="tabbar-item-icon"
        >
      </van-tabbar-item>

      <van-tabbar-item :to="{ name: 'Video' }">
        视频
        <img
            slot="icon"
            slot-scope="props"
            :src="props.active ? tabImgList[2].active : tabImgList[2].normal"
            class="tabbar-item-icon"
        >
      </van-tabbar-item>

      <van-tabbar-item :to="{ name: 'User' }">
        个人中心
        <img
            slot="icon"
            slot-scope="props"
            :src="props.active ? tabImgList[3].active : tabImgList[3].normal"
            class="tabbar-item-icon"
        >
      </van-tabbar-item>
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
      ],
      tabImgList: [
        {
          normal: '../static/images/icons/home1.png',
          active: '../static/images/icons/home2.png'
        },
        {
          normal: '../static/images/icons/music1.png',
          active: '../static/images/icons/music2.png'
        },
        {
          normal: '../static/images/icons/video1.png',
          active: '../static/images/icons/video2.png'
        },
        {
          normal: '../static/images/icons/usercenter1.png',
          active: '../static/images/icons/usercenter2.png'
        }
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
      // this.$router.go(-1)
      this.$router.push({name: 'Welcome'})
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
  .tabbar-item-icon {
    margin-bottom: -5px;
    height: 23px;
  }
</style>
