import Vue from 'vue'
import Router from 'vue-router'
import Recommend from '../components/recommend/recommend'
import Rank from '../components/rank/rank'
import Search from '../components/search/search'
import Singer from '../components/singer/singer'
import SingerDetail from '../components/singer-detail/singer-detail'
import disc from '../components/disc/disc'
import toplist from '../components/toplist/toplist'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [{
        path: ':id', // 根据不同的id显示不同的数据
        component: disc
      }]
    }, {
      path: '/rank',
      component: Rank,
      children: [{
        path: ':id', // 根据不同的id显示不同的数据
        component: toplist
      }]
    },
    {
      path: '/singer',
      component: Singer,
      children: [{
        path: ':id', // 根据不同的id显示不同的数据
        component: SingerDetail
      }]
    },
    {
      path: '/search',
      component: Search
    }
  ]
})
