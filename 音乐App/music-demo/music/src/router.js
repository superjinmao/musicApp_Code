import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Recommend from './views/recommend.vue';
import PlayListView from './views/playListView.vue';
import Rank from './views/rank.vue';
import Artists from './views/artists.vue';
import PlayListInfo from './views/playListInfo.vue';
import ArtistsInfo from './views/artistsInfo.vue';
import RankInfo from './views/rankInfo.vue';
import Search from './views/search.vue';
import UserCenter from './views/userCenter.vue';
import UserHistoryList from './views/userHistoryList.vue';
import UserLoveList from './views/userLoveList.vue';
import UserPlayList from './views/userPlayList.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          path: '/recommend',
          name: 'recommend',
          component: Recommend
        },
        {
          path: '/playListView',
          name: 'playListView',
          component: PlayListView,
          children: [
            {
              path: ':id',
              name: 'playListInfo',
              component: PlayListInfo
            }
          ]
        },
        {
          path: '/rank',
          name: 'rank',
          component: Rank,
          children: [
            {
              path: ':id',
              name: 'RankInfo',
              component: RankInfo
            }
          ]
        },
        {
          path: '/artists',
          name: 'artists',
          component: Artists,
          children: [
            {
              path: ':id',
              name: 'ArtistsInfo',
              component: ArtistsInfo
            }
          ]
        },
        {
          path: '/search',
          name: 'search',
          component: Search
        },
        {
          path: '/userCenter',
          name: 'userCenter',
          component: UserCenter,
          children: [
            {
              path: '/userHistoryList',
              name: 'userHistoryList',
              component: UserHistoryList
            },
            {
              path: '/userLoveList',
              name: 'userLoveList',
              component: UserLoveList
            },
            {
              path: '/userPlayList',
              name: 'userPlayList',
              component: UserPlayList
            }
          ]
        }
      ]
    }
  ]
});
