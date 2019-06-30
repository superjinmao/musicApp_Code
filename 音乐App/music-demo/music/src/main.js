import Vue from 'vue';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import VueLazyLoad from 'vue-lazyload';
import App from './App.vue';
import router from './router';
import store from './store/index';
import './assets/css/common.css';
import './assets/css/reset.css';
import './assets/fonts/iconfont.css';
import 'lib-flexible';
import 'swiper/dist/css/swiper.css';


Vue.config.productionTip = false;

Vue.use(VueAwesomeSwiper);

Vue.use(VueLazyLoad, {
  loading: '/load.gif',
  // 当出错的时候显示这张默认的图片
  error: 'user-bg.png'
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
