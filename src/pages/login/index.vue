<script setup lang="ts">
import { decrypt } from '@/utils/aes'

const loginInfo = reactive({
  phone: '',
  captCode: '',
  code: '',
  isCheck: false,
})
const sendCodeCount = ref(0)
// const tips = ref('获取验证码')
const chatUrl = ref('')
const codePic = ref('')
const uuid = ref('')
const isCheckProtocol = ref(false)
const countdown = ref(60)
const isCounting = ref(false)
const timer = ref<number | null>(null)

function onGoProtocolClick(type: number) {
  const baseUrl = import.meta.env.VITE_BASE_URL
  if (type === 1) {
    uni.navigateTo({
      url: `/pages/webview/webview?jumpUrl=${baseUrl.fileUrl}file/URP.html`,
    })
  }
  else {
    uni.navigateTo({
      url: `/pages/webview/webview?jumpUrl=${baseUrl.fileUrl}file/privacy.html`,
    })
  }
}

async function reFindChatUrl() {
  console.log('=== 获取聊天地址 ===')
  try {
    const res = await Apis.auth.reFindChatUrl({
      params: {},
    }).send()
    console.log('聊天地址:', res)
    chatUrl.value = res.entry
  }
  catch (error) {
    console.error('获取聊天地址失败:', error)
  }
}

async function reFindFetchCode() {
  try {
    const res = await Apis.sms.sendVerifyCode({
      params: {},
    }).send()
    console.log('data:', res)
    if (res.data.status) {
      const picUrl = `data:image/png;base64,${decrypt(res.data.entry.img)}`
      // let picPath =
      // let picUrl = `data:image/gif;base64,${res.data.entry.img.replace("*", "c")}`;
      codePic.value = picUrl
      uuid.value = res.data.entry.uuid
    }
    else {
      uni.showToast({
        icon: 'none',
        title: res.data.message,
      })
    }
  }
  catch (error) {
    console.error('获取验证码失败:', error)
  }
}

function onCheckProtocolChange() {
}

// 验证手机号格式
function validatePhone(phone: string): boolean {
  const reg = /^1[3-9]\d{9}$/
  if (!phone) {
    uni.showToast({ title: '请输入手机号', icon: 'none' })
    return false
  }
  if (!reg.test(phone)) {
    uni.showToast({ title: '手机号格式不正确', icon: 'none' })
    return false
  }
  return true
}

// 获取验证码
async function getVerifyCode() {
  if (isCounting.value)
    return

  if (!validatePhone(loginInfo.phone))
    return

  try {
    uni.showLoading({ title: '发送中...', mask: true })

    // 调用验证码接口
    const res = await Apis.sms.getVerificationCode({
      params: {
        phone: loginInfo.phone,
        // captCode: loginInfo.captCode, // 如果需要图片验证码
        // uuid: 'your-uuid' // 如果需要
      },
    }).send()

    if (res.code === 200) {
      uni.showToast({ title: '验证码发送成功', icon: 'success' })
      startCountdown()
    }
    else {
      throw new Error(res.message || '验证码发送失败')
    }
  }
  catch (error: any) {
    console.error('获取验证码失败:', error)
    uni.showToast({
      title: error.message || '验证码发送失败',
      icon: 'none',
    })
  }
  finally {
    uni.hideLoading()
  }
}

// 开始倒计时
function startCountdown() {
  isCounting.value = true
  countdown.value = 60

  timer.value = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer.value!)
      isCounting.value = false
      timer.value = null
    }
  }, 1000)
}

// 组件卸载时清除定时器
onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})
onLoad(() => {
  reFindChatUrl()
  reFindFetchCode()
})
function toKefu() {
  if (!chatUrl.value) {
    return false
  }
  window.open(chatUrl.value)
}
</script>

<template>
  <!-- dark:bg-[var(--wot-dark-background)] -->
  <view class="min-h-screen container">
    <view class="contain-wrap">
      <img src="@/static/login/consumption-tip.png" alt="" class="consumption-tip">
      <view class="contain-box">
        <input v-model="loginInfo.phone" type="text" placeholder="请输入手机号" class="phone-input">
        <view class="captCode-box">
          <input v-model="loginInfo.captCode" type="text" placeholder="请输入图片验证码" class="captCode-input">
          <image :src="codePic" class="code-img" @click="reFindFetchCode" />
        </view>
        <view class="code-box">
          <input v-model="loginInfo.code" type="text" placeholder="请输入验证码" class="code-input" :maxlength="6">
          <view class="code-btn" @click="getVerifyCode">
            {{ isCounting ? `${countdown} 秒` : '获取验证码' }}
          </view>
        </view>
        <view v-if="sendCodeCount >= 1" class="no-code-box" @click="toKefu">
          收不到验证码，点这里
        </view>
        <!-- @click="login" -->
        <view class="confirm-btn">
          立即申请
        </view>

        <view class="privacy-wrap">
          <wd-checkbox v-model="isCheckProtocol" checked-color="#eb4b46" @change="onCheckProtocolChange" />
          <view>
            已阅读并同意
            <text @click="onGoProtocolClick(1)">
              《注册协议》
            </text>
            <text @click="onGoProtocolClick(2)">
              《隐私协议》
            </text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  background-image: url('@/static/login/invite-bg.png');
  background-size: cover;
}

.contain-wrap {
  width: 680rpx;
  min-height: 60%;
  background-color: #fff;
  position: absolute;
  bottom: 6%;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 20rpx;
  box-sizing: border-box;

  .consumption-tip {
    position: relative;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 55%;
    padding-bottom: 5%;
  }

  .contain-box {
    padding: 0 32rpx;

    .phone-input {
      width: 100%;
      height: 96rpx;
      background-color: #f4f4f4;
      border: none;
      border-radius: 8rpx;
      padding: 0 30rpx;
      box-sizing: border-box;
    }

    .captCode-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 32rpx;
      background-color: #f4f4f4;
      padding: 16rpx 24rpx;
      border-radius: 8rpx;

      .captCode-input {
        flex: 1;
        height: 64rpx;
        border: none;
        box-sizing: border-box;
      }

      .code-img {
        width: 185rpx;
        height: 64rpx;
      }
    }

    .code-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 32rpx;
      background-color: #f4f4f4;
      padding: 16rpx 24rpx;
      border-radius: 8rpx;
      height: 96rpx;
      box-sizing: border-box;

      .code-input {
        flex: 1;
        height: 64rpx;
        border: none;
      }

      .code-btn {
        color: #eb4b46;
        font-size: 30rpx;
        font-weight: 500;
      }
    }

    .privacy-wrap {
      display: flex;
      align-items: center;
      margin-top: 50rpx;
      font-size: 24rpx;
      color: #666666;

      text {
        color: #de4b00;
      }
    }

    .confirm-btn {
      background: linear-gradient(18deg, #f04142 0%, #f06b41 100%);
      box-shadow: 0px 4px 5px 0px rgba(240, 65, 66, 0.43), -1px 0px 4px 0px rgba(255, 255, 255, 0.74);
      border-radius: 80rpx;
      padding: 20rpx 0;
      text-align: center;
      margin-top: 50rpx;
      font-size: 30rpx;
      color: #fff;
      font-weight: 600;
      font-family: SourceHanSansCN-Regular;
    }

    .no-code-box {
      color: #868686;
      font-size: 20rpx;
      margin-top: 20rpx;
      text-align: right;
    }
  }
}

:deep(.uni-input-wrapper) {
  font-size: 30rpx;
}
</style>

<route lang="json">{
  "name": "login",
  "style": {
    "navigationStyle": "custom"
  }
}
</route>
