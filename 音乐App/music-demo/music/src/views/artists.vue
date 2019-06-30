<template>
  <div class="page">
    <m-header>全部歌手</m-header>
    <!-- 这里首页的热门歌手没有被顶部固定的mHeader遮住，而全部歌手这里被遮住了，所以要额外设置样式margin-top -->
    <artist-list :data="artistsData" class="artists" @clickItem="goToArtistsInfo"></artist-list>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/javascript">
  import axios from 'axios';
  import mHeader from '../components/mHeader.vue';
  import ArtistList from '../components/artistList.vue';

  export default {
    name: 'artists',
    data() {
      return {
        artistsData: []
      };
    },
    created() {
      this.getArtists();
    },
    methods: {
      async getArtists() {
        // 不同首页的热门歌手只取10条，这里需要获取全部歌手的数据
        const { data } = await axios.get('/api/top/artists');
        if (data.code === 200) {
          this.artistsData = data.artists;
        }
      },
      goToArtistsInfo(item) {
        this.$router.push({
          name: 'ArtistsInfo',
          params: {
            id: item.id
          }
        });
      }
    },
    components: {
      mHeader,
      ArtistList
    }
  };
</script>

<style lang="less" scoped>
  .artists{
    margin: 90px 0 110px 0 ;
    background-color: white;
    padding: 0 20px;
  }
</style>
