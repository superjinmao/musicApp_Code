<template>
  <div class="page">
    <m-header>我的收藏</m-header>
    <!-- 同一个组件挂在不同的地方，可以直接在组件上给类，让该组件在不同的地方有不同的样式，灵活性提高 -->
    <count class="mt90">{{ loveList.length }}</count>
    <!-- 下面是歌曲的滚动列表,better-scroll配置成 scroll组件，在需要用到的地方直接使用即可，通过slot插槽实现元素注入 -->
    <!-- 从而实现一次配置，多次使用，方便使用 -->
    <!--  同样scroll挂在不同的地方也有不同的样式，所以直接将类添加在组件上,而不是将样式写在组件内部 -->
    <scroll class="user-list-container">
      <song-list :data="loveList" @clickItem="addToPlay"></song-list>
    </scroll>
  </div>
</template>

<script type="text/javascript">
  import { mapGetters } from 'vuex';
  import mHeader from '../components/mHeader.vue';
  import Count from '../components/count.vue';
  import Scroll from '../components/scroll.vue';
  import SongList from '../components/songList.vue';
  import PlayMixin from '../common/js/playMixin';

  export default {
    name: 'user-love-list',
    mixins: [PlayMixin],
    data() {
      return {

      };
    },
    methods: {
      addToPlay(item, index) {
        // 首先，点击播放歌曲，会展示全屏播放器，将fullScreen值设置为true
        this.SET_FULLSCREEN(true);
        // 然后将当前歌曲所属的歌单信息全部传递过去，注意是格式化后的数据
        this.SET_PLAY_LIST(this.loveList);
        // 存一份初始排序数据
        this.SET_SEQUENCE_LIST(this.loveList);
        this.SET_CURRENT_INDEX(index); // 传递当前这首歌曲所在歌单的id值
        // 这样当我们点击列表当中的某首歌曲时就会去修改vuex的值，改变后在player.vue中就可以去直接使用这些状态值了
      }
    },
    computed: {
      ...mapGetters([
        'loveList'
      ])
    },
    components: {
      mHeader,
      Count,
      Scroll,
      SongList
    }
  };
</script>

<style lang="less" scoped>
  .user-list-container{ // 滚动外层的高度也是需要去计算出来的
    // 在这个页面中，可视区的高度100vh减去mHeader组件的高度 + 共计多少首歌count的高度 = 170px
    height: calc(100vh - 280px);
    // 同时，为了防止内部滚动内容超出，添加overflow属性
    overflow: hidden;
  }
</style>
