const mutations = {
  // 是否全屏显示
  SET_FULLSCREEN(state, val) {
    state.fullScreen = val;
  },
  // 点击播放，添加当前歌曲播放列表
  SET_PLAY_LIST(state, val) {
    state.playList = val;
  },
  SET_SEQUENCE_LIST(state, val) {
    state.sequencesList = val;
  },
  SET_CURRENT_INDEX(state, val) {
    state.currentIndex = val;
  },
  SET_MODE(state, val) {
    state.mode = val;
  },
  DEL_FROM_PLAY_LIST(state, val) {
    // 在airbnb的书写规范中，针对箭头函数尽量要求书写简便，只有一个参数省略圆括号，只有一个返回值，省略关键字return

    // 获取当前点击删除的这首歌曲在其所在歌单的排序位置index值
    const index = state.playList.findIndex(item => item.id === val.delSong.id);
    // 然后根据这个index的值去删除指定歌曲,这里使用数组splice方法，第一个参数是删除的位置(删除包含当前位置)，第二个参数是删除多少个
    state.playList.splice(index, 1);
    // 如果删除的和当前播放的歌曲是同一首，那么要进行一个判断，不用去更新currentIndex的值

    if (val.delSong.id !== val.curSong.id) { // 只有当前删除的歌曲和播放的歌曲不同时，才执行currentIndex的重新定位
      // 重新确定更新当前歌曲在删除操作后的播放列表中的位置值currentIndex,防止出现播放紊乱
      state.currentIndex = state.playList.findIndex(item => item.id === val.curSong.id);
    }

    // 非常好的方法，先获取当前点击删除的歌曲在当前列表中的排序，然后根据这个index值去执行删除方法
    // state.playList = state.playList.filter(item => item.id !== val.id);


    // 这样当删除的是当前播放的歌曲时，会自动在删除后播放当前删除歌曲的下一首,这是为什么？
    /**
     * 因为删除当前歌曲后，下面的歌曲自然会补充原来的位置，currentIndex还是在的，只是列表发生了变化，导致歌曲发生了变化,也就是
     * currentSong变了，在watch那里，newVal不同于oldVal触发，重新请求歌曲数据并自动播放最新歌曲
     */
  },
  SET_HISTORY_LIST(state, val) {
    // 判断当前歌曲是否已经播放过，如果已经播放过，就不会重复去添加，执行push操作
    let haveHistory = false;
    for (let i = 0; i < state.historyList.length; i += 1) { // 遍历整个历史纪录
      if (state.historyList[i].id === val.id) { // 判断传递进来的对象值在History历史记录栈中是否存在
        // 如果存在，那么这个haveHistory的值设置为true
        haveHistory = true;
        return; // 判断该歌曲播放过，就不再去循环遍历了
      }
    }
    if (!haveHistory) { // 如果历史纪录栈中不存在这条数据，我们才将当前这条歌曲数据push到历史纪录中
      state.historyList.push(val);
    }
    // 最终再将整个historyList给添加到localStorage中去
    localStorage.setItem('HistoryList', JSON.stringify(state.historyList)); // 因为localStorage只能传字符串，所以这里要进行转化
  },
  // 添加收藏
  SET_LOVE_LIST(state, val) {
    let haveLove = false;
    for (let i = 0; i < state.loveList.length; i += 1) { // 遍历整个历史纪录
      if (state.loveList[i].id === val.id) { // 判断传递进来的对象值在History历史记录栈中是否存在
        // 如果存在，那么这个haveHistory的值设置为true
        haveLove = true;
        return; // 判断该歌曲播放过，就不再去循环遍历了
      }
    }
    if (!haveLove) { // 如果历史纪录栈中不存在这条数据，我们才将当前这条歌曲数据push到历史纪录中
      state.loveList.push(val);
    }
    // 最终再将整个historyList给添加到localStorage中去，相当于在本地存储去刷新收藏列表
    localStorage.setItem('LoveList', JSON.stringify(state.loveList)); // 因为localStorage只能传字符串，所以这里要进行转化
  },
  // 再次点击取消收藏
  DEL_FROM_LOVE_LIST(state, val) {
    // 要删除，就得找到当前已经收藏的歌曲在收藏列表 (loveList) 中的index值
    const index = state.loveList.findIndex(item => item.id === val.id);
    state.loveList.splice(index, 1); // 然后根据其在列表中的index值，通过数组的方法进行删除
    // 最终再将新的收藏列表保存到localStorage中
    localStorage.setItem('LoveList', JSON.stringify(state.loveList));
  },
  // 添加搜索记录
  SET_SEARCH_TEXT(state, val) { // 这里传入的val就是input输入框输入搜索的值
    // 同样要判断这个关键词在我们搜索历史记录中是否存在，如果存在就不用去重复的存储
    let haveText = false;
    for (let i = 0; i < state.searchText.length; i += 1) {
      if (state.searchText[i] === val.trim()) { // 这里直接拿值进行比较即可，均为文本内容,注意搜索框输入的内容要清除空格，因为只关心搜索关键词
        haveText = true;
        return; // 判断出这个关键词已经搜索过，就不再遍历，return出来
      }
    }
    // 如果遍历不出结果，则该关键词没有搜索过,则将这个搜索内容添加到搜索历史记录中
    if (!haveText) {
      state.searchText.unshift(val); // 最新搜索内容关键词是插入到前面的，所以不用push,而是unshift
      // 并且注意，存储的历史搜索最多不超过10条，超过的自动尾部删除，从旧的下手
      state.searchText = state.searchText.splice(0, 10); // 从第0开始，截取10条
    }
    // 最后再将这些值存放到localStorage中
    localStorage.setItem('SearchText', JSON.stringify(state.searchText));
  },
  // 点击删除关键字
  DEL_FROM_SEARCH_TEXT(state, val) {
    for (let i = 0; i < state.searchText.length; i += 1) {
      if (state.searchText[i] === val.trim()) { // trim清除空格
        state.searchText.splice(i, 1); // 匹配上就将当前这一条记录删除
      }
    }
    // 然后再更新本地储存数据,将删除好后的记录重新写入本地储存中
    localStorage.setItem('SearchText', JSON.stringify(state.searchText));
  }
};
export default mutations;
