<template>
  <div class="count">
    共有<slot></slot>首歌曲
  </div>
</template>

<script type="text/javascript">
  export default {
    name: '',
    data() {
      return {

      };
    },
    components: {

    }
  };
</script>

<style lang="less" scoped>
  .count{
    height: 80px;
    line-height: 80px;
    font-size: 26px;
    color: #808080;
    padding-left: 30px;
  }
</style>
