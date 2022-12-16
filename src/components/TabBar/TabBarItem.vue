<template>
    <view
      :class="pageName === 'home' && !showApplist ? 'selected' : 'unselected'"
      class="tab-bar-icon-wrapper"
    >
      <view :class="`iconfont icon-${iconName}`"></view>
      <view class="description">{{ title }}</view>
    </view>
</template>

<script setup lang="ts">
import './index.scss';

const { key, iconName, title } = defineProps<{key: string, iconName: string, title: string}>();

const emit = defineEmits(['onChange', 'update:pageName']);


</script>
