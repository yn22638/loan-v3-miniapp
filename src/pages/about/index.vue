<script setup lang="ts">

</script>

<template>
  <view class="min-h-screen py-3 dark:bg-[var(--wot-dark-background)]">
    <view class="text-primary">
      wwwww 我的
    </view>
    <wd-icon name="arrow-right" size="22px" />
    <div class="i-carbon-boot-volume text-origin-400" />
    <div class="i-carbon-logo-angular text-8xl" />
    <div class="i-carbon-sun dark:i-carbon-moon" />
    <div
      class="i-carbon-information hover:i-carbon-information-filled"
    />
  </view>
</template>

<route lang="json">
{
  "name": "about",
  "layout": "tabbar",
  "style": {
    "navigationBarTitleText": ""

  }
}
</route>
