<template>
    <div>
        <van-nav-bar
            title="曲谱详情"
            left-arrow
            :fixed="true"
            @click-left="backto()"
            @click-right="forwards()">
            <van-icon name="share" slot="right"></van-icon>
        </van-nav-bar>

        <div class="music-des-container">
            <div class="music-des">
                <p class="name"><span>{{musicDetail.name}}</span></p>
                <p class="author">
                    <span>作者：{{musicDetail.author}}</span>
                    <span class="music-type-tags"><van-tag>{{musicDetail.type}}</van-tag> <van-tag>{{musicDetail.tag}}</van-tag></span>
                </p>
            </div>

            <div>
                <img v-lazy="musicDetail.url" class="music-pic" @click="previewImg(musicDetail.url)"/>
            </div>

            <p class="music-content-label">曲谱介绍</p>
            <div v-html="musicDetail.content">
                {{musicDetail.content}}
            </div>

            <div>
                <p>浏览量：{{musicDetail.views}}</p>
                <p>点赞数：{{musicDetail.likes}}</p>
                <p>转发量：{{musicDetail.forwards}}</p>
                <p>发布日期：{{musicDetail.created_at | subtime}}</p>
            </div>
        </div>

    </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import { Panel, Lazyload, ImagePreview, NavBar, Icon, Tag } from 'vant'

export default {
  name: 'MusicDetail',
  components: {
    [Panel.name]: Panel,
    [Lazyload.name]: Lazyload,
    [ImagePreview.name]: ImagePreview,
    [NavBar.name]: NavBar,
    [Icon.name]: Icon,
    [Tag.name]: Tag
  },
  data () {
    return {
      musicDetail: {
        id: 1,
        name: '',
        type: '',
        tag: '',
        author: '',
        url: '',
        content: '',
        views: 0,
        created_at: 0
      }
    }
  },
  created () {
    this.setCurId(this.$route.query.id)
    this.musicDetail = this.curMusicDetail
  },
  computed: {
    ...mapGetters('music', [
      'curMusicDetail'
    ])
  },
  methods: {
    ...mapMutations('music', [
      'setCurId'
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
    .music-des-container {
        padding: 0 15px 20px 15px;
    }
    .music-des {
        margin-top: 60px;
    }
    .music-des p {
        line-height: 20px;
    }
    .name {
        text-align: center;
        font-size: 24px;
    }
    .music-type-tags {
        float: right;
    }
    .music-pic {
        width: 100%;
    }
    .music-content-label {
        border-bottom: #e5e5e5 1px solid;
        padding-bottom: 10px;
        margin-top: 30px;
    }
</style>
