<template>
  <view class="quick-view">
    <view class="quick-view-header">
      <view class="quick-view-title">
        <view :class="`quick-view-name-icon wjh-icon-${iconName}-fill`" />
        <view class="title-split" />
        <text>{{ title }}</text>
      </view>
      <view
        v-if="help"
        class="quick-view-help-icon iconfont icon-help"
        @tap.stop="handleTapHelp"
      />
    </view>
    <view class="quick-view-body">
      <slot />
    </view>
  </view>
</template>

<script lang="ts">
import './index.scss';
export default {
  props: {
    title: String,
    iconName: String,
    help: Boolean,
    helpContent: String
  },
  data() {
    return {
      isShowHelp: false
    };
  },
  methods: {
    handleTapHelp() {
      this.$emit('handleTapHelp');
    }
  }
};
</script>
