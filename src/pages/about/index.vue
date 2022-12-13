<template>
  <view class="background">
    <title-bar title="关于" />
    <scroll-view
      :scroll-y="true"
      style="flex: 1"
    >
      <view class="flex-column">
        <card>
          <image
            mode="aspectFit"
            :src="require('@/assets/jh-logo.png')"
            style="height: 20vh; width: 70%; display: block; margin: auto"
          />
        </card>
        <card
          title="微精弘2.0"
          class="description-card"
        >
          <view class="description">
            <view
              v-for="item in description"
              :key="item"
              class="description-item"
            >
              <text>| </text>
              <text>{{ item }}</text>
            </view>
          </view>
        </card>
        <card
          v-if="isDevelopment"
          title="测试信息"
        >
          <view>Hash: {{ commitHash.slice(0, 6) }}</view>
          <view>编译时间: {{ buildTime }}</view>
          <view>{{ getCopyRight() }}</view>
        </card>
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts">
import Card from '@/components/Card/index.vue';
import TitleBar from '@/components/TitleBar/index.vue';
import { aboutText } from '@/constants/copywriting';
import { getCopyRight } from '@/utils/effects';
import './index.scss';

export default {
  components: {
    TitleBar,
    Card
  },
  computed: {
    isDevelopment() {
      if (process.env.NODE_ENV === 'development') return true;
      return false;
    },
    commitHash() {
      return process.env.COMMIT_HASH;
    },
    commitTag() {
      return process.env.TAG;
    },
    buildTime() {
      return process.env.BUILD_TIME;
    },
    description() {
      return aboutText.description;
    }
  },
  methods: {
    getCopyRight
  }
};
</script>
