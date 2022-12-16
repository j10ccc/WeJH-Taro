<template>
  <view class="background">
    <home v-if="pageName === 'home'" />
    <my v-if="pageName === 'my'" />
    <pop-view v-model:show="showApplist">
      <app-list v-if="showApplist" />
    </pop-view>
    <nav-bar
      v-model:page-name="pageName"
      v-model:show-applist="showApplist"
    />
  </view>
  <w-modal
    v-model:show="showUpdateInfo"
    :title="updateInfo.title"
    :content="updateInfo.content"
  />
</template>

<script setup lang="ts">
import { AppList, NavBar, PopView, Home, My } from '@/components/index';
import Taro from '@tarojs/taro';
import { WModal } from '@/components/modal';
import { ref } from 'vue';
import store, { systemStore } from '@/store';
import { updateInfo } from '@/constants/index';
import './index.scss';

const showApplist = ref(false);
const pageName = ref('home');
const showUpdateInfo = ref(false);

const updateManager = Taro.getUpdateManager();

updateManager.onUpdateReady(function () {
  Taro.showModal({
    title: '微精弘更新提示',
    content: '新版本已经准备好，是否重启应用？',
    success: function (res) {
      if (res.confirm) {
        updateManager.applyUpdate();
      }
    }
  });
});

/**
 * 检查本地版本变量
 *
 * 要和小程序的平台版本区分开
 */
const checkoutUpdate = () => {
  const newVersion = updateInfo.version;
  if (newVersion && systemStore.version !== newVersion) {
    store.commit('setVersion', newVersion);
    showUpdateInfo.value = true;
  }
};
checkoutUpdate();

</script>
