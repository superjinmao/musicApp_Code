<template>
  <div class="page">
    <div class="search-header">
      <i class="iconfont icon-chaxun" @click="searchSongs"></i>
      <!-- 光标置入输入框时，将搜索结果隐藏掉 -->
      <input type="text" v-model="keyword" @keyup.enter="searchSongs" @focus="toggleResultShow(false)">
      <!-- 输入框中有内容的时候才显示这个删除按钮，并且点击这个删除按钮可以删除输入框中的关键字 -->
      <i class="iconfont icon-shanchu2" v-show="keyword" @click="clearKeyWord"></i>
      <div class="cancel" @click="goBack">取消</div>
    </div>
    <!-- 搜索词的列表会用到scroll组件 -->
    <!-- 直接在scroll组件上添加类给样式，相当于直接给组件内部的div.ref = wrapper 添加样式 -->
    <scroll class="history-list list-container" v-show="!resultShow">
      <ul>
        <!-- 有值的时候显示搜索历史，没值的时候不显示 -->
        <li class="list-title" v-if="searchText.length > 0">搜索历史</li>
        <li class="list-item history-item" v-for="(item, index) in searchText" :key="index" @click="addToSearch(item)">
          <!-- 注意，这里点击删除要阻止冒泡，影响到父级的搜索 -->
          {{item}} <i class="iconfont icon-shanchu1" @click.stop="delKeyWord(item)"></i>
        </li>
        <li class="list-title">热门搜索</li>
        <!-- 上下两个循环的key值都是index,会冲突，所以这里稍微改造一下 -->
        <li class="list-item" v-for="(item, index) in hotWords" :key="`hot-${index}`" @click="addToSearch(item.first)">{{ item.first }}</li>
      </ul>
    </scroll>
    <!-- 搜索结果样式 -->
    <div v-show="resultShow">
      <p class="list-count">共有{{ resultData.length }}首歌曲</p>
      <!-- 搜索结果也是用一个scroll组件进行包裹 -->
      <scroll class="list-container result-list">
        <ul>
          <li  v-for="(item, index) in resultData" class="list-item" :key="index" @click="addToPlay(item, index)">
            <!-- 歌曲名称 -->
            <p>{{ item.name }}</p>
            <!-- 歌手信息 -->
            <p class="artists-name">
              <!-- 因为在格式化数据那边， detail.ar = [].concat(item.ar || item.artists || item.song.artists); -->
              <!-- 尽管数组中只有一条数据对象，也可以用来遍历 -->
              <span v-for="(item2, index2) in item.ar" :key="index2">
                  {{item2.name}}
              </span>
            </p>
          </li>
        </ul>
      </scroll>
    </div>
  </div>
</template>

<script type="text/javascript">
  import axios from 'axios';
  import { mapMutations, mapGetters } from 'vuex';
  import Scroll from '../components/scroll.vue';
  import { formatSongDetail } from '../common/js/util';
  import PlayMixin from '../common/js/playMixin';

  export default {
    name: 'Search',
    mixins: [PlayMixin],
    // 注意，mixin只是对本页面的补充，优先级并没有本页面的代码高，重复的东西以本页面的为主
    data() {
      return {
        // 搜索历史和搜索结果的展示是一个互斥关系，所以这里添加一个字段去控制，配合v-show
        resultShow: false, // 先默认显示结果
        hotWords: [],
        keyword: '', // 与输入框双向绑定的字段默认是空，所以只要我们输入了内容，双向绑定这个字段也就会有值
        resultData: []
      };
    },
    created() {
      this.searchHotWords();
    },
    methods: {
      goBack() {
        this.$router.back();
      },
      ...mapMutations([
        'SET_SEARCH_TEXT',
        'DEL_FROM_SEARCH_TEXT'
      ]),
      async searchHotWords() {
        const { data } = await axios.get('/api/search/hot');
        if (data.code === 200) {
          this.hotWords = data.result.hots;
        }
      },
      // 敲回车或者点击搜索框的左边搜索按钮都会根据我们当前的关键词 keyWord 去搜索
      async searchSongs() {
        // 同样先做一个判断，如果输入框中不存在这个搜索关键字，那么不回去执行搜索,直接return
        if (!this.keyword.trim()) return; // 记得清除空格，因为我们的搜索只关注关键字内容
        // 存在这个关键字，就拿这个关键字作为接口去请求数据
        const { data } = await axios.get(`/api/search?keywords=${this.keyword}`); // 直接拼装接口就可以拿到搜索的数据了
        if (data.code === 200) {
          // 这里也要将搜索结果的数据进行格式化
          this.resultData = formatSongDetail(data.result.songs);
        }
        // 这里已经完成搜索，所以要将当前关键字添加到搜索历史中去
        this.SET_SEARCH_TEXT(this.keyword);
        // 搜索完成，收起搜索列表，展示结果列表
        this.toggleResultShow(true);
      },
      toggleResultShow(val) {
        this.resultShow = val;
      },
      addToSearch(val) {
        // 点击搜索历史的某一项，直接执行搜索
        this.keyword = val; // 先修改关键词
        this.searchSongs();
      },
      delKeyWord(val) {
        this.DEL_FROM_SEARCH_TEXT(val);
      },
      clearKeyWord() {
        this.keyword = '';
      },
      addToPlay(item, index) {
        // 首先，点击播放歌曲，会展示全屏播放器，将fullScreen值设置为true
        this.SET_FULLSCREEN(true);
        // 然后将当前歌曲所属的歌单信息全部传递过去，注意是格式化后的数据
        this.SET_PLAY_LIST(this.resultData);
        // 存一份初始排序数据
        this.SET_SEQUENCE_LIST(this.resultData);
        this.SET_CURRENT_INDEX(index); // 传递当前这首歌曲所在歌单的id值
        // 这样当我们点击列表当中的某首歌曲时就会去修改vuex的值，改变后在player.vue中就可以去直接使用这些状态值了
      }
    },
    computed: {
      ...mapGetters([
        'searchText'
      ])
    },
    components: {
      Scroll
    }
  };
</script>

<style lang="less" scoped>
  .search-header{
    padding: 15px 30px;
    background-color: #f2353c;
    height: 60px;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;

    input{
      border-radius: 10px;
      height: 60px;
      font-size: 32px;
      color: #999;
      padding-left: 65px;
      /**
      最近在写vue的移动端项目，在展示订单信息的时候用到了better-scroll插件（以下简称BS），
      BS需要给父级wrapper一个高度，滚动视图content也需要一个高度，
      写固定高度肯定是不实际的，在不同系统不同设备上高度都是不同的，写固定高度的话就会出问题，于是乎flex: 1就派上了用场
      flex:1 具体就不解释了，只需要知道要使用flex:1，必须在弹性模块中，既display: flex
       */
      flex: 1;
      box-sizing: border-box;
      outline: none;
    }

    .icon-chaxun{
      position: absolute;
      left: 45px;
      top: 29px;
      font-size: 32px;
      color: #999;
    }

    .icon-shanchu2{
      font-size: 32px;
      color: #999;
      position: absolute;
      top: 29px;
      right: 130px;
    }

    .cancel{
      font-size: 28px;
      color: white;
      margin-left: 30px;
    }
  }

  .history-list{
    // 如果想要内部元素滚动，就得给它一个固定的高度，外部给固定高度
    // vh 浏览器可视化床头的高度，在移动端会根据不同的设备去适配
    height: calc(100vh - 200px);
  }
  .list-container{
    overflow: hidden;
    // 当滚动scroll内部元素大于可视区高度时，滚动会遮盖住其他元素，这时候给滚动的外层盒子设置溢出隐藏即可

    .list-title{
      padding: 0 30px;
      line-height: 65px;
      font-size: 24px;
      color: #989898;
    }

    .list-item{
      padding: 30px;
      font-size: 28px;
      color: #333;
      background-color: white;
      border-bottom: 1PX solid #e6e6e6;
    }

    .history-item{
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    .icon-shanchu1{
      font-size: 30px;
      color: #999;
    }

    .artists-name{
      font-size: 20px;
      color: #b2b2b2;
      margin-top: 10px;
    }
  }

  .list-count{
    /**
    关于字体的行高与line-height的设置
    如果字体大小为12px,要使得行间距为12px,则需要设置line-height为24px，自己体会
     */
    line-height: 80px;
    padding: 0 30px;
    font-size: 26px;
    color: #808080;
  }

  .result-list{
    height: calc(100vh - 280px);
  }
</style>
