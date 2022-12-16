<template>
  <bottom-panel>
    <slot :activeKey="activeKey" @onChange="onChange"></slot>
  </bottom-panel>
</template>

<script setup lang="ts">
import BottomPanel from '@/components/BottomPanel/index.vue';
import { serviceStore } from '@/store';
import Taro from '@tarojs/taro';
import './index.scss';
import { computed } from 'vue';

const emit = defineEmits(['update:showApplist', 'update:pageName']);
// const { pageName = 'home', showApplist = false } = defineProps<{ pageName: string; showApplist: boolean}>();
const { activeKey, onChange } = defineProps<{
  activeKey: string;
  onChange: (key: string) => void;
}>();

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
