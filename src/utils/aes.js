import CryptoJS from 'crypto-js'

const Config = {
  AES_KEY: 'op0f91mrsrr5okrp',
  AES_IV: 'vectorivijnfheml',
}
export function decrypt(text) {
  const aesKey = CryptoJS.enc.Utf8.parse(Config.AES_KEY)
  const iv = CryptoJS.enc.Utf8.parse(Config.AES_IV)
  const decryptedBytes = CryptoJS.AES.decrypt(text, aesKey, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  const decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8)
  return decryptedMessage
}
