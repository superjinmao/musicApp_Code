<template>
  <div>
    <!-- 迷你播放器 -->
    <div class="mini-player" v-show="!fullScreen">
      <!--左边部分-->
      <!-- 点击左边部分歌曲信息会展开全屏播放器 -->
      <div class="player-info" @click="toggleShow(true)">
        <!--左边滚动图片-->
        <div class="player-img">
          <img :src="songImg" alt="">
        </div>
        <!--左边歌曲歌手信息-->
        <div>
          <p class="player-name">{{ songName }}</p>
          <p class="player-artists">
            <span v-for="(item, index) in songArtists" :key="index">{{item.name}}</span>
          </p>
        </div>
      </div>
      <!--右边两个操作按钮-->
      <div class="player-operate">
        <i class="iconfont icon-op" @click="togglePlay" :class="playIcon"></i>
        <i class="iconfont icon-xiayiqu" @click="next"></i>
      </div>
      <!-- 进度条 -->
      <div class="mini-progress" :style="{ width: `${barPercent}`}"></div>
    </div>

    <!-- 全屏播放器 -->
    <transition name="player">
      <!-- 动态绑定上样式 -->
      <div v-show="fullScreen" class="player" :style="{'backgroundImage' : `url(${songImg})`}">
        <!-- 添加一层蒙版，使其色调更暗一点 -->
        <div class="player-mask"></div>
        <!--头部-->
        <div class="player-header">
          <i class="iconfont icon-xia" @click="toggleShow(false)"></i>
          <!-- 歌手，歌曲名称 -->
          <div class="header-info">
            <p>{{ songName }}</p>
            <p class="header-artists">
              <span v-for="(item, index) in songArtists" :key="index">{{item.name}}</span>
            </p>
          </div>
        </div>
        <!-- 内容区域 -->
        <swiper :options="swiperOption">
          <swiper-slide class="img-container">
            <img :src="songImg" alt="">
            <!-- 收藏这里的图标样式，就可以根据getters中的isLove字段来判断是否已经收藏 -->
            <i class="iconfont icon-xiai" :class="{'icon-xiai-red' : isLove}" @click="addToLove"></i>
          </swiper-slide>
          <!-- 滚动歌词 -->
          <swiper-slide class="lyric-container">
            <scroll ref="lyricScroll" class="lyric-scroll">
              <!-- 注意，这个scroll只有其第一个子项才会生效这个滚动效果 -->
              <!-- 展示的前提条件是有数据 -->
              <div>
                <ul v-if="lyricLines.length > 0">
                  <li ref="lyricLine" v-for="(item, index) in lyricLines" :key="index" class="list-item" :class="{'active': index === currentLineNumber}">
                    {{ item.txt }}
                  </li>
                </ul>
                <div v-else>
                  暂无歌词
                </div>
              </div>
            </scroll>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
        <!-- 底部播放进度条部分 -->
        <div class="player-operate">
          <!-- 暗色蒙版 -->
          <div class="operate-mask"></div>
          <!-- 上面部分是进度条 -->
          <div class="progress">
            <!-- 将纯毫秒数的时间传入这个方法中进行格式化处理 -->
            <span class="time">{{ formatTime(this.currentTime) }}</span>
            <!-- 中间的进度条 -->
            <div class="progress-bar" ref="progressBar" @click="progressClick">
              <div class="bar-moved" :style="{ width: `${barPercent}`}"></div>
              <div class="bar-btn" :style="{left: `${barPercent}`}" @touchmove.prevent="progressMove" @touchend="progressEnd"></div>
            </div>
            <span class="time">{{ formatTime(this.overTime) }}</span>
          </div>
          <!-- 下面部分是操作，上一首，下一首，播放模式，循环，列表，随机，单曲，暂停等等 -->
          <div class="operate-icon">
            <!-- 第一个播放模式，会根据用户的选择而动态切换，这是一个动态值 -->
            <i class="iconfont ft-40" @click="changeMode" :class="modeIcon"></i>
            <i class="iconfont icon-shangyiqu ft-80" @click="prev"></i>
            <i class="iconfont ft-100" @click="togglePlay" :class="playIcon"></i>
            <i class="iconfont icon-xiayiqu ft-80" @click="next"></i>
            <i class="iconfont icon-more ft-40" @click="togglePlaylistShow"></i>
          </div>
        </div>
      </div>
    </transition>
    <!-- 添加一个蒙版层,为了实现点击列表外关闭的效果 -->
    <div class="playlist-mask" v-if="playlistShow" @click="togglePlaylistShow"></div>
    <!-- 播放列表,不是原数据,可以进行筛选增删 -->
    <transition name="playlist">
      <!-- 在这里给scroll添加样式，其实变相就是在给scroll组件内部的div添加样式 -->
      <scroll class="playlist-scroll" v-if="playlistShow">
        <ul>
          <li v-for="(item, index) in playList" :key="index" @click="addToPlay(index)">
            <!-- item.ar只是一个数组中有且仅有的一条数据 -->
            <p>{{item.name}} - <span v-for="(arItem, arIndex) in item.ar" :key="arIndex" class="artists-name">{{arItem.name}}</span></p>
            <i class="iconfont icon-shanchu2" @click.stop="delFromPlayList(item)"></i>
            <!-- 为了不让事件冒泡机制使得删除和添加方法一起触发，所以这里通过VUE的便捷式组织冒泡 .stop -->
            <!-- 这边点击删除，直接传递当前歌曲的整条数据对象信息，这样在mutations那边可以通过item.id拿到歌曲的id值而不是当前列表的排序值 -->
          </li>
        </ul>
        <div class="close" @click="togglePlaylistShow">关闭</div>
      </scroll>
    </transition>
    <audio :src="musicData.url" ref="audio" @ended="end" @timeupdate="updateTime"></audio>
  </div>
</template>

<script type="text/javascript">
  import { mapGetters, mapMutations } from 'vuex';
  import axios from 'axios';
  import Scroll from './scroll.vue';
  import { playMode } from '../common/js/aliasConfig';

  export default {
    name: '',
    data() {
      return {
        // fullScreen是全屏的意思
        swiperOption: {
          pagination: {
            el: '.swiper-pagination'
          }
        },
        musicData: {},
        lyricsData: null,
        playing: false,
        currentTime: 0,
        overTime: 0,
        touchBarWillMove: false,
        lyricLines: [],
        currentLineNumber: 0,
        playlistShow: false
      };
    },
    computed: {
      ...mapGetters([
        'fullScreen',
        'playList',
        'sequenceList',
        'currentIndex',
        'currentSong',
        'mode',
        'isLove'
      ]),
      songName() {
        // 确保歌单数据获取到再去拿它的name , 不然会报错
        return this.currentSong ? this.currentSong.name : '暂无播放歌曲';
      },
      songArtists() {
        // 同样是确保歌单有数据
        return this.currentSong ? this.currentSong.ar : [];
      },
      songImg() {
        // 如果所拿歌曲并没有背景图，则请求给本地默认的背景图
        return this.currentSong && this.currentSong.al.picUrl ? `${this.currentSong.al.picUrl}?params=400y400` : require('../assets/image/user-bg.png');
      },
      playIcon() {
        return this.playing ? 'icon-bofang' : 'icon-zanting';
      },
      modeIcon() {
        // 这里的三元运算符涉及到了多个条件判断
        return this.mode === playMode.sequence ? 'icon-liebiaoxunhuan' : (this.mode === playMode.loop ? 'icon-danquxunhuan' : 'icon-suiji');
      },
      // 当前歌曲播放百分比
      barPercent() {
        let p = this.currentTime / this.overTime;
        if (p === 0) {
          return 0;
        }
        p = Number(p * 100).toFixed();
        return `${p}%`;
      }
    },
    watch: {
      currentSong(newVal, oldVal) {
        // 第一次进入APP, watch到currentSong的值是undefined
        if (oldVal === undefined || newVal.id !== oldVal.id) { // 旧值不等于新值，说明点击了新歌曲，才执行下面的歌曲请求
          // 点击新歌曲时，将对应新的id值传递进去, 歌曲地址和歌词都是在这个时候去请求
          this.getMusicUrl(newVal.id);
          this.getLyricsData(newVal.id);
        }
      }
    },
    methods: {
      ...mapMutations([
        'SET_FULLSCREEN',
        'SET_PLAY_LIST',
        'SET_SEQUENCE_LIST',
        'SET_CURRENT_INDEX',
        'SET_MODE',
        'DEL_FROM_PLAY_LIST',
        'SET_HISTORY_LIST',
        'SET_LOVE_LIST',
        'DEL_FROM_LOVE_LIST'
      ]),
      toggleShow(val) {
        this.SET_FULLSCREEN(val);
      },
      async getMusicUrl(id) {
        const { data } = await axios(`/api/song/url?id=${id}`);
        if (data.code === 200 && data.data[0].code === 200) {
          this.musicData = data.data[0];
          // 监测到当前歌曲变化，也就是切换歌曲的时候，在dom更新完成之后去打开播放开关，硬性传入true开始播放
          this.$nextTick(() => {
            // 一旦获取到新的歌曲地址就去进行自动播放，并且注意要在dom重新更新渲染之后
            this.togglePlay(true); // 这里传入true即表示当即播放
            // 在该歌曲播放的时候将其添加到历史纪录中
            this.SET_HISTORY_LIST(this.currentSong); // 将当前播放的歌曲的整条数据对象传递过去
          });
        }
      },
      async getLyricsData(id) {
        const { data } = await axios(`/api/lyric?id=${id}`);
        if (data.code === 200 && data.lrc) {
          this.lyricsData = data.lrc.lyric;
          this.initLines();
          // 初始化（格式化）歌词
        } else {
          this.lyricsData = null;
        }
        // 这个方法已经拿到了歌词数据，就在这里进行歌词格式化处理
      },
      togglePlay(val) {
        // 首先要播放，必须保证currentSong有值， 没有值的情况下是不进行任何操作的
        if (!this.currentSong) return;
        if (val === true || val === false) { // 传入一个val,确保这个val值为一个准确值的情况才去切换
          this.playing = val; // 这一块代码的设置也是为了服务切换歌曲自动播放的功能，不然单纯的取反操作满足不了
        } else {
          this.playing = !this.playing;
        }
        const audio = this.$refs.audio;
        // 如果当前状态值的播放的话，即位true
        if (this.playing) {
          audio.play();
        } else {
          audio.pause();
        }
      },
      prev() {
        // 首先要拿到当前的播放列表
        const len = this.playList.length;
        let newIndex = this.currentIndex - 1;
        // 如果已经是第一首，还往前就切换到最后一首
        if (newIndex < 0) {
          // len是歌单总长度，最后一首便是 len - 1
          newIndex = len - 1;
        }
        // 调用这个mutations 去更新当前播放的歌曲, 这个currentIndex会改变，进而改变 currentSong,从而达到切换歌曲的目的
        this.SET_CURRENT_INDEX(newIndex);
      },
      next() {
        const len = this.playList.length;
        let newIndex = this.currentIndex + 1;
        if (newIndex === len) {
          newIndex = 0;
        }
        // 同样，修改之后同步到state去修改当前歌曲的标示值，进而改变 currentSong
        this.SET_CURRENT_INDEX(newIndex);
      },
      // 修改播放模式
      changeMode() {
        const modeNumber = (this.mode + 1) % 3; // +1 是因为切换模式就是这个mode值 + 1 , 才是切换到下一个模式
        // 拿到playMode, 接下来将Mode值更新
        this.SET_MODE(modeNumber);
        // 然后再根据我们的Mode值去进行我们当前播放列表的值的更新，看是顺序播放，还是打乱的随机播放，还是单曲
        let newPlayList = [];
        if (this.mode === playMode.random) { // 当切换到随机播放模式的时候
          // 将当前的列表打乱
          newPlayList = this.getRandomList(this.sequenceList); // 这里的this.sequenceList是我们之前预留的备份列表
        } else {
          newPlayList = this.sequenceList; // 如果不是随机播放，就把备份的原有数据列表赋值过去
        }
        // 因为我们可能在当前就已经有播放的歌曲，列表更新完成之后，我们当前播放的歌曲在新列表中index值就发生了变化，所以为了
        // 保证当前播放器还是再播放当前歌曲，我们就得去找到新的Index值
        const newIndex = newPlayList.findIndex(item => item.id === this.currentSong.id);
        // 将当前模式的新列表进行遍历，查找出与当前播放歌曲相同的id值并返回,这样就获取到了当前歌曲在新列表中的值
        // 然后再去改变当前播放列表的值以及当前歌曲的index值
        this.SET_PLAY_LIST(newPlayList); // 设置当前播放列表
        this.SET_CURRENT_INDEX(newIndex); // 设置当前歌曲所在列表的位置
      },
      getRandomList(arr) {
        const newArr = [].concat(arr);
        return newArr.sort((a, b) => (Math.random() > 0.5 ? -1 : 1));
      },
      end() { // 歌曲播放完后的回掉调函数
        if (this.mode === playMode.loop) { // 歌曲播放结束后，如果是单曲循环的模式
          this.loop();
        } else {
          this.next(); // 切换下一首播放
        }
      },
      loop() {
        const audio = this.$refs.audio;
        audio.currenTime = 0;
        audio.play();
        // 这样就完成了一个单曲循环操作
      },
      updateTime(e) {
        if (!this.touchBarWillMove) {
          // 如果这个值是false，就可以去更新这个值，当这个值是true时，就无法去执行更新这个方法
          this.currentTime = e.target.currentTime;
          this.overTime = e.target.duration;
          // console.log(this.currentTime);
        }
        // 歌曲正在播放的时候回去调用这个歌词滚动方法
        if (this.lyricsData) { // 存在歌词再去滚动
          this.moveLyric();
        }
      },
      formatTime(val) {
        // 先判断是不是数字，若不是，则返回00：00
        if (isNaN(val)) return '00:00';
        // 如果是数字时间，再进行下面的格式化, 进行时分秒转化
        let m = Math.floor(val / 60); // 确保是整数，向下取整,舍去小数点，保留原数，所以这样只有过了60秒，才算入一分钟
        let s = Math.floor(val % 60);
        // 补齐00：00的格式,歌曲小于10分钟的情况，在前面补充一个0
        if (m < 10) {
          m = `0${m}`;
        }
        // 秒数小于10的情况，在前面补充一个0
        if (s < 10) {
          s = `0${s}`;
        }
        // 最终返回特定时间格式
        return `${m}:${s}`;
      },
      // 拖动过程触发
      progressMove(e) {
        this.touchBarWillMove = true;
        // 通过事件对象拿到当前鼠标/触控所在的位置, 通过控制台可以查看
        const pageX = e.touches[0].pageX;
        // 外部定义一个方法，传递当前的进度条值去重新计算百分比
        this.calcPercent(pageX);
      },
      // 计算开始，这个方法将根据鼠标在进度条上的距离去计算进度条跑了多少
      calcPercent(x) {
        // 通过获取到进度条的dom,进而获取到这个进度条距左边界的距离
        const offsetLeft = this.$refs.progressBar.offsetLeft;
        // 进而通过计算获取进度条的宽度
        const barWidth = this.$refs.progressBar.clientWidth;
        // 计算出移动的距离
        let moveWidth = x - offsetLeft;
        if (moveWidth > barWidth) moveWidth = barWidth; // 按钮的移动距离超过了进度条的总长，则限定为进度条的长度
        if (moveWidth < 0) moveWidth = 0;
        let p = moveWidth / barWidth;
        // 然后通过这个比例值去重置歌曲的播放时间
        this.currentTime = this.overTime * p; // 这样就获得了新的currentTime的值，就可以从重新设置播放器
        // 拖动进度条时，歌词也要滚动
        this.moveLyric();
      },
      resetPlayer() {
        this.$refs.audio.currentTime = this.currentTime;
        // 操作这播放器的dom,将时间设置为进度条更新后的时间，然后继续播放
        this.togglePlay(true);
        // 重新设置完进度条之后，再把这个touchBarWillMove设置为false,才能继续播放
        this.touchBarWillMove = false;
      },
      // 拖动到指定位置松开后触发
      progressEnd() {
        // 只有当我们松开后，才会去执行这个重置播放器的方法resetPlayer
        this.resetPlayer();
      },
      progressClick(e) {
        this.touchBarWillMove = true;// 点击修改当前进度，同时要将自动更新时间停止一下
        const pageX = e.pageX; // 点击事件，直接通过ev.pageX就可以拿到距离
        this.calcPercent(pageX);
        // 计算完成之后还得去执行播放器重置的方法,将播放时间重置并开启继续播放
        this.resetPlayer();
      },
      initLines() {
        // 这里会将歌词数据格式化之后存到一个字段里面去
        this.lyricLines = [];
        if (this.lyricsData) { // 歌词数据不为空时才去进行处理
          const Lines = this.lyricsData.split('\n'); // 通过反斜杠n分割开来成一个数组
          // 然后下面再去遍历这个分割好的数组
          for (let i = 0; i < Lines.length; i += 1) {
            const line = Lines[i];
            // 拿到每一行歌词数据后，先进行匹配时间，匹配分和秒,此处通过正则来处理
            const timeExp = /\[(\d{2}):(\d{2}\.\d{2,3})\]/g;
            const result = timeExp.exec(line); // exec 查找并返回当前的匹配结果，并以数组的形式返回。
            console.log(result);
            if (result) { // 确保歌词格式化结果存在
              const time = Number(result[1] * 60 * 1000) + Number(result[2] * 1000); // 前面的数result[1]多乘以60是因为分转化成s要乘以60
              // 接下去匹配文本内容，同样利用刚才的正则，匹配到正则相关的时间格式全部去除，单纯留下歌词
              const txt = line.replace(timeExp, '').trim(); // 匹配上用空去代替，为了去除，顺便去除空格
              // 格式化后的时间和歌词都准备好了，然后一起向定义个歌词字段push进去
              this.lyricLines.push({ // push一个对象进去
                time,
                txt
              });
            }
          }
        }
      },
      moveLyric() {
        // 传入当前播放的时间去定位歌词的值，注意 * 1000 转换成毫秒, 因为currentTime记录的是秒，而歌词那里的数据所携带的时间是毫秒，统一单位才行
        this.currentLineNumber = this.findCurrentNumber(this.currentTime * 1000);
        if (this.currentLineNumber > 6) { // 播放到第7句歌词才开始滚动
          this.$refs.lyricScroll.scrollToElement(this.$refs.lyricLine[this.currentLineNumber - 6], 1000);
          // 第七句歌词时（出山：一瞬三年五载，品粗茶，食淡饭），7 - 6 = 1  滚动到第二句歌词的位置（作词：花粥），即该句歌词置顶
          // 调用组件那边封装的滚动函数，第一个参数是滚动的位置，第二个参数是过渡时间
        } else {
          this.$refs.lyricScroll(0, 0, 1000);
        }
      },
      findCurrentNumber(time) {
        // 该函数传入播放时间，用于计算返回当前播放的歌词位置标识符，比如第一句歌词返回1，第二句返回2
        for (let i = 0; i < this.lyricLines.length; i += 1) {
          if (time < this.lyricLines[i].time) { // 当前歌词的播放时间肯定小于下一句歌词的播放时间，所以满足条件，返回i - 1 ,这样才能准确定位到当前歌词
            console.log(this.lyricLines);
            // 注意，在这个for循环中，满足条件return,所以只走一次，只返回一个数值
            return i - 1;
          }
        }
        return this.lyricLines.length - 1;
      },
      togglePlaylistShow() {
        this.playlistShow = !this.playlistShow;
      },
      addToPlay(index) {
        // 这里在播放列表中去点播歌曲，只需要传递并更新一下currentIndex的值即可
        this.SET_CURRENT_INDEX(index);
        // 在播放列表切换歌曲时，需要先将列表收起
        this.togglePlaylistShow();
      },
      delFromPlayList(item) {
        // 也要顺便同步更新currentIndex的值，这样才不会出现因删除当前播放歌曲的前面歌曲而导致的播放顺序紊乱
        this.DEL_FROM_PLAY_LIST({
          'delSong': item, // 当前删除歌曲的整条数据对象
          'curSong': this.currentSong // 当前播放歌曲的整条数据对象
        });
      },
      addToLove() {
        if (this.isLove) { // 如果已经收藏过该歌曲,那么再次点击图标就是取消收藏
          this.DEL_FROM_LOVE_LIST(this.currentSong); // 将当前播放歌曲删除，传递当前播放歌曲数据即可，mutations那边才可val.id顺利拿到id值去比较
        } else { // 反之，没有收藏过，则将当前歌曲添加到收藏列表中
          this.SET_LOVE_LIST(this.currentSong);
        }
      }
    },
    components: {
      Scroll
    }
  };
</script>

<style lang="less" scoped>
  .mini-player{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #150a06;
    display: flex;
    flex-direction: row;
    /* 垂直居中 */
    align-items: center;
    // 歌曲信息和播放器操作（暂停和下一首）是左右分开，两端对齐的
    justify-content: space-between;
    color: white;
    padding: 10px 30px 10px 20px;
    z-index: 9999;

    .player-info{
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .player-img{
      width: 80px;
      height: 80px;
      // 不让其他元素给撑开，保持自己原有的宽度和高度
      flex-shrink: 0;
      margin-right: 20px;
      border-radius: 50%;
      // 里面的图片超出部分隐藏
      overflow: hidden;
      border: 4PX solid #695945;

      img{
        width: 100%;
        // 高度自适应
      }
    }
    .player-name{
      font-size: 26px;
      margin-bottom: 10px;
      line-height: 30px;
    }

    .player-artists{
      font-size: 20px;
      color: #b2b2b2;
    }

    .player-operate{

      i{
        font-size: 65px;
        color: #c9c3c1;
      }

      .icon-op{
        margin-right: 50px;
      }
    }

    .mini-progress{
      height: 6px;
      background-color: #f2353c;
      position: absolute;
      left: 0;
      bottom: 0;
    }
  }

  .player{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 9999;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    overflow: hidden;
    color: white;

    &:after{
      content: '';
      /* 伪类直接继承父类的bg样式即可 */
      background: inherit;
      filter: blur(20px);
      position: absolute;
      top: -40px;
      left: -40px;
      width: calc(100% + 80px);
      height: calc(100% + 80px);
      z-index: -2;
    }

    .player-mask{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: black;
      opacity: .5;
      z-index: -1;
    }

    .player-header{
      height: 60px;
      padding: 30px;

      i{
        font-size: 46px;
        position: absolute;
        top: 30px;
        left: 30px;
        /* 通过绝对定位让i 脱离标准流，负责歌曲歌手信息的div才能上去 */
      }

      .header-info{
        width: 70%;
        margin: 0 auto;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        /* 这两个属性经常结合一起使用，超出的部分隐藏，并且结尾部分使用 ... 代替 */
        font-size: 30px;
      }

      .header-artists{
        font-size: 18px;
        color: #b2b2b2;
        margin-top: 12px;
      }
    }

    .swiper-container{
      width: 100%;
      height: calc(100% - 360px);
    }

    .img-container{
      /* 通过给父盒子设置弹性布局居中设置，让内部的元素，图片居中 */
      display: flex;
      align-items: center;
      justify-content: center;
      // 通过flex快速让图片居中
      position: relative;

      img{
        width: 500px;
        height: 500px;
        border-radius: 50%;
        border: 20px solid #2b433c;
      }

      i{
        position: absolute;
        left: 30px;
        bottom: 30px;
        font-size: 50px;
        color: #c4b9bb;
      }
    }

    .player-operate{
      width: 100%;
      height: 300px;
      position: relative;

      .operate-mask{
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        background-color: rgba(0,0,0,0.1);
        /* 层级后移，否则文字会被盖住 */
        z-index: -1;
      }
    }

    .progress{
      display: flex;
      flex-direction: row;
      align-items: center;
      // 内容左右居中
      justify-content: center;
      height: 50px;
      padding: 30px;

      .time{
        width: 60px;
      }

      .progress-bar{
        width: 560px;
        height: 4px;
        background-color: #7e7374;
        position: relative;
        margin: 0 30px;
      }

      .bar-moved{
        position: absolute;
        left: 0;
        top: 0;
        height: 4px;
        background-color: #f2353c;
      }

      .bar-btn{
        position: absolute;
        top: 0;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: white;
        border: 5PX solid #5d5759;
        transform: translate3d(-50%,-50%, 0);
      }
    }

    .operate-icon{
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 0 30px;
      color: #c4b9bb;

      .ft-40{
        font-size: 40px;
      }
      .ft-80{
        font-size: 80px;
      }
      .ft-100{
        font-size: 100px;
      }
    }
  }

  .player-enter-active,.player-leave-active{
    // active表示的是当前出现的状态
    transition: all .3s;
    opacity: 1;

    // 这个变化样式放在enter-active和leave-active里面，说明也是伴随着vue的过渡效果来的
    // 并且因为是包裹在.player-enter-active,.player-leave-active内部，所以也具备透明度的变化
    .player-header,.player-operate{
      // 进入之后和离开之前的全屏展示状态，位移的偏移量都为0，及位于原本的位置上
      transform: translate3d(0,0,0);
      // 贝塞尔曲线
      transition: all .3s cubic-bezier(0.86, 0.18, 0.82, 1.32);
    }
  }

  .player-enter,.player-leave-to{
    // 进入之前，离开之后，透明度都是0
    opacity: 0;

    .player-header{
      // 进入之前，头部的位置位于原位置的 y轴 -100， 进入之后复原，也就有了从上往下的效果，离开之后又复原到-100px,也就有了从下往上收回的效果
      transform: translate3d(0,-100px,0);
    }

    // 进入之前，底部的位置位于原位置的 y轴 +100， 进入之后复原，也就有了从下往上的效果，离开之后又复原到+100px,也就有了从上往下收回的效果
    .player-operate{
      transform: translate3d(0,100px,0);
    }
  }

  // 这个vue过渡效果也说明了，过渡效果中还可以穿插子元素的一些其他动画，达到更好的效果
  // 抓住进入前，离开后      进入后，离开前     两种状态

  .lyric-container{
    height: 100%;
    box-sizing: border-box;
    padding: 30px 30px 70px 30px;
    overflow: hidden;
  }
  .lyric-scroll{
    height: 100%;
    width: 100%;
    color: white;
    overflow: hidden;
    text-align: center;

    .list-item{
      font-size: 24px;
      line-height: 1.5;
      min-height: 50px;
      opacity: .5;

      // 给个动态样式active,当前播放的歌词高亮显示
      &.active{
        opacity: 1;
      }
    }
  }

  .playlist-scroll{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 800px;
    overflow: hidden;
    z-index: 9999;
    background-color: rgba(255,255,255,.95);
    border-radius: 10px 10px 0 0;

    ul{
      padding-bottom: 80px;

      li{
        padding: 30px 20px;
        font-size: 24px;
        border-bottom: 1PX solid #e6e6e6;
        /* 让里面的内容排成一行 */
        display: flex;
        flex-direction: row;
        /* 两端对齐 */
        justify-content: space-between;
        /* 垂直居中 */
        align-items: center;
      }

      .artists-name{
        font-size: 18px;
        color: #b2b2b2;
      }

      i{
        font-size: 24px;
        color: lightgray;
      }
    }
    .close{
      font-size: 30px;
      line-height: 80px;
      text-align: center;
      color: #333;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      border-top: 1PX solid #e6e6e6;
      background-color: white;
    }
  }

  .playlist-mask{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    background-color: rgba(0,0,0,.4);
  }

  .playlist-enter-active,.playlist-leave-active{
    transition: all .3s;
  }
  .playlist-enter,.playlist-leave-to{
    transform: translate3d(0,100%,0); // 正值则是往下跑
  }
</style>
