<template>
  <quick-view
    @tap="nav2Lesson"
    title="课程表"
    icon-name="lessonstable"
    class="lessons-table-quick-view"
    help
    @handle-tap-help="handleTapHelp"
  >
    <text class="sub-text">今日课表 ({{ updateTimeString }})</text>
    <card
      v-for="(item, index) in todayLessonTable"
      :key="item.lessonName"
      :style="{
        backgroundColor: index % 2
          ? 'var(--wjh-color-yellow-light)'
          : 'var(--wjh-color-orange-light)'
      } as CSSProperties
      "
    >
      <view class="lesson-item">
        <view class="important-line">
          <text class="lesson-place">{{ item.lessonPlace }}</text>
          <text
            v-if="lessonState(item.sections) === 'before'"
            class="before-lesson"
          >
            还有 {{ getTimeString(item.detTime) }} 上课
          </text>
          <text
            v-if="lessonState(item.sections) === 'taking'"
            class="taking-lesson"
          >
            上课中
          </text>
        </view>
        <text class="teacher">
          <text class="iconfont icon-teacher"></text>
          <text class="teacher-name">
            {{ ` ${item.teacherName}` }}
          </text>
          <text class="duration">
            ({{ sectionsTimeString(item.sections) }})
          </text>
        </text>
        <text class="lesson-name">{{ item.lessonName }}</text>
      </view>
    </card>
    <view class="default-content" v-if="todayLessonTable?.length === 0">
      今天居然没有课😄
    </view>
    <view class="default-content" v-if="!todayLessonTable">
      点击获取你的课表 ～</view
    >
  </quick-view>
</template>

<script setup lang="ts">
import Card from '@/components/Card/index.vue';
import QuickView from '@/components/QuickView/index.vue';
import Taro from '@tarojs/taro';
import { ZFService } from '@/services';
import dayjs from 'dayjs';
import { CSSProperties, computed, ref, onMounted } from 'vue';
import { serviceStore, systemStore } from '@/store';
import './index.scss';
import { Lesson } from '@/types/Lesson';
import { dayScheduleStartTime } from '@/constants/dayScheduleStartTime';
import { useTimeInstance } from '@/utils/hooks';
let timer: NodeJS.Timeout | undefined = undefined;
// let timer:

const { hide } = defineProps<{hide: boolean }>();
const todayLessonTable = ref();

onMounted(() => {
  getTodayLessonTable()
});

const updateTimeString = computed(() => {
  if (!updateTime.value) return '更新失败';
  return dayjs(updateTime.value).fromNow();
})

const updateTime = computed(() => {
  let updateTime: Date | undefined = undefined;
  try {
    updateTime =
        serviceStore.zf.lessonsTableInfo[systemStore.generalInfo.termYear][
          systemStore.generalInfo.term
        ]?.updateTime;
    if (updateTime) return updateTime;
    else return undefined;
  } catch (e) {
    console.log(e);
    return undefined;
  }
});
watchEffect
  watch: {
    hide: {
      immediate: true,
      handler(val) {
        if (val == true) {
          if (timer) clearInterval(timer);
        } else {
          if (!serviceStore.zf.lessonsTableInfo)
            ZFService.updateLessonTable();
          this.getTodayLessonTable();
          timer = setInterval(this.getTodayLessonTable, 30000);
          // 30 秒刷新一次
        }
      }
    }
  }
    function nav2Lesson() {
      Taro.navigateTo({ url: '/pages/lessonstable/index' });
    }
    function sectionsTimeString(sections: string) {
      let arr = sections.split('-');
      return `${this.getLessonTimeInstance(parseInt(arr[0])).format(
        'HH:mm'
      )}-${this.getLessonTimeInstance(parseInt(arr[1]), 45).format('HH:mm')}`;
    }
    function getLessonTimeInstance(jc: number, offset: number = 0) {
      return useTimeInstance(
        dayScheduleStartTime[jc - 1].hour,
        dayScheduleStartTime[jc - 1].min + offset
      );
    }
    function goLessonAlert(sections: string) {
      let arr = sections.split('-');
      let detAfter =
          this.getLessonTimeInstance(arr[0]).valueOf() - dayjs().valueOf();
      if (detAfter > 0) return dayjs(detAfter).utc().format('HH:mm');
      else return null;
    }
    function goLessonAlertEm(sections: string) {
      // comment: detMin 暂时用不到，后期改动距离上课时间显示规则再重用
      let arr = sections.split('-');
      let detMin = this.getLessonTimeInstance(arr[0]).diff(
        dayjs(),
        'minute',
        true
      );
      return detMin;
    }
    function getTodayLessonTable() {
      let table = ZFService.getTodayLessonTable();
      table?.forEach((item) => {
        item['detMin'] = this.goLessonAlertEm(item.sections);
        item['detTime'] = this.goLessonAlert(item.sections);
      });
      todayLessonTable.value = table;
    }
    function getTimeString(time: string) {
      const hour = parseInt(time.split(':')[0]);
      const min = parseInt(time.split(':')[1]);
      return `${hour ? hour + '小时' : ''}${min ? min + '分钟' : ''}`;
    }
    function lessonState(sections: string): 'before' | 'taking' | 'after' {
      let arr = sections.split('-');
      let detAfter =
          this.getLessonTimeInstance(arr[0]).valueOf() - dayjs().valueOf();
      let detBefore =
          this.getLessonTimeInstance(arr[1], 45).valueOf() - dayjs().valueOf();

      if (detAfter > 0) return 'before';
      if (detAfter < 0 && detBefore > 0) return 'taking';
      return 'after';
    }
    function handleTapHelp() {
      this.$emit('showHelp', 'lessons-table');
    }
</script>
