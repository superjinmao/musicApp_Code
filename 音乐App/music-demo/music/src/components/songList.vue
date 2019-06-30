<template>
  <ul class="song-list">
    <!-- 点击触发自定义事件，将当前歌曲数据传递出去 -->
    <li v-for="(item, index) in data" :key="index" @click="handleClick(item, index)">
      <div>
        <img v-lazy="`${item.al.picUrl}?param=400y400`" alt="">
      </div>
      <div>
        <p>{{item.name}}</p>
        <p class="artists"><span v-for="(item2, index2) in item.ar" :key="index2">
          {{item2.name}}
        </span></p>
      </div>
    </li>
  </ul>
</template>

<script type="text/javascript">
  export default {
    name: 'song-list',
    props: {
      data: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    methods: {
      handleClick(item, index) {
        // 这里可以传递两个实参出去，这个index就是当前点击的这首歌曲在整个歌手所有歌曲列表中的排序位置
        this.$emit('clickItem', item, index);
      }
    },
    components: {

    }
  };
</script>

<style lang="less" scoped>
  .song-list{

    li{
      padding: 30px;
      // flex,弹性布局，使用后，其子元素的float,clear,vertical-align属性将失效
      display: flex;
      // 让其内部的子元素排成一行
      flex-direction: row;
      align-items: center;
      border-bottom: 1PX solid #e6e6e6;
      font-size: 30px;
      background-color: white;

      img{
        width: 80px;
        height: 80px;
        margin-right: 25px;
      }

      .artists{
        font-size: 20px;
        color: #b2b2b2;
        margin-top: 10px;
      }
    }
  }
</style>
