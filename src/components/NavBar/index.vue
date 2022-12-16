<template>
  <bottom-panel>
    <view
      :class="pageName === 'home' && !showApplist ? 'selected' : 'unselected'"
      class="nav-bar-icon-wrapper"
      @tap="nav('home')"
    >
      <view class="iconfont icon-home"></view>
      <view class="description">首页</view>
    </view>
    <view
      :class="showApplist ? 'selected' : 'unselected'"
      class="nav-bar-icon-wrapper"
      @tap="plusClick"
    >
      <view class="iconfont icon-applist"></view>
      <view class="description">功能</view>
    </view>
    <view
      :class="pageName === 'my' && !showApplist ? 'selected' : 'unselected'"
      class="nav-bar-icon-wrapper"
      @tap="nav('my')"
    >
      <view class="iconfont icon-user"></view>
      <view class="description">我的</view>
    </view>
  </bottom-panel>
</template>

<script setup lang="ts">
import BottomPanel from '@/components/BottomPanel/index.vue';
import { serviceStore } from '@/store';
import Taro from '@tarojs/taro';
import './index.scss';
import { computed } from 'vue';

const emit = defineEmits(['update:showApplist', 'update:pageName']);
const { pageName = 'home', showApplist = false } = defineProps<{ pageName: string; showApplist: boolean}>();

const nav = (val: string) => {
  emit('update:showApplist', false);
  emit('update:pageName', val);
};

const plusClick = () => {
  if (!serviceStore.user.isActive) {
    Taro.showToast({
      icon: 'none',
      title: '激活账号以使用功能'
    });
    return;
  }
  emit('update:showApplist', !showApplist);
};

/**
 * 用户是否激活
 */
const isActive = computed(() => {
  return serviceStore.user.isActive;
});

</script>
