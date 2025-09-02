import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue';  // 首页组件
import Wallpaper from '../views/Wallpaper/index.vue';  // 副页A组件

const routes = [
  { 
    path: '/wallpaper',      // 副页A路径：xxx.com/a
    name: 'Wallpaper',
    component: Wallpaper 
  },
];

const router = createRouter({
  history: createWebHistory(), // 使用 HTML5 History 模式
  routes
});

export default router;