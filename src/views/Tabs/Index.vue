<template>
    <div>
        <div style="height:auto;">
            <van-swipe :autoplay="3000" height="142">
                <van-swipe-item v-for="(image, index) in images" :key="index" class="swipe-item-div">
                    <!--<img v-lazy="image.pic" :title="image.title" />-->
                    <img :src="image.pic" :title="image.title" @click="clickSwipe(image.url)" />
                </van-swipe-item>
            </van-swipe>
        </div>
        <div>
            <van-row>
                <van-col span="8" class="row-col-item">
                    <router-link :to="{ name: 'ActivityList' }">
                        <div>
                            <img :src="menuTable[0].pic"/>
                            <p>{{ menuTable[0].title }}</p>
                        </div>
                    </router-link>
                </van-col>
                <van-col span="8" class="row-col-item">
                    <div>
                        <img :src="menuTable[1].pic"/>
                        <p>{{ menuTable[1].title }}</p>
                    </div>
                </van-col>
                <van-col span="8" class="row-col-item">
                    <div>
                        <img :src="menuTable[2].pic"/>
                        <p>{{ menuTable[2].title }}</p>
                    </div>
                </van-col>
            </van-row>
            <van-row>
                <van-col span="8" class="row-col-item">
                    <div>
                        <img :src="menuTable[3].pic"/>
                        <p>{{ menuTable[3].title }}</p>
                    </div>
                </van-col>
                <van-col span="8" class="row-col-item">
                    <div>
                        <img :src="menuTable[4].pic"/>
                        <p>{{ menuTable[4].title }}</p>
                    </div>
                </van-col>
                <van-col span="8" class="row-col-item">
                    <div>
                        <img :src="menuTable[5].pic"/>
                        <p>{{ menuTable[5].title }}</p>
                    </div>
                </van-col>
            </van-row>
        </div>
        <div>
            <van-tabs v-model="active" :swipeable="swipeable" :line-width="tabWidth">
                <van-tab>
                    <div slot="title">
                        <van-icon name="hot"></van-icon> 最热曲谱
                    </div>
                    <div class="tab-content-div">
                        <p v-for="(music, index) in viewsDataDeal" :key="index" class="views-music-p" @click="gotoDetail(music.id, 'views')">
                            <span class="views-music-index">{{index + 1}}.</span>
                            <span class="views-music-name">{{music.name}}</span>
                            <span class="views-music-type">{{music.type}}-{{music.tag}}</span>
                            <span class="views-music-views"><img :src="hotIcon"/>{{music.views}}</span>
                        </p>
                    </div>
                </van-tab>
                <van-tab>
                    <div slot="title">
                        <van-icon name="new-arrival"></van-icon> 最新曲谱
                    </div>
                    <div class="tab-content-div">
                        <p v-for="(music, index) in created_atDataDeal" :key="index" class="views-music-p" @click="gotoDetail(music.id, 'created_at')">
                            <span class="views-music-index">{{index + 1}}.</span>
                            <span class="views-music-name">{{music.name}}</span>
                            <span class="views-music-type">{{music.type}}-{{music.tag}}</span>
                            <span class="views-music-views"><img :src="timeIcon"/> {{music.created_at}}</span>
                        </p>
                    </div>
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { Swipe, SwipeItem, List, Lazyload, Icon, Tag, Row, Col, Tab, Tabs, Toast } from 'vant'

export default {
  name: 'Index',
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Lazyload.name]: Lazyload,
    [Icon.name]: Icon,
    [Tag.name]: Tag,
    [List.name]: List,
    [Row.name]: Row,
    [Col.name]: Col,
    [Tabs.name]: Tabs,
    [Tab.name]: Tab,
    [Toast.name]: Toast
  },
  data () {
    return {
      images: [
        {
          id: 1,
          title: '最新活动1',
          pic: '../static/images/swiper/1.jpg',
          url: '/activity/list'
        },
        {
          id: 2,
          title: '最新活动2',
          pic: '../static/images/swiper/2.jpg',
          url: '/home/music'
        },
        {
          id: 3,
          title: '最新活动3',
          pic: '../static/images/swiper/3.jpg',
          url: '/music/detail?id=4'
        }
      ],
      menuTable: [
        {
          title: '活动',
          pic: '../static/images/icons/activity.png'
        },
        {
          title: '和弦',
          pic: '../static/images/icons/chords.png'
        },
        {
          title: '节奏',
          pic: '../static/images/icons/节奏.png'
        },
        {
          title: '乐理',
          pic: '../static/images/icons/乐理技巧.png'
        },
        {
          title: '基本功',
          pic: '../static/images/icons/基本功.png'
        },
        {
          title: '技巧',
          pic: '../static/images/icons/技巧秘籍.png'
        }
      ],
      hotIcon: '../static/images/icons/hot.png',
      timeIcon: '../static/images/icons/time.png',

      active: 0,
      swipeable: true,
      tabWidth: 120
    }
  },
  computed: {
    ...mapGetters('music', [
      'viewsDataDeal',
      'created_atDataDeal'
    ])
  },
  created () {
    this.fetchMusicByTabs('views')
    this.fetchMusicByTabs('created_at')
  },
  methods: {
    ...mapActions('music', [
      'getMusicList'
    ]),
    ...mapMutations('music', [
      'setFromWhere'
    ]),

    fetchMusicByTabs (order) {
      let payload = {
        tabs: true,
        order: order
      }
      this.getMusicList(payload).then((res) => {
        if (res === 'success') {
          // this.$toast('加载成功')
        } else {
          this.$toast('回去数据失败')
        }
      })
    },

    clickSwipe (url) {
      this.$router.push(url)
    },

    gotoDetail (id, where) {
      this.setFromWhere(where)
      this.$router.push({name: 'MusicDetail', query: {id: id}})
    }
  }
}
</script>

<style scoped>
    .swipe-item-div img {
        width: 100%;
    }
    .row-col-item {
        border: #e0e0e0 1px solid;
        text-align: center;
        height: 80px;
        position: relative;
    }
    .row-col-item div {
        height: 52px;
        margin: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .row-col-item img {
        height: 25px;
    }
    .row-col-item p {
        padding: 0;
        margin: 0;
        color: lightslategrey;
        font-size: 16px;
        padding-top: 2px;
    }
    .tab-content-div {
        padding: 10px 0 20px 20px;
    }
    .views-music-index {
        color: gray;
    }
    .views-music-name {
        font-size: 17px;
    }
    .views-music-type {
        background-color: #b0c8e8;
        padding: 2px 5px 2px 5px;
        border-radius: 6px;
        font-size: 9px;
        color: white;
    }
    .views-music-p img {
        height: 10px;
    }
    .views-music-views {
        font-size: 10px;
        color: red;
    }
</style>
