<template>
  <div class="triangle-button" @click="goBack" title="返回上一页">
    <div class="icon-wrapper" :class="{ 'is-active': isHovered }" @mouseover="isHovered = true" @mouseleave="isHovered = false">
      <span class="icon-line line-1"></span>
      <span class="icon-line line-2"></span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const isHovered = ref(false);
const router = useRouter();

const goBack = () => {
  router.go(-1);
};
</script>

<style scoped>
.triangle-button {
  --triangle-size: 65px;
  --icon-box-size: calc(var(--triangle-size) * 0.4);
  --line-thickness: calc(var(--icon-box-size) * 0.13);
  --line-length: var(--icon-box-size);
  --transition-time: 0.3s;
  --ease-io: cubic-bezier(0.42, 0, 0.58, 1);

  position: fixed;
  top: 0;
  right: 0;
  width: var(--triangle-size);
  height: var(--triangle-size);
  background-color: white;
  clip-path: polygon(100% 0, 100% 100%, 0 0);
  cursor: pointer;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: -2px 2px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease-in-out;

}

.triangle-button:hover {
  background-color: #f5f5f5;
}

.icon-wrapper {
  width: var(--icon-box-size);
  height: var(--icon-box-size);
  position: relative;

  /* ✅ 微调右移位置（从 0.08 → 0.15） */
  transform: translate(calc(var(--triangle-size) * 0.15), calc(var(--triangle-size) * -0.13)) rotate(0deg);
  transition: transform var(--transition-time) var(--ease-io);
}

.icon-wrapper.is-active {
  /* ✅ 悬浮时也要保持相同偏移 */
  transform: translate(calc(var(--triangle-size) * 0.15), calc(var(--triangle-size) * -0.13)) rotate(45deg);
}

.icon-line {
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--line-length);
  height: var(--line-thickness);
  background-color: black;
  border-radius: 999px;
  transform-origin: center;
  transition: transform var(--transition-time) var(--ease-io);
}

/* 初始是 + 号 */
.line-1 {
  transform: translate(-50%, -50%) rotate(0deg);
}
.line-2 {
  transform: translate(-50%, -50%) rotate(90deg);
}

/* 激活后：line-1 保持不变，整体旋转导致视觉形成 X */
</style>
