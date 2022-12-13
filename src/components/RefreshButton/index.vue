<template>
  <w-button
    shape="circle"
    size="large"
    class="refresh-button"
    @tap="refresh"
  >
    <view
      class="iconfont icon-refresh"
      :class="{ 'refresh-running': isRefreshing }"
    />
  </w-button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { WButton } from '../button';
import './index.scss';

export default defineComponent({
  components: {
    WButton
  },
  props: {
    isRefreshing: Boolean
  },
  methods: {
    refresh() {
      this.$emit('refresh');
    }
  }
});
</script>
