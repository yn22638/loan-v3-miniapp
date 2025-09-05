export function useUtils() {
  const globalToast = useGlobalToast()
  const copyCommand = (command: string) => {
    uni.setClipboardData({
      data: command,
      showToast: false,
      success: () => {
        uni.hideToast()
        globalToast.success({
          msg: `${command}已成功复制到剪贴板`,
        })
      },
    })
  }

  return {
    copyCommand,
  }
}
