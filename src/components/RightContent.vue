<template>
  <div class="righter" v-show="store.rightContentShowStatus">
    <!-- <close-one class="close" theme="filled" size="28" fill="#ffffff60" @click="closeMusicList()" /> -->
    <div class="righter-title">
      <span>
        <div class="content-top">{{ contentTop.name }}</div>
      </span>
    </div>

    <div class="righter-content">
      <!-- 动态渲染内容 -->
      <div class="show-content" v-if="isShowContent">
        <img v-if="isMedia(showContent) == 'image'" :src="showContent" alt="动态图片" @click="openPicModal($event)"
          :style="{ width: '100%', transition: 'transform 0.3s ease' }" />
        <video v-else-if="isMedia(showContent) == 'video'" :src="showContent" controls autoplay></video>
        <div v-else v-html="newHtml" :key="contentKey" class="no-content-show" @click="handleClick()"></div>
      </div>
      <div class="show-content" v-else>
        <h1 style="text-align: center; margin-top: 30%;">正在努力加载喵...</h1>
        <img src="./../../public/images/icon/loading.png" style="width: 30%;height: 30%;object-fit: contain;margin: 0 35%;"/>
      </div>
    </div>


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
  getChengYu,
  getMoYuCalendar,getLvCha,
  getHistoryToday,getHotSearch,getWangYiYun,
  getCosPicture,getErCiYuanPicture,
  getIkunPicture,getChaijunPicture,
  getJKVideo,getCosVideo,getBaiSiVideo,

} from "@/api";
import { Icon } from "@vicons/utils";
import { getPlayerList } from "@/api";
import { mainStore } from "@/store";
import { cloneDeep } from "lodash";

const processedContent = ref(''); // 用来存储处理后的内容
const store = mainStore();
const showContent = ref("");
const isShowContent = ref(false);
const contentTop = ref("");
const newHtml = ref("");
const contentKey = ref(0); // 初始化 key

// 判断内容图片视频文本类型
const isMedia = (value) => {
  if (typeof value !== "string") return "text";
  if (value.endsWith(".jpg") || value.endsWith(".png") || value.endsWith(".gif") || value.endsWith(".jpeg")) return "image";
  if (value.endsWith(".mp4") || value.endsWith(".avi") || value.endsWith(".mov")) return "video";
  return "text";
}
// 关闭弹窗
const closeMusicList = () => {
  showContent.value = '';
  isShowContent.value = false;
  store.setRightContentShowStatus = false;
  store.setRightContent({});
};
  // 打开右边内容
const handleClick = () => {
      // 检查点击是否是标题 <h2>
      if (event.target.tagName === "H2") {
        const newsItem = event.target.closest(".news-item");
        const description = newsItem.querySelector(".description");

        if (description.style.maxHeight === "0px" || !description.style.maxHeight) {
          // 显示当前描述
          description.style.maxHeight = "500px";
          description.style.opacity = "1";
        } else {
          // 隐藏当前描述
          description.style.maxHeight = "0px";
          description.style.opacity = "0";
        }
      }
    }
const openModalList = async (data) => {
  console.log(data, 'datadada');
  isShowContent.value = false;
  contentTop.value = cloneDeep(data);
  // 点击按钮调用对应的 API
  showContent.value = '';
  const apiMap = {
    getRenMinSentence,
    getYangShiNews,
    getChengYu,
    get60sWorld,
    getMoYuCalendar,getLvCha,
    getHistoryToday,getHotSearch,getWangYiYun,
    getCosPicture,getErCiYuanPicture,
    getIkunPicture,getChaijunPicture,
    getJKVideo,getCosVideo,getBaiSiVideo,
  };
  if (!data || !apiMap[data]) {
    console.error("未找到对应的 API 方法");
    return;
  }
  try {
    const response = await apiMap[data]();
    // 判断返回类型，获取相应的内容
    // store.setRightContent (cloneDeep(response));
    // 央视新闻特殊处理
    if (data == 'getChengYu') {
      let html = '<h1>每日成语</h1>';
      let resultArr = response.p_contents;
      let result = resultArr.map(item=>{
        const parts = item.split("："); // 分割中文冒号
        
        return {
          title: parts[0] + "：", // 前半部分，包括序号和词语
          description: parts[1] ? parts[1] : "", // 后半部分解释
        };
      })
      // console.log(result, 'result');
      result.map((item,index) => {
        html += `
            <div class="news-item" data-index="${index}">
              <h2 style="margin: 20px 0px 5px 0px; cursor: pointer;">${item.title}</h2>
              <p class="description" style="max-height: 0; opacity: 0; overflow: hidden; transition: all 0.3s ease;">
                ${item.description}
              </p>
            </div>
          `;
      });
      newHtml.value = html;
    }else if (data == 'getYangShiNews') {
      let html = '';
      response.data.map((item) => {
        html += `
            <div class="news-item">
              <h2 style="margin: 20px 0px 5px 0px;">${item.title}</h2>
              <p>${item.brief}</p>
              <img src="${item.image}" style="width: 85%;height: 70%;object-fit: contain;"/>
              <a href="${item.url}" target="_blank">阅读更多</a>
            </div>
          `;
      });
      newHtml.value = html;
    }else if(data == 'getRenMinSentence'){
      let html = '';
      // 将原始数据按行拆分并解析
      const result =[];
      // 匹配金句正则
      const regex = /人民日报每日金句摘抄【[^】]+】\s+([^----]+)----(《[^》]+》\d{4}年\d{2}月\d{2}日)/g;
      const matches = [];
      let match;

      while ((match = regex.exec(response)) !== null) {
        const [_, content, date] = match;
        const titleMatch = response.match(/人民日报每日金句摘抄【[^】]+】/); // 提取标题
        const title = titleMatch ? titleMatch[0] : "未知标题";

        matches.push({
          title: title.trim(),
          content: content.trim(),
          date: `----${date.trim()}`, // 保留完整的日期部分
        });
      }
      console.log(matches,'matches');
      matches.map((item) => {
        html += `
            <div class="news-item">
              <h2 style="margin: 20px 0px 5px 0px;">${item.title}</h2>
              <p>${item.content}</p>
              <p style="text-align:right">${item.date}</p>
            </div>
          `;
      });
      newHtml.value = html;
    }else if(data=='getHistoryToday'||data=='getHotSearch'){
      let html = '';
      let result = JSON.parse(response).newslist;
      if(data=='getHistoryToday'){
        result.map((item) => {
            html += `
              <div class="news-item">
                <p style="text-align:left;font-size:18px;margin:2px 0px">${item.lsdate}——${item.title}</p>
               
              </div>
            `;
        });
        newHtml.value = html;
      }else{
        result = result.slice(0,15);
        result.map((item) => {
            html += `
              <div class="news-item">
                <p style="text-align:left;font-size:20px;margin:10px 0px 2px 0px">${item.keyword}${item.trend}</p>
                <p style="text-align:left;font-size:16px;margin:2px 0px">${item.brief}</p>
              </div>
            `;
        });
        newHtml.value = html;
      }
      
    }
    else {
      newHtml.value = response;
    }
    // showContent.value = cloneDeep(response);
    isShowContent.value = true;
  } catch (error) {
    console.error("API 调用失败:", error);
    isShowContent.value = true;
    newHtml.value = `
    <h3 style="text-align: center; ">被玩坏了喵？！这肯定不是喵的问题！绝对不是喵！</h3>
    <img src="https://cdn-jp.imgs.moe/2025/01/09/repair.gif@1052w_!web-dynamic_XSa5l19m2L.webp"  style="width: 96%;height: 96%;object-fit: contain;margin: 0 2%;"/>
    `;
  }
};
const processContent = async (content) => {
  // console.log(content,'content');
  await openModalList(content);
};

// 监听 content 变化
watch(
  () => store.getRightContent, // 监听 content 变化
  async (newContent) => {
    await nextTick();
    // 当 content 变化时调用 processContent 函数
    processedContent.value = processContent(newContent);
    contentKey.value++; // 每次内容变化时更新 key，强制刷新
  },
  { immediate: true } // 使得初始时也会调用一次
);

onMounted(() => {
  const content = store.getRightContent;
  openModalList(content, 'showContentshowContent');
});
</script>

<style lang="scss" scoped>

  .righter {
    position: absolute;
    right: 2vw;
    width: 25%;
    height: 75%;
    // border: 1px white solid;
    border-radius: 20px;
  }

  .righter-title {
    position: relative;
    width: 100%;
    height: 5%;
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

  .righter-content {
    width: 93%;
    height: 90%;
    // border: 1px solid;
    margin: 0 auto;
  }

  .show-content {
    margin: 0 auto;
    width: 96%;
    height: 95%;
    overflow-y: scroll;
  }
  .no-content-show{
    h2{
      @media (max-width: 720px) {
        font-size: 20px;
      }
    }
  }
  .content-foot {
    position: absolute;
    top: 2.5vw;
    left: 1.5vw;

    @media (max-width: 720px) {
      top: 11.5vw;
    }
  }

  .content-top {
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
@media screen and (max-width: 720px) {
  .righter {
    position: absolute;
    bottom: 20%;
    width: 100%;
    height: 30%;
  }
}
</style>