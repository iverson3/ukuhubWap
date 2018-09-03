<script src="../../store/modules/activity.js"></script>
<template>
    <div>
        <van-nav-bar
                title="报名"
                left-arrow
                :fixed="true"
                @click-left="backto()">
        </van-nav-bar>

        <div class="join-form">
            <div class="activity-tips">
                <p>请填写报名信息进行报名 (标"*"号的为必填项)
                <p>请填写正确的微信号，因为微信号将作为分组后组长联系到你的方式</p>
                <p>请放心，你的微信号不会被公开的显示在活动页面</p>
            </div>
            <van-cell-group>
                <van-field
                        v-model="name"
                        :required="required"
                        clearable
                        label="名字"
                        placeholder="请填写姓名或网名">
                </van-field>
                <van-field
                        v-model="wechat"
                        :required="required"
                        clearable
                        label="微信号"
                        @blur="wechatInputBlur"
                        placeholder="请填写自己的微信号">
                </van-field>
                <van-field
                        ref="musicTypeField"
                        v-model="music_type"
                        :required="required"
                        center
                        @focus="musicTypeFocus"
                        label="乐器类型"
                        placeholder="请选择乐器类型">
                </van-field>
                <van-field
                        ref="levelField"
                        v-model="level"
                        :required="required"
                        center
                        @focus="levelFocus"
                        label="能力分类"
                        placeholder="请选择能力分类">
                </van-field>

                <div v-show="showPic" class="pic-upload-container">
                    <div class="pic-upload-div">
                        <span class="pic1-label"><span style="color: red;">*</span>琴照上传</span>
                        <van-uploader
                                :after-read="onRead"
                                @oversize="onOversize"
                                accept="image/jpeg, image/png, image/jpg, image/gif, image/bmp"
                                :max-size="maxSize"
                                multiple>
                            <!--<van-icon name="photograph" size="30" color="gray"></van-icon>-->
                            <img :src="uploadIcon" class="activity-uploader-img" />
                        </van-uploader>
                        <span v-show="isUploading">图片上传中...</span>
                    </div>
                    <img class="member-pic" :src="pic1"/>
                </div>

                <van-field
                        v-model="pic2"
                        v-show="showUrl"
                        :required="required"
                        clearable
                        label="视频地址"
                        placeholder="请填写你的视频地址">
                </van-field>

                <van-field
                        v-model="remark"
                        clearable
                        label="备注信息"
                        placeholder="随便说点什么吧...">
                </van-field>
            </van-cell-group>
            <div class="activity-submit-div">
                <div class="activity-submit" @click="joinToActivity()">提交报名</div>
            </div>
        </div>

        <van-actionsheet v-model="conditionType" :actions="typeActions" cancel-text="取消"></van-actionsheet>
        <van-actionsheet v-model="conditionLevel" :actions="levelActions" cancel-text="取消"></van-actionsheet>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import { NavBar, Icon, Tag, Cell, CellGroup, Field, Actionsheet, Uploader, Toast } from 'vant'

export default {
  name: 'JoinActivity',
  components: {
    [NavBar.name]: NavBar,
    [Icon.name]: Icon,
    [Tag.name]: Tag,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [Actionsheet.name]: Actionsheet,
    [Uploader.name]: Uploader,
    [Toast.name]: Toast
  },
  data () {
    return {
      activity_id: 0,
      wechat: '',
      name: '',
      music_type: '',
      level: '',
      pic: '',
      pic1: '',
      pic2: '',
      remark: '',

      maxSize: 3000000, // 上传图片大小限制为近3M
      formData: null,
      isUploading: false,
      required: true,
      uploadIcon: '../static/images/icons/upload-img2.png',

      isNeedPicOrUrl: true,
      showPic: true,
      showUrl: false,

      musicTypeField: null,
      conditionType: false,
      typeActions: [
        {
          name: '尤克里里',
          callback: this.onTypeConfirm
        },
        {
          name: '吉他',
          callback: this.onTypeConfirm
        },
        {
          name: '鼓',
          callback: this.onTypeConfirm
        }
      ],

      levelField: null,
      conditionLevel: false,
      levelActions: [
        {
          name: '萌新',
          callback: this.onLevelConfirm
        },
        {
          name: '入门',
          callback: this.onLevelConfirm
        },
        {
          name: '大佬',
          callback: this.onLevelConfirm
        }
      ]
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.musicTypeField = this.$refs.musicTypeField
      this.levelField = this.$refs.levelField
      this.formData = new FormData()
    })
  },
  watch: {
    level (curVal, oldVal) {
      if (this.isNeedPicOrUrl) {
        if (curVal === '萌新') {
          this.showPic = true
          this.showUrl = false
        } else {
          this.showPic = false
          this.showUrl = true
        }
      }
    }
  },
  created () {
    this.activity_id = this.$route.query.id
  },
  methods: {
    ...mapActions('activity', [
      'joinActivity',
      'validateMemberByWechat'
    ]),

    onTypeConfirm (action) {
      this.music_type = action.name
      this.conditionType = false
    },
    musicTypeFocus () {
      this.conditionType = true
      this.musicTypeField.blur()
    },

    onLevelConfirm (action) {
      this.level = action.name
      this.conditionLevel = false
    },
    levelFocus () {
      this.conditionLevel = true
      this.levelField.blur()
    },

    onOversize (file) {
      this.$toast('图片过大，限制大小为3M')
    },
    onRead (file) {
      this.dealImageData(file, 'imgBlob')
      this.upload()
    },
    upload () {
      this.isUploading = true
      this.$http.post(
        '/api/activity/join/uploadPic',
        this.formData,
        {emulateJSON: true}
      )
        .then(res => res.json())
        .then(res => {
          this.isUploading = false
          if (res.success) {
            console.log('success')
            this.pic1 = res.url
          } else {
            this.$toast('上传失败，请重试')
          }
        })
        .catch(() => {
          this.isUploading = false
          this.$toast('上传失败，请重试')
        })
    },
    joinToActivity () {
      if (this.activity_id === 0) {
        this.$toast('出现未知错误,请返回活动页面重试')
        return
      }
      if (this.name === '') {
        this.$toast('请正确填写表单')
        return
      }
      if (this.wechat === '') {
        this.$toast('请正确填写表单')
        return
      }
      if (this.music_type === '') {
        this.$toast('请正确填写表单')
        return
      }
      if (this.level === '') {
        this.$toast('请正确填写表单')
        return
      }

      if (this.isNeedPicOrUrl) {
        if (this.level === '萌新') {
          if (this.pic1 === '') {
            this.$toast('萌新需要上传琴照哦')
            return
          }
          this.pic = this.pic1
        } else {
          if (this.pic2 === '') {
            this.$toast('入门和大佬需要填写视频地址哦')
            return
          }
          if (!this.isURL(this.pic2)) {
            this.$toast('请填写正确的视频地址哦')
            return
          }
          this.pic = this.pic2
        }

        if (this.pic === '') {
          this.$toast('请正确填写表单')
          return
        }
      }

      let data = {
        isOldMember: this.isNeedPicOrUrl ? 2 : 1,
        activity_id: parseInt(this.activity_id),
        wechat: this.wechat,
        name: this.name,
        music_type: this.music_type,
        level: this.level,
        pic: this.pic,
        remark: this.remark
      }
      // console.log(data)

      this.joinActivity(data).then((res) => {
        if (res === 'success') {
          this.$toast('报名成功')
          this.backto()
        } else if (res === 'repeat') {
          this.$toast('你已经报过名了')
        } else if (res === 'black') {
          this.$toast('抱歉，您已被加入黑名单，无法报名!')
        } else {
          this.$toast('报名失败，请重试')
        }
      })
    },
    wechatInputBlur () {
      this.validateMemberByWechat({wechat: this.wechat}).then((res) => {
        if (res === 'success') {
          this.isNeedPicOrUrl = false
          this.showPic = false
          this.showUrl = false
        } else {
          this.isNeedPicOrUrl = true
        }
      })
    },

    dealImageData (file, fieldName) {
      // 将dataURL转成Blob
      const ImageURL = file.content
      // Split the base64 string in data and contentType
      const block = ImageURL.split(';')
      // Get the content type of the image
      const contentType = block[0].split(':')[1] // In this case "image/jpeg"
      // get the real base64 content of the file
      const realData = block[1].split(',')[1] // In this case "R0lGODlhPQBEAPeoAJosM...."
      // Convert it to a blob to upload
      let imgBlob = this.b64toBlob(realData, contentType)
      // 利用formData 进行异步上传
      this.formData.append(fieldName, imgBlob)
    },
    b64toBlob (b64Data, contentType = '', sliceSize = 512) {
      const byteCharacters = atob(b64Data)
      const byteArrays = []

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize)

        const byteNumbers = new Array(slice.length)
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }

        const byteArray = new Uint8Array(byteNumbers)

        byteArrays.push(byteArray)
      }

      return new Blob(byteArrays, {type: contentType})
    },
    isURL (url) {
      const strRegex = '^((https|http|ftp|rtsp|mms)?://)' +
        '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' + // ftp的user@
        '(([0-9]{1,3}.){3}[0-9]{1,3}' + // IP形式的URL- 199.194.52.184
        '|' + // 允许IP和DOMAIN（域名）
        '([0-9a-z_!~*\'()-]+.)*' + // 域名- www.
        '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' + // 二级域名
        '[a-z]{2,6})' + // first level domain- .com or .museum
        '(:[0-9]{1,4})?' + // 端口- :80
        '((/?)|' + // a slash isn't required if there is no file name
        '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$'
      const re = new RegExp(strRegex)
      if (re.test(url)) {
        return true
      } else {
        return false
      }
    },

    backto () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
    .join-form {
        margin-top: 48px;
    }
    .activity-tips {
        color: gray;
        padding-top: 1px;
    }
    .activity-tips p {
        padding-left: 10px;
        color: red;
        font-size: 11px;
    }
    .member-pic {
        max-width: 80%;
        padding: 5px 15px 0 15px;
    }
    .pic-upload-container {
        border-bottom: 1px solid #e5e5e5;
    }
    .pic-upload-div {
        /*margin-top: 18px;*/
    }
    .activity-uploader-img {
        height: 31px;
        position: relative;
        top: 7px;
    }
    .pic1-label {
        display: inline-block;
        position: relative;
        top: -3px;
        font-size: 14px;
        color: #333;
        padding-left: 10px;
        padding-right: 30px;
    }
    .activity-submit-div {
        width: 100%;
        height: 35px;
        margin-top: 20px;
    }
    .activity-submit {
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
</style>
