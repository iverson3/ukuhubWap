<template>
    <div>
        <router-link :to="{ name: 'ActivityList' }">
            <p class="activity-enter">活动报名入口</p>
        </router-link>
    </div>
</template>

<script>
export default {
  name: 'Index'
}
</script>

<style scoped>
    .activity-enter {
        text-align: center;
        margin-top: 200px;
        color: gray;
        font-size: 26px;
    }
</style>
