<script setup lang="ts" name="category">
onMounted(() => {
  console.log('category页面已挂载')
})
</script>

<template>
  <view>
    <view class="flex-shrink-0">
      分类
    </view>
    <view class="overflow-auto bg-red">
      <view v-for="(item, index) in 17" :key="index" class="p-24px">
        {{ item }}
      </view>
    </view>
    <!-- <scroll-view scroll-y="true" class="h-0 flex-1 bg-red">
      <view v-for="(item, index) in 20" :key="index" class="p-24px">
        {{ item}}
      </view>
    </scroll-view> -->
  </view>
</template>

<style lang="scss" scoped>

</style>

<route lang="json">
{
  "name": "category",
  "layout": "tabbar",
  "style": {
    "transparentTitle": "always",
    "navigationStyle": "custom"
  }
}
</route>
