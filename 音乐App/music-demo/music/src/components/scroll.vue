<template>
  <div ref="scrollWrapper">
    <slot></slot>
  </div>
</template>

<script type="text/javascript">
  import BScroll from 'better-scroll';

  export default {
    name: 'scroll',
    mounted() {
      // 在操作时可能会更改某些数据进而触发dom的渲染更新，操作可能多次，这时如果想在dom更新完成之后再去执行某些方法，就需要$nextTick
      this.$nextTick(() => { // 在下次DOM更新循环结束之后执行延迟回调
        // 这个initScroll方法必须等到所有dom更新渲染完成后才被调用，重新计算滚动
        this.initScroll();
      });
    },
    props: {
      data: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    watch: {
      data(val) {
        // 值变化之后，同样是要在确保dom更新之后才执行refresh方法，值变化说明切换了歌曲
        this.$nextTick(() => {
          this.refresh();
        });
      }
    },
    methods: {
      initScroll() {
        if (!this.$refs.scrollWrapper) return;
        this.scroll = new BScroll(this.$refs.scrollWrapper, {
          click: true
        });
      },
      refresh() {
        // this.scroll已经存在，初始化了，那么才去调用它的refresh方法
        this.scroll && this.scroll.refresh();
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
      }
    },
    components: {

    }
  };
</script>

<style lang="less" scoped>
</style>
