<template>
    <div class="hello">
        <p>南风音乐<span>公益俱乐部</span></p>
        <router-link :to="{ name: 'Index'}"><h2>开启音乐之旅</h2></router-link>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'Welcome',
  created () {
    // 清除localStorage中存放的应用数据
    window.cleanVuexAlong()
    this.changeActive(0)
    this.changeTabsTitle('主页')
  },
  activated () {
    // back 时会调用的钩子函数
    this.changeActive(0)
    this.changeTabsTitle('主页')
  },
  methods: {
    ...mapMutations('common', [
      'changeActive',
      'changeTabsTitle'
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .hello h2 {
        margin-top: 20px;
        text-align: center;
        color: #666666;
    }
    .hello p {
        margin-top: 200px;
        font-size: 42px;
        text-align: center;
        font-weight: bold;
    }
    .hello span {
        font-size: 20px;
        font-style: italic;
    }
    .hello a {
        text-decoration: none;
    }
</style>
