import { createApp } from "vue";
import "@/style/style.scss";
import App from "@/App.vue";
// 引入 pinia
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import TopRightTriangleButton from '@/components/TopRightTriangleButton.vue' // 调整路径
// swiper
import "swiper/css";
import router from './router';
const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(router);
app.use(pinia);
app.mount("#app");
app.component('TopRightTriangleButton', TopRightTriangleButton) // 全局注册
// PWA
// navigator.serviceWorker.addEventListener("controllerchange", () => {
//   // 弹出更新提醒
//   console.log("站点已更新，刷新后生效");
//   ElMessage("站点已更新，刷新后生效");
// });
