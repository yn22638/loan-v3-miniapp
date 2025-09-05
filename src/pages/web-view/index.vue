<script setup lang="ts" name="">
const jumpUrl = ref('')
const webviewStyles = {
  width: '100%',
  height: '100%',
}
onLoad((option: any) => {
  console.log(option)
  jumpUrl.value = decodeURIComponent(option.jumpUrl)
})
</script>

<template>
  <view>
    <web-view :webview-styles="webviewStyles" :src="jumpUrl" />
  </view>
</template>

<style lang="scss" scoped></style>

<route lang="json">{
  "name": "web-view",
  "style": {
    "navigationBarTitleText": ""
  }
}
</route>
