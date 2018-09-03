<template>
    <div>
        <van-nav-bar
                title="活动中心"
                left-arrow
                :fixed="true"
                @click-left="backto()"
                @click-right="forwards()">
            <van-icon name="share" slot="right"></van-icon>
        </van-nav-bar>
        <div class="activity-list">
            <van-list
                    v-model="isLoading"
                    :finished="finished"
                    :offset="offset">
                <van-panel v-for="(item, index) in activitylist" class="music-item" :key="index">
                    <router-link :to="{ name: 'ActivityDetail', query: {id: item.id}}">
                        <van-card
                                class="activity-card">
                            <div slot="title">
                                <p class="activity-name">{{ item.name }}</p>
                            </div>
                            <div slot="thumb" class="activity-pic-div">
                                <img v-lazy="item.pic" class="music-pic" @click="previewImg(item.pic)"/>
                            </div>
                            <div slot="desc">
                                <p class="activity-author">发起者：{{ item.author }}</p>
                            </div>
                            <div slot="footer" class="activity-item-info">
                                <p class="activity-time">{{ item.start_time | subtime }}</p>
                                <van-tag><img :src="viewsIcon" /> {{item.views}}</van-tag>
                                <van-tag><img :src="forwardsIcon" /> {{item.forwards}}</van-tag>
                            </div>
                        </van-card>
                    </router-link>
                </van-panel>
            </van-list>
        </div>
    </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from 'vuex'
import { Lazyload, ImagePreview, NavBar, Icon, Tag, List, Panel, Card } from 'vant'

export default {
  name: 'ActivityList',
  components: {
    [Lazyload.name]: Lazyload,
    [ImagePreview.name]: ImagePreview,
    [NavBar.name]: NavBar,
    [Icon.name]: Icon,
    [Tag.name]: Tag,
    [List.name]: List,
    [Panel.name]: Panel,
    [Card.name]: Card
  },
  data () {
    return {
      finished: true,
      offset: 1000,

      viewsIcon: '../static/images/icons/views.png',
      forwardsIcon: '../static/images/icons/share-white.png'
    }
  },
  computed: mapState({
    activitylist: (state) => state.activity.activitylist,
    isLoading: (state) => state.activity.isLoading
  }),
  created () {
    this.initData()
    this.getActivityList()
  },
  methods: {
    ...mapActions('activity', [
      'initData',
      'getActivityList'
    ]),
    ...mapMutations('activity', [
      'clearMusicList'
    ]),

    backto () {
      this.$router.go(-1)
    },
    forwards () {
      // 分享
      this.$toast('功能开发中')
    },

    previewImg (url) {
      ImagePreview([url])
    }
  },
  filters: {
    subtime: function (value) {
      if (typeof value === 'undefined' || value === null || value === '') {
        return ''
      } else {
        return value.substr(0, 10)
      }
    }
  }
}
</script>

<style scoped>
    .activity-list {
        margin-top: 45px;
    }
    .activity-name {
        color: #232222;
        font-family: "微软雅黑";
        margin-top: 3px;
        margin-bottom: 0;
        height: 40px;
        line-height: 20px;
        word-break: break-all;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
    }
    .activity-item-info img {
        height: 9px;
    }
    .activity-author {
        font-size: 12px;
        color: gray;
    }
    .activity-pic-div {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    .activity-time {
        color: gray;
        font-size: 13px;
        margin-bottom: 2px;
        text-align: right;
    }
</style>
