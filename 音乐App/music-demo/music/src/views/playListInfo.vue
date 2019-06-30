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
    name: 'play-list-info',
    mixins: [infoMixin, PlayMixin],
    created() {
      this.getInfo(this.$route.params.id);
    },
    methods: {
      async getInfo(id) {
        const { data } = await axios.get(`/api/playList/detail?id=${id}`);
        this.formatData = formatSongDetail(data.playlist.tracks);
      }
    }
  };
</script>

<style lang="less" scoped>
</style>
