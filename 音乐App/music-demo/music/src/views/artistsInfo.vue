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
  import { mapMutations } from 'vuex';
  import infoMixin from '../common/js/infoMixin';
  import { formatSongDetail } from '../common/js/util';

  export default {
    name: 'artists-info',
    mixins: [infoMixin],
    created() {
      this.getInfo(this.$route.params.id);
    },
    methods: {
      // 通过辅助函数，将mutations的方法映射到这边，便可以通过调用方法的形式去调用，相当于 this.$store.commit('', val)
      ...mapMutations([
        'SET_PLAY_LIST',
        'SET_FULLSCREEN',
        'SET_SEQUENCE_LIST',
        'SET_CURRENT_INDEX',
        'SET_MODE'
      ]),
      async getInfo(id) {
        // 获取当前歌手相关的所有歌曲数据
        const { data } = await axios.get(`/api/artists?id=${id}`);
        // 格式化数据
        this.formatData = formatSongDetail(data.hotSongs);
      },
      addToPlay(item, index) {
        // 首先，点击播放歌曲，会展示全屏播放器，将fullScreen值设置为true
        this.SET_FULLSCREEN(true);
        // 然后将当前歌曲所属的歌单信息全部传递过去，注意是格式化后的数据
        this.SET_PLAY_LIST(this.formatData);
        // 存一份初始排序数据
        this.SET_SEQUENCE_LIST(this.formatData);
        this.SET_CURRENT_INDEX(index); // 传递当前这首歌曲所在歌单的id值
        // 这样当我们点击列表当中的某首歌曲时就会去修改vuex的值，改变后在player.vue中就可以去直接使用这些状态值了
      }
    }
  };
</script>

<style lang="less" scoped>
</style>
