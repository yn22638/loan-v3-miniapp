<script setup lang="ts">
const router = useRouter()
async function reFindRecommendList() {
  try {
    const res = await Apis.goods.getTopGoods({
      params: {},
    }).send()
    console.log(res)
  }
  catch (error) {
    console.log(error)
  }
}
onLoad(() => {
  reFindRecommendList()
})
</script>

<template>
  <view class="box-border py-3">
    首页
  </view>
</template>

<route lang="json">{
  "name": "home",
  "layout": "tabbar",
  "style": {
    "transparentTitle": "always",
    "navigationStyle": "custom",
    "enablePullDownRefresh": true
  }
}
</route>
