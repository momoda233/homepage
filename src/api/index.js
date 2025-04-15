// import axios from "axios";
import fetchJsonp from "fetch-jsonp";

/**
 * 音乐播放器
 */

// 获取音乐播放列表
export const getPlayerList = async (server, type, id) => {
  const res = await fetch(
    `${import.meta.env.VITE_SONG_API||'https://api.wuenci.com/meting/api/'}?server=${server}&type=${type}&id=${id}`,
    // ||'https://api.wuenci.com/meting/api/'
  );
  const data = await res.json();

  if (data[0].url.startsWith("@")) {
    // eslint-disable-next-line no-unused-vars
    const [handle, jsonpCallback, jsonpCallbackFunction, url] = data[0].url.split("@").slice(1);
    const jsonpData = await fetchJsonp(url).then((res) => res.json());
    const domain = (
      jsonpData.req_0.data.sip.find((i) => !i.startsWith("http://ws")) ||
      jsonpData.req_0.data.sip[0]
    ).replace("http://", "https://");

    return data.map((v, i) => ({
      name: v.name || v.title,
      artist: v.artist || v.author,
      url: domain + jsonpData.req_0.data.midurlinfo[i].purl,
      cover: v.cover || v.pic,
      lrc: v.lrc,
    }));
  } else {
    return data.map((v) => ({
      name: v.name || v.title,
      artist: v.artist || v.author,
      url: v.url,
      cover: v.cover || v.pic,
      lrc: v.lrc,
    }));
  }
};
const proxyUrl = "https://cors-anywhere.herokuapp.com/";

// 输出当前日期，如20250406
function getFormattedDate(pattern = 'YYYYMMDD') {
  const d = new Date();
  const parts = {
    YYYY: d.getFullYear(),
    MM: String(d.getMonth() + 1).padStart(2, '0'),
    DD: String(d.getDate()).padStart(2, '0')
  };
  return pattern.replace(/YYYY|MM|DD/g, (match) => parts[match]);
}
// 使用示例
// console.log(getFormattedDate()); // 输出：20250406[5,7](@ref)
/**
 * 一言
 */

// 获取一言数据
export const getHitokoto = async () => {
  const res = await fetch("https://v1.hitokoto.cn");
  return await res.json();
};

/**
 * 天气
 */

// 获取高德地理位置信息
export const getAdcode = async (key) => {
  const res = await fetch(`https://restapi.amap.com/v3/ip?key=${key}`);
  return await res.json();
};

// 获取高德地理天气信息
export const getWeather = async (key, city) => {
  const res = await fetch(
    `https://restapi.amap.com/v3/weather/weatherInfo?key=${key}&city=${city}`,
  );
  return await res.json();
};

// 获取教书先生天气 API
// https://api.oioweb.cn/doc/weather/GetWeather
export const getOtherWeather = async () => {
  const res = await fetch("https://api.oioweb.cn/api/weather/GetWeather");
  return await res.json();
};

// 获取人民日报金句
// http://momoda.voin.ink/bg/人民日报.php
export const getRenMinSentence= async () => {
  const res = await fetch("http://momoda.voin.ink/bg/renminriba.php");
    return await res.text(); // 读取文本内容并返回
};
// 获取每日成语
// http://momoda.voin.ink/bg/chengyuapi.php
export const getChengYu= async () => {
  const res = await fetch("http://momoda.voin.ink/bg/chengyuapi.php");
  return res.json(); // 读取内容并返回
};

// 获取央视新闻
// 老接口 http://momoda.voin.ink/test/新闻.php
export const getYangShiNews = async () => {
  const res = await fetch("http://momoda.voin.ink/test/xinwen.php");
  return await res.json(); // 读取文本内容并返回
};
// 获取每天60s读懂世界
// https://api.03c3.cn/api/zb
export const get60sWorld = async () => {
  const date = getFormattedDate();
  const res = await fetch(`https://api.suxun.site/60s/${date}.png`);
    return await res; // 读取文本内容并返回
};

// 获取摸鱼人日历
// http://api.vvhan.com/api/moyu
export const getMoYuCalendar = async () => {
  const res = await fetch("http://api.vvhan.com/api/moyu");
    return await res; // 读取文本内容并返回
};

// 获取历史上的今天
// http://momoda.voin.ink/bg/历史上的今天.php
export const getHistoryToday = async () => {
  const res = await fetch("http://momoda.voin.ink/bg/lishi.php");
      return await res.text(); // 读取文本内容并返回
};

// 获取百度热搜
// http://momoda.voin.ink/bg/百度热搜.php
export const getHotSearch = async () => {
  const res = await fetch("http://momoda.voin.ink/bg/resou.php");
      return await res.text(); // 读取文本内容并返回
};
// 获取网易云热评
// http://momoda.voin.ink/bg/网易云热评.php
export const getWangYiYun = async () => {
  const res = await fetch("http://momoda.voin.ink/bg/网易云热评.php");
      return await res.text(); // 读取文本内容并返回
};
// 获取绿茶
// http://momoda.voin.ink/bg/绿茶.php
export const getLvCha = async () => {
  const res = await fetch("http://momoda.voin.ink/bg/绿茶.php");
      return await res.text(); // 读取文本内容并返回
};

// 获取cos图片
// http://momoda.voin.ink/bg/cos.php
export const getCosPicture = async () => {
  const res = await fetch("http://momoda.voin.ink/bg/cosapi.php");
      return await res.text(); // 读取文本内容并返回
};
// 获取二次元图片
// http://momoda.voin.ink/bg/erciyuan.php
export const getErCiYuanPicture = async () => {
  const res = await fetch("http://momoda.voin.ink/bg/erciyuan.php");
      return await res.text(); // 读取文本内容并返回
};
// 获取ikun表情包
// http://momoda.voin.ink/bg/ikunapi.php
export const getIkunPicture = async () => {
  const res = await fetch("http://momoda.voin.ink/bg/ikunapi.php");
      return await res.text(); // 读取文本内容并返回
};
// 获取i柴郡表情包
// http://api.yujn.cn/api/chaijun.php?content_copy"
export const getChaijunPicture = async () => {
  const res = await fetch("http://api.yujn.cn/api/chaijun.php");
  return res; // 读取内容并返回
};
// 视频区
// 随机小姐姐视频
export const getJKVideo = async () => {
  const res = await fetch("http://momoda.voin.ink/bg/xiaojiejie.php");
  return res; // 读取内容并返回
};
// 随机cos视频
export const getCosVideo = async () => {
  const res = await fetch("http://momoda.voin.ink/bg/cosvideo.php");
  console.log(res,'resres');
  return res; // 读取内容并返回
};
// 随机白丝视频
export const getBaiSiVideo = async () => {
  // 判断环境，开发环境使用代理路径，生产环境使用真实 API 地址
  const apiUrl = process.env.NODE_ENV === 'development'
    ? '/yujn/api/baisis.php'  // 在开发环境中使用相对路径
    : 'http://api.yujn.cn/api/baisis.php?type=video';  // 在生产环境中使用绝对路径
    // const res = await fetch("http://momoda.voin.ink/bg/baisivideo.php");

  const res = await fetch(apiUrl);
  return res;  // 读取内容并返回
};
// 随机B站小姐姐视频
// export const getBVSisterVideo = async () => {
//   const IDArr =['2054530954','3262571154','3289036254','3398398454','3417778254'];
//   const randomId = IDArr[Math.floor(Math.random()*IDArr.length)];
//   const res = await fetch("https://api.bilibili.com/x/v3/fav/resource/list?media_id="+randomId+"&pn=5&ps=5&keyword=&order=mtime&type=0&tid=0&platform=web&jsonp=jsonp",
//     {
//     method: 'GET',
//     credentials: 'include',
//     mode: 'cors',
//   }
//   );
//   console.log(res,'resres');
//   return res.json(); // 读取内容并返回
// };
export const getBVSisterVideo = async () => {
  const res = await fetch("http://momoda.voin.ink/bg/BVcosapi.php");
      return await res.text(); // 读取文本内容并返回
};
// nin视频
export const getBVNinVideo = async () => {
  const res = await fetch("http://momoda.voin.ink/bg/BVnin.php");
      return await res.text(); // 读取文本内容并返回
};