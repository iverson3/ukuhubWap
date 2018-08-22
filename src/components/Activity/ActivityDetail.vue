<template>
    <div>
        <van-nav-bar
            title="活动详情"
            left-arrow
            :fixed="true"
            @click-left="backto()"
            @click-right="forwards()">
            <van-icon name="share" slot="right"></van-icon>
        </van-nav-bar>
        <div class="activity-des">
            <div><img :src="activityDetail.pic"/></div>
            <div>
                <p class="activity-title">{{activityDetail.name}}</p>
            </div>
            <div>
                <van-cell-group>
                    <van-cell title="活动时间" :value="activityTime"></van-cell>
                    <van-cell title="活动地点" :value="activityDetail.address" :to="{ name: 'TabThree' }"></van-cell>
                    <van-cell title="主办方" :value="activityDetail.author" ></van-cell>
                </van-cell-group>
            </div>
            <div>
                <p class="activity-content-label">活动详情：</p>
                <div class="activity-content" v-html="activityDetail.content">{{activityDetail.content}}</div>
            </div>

            <div class="activity-member-list">
                <p class="member-count">
                    已报名({{memberSum}})
                    <router-link :to="{ name: 'CancelJoinActivity', query: {id: activityDetail.id}}">
                        <span v-show="canJoin" class="cancel-join">取消报名>></span>
                    </router-link>
                </p>
                <van-list
                    :finished="finished">
                    <van-cell
                            v-for="(member, index) in memberlist"
                            :key="index"
                            :title="member.name"
                            :value="member.music_type + ' - ' + member.level"
                            :label="'留言：' + member.remark">
                    </van-cell>
                </van-list>
            </div>

            <router-link :to="{ name: 'JoinActivity', query: {id: activityDetail.id}}">
            <div class="activity-join-div" v-show="canJoin">
                <div class="activity-join">
                    立即报名
                </div>
            </div>
            </router-link>
            <div class="activity-join-div" v-show="!canJoin">
                <div class="activity-join canot-join">
                    活动报名已截止
                </div>
            </div>
            <div class="activity-join-div" v-show="!canJoin && isOverTime">
                <div class="activity-join canot-join">
                    活动已结束
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapMutations, mapGetters, mapState, mapActions } from 'vuex'
import { Panel, Lazyload, ImagePreview, NavBar, Icon, Tag, Cell, CellGroup, List } from 'vant'

export default {
  name: 'ActivityDetail',
  components: {
    [Panel.name]: Panel,
    [Lazyload.name]: Lazyload,
    [ImagePreview.name]: ImagePreview,
    [NavBar.name]: NavBar,
    [Icon.name]: Icon,
    [Tag.name]: Tag,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [List.name]: List
  },
  data () {
    return {
      activityDetail: {
        id: 0,
        name: '',
        author: '',
        pic: '',
        content: '',
        views: 0,
        start_time: 0,
        end_time: 0
      },

      finished: true
    }
  },
  created () {
    console.log('created activityDetail')
    this.$navigation.on('forward', (to, from) => {
      console.log('activityDetail forward to other page')
    })
    this.$navigation.once('back', (to, from) => {
      console.log('back to activityDetail')
    })

    this.setCurId(this.$route.query.id)
    this.activityDetail = this.curActivityDetail
    this.getMemberList()
    this.initDetailData()
  },
  activated () {
    // back 时会调用的钩子函数
    console.log('activated')
  },
  computed: {
    ...mapGetters('activity', [
      'curActivityDetail',
      'memberSum'
    ]),
    ...mapState({
      memberlist: (state) => state.activity.memberlist
    }),

    activityTime: function () {
      return this.activityDetail.start_time.substr(5, 11) + ' - ' + this.activityDetail.end_time.substr(11, 5)
      // return this.$format(new Date(parseInt(this.activityDetail.start_time) * 1000), 'MM月DD日 HH:mm') + ' - ' + this.$format(new Date(parseInt(this.activityDetail.end_time) * 1000), 'HH:mm')
    },
    // 活动是否已结束
    isOverTime: function () {
      let end_time = this.activityDetail.end_time.replace(/-/g, '/')
      let end_timestamp = parseInt(new Date(end_time).getTime() / 1000)
      let now_timestamp = parseInt(new Date().getTime() / 1000)
      if (now_timestamp >= end_timestamp) {
        return true
      } else {
        return false
      }
    },
    // 距离活动开始是否只剩12小时 是否还可以报名
    canJoin: function () {
      let start_time = this.activityDetail.start_time.replace(/-/g, '/')
      let s_timestamp = parseInt(new Date(start_time).getTime() / 1000)
      let now_timestamp = parseInt(new Date().getTime() / 1000)
      if (s_timestamp > now_timestamp + 12 * 60 * 60) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    ...mapMutations('activity', [
      'setCurId'
    ]),
    ...mapActions('activity', [
      'getMemberList',
      'initDetailData'
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
  }
}
</script>

<style scoped>
    .activity-des {
        margin-top: 46px;
    }
    .activity-des img {
        max-width: 100%;
    }
    .activity-title {
        font-size: 25px;
        padding: 0 15px 0 15px;
    }
    .activity-content-label {
        color: gray;
        padding: 5px 0 5px 15px;
    }
    .activity-content {
        padding: 0 15px 20px 15px;
    }
    .activity-member-list {
        width: 100%;
        min-height: 20px;
        margin-bottom: 50px;
    }
    .member-count {
        font-size: 18px;
        color: #5390e4;
        background-color: #E0E0E0;
        padding: 10px 0 10px 15px;
    }
    .cancel-join {
        float: right;
        padding-right: 12px;
        font-size: 12px;
        color: gray;
        line-height: 23px;
    }
    .activity-join-div {
        position: fixed;
        bottom: 3px;
        left: 0;
        width: 100%;
        height: 35px;
    }
    .activity-join {
        width: 96%;
        height: 100%;
        margin: 0 auto;
        line-height: 35px;
        background-color: #5390e4;
        text-align: center;
        font-size: 20px;
        color: white;
        border-radius: 6px;
    }
    .canot-join {
        background-color: lightgrey;
        color: red;
    }
</style>
