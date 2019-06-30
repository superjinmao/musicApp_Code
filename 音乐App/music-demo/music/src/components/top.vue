<template>
  <div>
    <div class="top" :style="{'backgroundImage' : `url(${img}?param=400y400)`}">
      <m-header :red="false">
        {{ title }}
      </m-header>
      <!-- 图片这里同样也对大小进行压缩 -->
      <img :src="`${img}?param=400y400`" alt="">
    </div>
    <count>{{ count }}</count>
  </div>
</template>

<script type="text/javascript">
  import mHeader from './mHeader.vue';
  import Count from './count.vue';

  export default {
    name: 'top',
    data() {
      return {

      };
    },
    props: {
      // title 这里也是由父组件传递值
      title: {
        type: String,
        default: ''
      },
      // 图片也是
      img: {
        type: String,
        default: ''
      },
      count: {
        type: Number,
        default: 0
      },
      data: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    components: {
      mHeader,
      Count
    }
  };
</script>

<style lang="less" scoped>
  .top{
    position: relative;
    width: 100%;
    height: 300px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    /* 伪类超出的模糊部分隐藏，防止遮挡到下面的歌曲总计 */
    overflow: hidden;

    &:after{
      // 一般伪类或伪元素都设置内容为 ''
      content: '';
      width: calc(100% + 80px);
      height: calc(100% + 80px);
      position: absolute;
      // 先让伪类覆盖层往左上偏移40px , 然后再通过样式的计算属性calc, 计算出宽高会基于原来的100%再去加上80px
      top: -40px;
      left: -40px;
      background: inherit;
      filter: blur(20px);
    }

    img{
      width: 120px;
      height: 120px;
      border: 10PX solid #9e8d7f;
      border-radius: 50%;
      position: absolute;
      top: 60%;
      left: 50%;
      transform: translate3d(-50%,-50%,0);
      z-index: 1;
    }
  }

  .count{
    height: 80px;
    line-height: 80px;
    font-size: 26px;
    color: #808080;
    padding-left: 30px;
  }
</style>
