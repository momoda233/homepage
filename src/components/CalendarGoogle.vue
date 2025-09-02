<template>
  <div class="chinese-almanac-dark"
    @mouseenter="handleAlmanacMouseEnter"
    @mouseleave="handleAlmanacMouseLeave"
  >
    <div class="almanac-container" @mouseover="handleElementHover" @mouseout="handleElementLeave">
      <!-- Left Panel: Date Selection & Calendar -->
      <div class="date-selector-panel">
        <div class="year-month-selector">
          <div class="year-month-controls">
            <button @click="changeYear(-1)" title="上一年" class="nav-button auto-clickable-on-hover"><<</button>
            <button @click="changeMonth(-1)" title="上一月" class="nav-button auto-clickable-on-hover"><</button>
            <span class="current-year-month-display">{{ currentYear }}年 {{ currentMonth }}月</span>
            <button @click="changeMonth(1)" title="下一月" class="nav-button auto-clickable-on-hover">></button>
            <button @click="changeYear(1)" title="下一年" class="nav-button auto-clickable-on-hover">>></button>
          </div>
          <button @click="returnToToday" class="return-today-btn auto-clickable-on-hover">回到今天</button>
        </div>

        <div class="calendar-grid">
          <div class="weekday-header" v-for="day in weekdays" :key="day">{{ day }}</div>
          <div v-for="dayObj in calendarDays" :key="dayObj.id" class="calendar-day" :class="{
              'other-month': !dayObj.isCurrentMonth,
              'is-today': dayObj.isToday,
              'is-selected': dayObj.gregorianDate && dayObj.gregorianDate.getDate() === selectedDay && dayObj.isCurrentMonth,
              'auto-clickable-on-hover': dayObj.isCurrentMonth && dayObj.gregorianDate // Only current month days are auto-clickable
            }" @click="dayObj.isCurrentMonth && dayObj.gregorianDate && selectDate(dayObj.gregorianDate.getDate())">
            <div v-if="dayObj.gregorianDate">
              <div class="gregorian-day">{{ dayObj.gregorianDate.getDate() }}</div>
              <div class="lunar-day-small">
                {{ dayObj.lunarDisplay }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel: Almanac Details (unchanged, content remains the same) -->
      <div class="almanac-details-panel">
        <div v-if="loading" class="loading-text">加载中...</div>
        <div v-else-if="apiError" class="error-text">{{ apiError }}</div>
        <div v-else-if="almanacData">
          <div class="selected-date-display">
            {{ almanacData.gregoriandate }}
          </div>
          <div class="lunar-date-display">
            <!-- 公历 -->
            {{ almanacData.ynian }}年{{ almanacData.yyue }}月{{ almanacData.yri }}日
            {{ almanacData.xingqi }}<span style="color:lightcoral;"> |</span>
            <!-- 农历 -->
            {{ almanacData.lunar }}
            {{ almanacData.shengxiao }}年 {{ almanacData.nyue }}{{ almanacData.nri }}
            <!-- 时辰 -->
            <span style="color:lightcoral;"> |</span> <span  style="color:rgb(155, 55, 55);font-weight: 700;">{{ currentShichenInfo.name }}</span>
            <!-- 节气-->
            <p class="term-info" v-if="almanacData.jieqi">
               {{ almanacData.jieqimsg }}
            </p>
          </div>

          <div class="suit-avoid">
            <div class="suit">
              <span class="label">宜</span>
              <p>{{ almanacData.yi || '无' }}</p>
            </div>
            <div class="avoid">
              <span class="label">忌</span>
              <p>{{ almanacData.ji || '无' }}</p>
            </div>
          </div>

          <div class="holidays-info">
          </div>

          <div class="other-info">
            <div class="other-info-hang">
              <span class="other-info-lie"><strong>星座:</strong> {{ almanacData.xingzuo }}</span>
              <span class="other-info-lie" v-if="almanacData.jieri && almanacData.jieri.length > 0">
              <strong>节日:</strong> {{ almanacData.jieri}}
            </span>
            </div>
            <div class="other-info-hang">
              <span v-if="almanacData.ganzhinian" class="other-info-lie"><strong>天干地支年:</strong> {{ almanacData.ganzhinian }}</span>
              <span v-if="almanacData.ganzhiyue" class="other-info-lie"><strong>天干地支月:</strong> {{ almanacData.ganzhiyue }}</span>
            </div>
            <div class="other-info-hang">
              <span v-if="almanacData.ganzhiri" class="other-info-lie"><strong>天干地支日:</strong> {{ almanacData.ganzhiri }}</span>
              <span v-if="almanacData.xiangchong" class="other-info-lie"><strong>相冲:</strong> {{ almanacData.xiangchong }}</span>
            </div>
          </div>

        </div>
        <div v-else>
          请选择一个日期查看黄历信息。
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed, watch } from 'vue';
import { Lunar } from 'lunar-typescript';

const today = new Date();

// --- Reactive State ---
const currentYear = ref(today.getFullYear());
const currentMonth = ref(today.getMonth() + 1); // 1-12
const selectedDay = ref(today.getDate());

const calendarDays = ref([]);
const almanacData = reactive({});
const loading = ref(false);
const apiError = ref(null);

const weekdays = ['一', '二', '三', '四', '五', '六', '日'];
// 时辰及其对应生肖和时间范围 (24小时制)
// 注意：子时跨越午夜
const shichenData = [
  { name: "子时",  startHour: 23, endHourNextDay: 1 }, // 23:00 - 00:59
  { name: "丑时",  startHour: 1, endHour: 3 },     // 01:00 - 02:59
  { name: "寅时",  startHour: 3, endHour: 5 },     // 03:00 - 04:59
  { name: "卯时",  startHour: 5, endHour: 7 },     // 05:00 - 06:59
  { name: "辰时",  startHour: 7, endHour: 9 },     // 07:00 - 08:59
  { name: "巳时",  startHour: 9, endHour: 11 },    // 09:00 - 10:59
  { name: "午时",  startHour: 11, endHour: 13 },   // 11:00 - 12:59
  { name: "未时",  startHour: 13, endHour: 15 },   // 13:00 - 14:59
  { name: "申时",  startHour: 15, endHour: 17 },   // 15:00 - 16:59
  { name: "酉时",  startHour: 17, endHour: 19 },   // 17:00 - 18:59
  { name: "戌时",  startHour: 19, endHour: 21 },   // 19:00 - 20:59
  { name: "亥时",  startHour: 21, endHour: 23 },   // 21:00 - 22:59
];
const currentTime = ref('');
const currentHour = ref(new Date().getHours());
let shichenTimerId = null; // Renamed from timerId to avoid confusion

// --- New state for hover/leave timers ---
const HOVER_CLICK_DELAY = 10000; // 10 seconds
const ALMANAC_LEAVE_RETURN_TODAY_DELAY = 10000; // 10 seconds

const hoverClickTimeoutId = ref(null);
const almanacLeaveTimeoutId = ref(null);
const isMouseInsideAlmanac = ref(false);

// 更新当前时间和小时
const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour12: false });
  currentHour.value = now.getHours();
};

const currentShichenInfo = computed(() => {
  const hour = currentHour.value;
  
  // 优先处理跨日的子时
   if (hour === 23 || hour === 0) {
    const ziShi = shichenData.find(s => s.name === "子时");
    return { 
      ...ziShi,
       timeRange: "23:00 - 00:59" 
      };
  }

  // 其他时辰
  const shichen = shichenData.find(s =>
    s.startHour !== undefined && // 排除子时在这里的判断
    hour >= s.startHour &&
     hour < s.endHour
  );

  if (shichen) {
    return {
      ...shichen,
      timeRange: `${String(shichen.startHour).padStart(2, '0')}:00 - ${String(shichen.endHour -1).padStart(2, '0')}:59`
    };
  }

  return null; // 理论上不会到这里，因为所有小时都应覆盖
});

// --- Computed Properties ---
const yearOptions = computed(() => {
  const current = new Date().getFullYear();
  const years = [];
  for (let i = current - 70; i <= current + 30; i++) {
    years.push(i);
  }
  return years;
});

const selectedDateString = computed(() => {
  const y = currentYear.value;
  const m = String(currentMonth.value).padStart(2, '0');
  const d = String(selectedDay.value).padStart(2, '0');
  return `${y}-${m}-${d}`;
});
// --- Functions ---
const generateCalendar = () => {
  calendarDays.value = [];
  const year = currentYear.value;
  const month = currentMonth.value - 1; // JS months are 0-indexed

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  let startingDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) - 6 (Sat)
  if (startingDayOfWeek === 0) startingDayOfWeek = 6; // Convert Sunday from 0 to 6 (to match Mon-Sun 0-6)
  else startingDayOfWeek -= 1; // Convert Mon-Sat from 1-6 to 0-5

  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = 0; i < startingDayOfWeek; i++) {
    const day = prevMonthLastDay - startingDayOfWeek + 1 + i;
    calendarDays.value.push({
      id: `prev-${day}`,
      gregorianDate: null,
      isCurrentMonth: false,
      lunarDisplay: ''
    });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dateObj = new Date(year, month, i);
    const lunarInstance = Lunar.fromDate(dateObj);
    let lunarDisplay = lunarInstance.getDayInChinese();

    const festivals = lunarInstance.getFestivals().join(' ') || lunarInstance.getOtherFestivals().join(' ');
    const solarTerm = lunarInstance.getJieQi();

    if (solarTerm) {
      lunarDisplay = solarTerm;
    } else if (festivals) {
      lunarDisplay = festivals.split(' ')[0]; // Show first festival if multiple
    }

    calendarDays.value.push({
      id: `current-${i}`,
      gregorianDate: dateObj,
      isCurrentMonth: true,
      isToday: dateObj.toDateString() === today.toDateString(),
      lunarDisplay: lunarDisplay,
    });
  }

  const totalCells = calendarDays.value.length;
  const remainingCells = (totalCells % 7 === 0) ? 0 : 7 - (totalCells % 7);
  for (let i = 1; i <= remainingCells; i++) {
    calendarDays.value.push({
      id: `next-${i}`,
      gregorianDate: null,
      isCurrentMonth: false,
      lunarDisplay: ''
    });
  }
};

const fetchAlmanacData = async (dateStr) => {
  loading.value = true;
  apiError.value = null;
  Object.keys(almanacData).forEach(key => delete almanacData[key]); // Clear previous data

  const parts = dateStr.split('-');
  const apiNian = parts[0];
  const apiYue = parts[1];
  const apiRi = parts[2];

  const TIANAPI_URL = `http://101.35.2.25/api/time/getzdday.php?id=10004213&key=daa3c2334f98b9d80b4008c40dfa567a&nian=${apiNian}&yue=${apiYue}&ri=${apiRi}`;

  try {
    const response = await fetch(TIANAPI_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data.code === 200) Object.assign(almanacData, data);
    else throw new Error(data.msg || "获取黄历数据失败或数据格式不正确");
  } catch (error) {
    console.error("Error fetching almanac data:", error);
    apiError.value = `加载黄历信息失败: ${error.message}`;
    Object.keys(almanacData).forEach(key => delete almanacData[key]);
  } finally {
    loading.value = false;
  }
};

const selectDate = (day) => {
  selectedDay.value = day;
};

const returnToToday = () => {
  console.log("Returning to today programmatically or by user click");
  const newToday = new Date();
  currentYear.value = newToday.getFullYear();
  currentMonth.value = newToday.getMonth() + 1;
  selectedDay.value = newToday.getDate();
};

const changeYear = (delta) => {
  const newYear = currentYear.value + delta;
  const minYear = yearOptions.value[0];
  const maxYear = yearOptions.value[yearOptions.value.length - 1];
  if (newYear >= minYear && newYear <= maxYear) currentYear.value = newYear;
};

const changeMonth = (delta) => {
  let m = currentMonth.value;
  let y = currentYear.value;
  m += delta;
  if (m < 1) { m = 12; y--; }
  else if (m > 12) { m = 1; y++; }
  const minYear = yearOptions.value[0];
  const maxYear = yearOptions.value[yearOptions.value.length - 1];
  if (y >= minYear && y <= maxYear) {
    currentYear.value = y;
    currentMonth.value = m;
  }
};

// --- New Event Handlers for Hover/Leave ---
const handleElementHover = (event) => {
  const target = event.target.closest('.auto-clickable-on-hover'); // Find closest parent or self with the class
  if (target) {
    // Clear any existing timer to prevent multiple triggers
    if (hoverClickTimeoutId.value) {
      clearTimeout(hoverClickTimeoutId.value);
    }
    hoverClickTimeoutId.value = setTimeout(() => {
      if (target && typeof target.click === 'function') {
        console.log('Auto-clicking element due to hover:', target);
        target.click();
      }
      hoverClickTimeoutId.value = null;
    }, HOVER_CLICK_DELAY);
  }
};

const handleElementLeave = (event) => {
  const target = event.target.closest('.auto-clickable-on-hover');
  if (target && hoverClickTimeoutId.value) {
    clearTimeout(hoverClickTimeoutId.value);
    hoverClickTimeoutId.value = null;
  }
};

const handleAlmanacMouseEnter = () => {
  isMouseInsideAlmanac.value = true;
  if (almanacLeaveTimeoutId.value) {
    clearTimeout(almanacLeaveTimeoutId.value);
    almanacLeaveTimeoutId.value = null;
    console.log("Mouse re-entered almanac, cleared return-to-today timer.");
  }
};

const handleAlmanacMouseLeave = () => {
  isMouseInsideAlmanac.value = false;
  // Clear any existing timer before setting a new one
  if (almanacLeaveTimeoutId.value) {
    clearTimeout(almanacLeaveTimeoutId.value);
  }
  almanacLeaveTimeoutId.value = setTimeout(() => {
    if (!isMouseInsideAlmanac.value) { // Check again in case mouse quickly re-entered and left
      console.log("Mouse left almanac for 5s, returning to today.");
      returnToToday();
    }
    almanacLeaveTimeoutId.value = null;
  }, ALMANAC_LEAVE_RETURN_TODAY_DELAY);
};
// ---

// --- Watchers ---
watch(selectedDateString, (newDateStr) => {
  fetchAlmanacData(newDateStr);
}, { immediate: true });

watch([currentYear, currentMonth], () => {
  const daysInNewMonth = new Date(currentYear.value, currentMonth.value, 0).getDate();
  if (selectedDay.value > daysInNewMonth) selectedDay.value = 1;
  generateCalendar();
}, { deep: true });

// --- Lifecycle Hooks ---
onMounted(() => {
  generateCalendar();
  updateTime();
  shichenTimerId = setInterval(updateTime, 1000);
  // Initial fetch handled by watcher
});

onUnmounted(() => {
  if (shichenTimerId) clearInterval(shichenTimerId);
  // Clear any active timers when component is unmounted
  if (hoverClickTimeoutId.value) clearTimeout(hoverClickTimeoutId.value);
  if (almanacLeaveTimeoutId.value) clearTimeout(almanacLeaveTimeoutId.value);
});

</script>

<style scoped>
/* Styles remain the same, but make sure clickable elements are accessible */
.chinese-almanac-dark {
  background-color: rgba(0, 0, 0, 0.2);
  color: #e0e0e0;
  padding: 20px;
  border-radius: 8px;
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
  display: flex;
  justify-content: center;
  min-height: 600px;
  width: 36%; /* As per original */
  margin-top: 20px;
}

.almanac-container {
  width: 100%;
  max-width: 1000px;
  /* gap: 20px; Removed this as layout is column for panels */
}

.date-selector-panel {
  /* flex: 0 0 45%; */ /* No longer using flex row for panels */
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.almanac-details-panel {
  /* flex: 1; */ /* No longer using flex row for panels */
  background-color: rgba(0, 0, 0, 0.3);
  padding: 10px;
  border-radius: 6px;
  overflow-y: auto;
  max-height: 560px; 
}

.year-month-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px; /* Added margin for better spacing */
}

.year-month-controls {
  display: flex;
  align-items: center;
  gap: 5px;
  /* margin-left: 12px; Removed as parent now centers */
}

.nav-button, .return-today-btn {
  padding: 6px 10px;
  background-color:rgba(0, 0, 0, 0.2);
  color: #e0e0e0;
  border: 1px solid #555;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
}
.nav-button:hover, .return-today-btn:hover {
  background-color: #555;
}

.current-year-month-display {
  padding: 6px 10px;
  font-weight: bold;
  color: #e0e0e0;
  white-space: nowrap;
}

.return-today-btn {
  padding: 8px 12px;
  /* margin-right: 15px; Removed as parent now centers */
}


.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px; /* Slightly reduced gap for a tighter grid */
  text-align: center;
  /* margin-left: 12px; Removed */
}

.weekday-header {
  font-weight: bold;
  padding: 4px 0px; /* Adjusted padding */
  /* margin-right: 12px; Removed as grid handles spacing */
  color: #aaa;
  font-size: 0.85em; /* Slightly smaller */
}

.calendar-day {
  padding: 3px;
  display: flex;
  /* width: 77%; Removed fixed width, let grid handle it */
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #444;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 2px; /* Reduced margin */
  transition: background-color 0.2s;
  font-size: 0.75em;
  min-height: 35px; /* Ensure cells have some min height */
  box-sizing: border-box; /* Important for padding and border */
  aspect-ratio: 1 / 1;
}

.calendar-day:hover:not(.other-month) {
  background-color: #555;
}

.calendar-day.other-month {
  color: #666;
  cursor: default;
  background-color: rgba(0, 0, 0, 0.1); /* Slightly lighter for other month */
}
.calendar-day.other-month .gregorian-day,
.calendar-day.other-month .lunar-day-small {
  opacity: 0.6;
}


.calendar-day.is-today {
  border-color: #00aaff;
}
.calendar-day.is-today .gregorian-day {
    font-weight: bold;
    color: #00aaff;
}


.calendar-day.is-selected {
  background-color: #007acc;
  color: #fff;
  border-color: #005c99;
}

.calendar-day.is-selected .lunar-day-small {
  color: #ddd;
}
.calendar-day.is-selected .gregorian-day {
  color: #fff;
}


.gregorian-day {
  font-size: 1.3em; /* Relative to .calendar-day */
  font-weight: bold;
}

.lunar-day-small {
  font-size: 0.95em; /* Relative to .calendar-day */
  color: #a0a0a0;
  margin-top: 1px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%; /* Allow it to take full width of cell */
  line-height: 1.2;
}

.loading-text,
.error-text {
  text-align: center;
  padding: 20px;
  font-size: 1.1em;
}

.error-text {
  color: #ff6b6b;
}

.selected-date-display {
  font-size: 1.8em;
  font-weight: bold;
  color: #00aaff;
  margin-bottom: 5px;
  text-align: center;
}

.lunar-date-display {
  font-size: 1.1em;
  color: #ccc;
  margin-bottom: 15px;
  text-align: center;
  line-height: 1.5;
}

.term-info {
  font-size: 1em; /* Relative to .lunar-date-display */
  color: #f0ad4e;
  /* margin-top: 10px; Removed, let p handle flow */
  text-align: center;
}

.suit-avoid {
  display: flex;
  gap: 15px;
  margin-bottom: 15px; /* Increased margin */
}

.suit-avoid>div {
  flex: 1;
  padding: 10px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.4);
}

.suit-avoid .label {
  display: inline-block;
  width: 2em;
  height: 2em;
  line-height: 2em;
  border-radius: 50%;
  text-align: center;
  font-weight: bold;
  color: #fff;
  margin-right: 8px;
  float: left; /* Keep float for this specific layout */
}

.suit .label {
  background-color: #d9534f; /* Red for Yi */
}

.avoid .label {
  background-color: #5bc0de; /* Blue for Ji */
}

.suit-avoid p {
  margin: 0;
  padding-left: 2.5em; /* Space for the floated label */
  line-height: 1.6;
  font-size: 0.9em;
  word-break: break-word;
  min-height: 2em; /* Ensure p has at least the height of the label */
}


.holidays-info,
.other-info {
  font-size: 0.95em;
  line-height: 1.7;
}

.holidays-info strong,
.other-info strong {
  color: #99ccff;
}

.other-info-hang{
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px; /* Slightly more margin */
  gap: 15px;
  flex-wrap: wrap; /* Allow wrapping on smaller screens if needed */
}
.other-info-lie{
  flex: 1;
  min-width: 150px; /* Prevent items from becoming too narrow */
  text-align: left;
}
</style>