export function useValidate() {
  const validatePhone = (phone: string): boolean => {
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

  return {
    validatePhone,
  }
}
