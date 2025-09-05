import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: (): User =>
    <User>{
      // isLogin: false,
      auth: 0,
      avatar: '',
      mobile: '',
      nickname: '',
    },

  getters: {
    // isLogin(state: User) {
    //   return state.auth === 1
    // },
  },

  actions: {

    // updateLogin(value: boolean) {
    //   this.isLogin = value
    // },
  },
})

export interface User {
  auth: number
  avatar: string
  mobile: string
  nickname: string
  // isLogin: boolean
  [key: string]: any
}
