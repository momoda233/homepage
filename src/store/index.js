import { defineStore } from "pinia";

export const mainStore = defineStore("main", {
  state: () => {
    return {
      imgLoadStatus: false, // 壁纸加载状态
      innerWidth: null, // 当前窗口宽度
      coverType: "0", // 壁纸种类
      siteStartShow: false, // 建站日期显示
      musicClick: false, // 音乐链接是否跳转
      musicIsOk: true, // 音乐是否加载完成
      musicVolume: 10, // 音乐音量;
      musicOpenState: true, // 音乐面板开启状态
      backgroundShow: false, // 壁纸展示状态
      boxOpenState: false, // 盒子开启状态
      mobileOpenState: false, // 移动端开启状态
      mobileFuncState: true, // 移动端功能区开启状态
      setOpenState: false, // 设置页面开启状态
      playerState: true, // 当前播放状态
      playerTitle: null, // 当前播放歌曲名
      playerArtist: null, // 当前播放歌手名
      playerCover: null, // 当前播放封面
      playerLrc: "歌词加载中喵", // 当前播放歌词
      playerLrcShow: true, // 是否显示底栏歌词
      footerBlur: false, // 底栏模糊
      playerAutoplay: true, // 是否自动播放
      playerLoop: "all", // 循环播放 "all", "one", "none"
      playerOrder: "list", // 循环顺序 "list", "random"
      rightContent: 'getYangShiNews', // 右边展示内容，默认 人民日报金句
      rightContentShowStatus: true, // 右边展示状态
      detectBrowser:  navigator&&navigator.userAgent.indexOf("Edg")>-1?'Edge':'Chrome', // 检测浏览器
    };
  },
  getters: {
    // 获取歌词
    getPlayerLrc(state) {
      return state.playerLrc;
    },
    // 获取歌曲信息
    getPlayerData(state) {
      return {
        name: state.playerTitle,
        artist: state.playerArtist,
      };
    },
    // 获取页面宽度
    getInnerWidth(state) {
      return state.innerWidth;
    },
    // 获取右边展示内容全部
    getRightContent(state) {
      return state.rightContent;
    },
    // 获取右边展示内容状态
    getRightContentShowStatus(state) {
      return state.rightContentShowStatus;
    },

  },
  actions: {
    // 更改当前页面宽度
    setInnerWidth(value) {
      this.innerWidth = value;
      if (value >= 720) {
        this.mobileOpenState = false;
        this.mobileFuncState = false;
      }
    },
    // 更改播放状态
    setPlayerState(value) {
      if (value) {
        this.playerState = false;
      } else {
        this.playerState = true;
      }
    },
    // 更改歌词
    setPlayerLrc(value) {
      this.playerLrc = value;
    },
    // 更改歌曲数据
    setPlayerData(title, artist, cover) {
      this.playerTitle = title;
      this.playerArtist = artist;
      this.playerCover = cover;
    },
    // 更改壁纸加载状态
    setImgLoadStatus(value) {
      this.imgLoadStatus = value;
    },
    // 更改右边展示内容状态
    setRightContentShowStatus(value) {
      this.rightContentShowStatus = value;
    },
    // 更改右边展示内容
    setRightContent(value) {
      this.rightContent = value;
    },
    setCheckBrowser(state) {
      // 检测浏览器
      const brands = navigator.userAgentData.brands;
      const isEdge = brands.some(b => b.brand === 'Microsoft Edge');
      const isChrome = brands.some(b => b.brand === 'Google Chrome');
      return this.detectBrowser = isEdge ? 'Edge' : isChrome ? 'Chrome' : 'Unknown';
    }
  },
  persist: {
    key: "data",
    storage: window.localStorage,
    paths: [
      "coverType",
      "musicVolume",
      "siteStartShow",
      "musicClick",
      "playerLrcShow",
      "footerBlur",
      "playerAutoplay",
      "playerLoop",
      "playerOrder",
    ],
  },
});
