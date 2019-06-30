<template>
  <div>
    <ul class="play-list">
      <!-- 为了提高子组件在外部挂载的灵活度，这里不是传递item.id，而是整个歌单的数据全部传递出去 -->
      <li v-for="(item, index) in data" :key="index" @click="handleClick(item)">
        <img v-lazy="`${item.picUrl}?param=400y400`" alt="">
        <p>{{ item.name }}</p>
        <i class="iconfont icon-zanting"></i>
      </li>
    </ul>
  </div>
</template>

<script type="text/javascript">
  export default {
    name: 'playList',
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
    }
  };
</script>

<style lang="less" scoped>
  .play-list{
    li{
      width: 220px;
      // 行内排列显示
      display: inline-block;
      margin-right: 25px;
      margin-bottom: 25px;
      font-size: 24px;
      color: #333;
      // 设置顶部对齐
      vertical-align: top;
      position: relative;

      &:nth-child(3n){
        margin-right: 0;
      }

      img{
        width: 220px;
        height: 220px;
        margin-bottom: 15px;
      }

      i{
        // 根据父级li去绝对定位, 播放按钮
        position: absolute;
        top: 170px;
        right: 10px;
        font-size: 40px;
        color: #ffffff;
      }
    }
  }
</style>
