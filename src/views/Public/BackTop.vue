<template>
    <div class="fix-to-top" @click="toTop" v-show="isShow">Top</div>
</template>

<script>
export default {
  name: 'BackTop',
  data () {
    return {
      isShow: false
    }
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    toTop () {
      document.documentElement.scrollTop = document.body.scrollTop = 0
    },
    handleScroll: function () {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop <= 1000) {
        this.isShow = false
      } else {
        this.isShow = true
      }
    }
  }
}
</script>

<style scoped>
    .fix-to-top {
        width: 38px;
        height: 38px;
        position: fixed;
        bottom: 100px;
        right: 15px;
        z-index: 1000;
        background-color: #c9c9c9;
        border-radius: 19px;
        text-align: center;
        line-height: 40px;
        opacity: 0.5;
    }
</style>
