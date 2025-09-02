<template>
  <div>
    <div v-if="loading">正在加载数据...</div>
    <div v-if="error" style="color: red;">{{ error }}</div>

    <div v-if="!loading && !error && currentDisplay"
         class="display-entry">
      {{ currentDisplay }}
    </div>

    <div v-if="!loading && !error && !currentDisplay && allEntries.length === 0 && initialLoadDone">
      Excel文件中没有有效数据（至少需要两列，且有内容）。
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'; // 引入 onUnmounted
import * as XLSX from 'xlsx';

const allEntries = ref([]);
const currentDisplay = ref('');
const loading = ref(true);
const error = ref(null);
const initialLoadDone = ref(false); // 标记初始加载是否完成

let refreshTimer = null; // 用于存储 setInterval 返回的 ID

// 显示一个随机词条
function showRandomEntry() {
  if (allEntries.value.length === 0) {
    currentDisplay.value = '';
    return;
  }
  const randomIndex = Math.floor(Math.random() * allEntries.value.length);
  currentDisplay.value = allEntries.value[randomIndex];
  console.log("词条已刷新:", new Date().toLocaleTimeString()); // 方便调试
}

// 启动自动刷新
function startAutoRefresh() {
  // 先清除可能存在的旧定时器
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }
  // 仅当有条目时才启动定时器
  if (allEntries.value.length > 0) {
    refreshTimer = setInterval(() => {
      showRandomEntry();
    }, 15000);
  }
}

async function loadExcelData() {
  loading.value = true;
  error.value = null;
  initialLoadDone.value = false;
  allEntries.value = [];
  currentDisplay.value = '';

  try {
    const filePath = '/成语词语.xlsx';
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(`无法加载文件: ${response.statusText} (状态码: ${response.status})。请确保文件 '${filePath}' 存在于 public 目录下并且路径正确。`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });

    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      throw new Error('Excel文件中没有找到工作表。');
    }
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (jsonData && jsonData.length > 0) {
      const processedEntries = [];
      jsonData.forEach(row => {
        if (Array.isArray(row) && row.length >= 2 &&
            row[0] !== null && row[0] !== undefined && String(row[0]).trim() !== '' &&
            row[1] !== null && row[1] !== undefined && String(row[1]).trim() !== '') {
          processedEntries.push(`${String(row[0])}: ${String(row[1])}`);
        }
      });
      allEntries.value = processedEntries;

      if (allEntries.value.length > 0) {
        showRandomEntry(); // 立即显示第一个随机词条
        startAutoRefresh(); // 开始自动刷新
      } else {
        console.warn("Excel文件已读取，但未找到符合条件的数据行。");
      }
    } else {
      console.warn("Excel文件为空或无法解析内容。");
    }

  } catch (err) {
    console.error("读取Excel文件失败:", err);
    error.value = `读取Excel文件失败: ${err.message}`;
  } finally {
    loading.value = false;
    initialLoadDone.value = true; // 标记初始加载完成
  }
}

onMounted(() => {
  loadExcelData();
});

// 组件卸载时清除定时器
onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null; // 重置
    console.log("自动刷新定时器已清除。");
  }
});
</script>

<style scoped>
.display-entry {
  position: absolute;
  bottom: 0%;
  padding: 15px;
  /* border: 1px solid #ccc; */
  border-radius: 5px;
  font-size: 1.2em;
  text-align: center;
  margin-top: 20px;
}

div[v-if="loading"], div[v-if="error"] {
  margin-top: 20px;
  padding: 10px;
  text-align: center;
}
</style>