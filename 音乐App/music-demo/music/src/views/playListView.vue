<template>
  <div class="page">
    <div>
      <m-header>
        全部歌单
      </m-header>
      <!-- 外层再套一个盒子，因为全部歌单那里背景白色，而且上下30px内边距，左右20px内边距 -->
      <div class="play-list-wrapper">
        <play-list :data="playListData" @clickItem="goToPlayListInfo"></play-list>
      </div>
    </div>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/javascript">
  import axios from 'axios';
  import mHeader from '../components/mHeader.vue';
  import PlayList from '../components/playList.vue';

  export default {
    name: 'play-list-view',
    data() {
      return {
        playListData: []
      };
    },
    methods: {
      async getPlayList() {
        // 在网易云API文档查询得知，推荐歌单的接口地址 /personalized
        const { data } = await axios.get('/api/personalized');
        if (data.code === 200) {
          // 返回的结果 data.result是所有歌单，这里就是要的全部歌单，所以全盘收入
          this.playListData = data.result;
        }
      },
      goToPlayListInfo(item) {
        this.$router.push({
          name: 'playListInfo',
          params: {
            id: item.id
          }
        });
      }
    },
    created() {
      this.getPlayList();
    },
    components: {
      mHeader,
      PlayList
    }
  };
</script>

<style lang="less" scoped>
  .play-list-wrapper{
    // 因为顶部的固定定位
    margin-top: 90px;
    background-color: #fff;
    padding: 30px 20px;
  }
</style>
