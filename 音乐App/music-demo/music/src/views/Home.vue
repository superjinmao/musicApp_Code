<template>
  <div>
    <div class="header">
      <div class="personal" @click="goToUserCenter">我的</div>
      <div>MIKO</div>
      <i class="iconfont icon-chaxun" @click="goToSearch"></i>
    </div>
    <div class="swiper-content home-item">
      <swiper :options="swiperOption">
        <swiper-slide v-for="(item, index) in newSongData" :key="index">
          <!-- 这样设置后，请求过来的图片数据就会小很多 -->
          <!-- 为了更好的效果，轮播图不设置懒加载和动态图，直接加载完成 -->
          <img :src="`${item.song.album.picUrl}?param=400y400`" alt="">
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
      <ul class="nav">
        <li @click="goToRecommend">
          <div class="icon-container">
            <i class="iconfont icon-date icon"></i>
          </div>
          <p>每日推荐</p>
        </li>
        <li @click="goToPlayList">
          <div class="icon-container">
            <i class="iconfont icon-music-list icon"></i>
          </div>
          <p>歌单</p>
        </li>
        <li @click="goToRank">
          <div class="icon-container">
            <i class="iconfont icon-rank icon"></i>
          </div>
          <p>排行榜</p>
        </li>
      </ul>
    </div>
    <!--  之前已经将home-item独立为公共样式， home-item即为样式里面公用的某一块-->
    <div class="home-item">
      <div class="title-wrapper">
        <div class="title">每日推荐</div>
        <div class="more" @click="goToPlayList">
          <i class="iconfont icon-more"></i>
        </div>
      </div>
      <div class="play-list-wrapper">
        <play-list :data="playListData" @clickItem="goToPlayListInfo"></play-list>
      </div>
    </div>
    <div class="home-item">
      <div class="title-wrapper">
        <div class="title">热门歌手</div>
        <div class="more" @click="goToArtists">
          <i class="iconfont icon-more"></i>
        </div>
      </div>
      <artist-list :data="artistsData" @clickItem="goToArtistsInfo"></artist-list>
    </div>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import axios from 'axios';
  import PlayList from '../components/playList.vue';
  import ArtistList from '../components/artistList.vue';

  export default {
    name: 'home',
    components: {
      ArtistList,
      PlayList
    },
    data() {
      return {
        swiperOption: {
          pagination: {
            el: '.swiper-pagination'
          }
        },
        newSongData: [],
        playListData: [],
        artistsData: []
      };
    },
    created() {
      this.getNewSongs();
      this.getPlayList();
      this.getArtists();
    },
    methods: {
      async getNewSongs() {
        // 通过解构赋值的形式拿到对应的data, axios异步请求数据成功调用成功的回调时传入的成功数据作为当前await的返回值
        const { data } = await axios.get('/api/personalized/newsong');
        // 模拟接口数据请求情况，成功才进行赋值操作
        if (data.code === 200) {
          this.newSongData = data.result;
          // console.log(data.result);
        }
      },
      async getPlayList() {
        // 在网易云API文档查询得知，推荐歌单的接口地址 /personalized
        const { data } = await axios.get('/api/personalized');
        if (data.code === 200) {
          // 因为返回的结果 data.result是所有歌单，这里我们推荐歌单只需要6个，所以可以截取前6个歌单数据
          this.playListData = data.result.slice(14, 20);
        }
      },
      async getArtists() {
        // 这里只取10条数据
        const { data } = await axios.get('/api/top/artists?limit=10');
        if (data.code === 200) {
          this.artistsData = data.artists;
          // console.log(data.artists);
        }
      },
      goToRecommend() {
        this.$router.push({
          name: 'recommend'
        });
      },
      goToPlayList() {
        this.$router.push({
          name: 'playListView'
        });
      },
      goToRank() {
        this.$router.push({
          name: 'rank'
        });
      },
      goToArtists() {
        this.$router.push({
          name: 'artists'
        });
      },
      goToPlayListInfo(item) {
        this.$router.push({
          name: 'playListInfo',
          params: {
            id: item.id
          }
        });
      },
      goToArtistsInfo(item) {
        this.$router.push({
          name: 'ArtistsInfo',
          params: {
            id: item.id
          }
        });
      },
      goToSearch() {
        this.$router.push({
          name: 'search'
        });
      },
      goToUserCenter() {
        this.$router.push({
          name: 'userCenter'
        });
      }
    },
    component: {
      PlayList,
      ArtistList
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
    background-color: #f2353c;
    padding: 0 20px;
    // 这个就是弹性布局，取代了之前通过定位和浮动来使得元素左右排列的布局
    display: flex;
    // 排成一行，默认row是从左往右
    flex-direction: row;
    // 垂直居中
    align-items: center;
    // 两端对齐
    justify-content: space-between;
    color: #ffffff;
    font-size: 36px;
    z-index: 9;

    .personal{
      color: #f9aeb0;
    }
    i{
      // 字体图标需要单独给字体大小，才能起作用
      font-size: 36px;
    }
  }

  .home-item{
    // 先给公共样式，高度由内部内容进行填充
    padding: 20px;
    margin-bottom: 20px;
    background-color: white;

    .title-wrapper{
      display: flex;
      // 排成一行，两端对齐
      flex-direction: row;
      justify-content: space-between;
      margin-bottom: 40px;


      .title{
        font-size: 34px;
        border-left: 6px solid #f2353c;
        padding-left: 20px;
        color: #4c4c4c;
        line-height: 38px;
      }

      .more{
        width: 50px;
        height: 38px;
        border: 1px solid #ccc;
        border-radius: 25px;
        color: #bfbfbf;
        text-align: center;
        line-height: 38px;
      }
    }
  }

  .swiper-content{
    margin-top: 90px;

    .swiper-container{
      width: 100%;
      height: 350px;
      border-radius: 10px;

      img{
        width: 100%;
        // 高度自适应即可
      }
    }
  }
  .nav{
    padding: 20px 30px 0 30px;
    display: flex;
    // flex布局，排成一行
    flex-direction: row;
    // 垂直居中
    align-items: center;
    // 内容两端对齐
    justify-content: space-between;

    li{
      text-align: center;
    }

    .icon-container{
      width: 120px;
      height: 120px;
      border-radius: 50%;
      margin-bottom: 20px;
      background-color: #f2353c;
      line-height: 120px;

      .icon{
        font-size: 70px;
        color: #ffffff;
      }
    }
  }

  .play-list-wrapper{
    min-height: 650px;
  }
</style>
