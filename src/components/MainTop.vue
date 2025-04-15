<template>
  <div id="toper" :class="store.footerBlur ? 'blur' : null">
    <Transition name="fade" mode="out-in">
      <div class="power">
        <!-- 时钟 -->
        <div id="clock">
          <!-- 翻页时钟 -->
          <div :class="store.detectBrowser=='Edge' ? 'date-main-top-edge' : 'date-main-top'">
            <!-- <span style="position: absolute;left: -7vw;" ><img src="https://cdn-jp.imgs.moe/2025/01/09/710EB159-B8A4-4ECC-A904-1A64405EF68D_B9PJ5mW06D.gif"/>&nbsp;</span> -->
            <span>北京时间：&nbsp;</span>
              <span>{{ currentTime.year }}&nbsp;年&nbsp;</span>
              <span>{{ currentTime.month }}&nbsp;月&nbsp;</span>
              <span>{{ currentTime.day }}&nbsp;日&nbsp;</span>
              <span class="sm-hidden">{{ currentTime.weekday }}</span>
            </div>
          <div class="clock" id="pagclock" style="color: rgb(210, 227, 243);">
            <div class="column">
              <div class="num">0</div>
              <div class="num">1</div>
              <div class="num">2</div>
            </div>
            <div class="column" style="color: rgb(186, 214, 238);">
              <div class="num">0</div>
              <div class="num">1</div>
              <div class="num">2</div>
              <div class="num">3</div>
              <div class="num">4</div>
              <div class="num">5</div>
              <div class="num">6</div>
              <div class="num">7</div>
              <div class="num">8</div>
              <div class="num">9</div>
            </div>
            <div class="colon"></div>
            <div class="column" style="color: rgb(182, 215, 235);">
              <div class="num">0</div>
              <div class="num">1</div>
              <div class="num">2</div>
              <div class="num">3</div>
              <div class="num">4</div>
              <div class="num">5</div>
            </div>
            <div class="column" style="color: rgb(139, 192, 223);">
              <div class="num">0</div>
              <div class="num">1</div>
              <div class="num">2</div>
              <div class="num">3</div>
              <div class="num">4</div>
              <div class="num">5</div>
              <div class="num">6</div>
              <div class="num">7</div>
              <div class="num">8</div>
              <div class="num">9</div>
            </div>
            <div class="colon"></div>
            <div class="column" style="color: rgb(208, 200, 226);">
              <div class="num">0</div>
              <div class="num">1</div>
              <div class="num">2</div>
              <div class="num">3</div>
              <div class="num">4</div>
              <div class="num">5</div>
            </div>
            <div class="column" style="color: rgb(177, 158, 204);">
              <div class="num">0</div>
              <div class="num">1</div>
              <div class="num">2</div>
              <div class="num">3</div>
              <div class="num">4</div>
              <div class="num">5</div>
              <div class="num">6</div>
              <div class="num">7</div>
              <div class="num">8</div>
              <div class="num">9</div>
            </div>
          </div>
        </div>
        <span>
        </span>
      </div>
    </Transition>
  </div>
</template>
<script setup>
import { MusicOne } from "@icon-park/vue-next";
import { mainStore } from "@/store";
import config from "@/../package.json";
import { getCurrentTime } from "@/utils/getTime";
import $ from 'jquery';

$(document).ready(function () {
  var sizeA = 29;
  var columnsA = Array.from(document.getElementsByClassName('column'));
  var dA = void 0,
    cA = void 0;
  var classListA = ['visible', 'close', 'far', 'far', 'distant', 'distant'];
  var use24HourClock = true;

  function padClock(p, n) {
    return p + ('0' + n).slice(-2);
  }

  function getClock() {
    dA = new Date();
    return [use24HourClock ? dA.getHours() : dA.getHours() % 12 || 12, dA.getMinutes(), dA.getSeconds()].reduce(padClock, '');
  }

  function getClass(n, i2) {
    return classListA.find(function (class_, classIndex) {
      return Math.abs(n - i2) === classIndex;
    }) || '';
  }

  var loop = setInterval(function () {
    cA = getClock();

    columnsA.forEach(function (ele, i) {
      var n = +cA[i];
      var offset = -n * sizeA;
      ele.style.transform = 'translateY(calc(50vh + ' + offset + 'px - ' + sizeA / 2 + 'px))';
      Array.from(ele.children).forEach(function (ele2, i2) {
        ele2.className = 'num ' + getClass(n, i2);
      });
    });
  }, 200 + Math.E * 10);
})

const store = mainStore();
// 当前时间
const currentTime = ref({});
const timeInterval = ref(null);
// 更新时间
const updateTimeData = () => {
  currentTime.value = getCurrentTime();
};
onMounted(() => {
  updateTimeData();
  timeInterval.value = setInterval(updateTimeData, 1000);
  console.log(store.detectBrowser, '浏览器');

});

onBeforeUnmount(() => {
  clearInterval(timeInterval.value);
});
</script>

<style lang="scss" scoped>
  #toper {
    width: 50%;
    position: absolute;
    top: 0;
    right: 0;
    height: 460px;
    text-align: center;
    z-index: 0;
    font-size: 14px;
    word-break: keep-all;
    white-space: nowrap;
    display: flex;
    justify-content: end;
    @media screen and (max-width: 720px) {
      height: 20%;
    }
  .power {
    animation: fade 0.3s;
    position: relative;
    left: 0px;
    top: 0px;
    width: 40vw;
    height: 100%;
  }

  .lrc {
    padding: 0 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    .lrc-all {
      width: 98%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

      .lrc-text {
        margin: 0 8px;
      }

      .i-icon {
        width: 18px;
        height: 18px;
        display: inherit;
      }
    }
  }

  &.blur {
    // backdrop-filter: blur(10px);
    // background: rgb(0 0 0 / 25%);
    font-size: 16px;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.15s ease-in-out;
  }

  @media (max-width: 720px) {
    font-size: 0.9rem;

    &.blur {
      font-size: 0.9rem;
    }
  }

  @media (max-width: 560px) {
    .cA-hidden {
      display: none;
    }
  }

  @media (max-width: 480px) {
    .hidden {
      display: none;
    }
  }

  /* 数字时钟 */
  .clock {
    margin: auto;
    position: absolute;
    right: 0.5vw;
    bottom: 30.2vw;
    z-index: -999;
    font-family: "Pacifico-Regular";
    @media screen and (max-width: 720px) {
      bottom: 60vw;
    }
  }

  * {
    margin: 0;
    padding: 0;
    // font-family: Helvetica, Tahoma, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei";
  }

  a {
    text-decoration: none;
    // color: #fff;
    font-size: 16px;
  }

  body,
  html {
    height: 100%;
  }

  /* icon通用css */
  /* .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    font-size: 32px;
} */



  .body {
    /* background: url('../image/testBg.jpg') no-repeat fixed;壁纸图片引用 */
    // background-color: white !important;
    background-size: cover !important;
    transition: ease-in-out 1.5s;
  }

  .main {
    margin: auto;
    background-color: rgba(152, 152, 152, 0.0);
    /*背景遮罩*/
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    /* height: 16.2rem; */
    padding: 4rem;
    box-sizing: border-box;
    font-size: 1.56rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
    text-align: right;
    /* text-shadow: black 0.05em 0.05em 0.1em; */
  }

  .LinKing {
    width: 31.25rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    text-align: start;
    position: relative;
    top: 0;
    left: -20px;
  }

  #otherLinKing,
  #hotWeibo,
  #wangyiyun {
    justify-content: start;
    position: absolute;
    top: 60px;
    left: 30px;
  }

  #hotWeibo {
    left: 350px;
  }

  #wangyiyun {
    top: 420px;
    width: 600px;
    color: #A798C6;
    /* color: rgb(208, 200, 226); */
  }

  #senhotWeibo,
  #senwangyiyun {
    justify-content: flex-start;
  }

  #otherLinKing #otherhitokoto,
  #hithotWeibo {
    display: flex;
    justify-content: flex-start;
    line-height: 1.5;
    font-size: 17px;
    position: absolute;
    top: 30px;
    left: 0px;
    width: 300px;
  }

  #hitwangyiyun {
    width: 500px;
    width: 600px;
  }

  #hitokoto,
  #hitwangyiyun {
    line-height: 1.5;
  }

  .hitokoto.right-content {
    line-height: 1.5;
    color: rgb(208, 200, 226)
  }

  .from.right-content {
    color: rgb(177, 158, 204)
  }

  .sentence {
    display: flex;
    justify-content: flex-end;
  }

  #othersentence {
    position: absolute;
    left: 0;
  }



  .BR {
    display: flex;
    justify-content: flex-end;
    align-content: flex-end;
  }

  .from,
  .wangyi {
    margin: 10px;
    display: flex;
    justify-content: flex-end;
  }

  .date {
    position: relative;
    top: 0;
    left: -20px;
    display: flex;
    justify-content: space-between;
    /* line-height:3.5rem; */
  }

  .hour {
    height: 83px;
    font-size: 3rem;
    line-height: 83px;
  }

  .day {
    font-size: 4rem;
    line-height: 4rem;
    display: flex;
    justify-content: space-around;
  }

  .MonYea {
    line-height: 1.5rem;
    display: flex;
    justify-content: space-around;
  }

  .month {
    font-size: 1.2rem;
    line-height: 1.2rem;
    padding-right: 0.3rem;
  }

  .year {
    font-size: 1.2rem;
    line-height: 1.2rem;
  }

  /* 数字时钟 */
  .clock {
    margin: auto;
    position: absolute;
    z-index: -999;
    color: #8A9CC4;
  }

  /* 翻页时钟 */
  body {
    // text-align: center;
    // color: #8A9CC4;
    /* color: rgb(242,179,196); */
    /* color: rgb(208, 200, 226); */
    overflow: hidden;
  }

  .column,
  .colon {
    display: inline-block;
    vertical-align: top;
    font-size: 22px;
    line-height: 29px;
  }

  .column {
    transition: -webkit-transform 300ms;
    transition: transform 300ms;
    transition: transform 300ms, -webkit-transform 300ms;
  }

  .colon {
    transition: -webkit-transform 300ms;
    transition: transform 300ms;
    transition: transform 300ms, -webkit-transform 300ms;
    transform: translateY(calc(0vh - 43px));
  }

  .colon:after {
    content: ':';
  }

  .num {
    transition: opacity 500ms, text-shadow 100ms;
    opacity: 0.025;
  }

  .num.visible {
    opacity: 1.0;
    text-shadow: 1px 1px 1px #000;
  }

  .num.close {
    opacity: 0.35;
  }

  .num.far {
    opacity: 0.15;
  }

  .num.distant {
    opacity: 0.1;
  }

  @media (min-width: 1201px) and  (max-width: 1912px) {
    .date-main-top,.date-main-top-edge{
      position: absolute;
      left: 16vw;
      top: 1.8vw;
      font-size: 20px;
      font-family: "Pacifico-Regular";
    }
    .date-main-top-edge{
      top: 2.2vw;
    }
  }
  @media (min-width: 2552px) {
    .date-main-top,.date-main-top-edge{
      position: absolute;
      left: 22vw;
      top: 0.8vw;
      font-size: 20px;
      font-family: "Pacifico-Regular";
  
    }
    .date-main-top-edge{
      top: 1.15vw;
    }
  }
  @media (max-width: 720px) {
    .date-main-top{
    position: absolute;
    font-family: "Pacifico-Regular";
    font-size: 16px;
    right: 0;
  }
    }
}
</style>
