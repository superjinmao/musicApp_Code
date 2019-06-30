<template>
  <div class="page">
    <div>
      <m-header>排行榜</m-header>
      <div class="rank-wrapper">
        <!-- 官方 -->
        <div>
          <!-- 标题 -->
          <p class="rank-title">官方榜</p>
          <ul class="office-list">
            <li class="list-item" v-for="(item, index) in officeList" :key="index" @click="goToRankInfo(item.id)">
              <img v-lazy="`${item.coverImgUrl}?param=400y400`" alt="">
              <div>
                <ul>
                  <li class="list-txt" v-for="(listItem, listIndex) in item.tracks" :key="listIndex">
                    {{ listIndex + 1}}.{{ listItem.first}} - {{listItem.second}}
                  </li>
                </ul>
                <i class="iconfont icon-zanting"></i>
              </div>
            </li>
          </ul>
        </div>
        <!--推荐-->
        <div>
          <!-- 标题 -->
          <p class="rank-title">推荐榜</p>
          <ul class="rank-list">
            <li v-for="(item, index) in recommendList" :key="index" @click="goToRankInfo(item.id)">
              <img v-lazy="`${item.coverImgUrl}?param=400y400`" alt="">
              <p>{{ item.name }}</p>
              <i class="iconfont icon-zanting"></i>
            </li>
          </ul>
        </div>
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

  export default {
    name: 'rank',
    data() {
      return {
        officeList: [],
        recommendList: []
      };
    },
    methods: {
      async getTopList() {
        const { data } = await axios.get('/api/toplist/detail');
        if (data.code === 200) {
          // 前面4条数据给到官方榜
          this.officeList = data.list.slice(0, 4);
          // 其余后面的数据给到，从第五条开始的数据给到推荐榜
          this.recommendList = data.list.slice(4, data.list.length);
        }
      },
      goToRankInfo(id) {
        this.$router.push({
          name: 'RankInfo',
          params: {
            id
          }
        });
      }
    },
    created() {
      this.getTopList();
    },
    components: {
      mHeader
    }
  };
</script>

<style lang="less" scoped>
  .rank-wrapper{
    margin-top: 90px;
  }

  .rank-title{
    padding: 30px 20px 10px 20px;
    font-size: 26px;
  }

  .office-list{
    background-color: white;

    .list-item{
      padding: 30px 20px;
      display: flex;
      flex-direction: row;
      // 垂直居中
      align-items: center;
      // 弹性盒子，设置在父级，作用于内部子元素
      border-bottom: 1PX solid #e6e6e6;
      position: relative;

      img{
        width: 200px;
        height: 200px;
        margin-right: 50px;
      }

      i{
        position: absolute;
        right: 20px;
        top: 25px;
        font-size: 50px;
        color: #808080;
      }
    }

    .list-txt{
      font-size: 22px;
      color: #808080;
      padding: 10px 0;
      line-height: 1.5;
    }
  }

  .rank-list{
    padding: 30px 20px;
    background-color: white;

    li{
      display: inline-block;
      width: 220px;
      margin-right: 25px;
      margin-bottom: 40px;
      color: #333;
      // 顶部对齐
      vertical-align: top;
      position: relative;
      line-height: 1.5;

      img{
        width: 100%;
        margin-bottom: 15px;
      }

      // 表示选择ul下面的所有子元素中为3的倍数的，注意css中不是从0开始，而是1
      &:nth-child(3n){
        margin-right: 0;
      }

      i{
        font-size: 40px;
        position: absolute;
        top: 150px;
        right: 20px;
        color: white;
      }
    }
  }
</style>
