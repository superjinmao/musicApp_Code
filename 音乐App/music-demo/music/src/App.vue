<template>
  <div id="app">
    <router-view/>
    <player></player>
  </div>
</template>

<script type="text/javascript">
  import Player from './components/player.vue';

  export default {
    name: 'app',
    // 在vue组件中，components是复数来的 s
    components: {
      Player
    }
  };
</script>

<style lang="less">
</style>
