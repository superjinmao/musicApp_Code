<template>
  <div class="page">
    <top :title="title" :img="img" :count="formatData.length"></top>
    <Scroll :data="formatData" class="page-info-list">
      <!-- 为了同步监测列表的数据变化进而重新计算better-scroll，因为scroll组件内部watch了props,所以这里都传入newSongData -->
      <song-list :data="formatData" @clickItem="addToPlay"></song-list>
    </Scroll>
  </div>
</template>

<script type="text/javascript">
  import axios from 'axios';
  import { formatSongDetail } from '../common/js/util';
  import infoMixin from '../common/js/infoMixin';
  import PlayMixin from '../common/js/playMixin';

  export default {
    name: 'recommend',
    mixins: [infoMixin, PlayMixin],
    methods: {
      async getNewSongs() {
        // 通过解构赋值的形式拿到对应的data, axios异步请求数据成功调用成功的回调时传入的成功数据作为当前await的返回值
        const { data } = await axios.get('/api/personalized/newsong');
        // 模拟接口数据请求情况，成功才进行赋值操作
        if (data.code === 200) {
          // 引入定义好的数据格式方法，将请求的数据传入进行处理，最终返回符合格式的数据
          this.formatData = formatSongDetail(data.result);
          console.log(this.formatData);
        }
      }
    },
    created() {
      this.getNewSongs();
    }
  };
</script>

<style lang="less" scoped>
  // 通过这个样式去控制最外层滚动盒子父级的固定高度
  .page-info-list{
    // vh是当前移动端浏览器可视区的总高度,减去的380是头部组件top的总高，它并不在我们BS的滑动范围之内
    height: calc(100vh - 490px); // 这也是限制滚动距离
    // 超出滑动区域的部分隐藏，这样才不会盖住top组件部分
    overflow: hidden;
  }
</style>
