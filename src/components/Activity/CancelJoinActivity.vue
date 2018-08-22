<template>
    <div>
        <van-nav-bar
            title="取消活动报名"
            left-arrow
            :fixed="true"
            @click-left="backto()">
        </van-nav-bar>

        <div class="cancel-container">
            <!--在 van-search 外层增加 form 标签，并且 action 不为空，即可在 IOS 弹出的输入法中显示搜索按钮-->
            <form action="/" class="search-container">
                <van-search
                    v-model="wechat"
                    placeholder="请输入您的微信号"
                    class="wechat-search"
                    show-action
                    @search="wechatSearch">
                    <div slot="action" @click="wechatSearch">查询</div>
                </van-search>
            </form>
            <div v-show="showInfo" class="member-info">
                <h3>{{ searchResult }}</h3>
                <p>微信号：{{ memberInfo.wechat }}</p>
                <p>名字：{{ memberInfo.name }}</p>
                <p>乐器类型：{{ memberInfo.music_type }}</p>
                <p>能力分类：{{ memberInfo.level }}</p>
                <p>备注信息：{{ memberInfo.remark }}</p>
                <p v-show="showRedTip" class="redTip">提示: 您的微信号已经被管理员禁用!</p>
            </div>
            <van-button v-show="showCancelButton" type="danger" size="small" @click="cancelClick" class="cancel-button">取消报名</van-button>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import { NavBar, Toast, Button, Dialog, Search } from 'vant'

export default {
  name: 'CancelJoinActivity',
  components: {
    [NavBar.name]: NavBar,
    [Toast.name]: Toast,
    [Button.name]: Button,
    [Dialog.name]: Dialog,
    [Search.name]: Search
  },
  data () {
    return {
      activity_id: 0,
      wechat: '',

      searchResult: '',
      memberInfo: {
        wechat: '',
        name: '',
        music_type: '',
        level: '',
        remark: ''
      },
      showInfo: false,
      showCancelButton: false,
      showRedTip: false
    }
  },
  created () {
    this.activity_id = this.$route.query.id
  },
  methods: {
    ...mapActions('activity', [
      'searchMember',
      'cancelActivity'
    ]),

    wechatSearch () {
      if (this.wechat === '') {
        this.$toast('请先填写微信号')
        return false
      }

      let paras = {
        activity_id: this.activity_id,
        wechat: this.wechat
      }
      this.searchMember(paras).then((res) => {
        if (res !== 'fail') {
          this.showInfo = true
          if (parseInt(res.status) === 1) {
            this.showCancelButton = true
            this.showRedTip = false
          } else {
            this.showCancelButton = false
            this.showRedTip = true
          }

          this.searchResult = '以下是查询到的报名信息：'
          this.memberInfo = res
        } else {
          this.showInfo = false
          this.showCancelButton = false
          this.searchResult = ''
          this.$toast('没有查到该微信号的报名信息')
        }
      })
    },
    cancelClick () {
      if (this.wechat === '') {
        this.$toast('请先填写微信号')
        return false
      }

      let me = this
      Dialog.confirm({
        title: '有琴提示',
        message: '确定要取消此次报名吗？'
      }).then(() => {
        let paras = {
          activity_id: this.activity_id,
          wechat: this.wechat
        }
        this.cancelActivity(paras).then((res) => {
          if (res === 'success') {
            me.$toast('取消成功')
            me.backto()
          } else {
            me.$toast('取消失败，请重试')
          }
        })
      }).catch(() => {
        // me.$toast('取消')
      })
    },
    backto () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
    .cancel-container {
        margin-top: 45px;
        padding: 0 15px 0 15px;
    }
    .search-container {
        padding-top: 8px;
    }
    .member-info {
        margin-bottom: 20px;
        color: gray;
    }
    .cancel-button {
        float: right;
        margin-top: 20px;
    }
    .redTip {
        color: red;
        font-size: 20px;
    }
</style>
