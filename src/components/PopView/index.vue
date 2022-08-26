<template>
  <view
    class="wjh-pop-view"
    :class="[
      {
        'wjh-pop-view-hidden': !show
      },
      positionClass
    ]"
  >
    <view
      v-if="hasMask"
      class="mask"
      :class="{
        'fully-hidden': fullyHidden
      }"
      @tap="close"
      ref="maskRef"
    ></view>
    <view
      class="wjh-pop-view-body"
      :style="
        isNewIPhone() && positionClass === 'bottom' ? 'margin-bottom: 2rem' : ''
      "
    >
      <slot></slot>
    </view>
  </view>
</template>

<script setup lang="ts">
  import { isNewIPhone } from '@/utils/effects';
  import { computed, toRefs, ref } from 'vue';
  import './index.scss';

  const props = defineProps({
    position: {
      type: String,
      default: 'bottom'
    },
    show: {
      type: Boolean,
      default: false
    },
    mask: {
      type: Boolean,
      default: true
    }
  });
  const maskRef = ref();
  const fullyHidden = ref(true);
  const emit = defineEmits(['update:show']);

  const { position, mask } = toRefs(props);

  const positionClass = computed(() => {
    return `wjh-pop-view-${position.value}`;
  });
  const hasMask = computed(() => {
    return mask;
  });

  function close() {
    emit('update:show', false);
  }
</script>
