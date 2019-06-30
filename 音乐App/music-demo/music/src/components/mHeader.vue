<template>
  <div class="header" :class="{ 'red': red}">
    <i class="iconfont icon-zuo" @click="goBack"></i>
    <!-- 这里slot又称为插槽，在外部组件内写的东西，就会渲染到这个标签中来 -->
    <slot></slot>
  </div>
</template>

<script type="text/javascript">
  export default {
    name: 'm-header',
    props: {
      red: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {

      };
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      }
    }
  };
</script>

<style lang="less" scoped>
  .header{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 90px;
    /* 让文字垂直居中 */
    line-height: 90px;
    font-size: 34px;
    color: #fefefe;
    text-align: center;
    z-index: 999;

    // 这个表示给当前这个类名为 .header 的元素添加一个 .red 的新类样式
    &.red{
      background-color: #f2353c;
    }

    /* 通常字体图标要额外设置样式才能生效 */
    i{
      position: absolute;
      left: 20px;
      font-size: 50px;
    }
  }
</style>
