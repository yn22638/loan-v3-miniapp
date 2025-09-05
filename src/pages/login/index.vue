<script setup lang="ts">
import { decrypt } from '@/utils/aes'
import { useUserStore } from '@/store/user'

const router = useRouter()
const validate = useValidate()
const userStore = useUserStore()
const globalToast = useGlobalToast()
const loginInfo = reactive({
  phone: '',
  captCode: '',
  verificationCode: '',
})
const sendCodeCount = ref(0)
const chatUrl = ref('')
const codePic = ref('')
const uuid = ref('')
const isCheckProtocol = ref(false)
const countdown = ref(60)
const isCounting = ref(false)
const timer = ref<number | null>(null)

function onGoProtocolClick(type: number) {
  const baseUrl = import.meta.env.VITE_FILE_URL
  if (type === 1) {
    router.push({
      name: 'web-view',
      params: {
        jumpUrl: `${baseUrl}/file/URP.html`,
      },
    })
  }
  else {
    router.push({
      name: 'web-view',
      params: {
        jumpUrl: `${baseUrl}/file/privacy.html`,
      },
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
    uni.setStorageSync('chatUrl', res.entry)
  }
  catch (error) {
    console.error('获取聊天地址失败:', error)
  }
}

async function reFindFetchCode() {
  try {
    const res = await Apis.sms.sendVerifyCode({
      headers: {
        // 该请求特定的身份认证信息
      },
      params: {},
    }).send()
    console.log('data:', res)
    if (res.status) {
      const picUrl = `data:image/png;base64,${decrypt(res.entry.img)}`
      codePic.value = picUrl
      uuid.value = res.entry.uuid
    }
    else {
      uni.showToast({
        icon: 'none',
        title: res.message,
      })
    }
  }
  catch (error) {
    console.error('获取验证码失败:', error)
  }
}

async function onLoginClick() {
  const recommenderId = uni.getStorageSync('recommenderId')
  if (!isCheckProtocol.value) {
    globalToast.warning({ msg: '请先阅读协议', duration: 500 })
    return
  }
  try {
    const res = await Apis.app.appLogin({
      headers: {
        // 该请求特定的身份认证信息
      },
      data: {
        recommenderId,
        loginType: 2,
        ...loginInfo,
      },
    }).send()
    console.log('data:', res)
    // "entry": {
    //         "token": "9a9e759252d94733afcb0b15227971db",
    //         "mobile": "18932552007",
    //         "nickname": "18932552007",
    //         "avatar": "",
    //         "auth": 0
    //     }
    // if (res.status) {
    uni.setStorageSync('token', res.entry.token)
    // uni.setStorageSync('userInfo', res.entry)
    /**
     * 重置store（防止重新登录之前信息还存在）
     */
    userStore.$reset()
    userStore.$patch(res.entry)
    // uni.setStorageSync('login', true)
    // if (res.entry.auth === 0) {
    //   uni.setStorageSync('realname', false)
    // }
    // else {
    //   uni.setStorageSync('realname', true)
    // }
    globalToast.success({ msg: '申请成功' })
    uni.reLaunch({
      url: '/pages/index/index',
    })
  }
  catch (error) {
    console.error('登录失败-', error)
  }
}

function onCheckProtocolChange() {
}

// 获取验证码
async function getVerifyCode() {
  if (isCounting.value)
    return

  if (!validate.validatePhone(loginInfo.phone))
    return

  try {
    uni.showLoading({ title: '发送中...', mask: true })
    // 调用验证码接口
    const res = await Apis.sms.getVerificationCode({
      params: {
        phone: loginInfo.phone,
        captCode: loginInfo.captCode, // 如果需要图片验证码
        uuid: uuid.value, // 如果需要
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
  <view class="position-relative min-h-screen container">
    <view
      class="contain-wrap position-absolute bottom-6% left-50% box-border min-h-[60%] rounded-20rpx bg-white -translate-x-1/2"
    >
      <img
        src="@/static/login/consumption-tip.png" alt=""
        class="position-relative left-50% top-0 w-55% pb-5% -translate-x-1/2"
      >
      <view class="px-32rpx">
        <input
          v-model="loginInfo.phone" type="text" placeholder="请输入手机号"
          class="box-border h-96rpx w-full rounded-8rpx border-none bg-#f4f4f4 px-30rpx"
        >
        <view class="mt-32rpx flex items-center justify-between rounded-8rpx bg-#f4f4f4 px-24rpx py-16rpx">
          <input
            v-model="loginInfo.captCode" type="text" placeholder="请输入图片验证码"
            class="box-border h-64rpx flex-1 border-none"
          >
          <image :src="codePic" class="h-64rpx w-185rpx" @click="reFindFetchCode" />
        </view>
        <view
          class="code-box mt-32rpx box-border h-96rpx flex items-center justify-between rounded-8rpx bg-#f4f4f4 px-24rpx py-16rpx"
        >
          <input
            v-model="loginInfo.verificationCode" type="text" placeholder="请输入验证码"
            class="h-64rpx flex-1 border-none" :maxlength="6"
          >
          <view class="text-30rpx text-#eb4b46 font-500" @click="getVerifyCode">
            {{ isCounting ? `${countdown} 秒` : '获取验证码' }}
          </view>
        </view>
        <view v-if="sendCodeCount >= 1" class="mt-20rpx text-right text-20rpx text-#666" @click="toKefu">
          收不到验证码，点这里
        </view>
        <view class="confirm-btn" @click="onLoginClick">
          立即申请
        </view>

        <view class="privacy-wrap mt-50rpx flex items-center text-24rpx text-#666">
          <wd-checkbox v-model="isCheckProtocol" checked-color="#eb4b46" @change="onCheckProtocolChange" />
          <view>
            已阅读并同意
            <text class="text-#eb4b46" @click="onGoProtocolClick(1)">
              《注册协议》
            </text>
            <text class="text-#eb4b46" @click="onGoProtocolClick(2)">
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

:deep(.uni-input-wrapper) {
  font-size: 30rpx;
}
</style>

<route lang="json">
{
  "name": "login",
  "style": {
    "navigationStyle": "custom"
  }
}
</route>
