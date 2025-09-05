import router from '@/router'

let isLogouting = false
export function logout() {
  if (isLogouting)
    return
  isLogouting = true
  const userStore = useUserStore()
  userStore.$reset()
  uni.clearStorageSync()
  // const loginType = sessionStorage.getItem('loginType')
  sessionStorage.clear()
  localStorage.clear()
  // console.log('是否登录页进来', isLogouting, loginType)

  return setTimeout(() => {
    isLogouting = false
  }, 1000)
}
