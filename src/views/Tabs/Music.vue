<template>
    <div>
        <!--在 van-search 外层增加 form 标签，并且 action 不为空，即可在 IOS 弹出的输入法中显示搜索按钮-->
        <transition name="van-slide-bottom">
            <form action="/" class="search-container">
                <van-search
                    v-model="searchText"
                    placeholder="曲谱名"
                    v-show="isShowSearch"
                    class="name-search"
                    show-action
                    @search="nameSearch">
                    <div slot="action" @click="nameSearch">搜索</div>
                </van-search>
            </form>
        </transition>

        <div class="filter">
            <van-row gutter="20" class="filter-list-row">
                <van-col span="8" class="filter-item"><span @click="showTypeCondition">{{type}}<img :src="downIcon"/></span></van-col>
                <van-col span="8" class="filter-item"><span @click="showLevelCondition">{{level}}<img :src="downIcon"/></span></van-col>
                <van-col span="8" class="filter-item"><span @click="showSortCondition">{{sort}}<img :src="downIcon"/></span></van-col>
            </van-row>
            <van-actionsheet v-model="conditionType" :actions="typeActions" cancel-text="取消"></van-actionsheet>
            <van-actionsheet v-model="conditionLevel" :actions="levelActions" cancel-text="取消"></van-actionsheet>
            <van-actionsheet v-model="conditionSort" :actions="sortActions" cancel-text="取消"></van-actionsheet>
        </div>

        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <div>
                <van-list
                    v-model="isLoadingMore"
                    :finished="finished"
                    :offset="offset"
                    @load="loadmore">
                    <van-panel v-for="(item, index) in musiclist" class="music-item" :key="index">
                        <router-link :to="{ name: 'MusicDetail', query: {id: item.id}}">
                        <van-card
                            class="music-card">
                            <div slot="title">
                                <p class="music-name">{{ item.name }}</p>
                            </div>
                            <div slot="thumb" class="music-pic-div">
                                <img v-lazy="item.url" class="music-pic" @click="previewImg(item.url)"/>
                            </div>
                            <div slot="desc">
                                <p class="music-author">by {{ item.author }}</p>
                            </div>
                            <div slot="footer" class="music-item-info">
                                <p class="music-time">{{ item.created_at | subtime }}</p>
                                <van-tag><img :src="viewsIcon" /> {{item.views}}</van-tag>
                                <van-tag><img :src="likesIcon" /> {{item.likes}}</van-tag>
                                <van-tag><img :src="forwardsIcon" /> {{item.forwards}}</van-tag>
                            </div>
                        </van-card>
                        </router-link>
                    </van-panel>
                </van-list>
            </div>
        </van-pull-refresh>
        <div v-show="finished" class="no-more">没有更多了</div>
        <div v-show="!finished && isLoadingMore" class="no-more">加载中...</div>

        <BackTop></BackTop>
    </div>
</template>

<script>
import { Row, Col, NavBar, Cell, Actionsheet, Icon, Search, PullRefresh, List, Toast, Tag, Button, Panel, Lazyload, ImagePreview, Card } from 'vant'
import BackTop from '../Public/BackTop'
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  name: 'Music',
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [NavBar.name]: NavBar,
    [Cell.name]: Cell,
    [Icon.name]: Icon,
    [Search.name]: Search,
    [Actionsheet.name]: Actionsheet,
    [Toast.name]: Toast,
    [Tag.name]: Tag,
    [Button.name]: Button,
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
    [Panel.name]: Panel,
    [Lazyload.name]: Lazyload,
    [ImagePreview.name]: ImagePreview,
    [Card.name]: Card,
    BackTop
  },
  data () {
    return {
      conditionType: false,
      typeActions: [
        {
          name: '全部',
          callback: this.onTypeConfirm
        },
        {
          name: '单音',
          callback: this.onTypeConfirm
        },
        {
          name: '指弹',
          callback: this.onTypeConfirm
        },
        {
          name: '弹唱',
          callback: this.onTypeConfirm
        },
        {
          name: '合奏',
          callback: this.onTypeConfirm
        }
      ],

      conditionLevel: false,
      levelActions: [
        {
          name: '全部',
          callback: this.onLevelConfirm
        },
        {
          name: '萌新',
          callback: this.onLevelConfirm
        },
        {
          name: '入门',
          callback: this.onLevelConfirm
        },
        {
          name: '进阶',
          callback: this.onLevelConfirm
        },
        {
          name: '困难',
          callback: this.onLevelConfirm
        },
        {
          name: '大神',
          callback: this.onLevelConfirm
        }
      ],

      conditionSort: false,
      sortActions: [
        {
          name: '综合',
          callback: this.onSortConfirm
        },
        {
          name: '时间',
          callback: this.onSortConfirm
        },
        {
          name: '热度',
          subname: '浏览量',
          callback: this.onSortConfirm
        },
        {
          name: '曲名',
          subname: '曲谱名',
          callback: this.onSortConfirm
        }
      ],
      downIcon: '../static/images/icons/arrow-down.png',
      viewsIcon: '../static/images/icons/views.png',
      likesIcon: '../static/images/icons/like-white.png',
      forwardsIcon: '../static/images/icons/share-white.png',

      isMute: false,
      isClose: true,
      isTop: false,
      offset: 50,
      searchText: '',
      isShowSearch: true
    }
  },
  computed: mapState({
    name: state => state.music.name,
    type: state => state.music.type,
    level: state => state.music.level,
    sort: state => state.music.sort,
    musiclist: (state) => state.music.musiclist,
    isLoading: (state) => state.music.isLoading,
    isLoadingMore: (state) => state.music.isLoadingMore,
    finished: (state) => state.music.finished
  }),
  created () {
    this.initData()
    this.getData()
  },
  methods: {
    ...mapActions('music', [
      'initData',
      'getMusicList',
      'getMusicListByFilterChange'
    ]),
    ...mapMutations('music', [
      'changeName',
      'changeType',
      'changeLevel',
      'changeSort',
      'changePage',
      'changeisLoading',
      'changefinished',
      'clearMusicList',
      'changeisLoadingMore'
    ]),

    onRefresh () {
      this.clearMusicList()
      this.changePage(1)
      this.changeisLoadingMore(false)
      this.changeisLoading(true)
      this.changefinished(false)
      this.getData()
    },
    loadmore () {
      if (!this.isLoading) {
        this.changeisLoadingMore(true)
        this.getData()
      }
    },
    previewImg (url) {
      ImagePreview([url])
    },
    getData () {
      this.getMusicList().then((res) => {
        console.log(res)
        if (res === 'fail') {
          this.$toast('刷新失败,请重试')
        }
      })
    },

    showTypeCondition () {
      this.conditionType = true
    },
    onTypeConfirm (action) {
      this.changeType(action.name)
      this.getMusicListByFilterChange()
      this.conditionType = false
    },
    showLevelCondition () {
      this.conditionLevel = true
    },
    onLevelConfirm (action) {
      this.changeLevel(action.name)
      this.getMusicListByFilterChange()
      this.conditionLevel = false
    },
    showSortCondition () {
      this.conditionSort = true
    },
    onSortConfirm (action) {
      this.changeSort(action.name)
      this.getMusicListByFilterChange()
      this.conditionSort = false
    },

    nameSearch () {
      this.changeName(this.searchText)
      this.getMusicListByFilterChange()
    },
    onCancelSearch () {
      this.isShowSearch = false
    }
  },
  filters: {
    subtime: function (value) {
      return value.substr(0, 10)
    }
  }
}
</script>

<style scoped>
    .filter {
        border-bottom: #E0E0E0 1px solid;
        width: 100%;
        height: 33px;
        text-align: center;
    }
    .filter-list-row {
        margin-right: 0!important;
    }
    .filter-item {
        padding-top: 7px;
    }
    .filter-item img {
        height: 15px;
        padding-left: 4px;
        position: relative;
        top: 2px;
    }
    .music-pic-div {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    .music-card {
        margin-top: -18px;
    }
    .music-name {
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
    .music-pic {
        width: 100%;
        height: 100%;
    }
    .music-time {
        font-size: 13px;
        margin-bottom: 2px;
        text-align: right;
        color: gray;
    }
    .music-author {
        font-size: 13px;
        margin-top: 5px;
        color: gray;
    }
    .music-item-info img {
        height: 9px;
    }
    .name-search {
        touch-action: none;
    }
    .no-more {
        width: 100%;
        height: 30px;
        text-align: center;
        padding-top: 20px;
        color: gray;
    }
    .search-container {
        /*position: fixed;*/
        /*top: 0;*/
        width: 100%;
        height: auto;
        /*z-index: 2;*/
    }
</style>
