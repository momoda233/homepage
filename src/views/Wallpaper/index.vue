<template>
  <div class="wallpaper-box cards">
    <TopRightTriangleButton />
    <ClockOfWallpaper />
    <CalendarGoogle />
    <RandomChengyu />

  </div>
</template>

<script setup>
import { CloseOne, SettingTwo } from "@icon-park/vue-next";
import { mainStore } from "@/store";
import TimeCapsule from "@/components/TimeCapsule.vue";
import MoreContent from "@/components/MoreContent.vue";
import ClockOfWallpaper from "@/components/ClockOfWallpaper.vue";
import TopRightTriangleButton from '@/components/TopRightTriangleButton.vue';
import CalendarGoogle from "@/components/CalendarGoogle.vue";
import RandomChengyu from "@/components/RandomChengyu/index.vue";
const store = mainStore();
const closeShow = ref(false);
</script>

<style lang="scss" scoped>
.wallpaper-box {
  flex: 1 0 0%;
  // margin: 0.5rem;
  height: 100%;
  max-width: 100%;
  position: relative;
  animation: fade 0.5s;
  background-image: url('https://cdn-jp.imgs.moe/2025/05/25/QQ图片20210306231756_waifu2x_3x_3n_jpg_3yhfwdJmJT.png');
  background-attachment:fixed;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 2;
  &:hover {
    transform: scale(1);
  }

  .close,
  .setting {
    position: absolute;
    top: 14px;
    right: 14px;
    width: 28px;
    height: 28px;
    transition:
      transform 0.3s,
      opacity 0.3s;

    &:hover {
      transform: scale(1.2);
    }

    &:active {
      transform: scale(1);
    }
  }

  .setting {
    right: 56px;
  }

  .content {
    display: flex;
    flex-direction: column;
    padding: 30px;
    width: 100%;
    height: 100%;
  }
  @media (min-height: 1080px) {
    .chinese-almanac-dark{
      width: 20%;
      position: absolute;
      bottom: 3.7%;
    }
  }
  @media (min-height: 1440) {
    .chinese-almanac-dark{
      width: 20%;
      position: absolute;
      bottom: 2.7%;
    }
  }
}
</style>
