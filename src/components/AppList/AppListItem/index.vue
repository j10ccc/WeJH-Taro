<template>
  <view
    class="applist-item"
    @tap="appTaped"
  >
    <view
      class="applist-bg"
      :style="backgroundColor"
    >
      <image
        class="applist-item-icon"
        :src="require('@/assets/icons/applist/' + iconUrl)"
      />
    </view>
    <text
      class="label"
      data-test="label"
    >
      {{ label }}
    </text>
  </view>
</template>

<script setup lang="ts">
import { serviceStore } from '@/store';
import Taro from '@tarojs/taro';
import { computed, ref } from 'vue';
import './index.scss';

const { require, bg = 'green', label, url } = defineProps<{
  label: string,
  iconUrl: string,
  url: string,
  bg: string,
  require: string,
}>();

let isDisabled = ref(false);
if (require === 'zf' && !serviceStore.user.isBindZF)
  isDisabled.value = true;
if (require === 'card' && !serviceStore.user.isBindCard)
  isDisabled.value = true;
if (require === 'library' && !serviceStore.user.isBindLibrary)
  isDisabled.value = true;

async function appTaped() {
  if (isDisabled.value) {
    await Taro.navigateTo({ url: '/pages/bind/index' });
    Taro.showToast({
      icon: 'none',
      title: '请绑定相关账号'
    });
  } else if (url) await Taro.navigateTo({ url: url });
}

const backgroundColor = computed(() => {
  if (isDisabled.value)
    return { backgroundColor: 'var(--wjh-color-light)' };
  else return { backgroundColor: `var(--wjh-color-${bg})` };
});

</script>
