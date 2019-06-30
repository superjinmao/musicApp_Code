<template>
  <div class="page">
    <m-header :red="false">
      个人中心
    </m-header>
    <div class="user-bg">
      <img src="../assets/image/user-bg.png" alt="">
      <p>MIKO</p>
    </div>
    <!-- 下面开始展示收藏歌单和历史记录 -->
    <ul class="user-list">
      <li @click="goToPage('userPlayList')">
        <div class="icon-wrap">
          <i class="iconfont icon-music"></i> 播放列表
        </div>
        <i class="iconfont icon-you"></i>
      </li>
      <li class="split-item" @click="goToPage('userLoveList')">
        <div class="icon-wrap">
          <i class="iconfont icon-xiai"></i> 我的收藏
        </div>
        <i class="iconfont icon-you"></i>
      </li>
      <li @click="goToPage('userHistoryList')">
        <div class="icon-wrap">
          <i class="iconfont icon-guangdie"></i> 最近听过
        </div>
        <i class="iconfont icon-you"></i>
      </li>
    </ul>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/javascript">
  import mHeader from '../components/mHeader.vue';

  export default {
    name: 'user-center',
    data() {
      return {

      };
    },
    methods: {
      goToPage(path) {
        this.$router.push({
          name: path
        });
      }
    },
    components: {
      mHeader
    }
  };
</script>

<style lang="less" scoped>
  .user-bg{
    width: 100%;
    height: 400px;
    background-image: url("../assets/image/user-bg.png");
    background-repeat: no-repeat;
    background-size: cover;
    /**
    background-size：100% 100%;---按容器比例撑满，图片变形；
    background-size：cover;---把背景图片放大到适合元素容器的尺寸，图片比例不变，但是要注意，超出容器的部分可能会裁掉。
     */
    background-position: center center;
    // 里面的内容垂直水平居中
    display: flex;
    // row 是水平排列成一行，column 垂直排列成一列
    flex-direction: column;
    align-items: center;
    // 这里不是两端对齐
    justify-content: center;
    color: white;
    margin-bottom: 30px;

    img{
      width: 100px;
      height: 100px;
      border-radius: 50%;
      margin-bottom: 20px;
      margin-top: 60px;
    }
  }

  .user-list {

    li {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      height: 110px;
      padding: 0 30px;
      font-size: 30px;
      color: #333;
      background-color: white;
      border-bottom: 1PX solid #e6e6e6;
    }

    i {
      font-size: 40px;
      color: #ccc;
    }

    .icon-wrap {
      display: flex;
      align-items: center;
      // 在图标的外部加上一个div,添加flex和居中对齐，使得其内部的icon图标和字体垂直方向上对齐，这也是垂直对齐的一种方法

      i {
        margin-right: 20px;
      }
    }
    .split-item {
      margin-top: 20px;
    }
  }
</style>
