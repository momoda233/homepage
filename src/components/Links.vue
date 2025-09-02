<template>
  <div v-if="siteLinks[0]" class="links">
    <div class="line"  
      @click="funcShow1=!funcShow1">
      <Icon size="20">
        <Link />
      </Icon>
      <span class="title">功能区</span>
      <AngleDown size="20" v-show="funcShow1" style="margin-left: 8px;width: 13px;"/>
      <AngleUp size="20" v-show="!funcShow1" style="margin-left: 8px;width: 13px;"/><span v-show="!funcShow1" style="font-size: 15px;"> &nbsp;展开</span>
    </div>
    <!-- 网站列表 -->
    <Swiper
      v-if="siteLinks[0]&&funcShow1"
      :modules="[Pagination, Mousewheel]"
      :slides-per-view="1"
      :space-between="40"
      :pagination="{
        el: '.swiper-pagination',
        clickable: true,
        bulletElement: 'div',
      }"
      :mousewheel="true"
    >
      <SwiperSlide v-for="site in siteLinksLink" :key="site">
        <el-row class="link-all" :gutter="20">
          <el-col 
            v-for="(item, index) in site" 
            :span="12" 
            :key="item"
          >
            <div
              class="item cards"
              :style="'margin-bottom: 20px'"
              @click="jumpLink(item)"
            >
              <Icon size="26">
                <component :is="siteIcon[item.icon]" />
              </Icon>
              <span class="name text-hidden">{{ item.name }}</span>
            </div>
          </el-col>
        </el-row>
      </SwiperSlide>
      <div class="swiper-pagination" />
    </Swiper>

    <div class="line"  
    @click="funcShow2=!funcShow2">
      <Icon size="20">
        <Link />
      </Icon>
      <span class="title">图片区</span>
      <AngleDown size="20" v-show="funcShow2" style="margin-left: 8px;width: 13px;"/>
      <AngleUp size="20" v-show="!funcShow2" style="margin-left: 8px;width: 13px;"/> <span v-show="!funcShow2" style="font-size: 15px;"> &nbsp;展开</span>
    </div>
    <Swiper
      v-if="siteLinks[0] && funcShow2"
      :modules="[Pagination, Mousewheel]"
      :slides-per-view="1"
      :space-between="40"
      :pagination="{
        el: '.swiper-pagination',
        clickable: true,
        bulletElement: 'div',
      }"
      :mousewheel="true"
    >
      <SwiperSlide v-for="site in siteLinksSister" :key="site">
        <el-row class="link-all" :gutter="20">
          <el-col 
            v-for="(item, index) in site" 
            :span="12" 
            :key="item"
          >
            <div
              class="item cards"
              :style="'margin-bottom: 20px'"
              @click="jumpLink(item)"
            >
              <Icon size="26">
                <component :is="siteIcon[item.icon]" />
              </Icon>
              <span class="name text-hidden">{{ item.name }}</span>
            </div>
          </el-col>
        </el-row>
      </SwiperSlide>
      <div class="swiper-pagination" />
    </Swiper>

    <div class="line"  @click="funcShow3=!funcShow3">
      <Icon size="20">
        <Link />
      </Icon>
      <span class="title">网站区(正在开发ing)</span>
      <AngleDown size="20" v-show="funcShow3" style="margin-left: 8px;width: 13px;"/>
      <AngleUp size="20" v-show="!funcShow3" style="margin-left: 8px;width: 13px;"/> <span v-show="!funcShow3" style="font-size: 15px;"> &nbsp;展开</span>
    </div>
    <Swiper
      v-if="siteLinks[0]&& funcShow3"
      :modules="[Pagination, Mousewheel]"
      :slides-per-view="1"
      :space-between="40"
      :pagination="{
        el: '.swiper-pagination',
        clickable: true,
        bulletElement: 'div',
      }"
      :mousewheel="true"
    >
      <SwiperSlide v-for="site in siteLinksProject" :key="site">
        <el-row class="link-all" :gutter="20">
          <el-col 
            v-for="(item, index) in site" 
            :span="12" 
            :key="item"
          >
            <div
              class="item cards"
              :style="'margin-bottom: 20px'"
              @click="jumpLink(item)"
            >
              <Icon size="26">
                <component :is="siteIcon[item.icon]" />
              </Icon>
              <span class="name text-hidden">{{ item.name }}</span>
            </div>
          </el-col>
        </el-row>
      </SwiperSlide>
      <div class="swiper-pagination" />
    </Swiper>

    <Transition name="fade" mode="out-in">
    <div class="music-list" v-show="musicListShow" @click="closeMusicList()">
      <Transition name="zoom">
        <div class="list" v-show="musicListShow" @click.stop>
          <close-one
            class="close"
            theme="filled"
            size="28"
            fill="#ffffff60"
            @click="closeMusicList()"
          />
          <!-- 动态渲染内容 -->
          <div class="content-top">{{ contentTop.name }}</div>
            <div class="show-content" v-if="isShowContent=='1'||isShowContent=='3'||isShowContent=='4'||isShowContent=='5'">
              <img v-if="isMedia(showContent)=='image'" :src="showContent" alt="动态图片" @click="openPicModal($event)" :style="{ width:'100%',transition: 'transform 0.3s ease',margin:'10px 0px' }"/>
              <video v-else-if="isMedia(showContent)=='video'" :src="showContent" controls autoplay :style="{width:'98%',height:'98%',marginTop: '5px'}"></video>
              <p v-else>{{ showContent }}</p>
            <div class="newHtml" v-if="isShowContent==3||isShowContent=='4'||isShowContent=='5'" v-html="newHtml" :key="contentKey"></div>
          </div>
          <div class="show-content" v-else> 
            <h1 style="text-align: center; margin-top: 30%;">正在努力加载喵...</h1>
            <img src="./../../public/images/icon/loading.png" style="width: 30%;height: 30%;object-fit: contain;margin: 0 35%;"/>
          </div>
          <!-- 底部内容 -->
          <div class="content-foot">
            <div class="btns" v-show="isShowContent==1||isShowContent=='4'">
              <span @click="getImageExtension(showContent)">保存本地喵</span>
              <span @click="openPicModal($event)" v-if="isMedia(showContent)=='image'">点击图片放大喵</span>
              <span @click="openModalList(contentTop)">换一个喵</span>
            </div>
          </div>
          <!-- 模态框 -->
          <div v-if="showPicModal" class="pic-modal" @click="closePicModal()" @wheel="handleWheel">
            <img 
              :src="showContent" alt="放大图片" 
              class="modal-content" 
              :style="{ transform: `translate(${translateX}px, ${translateY}px) scale(${imageScale})` }"  
              @mousemove="updateMousePosition"
            />
            <!-- <img :src="showContent" alt="放大图片" class="modal-content" @mousedown="startDrag" ref="draggableImage" :style="imageStyle.value"/> -->
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
  </div>
</template>

<script setup>
import {
  GoStart,
  PlayOne,
  Pause,
  GoEnd,
  CloseOne,
  VolumeMute,
  VolumeSmall,
  VolumeNotice,


} from "@icon-park/vue-next";

import { 
  getRenMinSentence,
  getYangShiNews,
  get60sWorld,
  getMoYuCalendar,
  getHistoryToday,
  getHotSearch,
  getChengYu,
  getWangYiYun,getLvCha,
  getCosPicture,
  getErCiYuanPicture,
  getIkunPicture,getChaijunPicture,
  getJKVideo,getCosVideo,getBaiSiVideo,getBVSisterVideo,getBVNinVideo
 } from "@/api";


import { Icon } from "@vicons/utils";
// 可前往 https://www.xicons.org 自行挑选并在此处引入
import { Link, Blog, CompactDisc, Cloud, Compass, Book, Fire, LaptopCode,
  GrinHeartsRegular,
  KissWinkHeart,
  GrinHearts,
  Bullhorn,
  UserTimes,
  Heart,
  Kiss,
  AngleUp,
  AngleDown,
  SadCryRegular,
  Camera,
  CalendarDay,PencilAlt,
  BirthdayCake,
  HandHoldingHeart, } from "@vicons/fa"; // 注意使用正确的类别
import { mainStore } from "@/store";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Mousewheel } from "swiper/modules";
import siteLinks from "@/assets/siteLinks.json";
import { cloneDeep } from "lodash";
import { ref } from "vue";
import router from '../router/index.js';
const store = mainStore();
const musicListShow = ref(false);
const funcShow1 = ref(true);
const isHover1 = ref(false);
const funcShow2 = ref(true);
const isHover2 = ref(false);
const funcShow3 = ref(true);
const isHover3 = ref(false);
console.log(funcShow1,funcShow2,funcShow3); 
const isShowContent = ref('1');//1:图片或视频 2:加载中 3:挂掉 4 :BV视频或 5: repair
const showContent = ref("");
const newHtml = ref("");
const contentTop = ref("");
const showPicModal = ref(false);
const imageScale = ref(1); // 图片缩放
const zoomSpeed = 0.1; // 缩放速度
const translateX = ref(0); // 水平位移
const translateY = ref(0); // 垂直位移
const mouseX = ref(0); // 鼠标X位置
const mouseY = ref(0); // 鼠标Y位置
const containerWidth = ref(0); // 容器宽度
const containerHeight = ref(0); // 容器高度
const BVID = ref(""); // 替换为实际的 BVID
const newBVHtml =  computed(() => `
      <iframe
        class="BVPlayer"
        src="https://player.bilibili.com/player.html?bvid=${BVID.value}&autoplay=1&high_quality=1"
        height="100%"
        width="100%"
        scrolling="no"
        border="0"
        frameborder="no"
        framespacing="0"
        allowfullscreen
        :style="{position: 'absolute !important', top: 10%, left: 0}"
      ></iframe>
`);

const siteLinksList = (arr,type) => {
  arr = arr.filter((item) => item.type === type);
  const result = [];
  for (let i = 0; i < arr.length; i += 4) {
    const subArr = arr.slice(i, i + 4);
    result.push(subArr);
  }
  return result;
};
// 计算网站链接
const siteLinksArr = cloneDeep(siteLinks);
const siteLinksProject = siteLinksList(siteLinksArr,'3');
const siteLinksSister = siteLinksList(siteLinksArr,'2');
const siteLinksLink = siteLinksList(siteLinksArr,'1');
// 判断内容图片视频文本类型
const isMedia = (value)=> {
  if (typeof value !== "string") return "text";
  if (value.endsWith(".jpg") || value.endsWith(".png") || value.endsWith(".gif")|| value.endsWith(".jpeg")|| value.endsWith(".webp")) return "image";
  if (value.includes(".mp4") || value.includes(".avi") || value.includes(".mov")) return "video";
  return "text";
}
// 打开放大图片弹窗
const openPicModal=(event) =>{
      showPicModal.value = true;
}
// 绑定放大图片键盘事件
const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      closePicModal();
    }
  };
const closePicModal=() =>{
      showPicModal.value = false;
      imageScale.value = 1; // 重置缩放
}
// 鼠标滚动事件
const handleWheel = (event) => {
    event.preventDefault();
      // 更新缩放比例
      const oldScale = imageScale.value;
      const newScale = event.deltaY < 0
        ? imageScale.value + zoomSpeed // 放大
        : Math.max(1, imageScale.value - zoomSpeed); // 缩小，最小缩放为1

      if (newScale === oldScale) return;

      // 计算放大或缩小时的偏移量
      const scaleDiff = newScale - oldScale;
      const offsetX = (mouseX.value - containerWidth.value / 2) * scaleDiff;
      const offsetY = (mouseY.value - containerHeight.value / 2) * scaleDiff;

      translateX.value -= offsetX;
      translateY.value -= offsetY;
      imageScale.value = newScale;
};
// 鼠标移动时更新鼠标位置
const updateMousePosition = (event) => {
      const rect = event.target.getBoundingClientRect();
      mouseX.value = event.clientX - rect.left;
      mouseY.value = event.clientY - rect.top;
      containerWidth.value = rect.width;
      containerHeight.value = rect.height;
  };

// 下载内容
// const downloadImage = async (url) => {
//       // 正则表达式匹配图片链接
//   // const imageExtension = await getImageExtension(showContent);
//       const link = document.createElement('a');
//       link.href = showContent;
//       // link.download = `downloaded_image${imageExtension}`; // 根据格式动态设置文件名
//       link.download = url.split('/').pop(); // 使用图片的文件名作为下载文件名
//       link.click();
// }
// 判断图片格式
const getImageExtension = async (url) => {
    window.open(url, '_blank');

    // try {
    //   const response = await fetch(url);
    //   console.log(response,'response');
    //   const contentType = response.headers.get('Content-Type');
    //   console.log(contentType,'contentType');
    //   if (contentType.includes('image/jpeg')) {
    //     return '.jpg';
    //   } else if (contentType.includes('image/png')) {
    //     return '.png';
    //   } else {
    //     return ''; // 返回默认值或其他处理
    //   }
    // } catch (error) {
    //   console.error('无法获取图片类型:', error);
    //   return ''; // 返回默认值或处理错误
    // }
    // try {
    //   const imageRegex = /https?:\/\/\S+\.(jpg|jpeg|png|gif)/i;
    //     // 提取图片 URL
    //   const imageUrls = extractImageUrls(url);
    //     // 从文本中提取所有符合图片格式的 URL
    //   function extractImageUrls(url) {
    //       const matches = url.match(imageRegex);
    //       return matches || []; // 返回所有匹配的图片链接，若没有则返回空数组
    //   }
    //   if (imageUrls.length > 0) {
    //     // 下载第一个图片（或根据需求下载所有图片）
    //     downloadImage(imageUrls[0]);
    //   } else {
    //     console.log('未找到图片链接');
    //   }
    //   } catch (error) {
    //   console.error('下载失败:', error);
    // }
}
// 关闭弹窗
const closeMusicList = () => {
  showContent.value ='';
  musicListShow.value = false;
  isShowContent.value = '2';
  contentTop.value = '';
};
// 开启弹窗
const openModalList = async (data) => {
  isShowContent.value = '2';
  contentTop.value = cloneDeep(data);
    // 点击按钮调用对应的 API
  showContent.value ='';
  const apiMap = {
      getRenMinSentence,
      getYangShiNews,
      get60sWorld,
      getMoYuCalendar,
      getHistoryToday,
      getChengYu,
      getHotSearch,
      getWangYiYun,getLvCha,
      getCosPicture,
      getErCiYuanPicture,
      getIkunPicture,getChaijunPicture,
      getJKVideo,getCosVideo,getBaiSiVideo,getBVSisterVideo,getBVNinVideo
    };
    if (!data.api || !apiMap[data.api]) {
      if(data.repair){
        newHtml.value = `
            <h1 style="text-align: center; margin-top: 30%;">不要催了喵，还在赶了喵！</h1>
           <img src="https://cdn-jp.imgs.moe/2025/01/09/IMG_4598_LYLAPZh3b1.gif"  style="width: 96%;height: 96%;object-fit: contain;margin: 0 2%;"/>
          `;
      }else{
        newHtml.value = `
            <h1 style="text-align: center; margin-top: 30%;">加载失败了喵？！怎么回事喵？！</h1>
           <img src="https://cdn-jp.imgs.moe/2025/01/09/D6DE230C-66F7-45D4-9BA0-C51B28040E4B_AC3mY4g6Ws.jpeg"  style="width: 96%;height: 96%;object-fit: contain;margin: 0 2%;"/>
          `;
      }
        isShowContent.value = '3';
        console.error("未找到对应的 API 方法");
        return;
    }
    try {
        const response = await apiMap[data.api]();
        // 判断返回类型，获取相应的内容
        if(data.isOpen){
          if(data.api === 'getBaiSiVideo' 
          || data.api === 'getCosVideo'
          || data.api === 'getJKVideo'){
            // 获取视频数据并转换为 Blob URL
          const videoBlob = await response.blob();
          const videoBlobUrl = URL.createObjectURL(videoBlob);
          // 设置视频源 URL
            // const videoUrl = response.url;
            showContent.value =  videoBlobUrl;
            isShowContent.value = '1';
        }else if(data.api === 'getBVSisterVideo'||data.api === 'getBVNinVideo'){
            isShowContent.value = '4';
            // 随机B站小姐姐视频
            const resData = JSON.parse(response);
            const medias = resData.data.medias;
            const randomData = medias[Math.floor(Math.random() * medias.length)];
            console.log(randomData,'randomData');
            BVID.value = randomData.bvid;
            newHtml.value = newBVHtml.value;
            console.log(newHtml.value,'newHtml');
          }
          // else if(data.repair){
          // isShowContent.value = '5';
          // newHtml.value = `<img src="../../public/images/icon/repair.gif@1052w_!web-dynamic.webp" style="width: 30%;height: 30%;object-fit: contain;margin: 0 35%;"/>`;
          // } 
        else {
            showContent.value = response;
            isShowContent.value = '1';
          }
        }
        }catch (error) {
          isShowContent.value = '3';
          newHtml.value = `
            <h1 style="text-align: center; margin-top: 30%;">被玩坏了喵？！这肯定不是喵的问题！绝对不是喵！</h1>
            <img src="https://cdn-jp.imgs.moe/2025/01/09/502_zTks7cRzXu.png" style="width: 30%;height: 30%;object-fit: contain;margin: 0 35%;"/>
          `;
          console.error("API 调用失败:", error);
    } 
    
};
// 网站链接图标
const siteIcon = {
  Blog,
  Cloud,
  CompactDisc,
  Compass,
  Book,
  Fire,
  LaptopCode,  
  GrinHeartsRegular,
  KissWinkHeart,
  GrinHearts,
  Heart,
  AngleUp,
  AngleDown,
  Kiss,
  Bullhorn,
  SadCryRegular,
  HandHoldingHeart,
  BirthdayCake,
  Camera,
  PencilAlt,
  UserTimes,
  CalendarDay,
};
// 例如，设置一个时间戳或版本号
let timestamp = ref(0);

const forceUpdateContent = (newContent) => {
  // 更新 store 内容
  store.setRightContent(cloneDeep(newContent));
  // 更新时间戳或版本号，强制刷新
  timestamp.value++;
};
// 链接跳转
const jumpLink = (data) => {
  if (data.name === "音乐列表" && store.musicClick) {
    if (typeof $openList === "function") $openList();
  }else if(data.link){
    window.open(data.link, "_blank");
  }else if (data.name === "音乐列表" && !store.musicClick) {
    store.musicClick = true;
    store.musicListShow = true;
  }else if(data.isOpen === true){
    musicListShow.value = true;
    openModalList&&openModalList(data);
  }else if(data.isOpen === false){
    // openModalList&&openModalList(data);
    forceUpdateContent(data.api);
  } else if(data.name==='wallpaper设计ing'){
       // 执行页面A的独立跳转逻辑
    router.push({ 
      path: data.path, 
    });
  }else{
    console.error("未找到对应的链接");
  }
};

onMounted(() => {
  // console.log(siteLinks);
  window.addEventListener('keydown', handleKeyDown);
});
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<style lang="scss" scoped>
.links {
  .line {
    margin: 2rem 0.25rem 1rem;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    animation: fade 0.5s;
    position: relative;
    z-index: 2;
    .title {
      margin-left: 8px;
      font-size: 1.15rem;
      text-shadow: 0 0 5px #00000050;
    }
  }
  .swiper {
    left: -10px;
    width: calc(100% + 20px);
    padding: 5px 10px 0;
    z-index: 0;
    .swiper-slide {
      height: 100%;
    }
    .swiper-pagination {
      margin-top: 12px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      :deep(.swiper-pagination-bullet) {
        background-color: #fff;
        width: 20px;
        height: 4px;
        margin: 0 4px;
        border-radius: 4px;
        opacity: 0.2;
        transition: opacity 0.3s;
        &.swiper-pagination-bullet-active {
          opacity: 1;
        }
        &:hover {
          opacity: 1;
        }
      }
    }
  }
  .link-all {
    height: 220px;
    .item {
      height: 100px;
      width: 100%;
      display: flex;
      align-items: center;
      flex-direction: row;
      justify-content: center;
      padding: 0 10px;
      animation: fade 0.5s;

      &:hover {
        transform: scale(1.02);
        background: rgb(0 0 0 / 40%);
        transition: 0.3s;
      }

      &:active {
        transform: scale(1);
      }

      .name {
        font-size: 1.1rem;
        margin-left: 8px;
      }
      @media (min-width: 720px) and (max-width: 820px) {
        .name {
          display: none;
        }
      }
      @media (max-width: 720px) {
        height: 80px;
      }
      @media (max-width: 460px) {
        flex-direction: column;
        .name {
          font-size: 1rem;
          margin-left: 0;
          margin-top: 8px;
        }
      }
    }
    @media (max-width: 720px) {
      height: 180px;
    }
  }
}
.music-list {
  position: fixed;
  top: 0;
  left: 0;
  margin: auto;
  width: 100%;
  height: 100%;
  background-color: #00000080;
  backdrop-filter: blur(20px);
  z-index: 4;
  .list {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: calc(50% - 450px);
    left: calc(50% - 320px);
    width: 640px;
    height: 900px;
    background-color: #ffffff66;
    border-radius: 6px;
    z-index: 999;
    @media (max-width: 720px) {
        left: 5%;
        width: 90%;
        height: 90%;
        top: 5%;
    }
    .close {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 28px;
      height: 28px;
      display: block;
      &:hover {
        transform: scale(1.2);
      }
      &:active {
        transform: scale(0.95);
      }
    }
    .show-content{
      margin: 0 auto;
      width: 90%;
      height: 80%;
      overflow-y: scroll;
    }
    .content-foot{
      position: absolute;
      top: 2.5vw;
      left: 1.5vw;
      @media (max-width: 720px) {
        top: 11.5vw;
      }
    }
    .content-top{
      position: absolute;
      top: 1vw;
      font-weight: 800;
      font-size: 22px;
    }
    .btns {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
    span {
      background: #ffffff26;
      padding: 2px 8px;
      border-radius: 6px;
      margin: 0px 6px;
      text-overflow: ellipsis;
      overflow-x: hidden;
      white-space: nowrap;
      &:hover {
        background: #ffffff4d;
      }
    }
  }
  .pic-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    cursor: grab;
    }

  .modal-content {
    // max-width: 90%;
    max-height: 100%;
    object-fit: contain;
    z-index: 101;
    transition: transform 0.2s ease;
  }
  }
}

// 弹窗动画
.zoom-enter-active {
  animation: zoom 0.4s ease-in-out;
}
.zoom-leave-active {
  animation: zoom 0.3s ease-in-out reverse;
}
@keyframes zoom {
  0% {
    opacity: 0;
    transform: scale(0) translateY(-600px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
.newHtml{
    width: 100%;
    height: 85%;
    overflow: hidden;
    margin: 3% 0;
}
.bpx-player-video-wrap{
  height: 150%;
}
</style>
