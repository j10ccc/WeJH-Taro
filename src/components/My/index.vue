<template>
  <title-bar title="我的" :back-button="false"></title-bar>
  <scroll-view :scrollY="true">
    <view class="flex-column">
      <card class="profile-card" v-if="isActive">
        <view class="avatar-wrapper">
          <image
            v-if="userWXProfile"
            class="avatar"
            :src="userWXProfile.avatarUrl"
          ></image>
        </view>
        <view v-if="userWXProfile" class="profile-split"></view>
        <view class="info-wrapper">
          <view>
            <view v-if="userWXProfile" class="name">{{
              userWXProfile.nickName
            }}</view>
            <view v-else class="name" @tap="getUserWXInfo"
              >点击获取头像昵称</view
            >
            <view class="sub-text">微精弘</view>
          </view>
          <view class="sub-text" style="bottom: 0" v-if="userInfo">{{
            userInfo.studentID
          }}</view>
        </view>
      </card>

      <card v-else title="未激活，激活享受更多精彩">
        <w-button block class="active" v-if="!isActive" @tap="nav2activation">
          激活
        </w-button>
      </card>

      <view class="operate" v-if="isActive">
        <w-list
          :key="index"
          v-for="(column, index) in options"
          class="operate-list"
        >
          <w-list-item
            v-for="item in column"
            :key="item.title"
            @tap="nav2url(item.url)"
          >
            <text>{{ item.title }}</text>
          </w-list-item>
        </w-list>
      </view>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import { serviceStore } from '@/store';
import { WList, WListItem, TitleBar, WButton, Card } from '@/components/index';
import Taro from '@tarojs/taro';
import { UserService } from '@/services';
import { computed, onMounted } from 'vue';
import store from '@/store';
import './index.scss';

const options = [
  [
    { title: '绑定', url: '/pages/bind/index' },
    { title: '实验室', url: '/pages/lab/index' }
  ],
  [
    { title: '反馈', url: '/pages/connect/index' },
    { title: '关于', url: '/pages/about/index' }
  ],
  [
    { title: '设置', url: '/pages/setting/index' }
  ]
];

function nav2activation() {
  Taro.navigateTo({
    url: '/pages/activation/index'
  });
}

function nav2url(url: string | undefined) {
  if (url)
    Taro.navigateTo({
      url: url
    });
}

function getUserWXInfo() {
  Taro.getUserProfile({
    desc: '用于获取头像和昵称',
    success: (res: any) => {
      const { avatarUrl, nickName } = res.userInfo;
      store.commit('setUserWXProfile', { avatarUrl, nickName });
    },
    complete: (res) => {
      console.log(res);
    }
  });
}

const userInfo = computed(() => {
  return serviceStore.user.info;
});

const userWXProfile = computed(() => {
  return serviceStore.user.wxProfile;
});

const isActive = computed(() => {
  return serviceStore.user.isActive;
});

onMounted(() => {
  if (serviceStore.user.isActive && !serviceStore.user.info)
    UserService.getUserInfo();
});

</script>
