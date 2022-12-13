<template>
  <view class="background">
    <title-bar title="设置" />
    <scroll-view
      :scroll-y="true"
      style="flex: 1"
    >
      <view
        class="flex-column"
        :style="isEmpty ? 'justify-content: space-between' : undefined"
      >
        <card class="setting-card">
          <view
            v-if="isEmpty"
            class="empty"
          >
            {{ emptyText }}
          </view>
          <template #footer>
            <view class="footer-text">
              {{ getCopyRight() }}
            </view>
          </template>
        </card>
      </view>
    </scroll-view>
    <image
      v-if="isEmpty"
      src="@/assets/photos/setting.svg"
      style="margin: 0 auto"
    />
  </view>
</template>

<script lang="ts">
import Card from '@/components/Card/index.vue';
import TitleBar from '@/components/TitleBar/index.vue';
import { settingText } from '@/constants/copywriting';
import { getCopyRight } from '@/utils/effects';
import { defineComponent } from 'vue';
import './index.scss';

export default defineComponent({
  components: {
    TitleBar,
    Card
  },
  data() {
    return {
      isEmpty: true
    };
  },
  computed: {
    emptyText() {
      return settingText.empty;
    }
  },
  methods: {
    getCopyRight
  }
});
</script>
