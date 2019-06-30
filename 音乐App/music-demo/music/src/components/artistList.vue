<template>
  <ul class="artists-list">
    <li v-for="(item, index) in data" :key="index" @click="handleClick(item)">
      <img v-lazy="`${item.picUrl}?param=400y400`" alt="">
      <div>
        <p class="name">{{ item.name }}</p>
        <p class="info">专辑{{ item.albumSize }}张，共{{ item.musicSize }}首歌</p>
      </div>
    </li>
  </ul>
</template>

<script type="text/javascript">
  export default {
    name: 'artist-list',
    props: {
      data: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    methods: {
      handleClick(val) {
        this.$emit('clickItem', val);
      }
    },
    components: {

    }
  };
</script>

<style lang="less" scoped>
  .artists-list{
    margin-bottom: 65px;

    li{
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 30px;
      // 这里border就是要1px,直接小写会转换成rem, 1PX这样就可以解决1像素边框的问题
      border-top: 1PX solid #e6e6e6;
      // 在外层存在padding的情况下
      margin-left: -20px;
      margin-right: -20px;

      img{
        width: 80px;
        height: 80px;
        margin-right: 20px;
      }

      .name{
        font-size: 30px;
        color: #000;
        margin-bottom: 20px;
      }
      .info{
        font-size: 24px;
        color: #b2b2b2;
        margin-bottom: 20px;
      }
    }
  }
</style>
