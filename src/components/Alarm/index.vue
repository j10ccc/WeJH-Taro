<template>
  <view class="wjh-alarm">
    <view class="wjh-alarm-icon iconfont icon-alarm " />
    <view
      v-if="counter && counter > 0"
      class="wjh-alarm-counter-background">
      {{ counter }}
    </view>
  </view>
</template>

<script setup lang="ts">
import './index.scss';

const { counter } = defineProps<{counter: number}>();

</script>
