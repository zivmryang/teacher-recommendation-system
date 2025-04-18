import { useAuthStore } from '../stores/authStore'

export const initWeComSDK = async () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js'
    script.onload = () => {
      wx.config({
        beta: true,
        debug: false,
        appId: import.meta.env.VITE_WE_COM_CORP_ID,
        timestamp: Date.now(),
        nonceStr: Math.random().toString(36).substring(2, 15),
        signature: '', // Will be set by backend API
        jsApiList: [
          'scanQRCode',
          'getLocation',
          'chooseImage',
          'previewImage',
          'openEnterpriseChat',
          'onMenuShareWechat'
        ]
      })

      wx.ready(() => {
        console.log('WeCom SDK ready')
        resolve()
      })

      wx.error(err => {
        console.error('WeCom SDK error:', err)
        reject(err)
      })
    }
    script.onerror = reject
    document.body.appendChild(script)
  })
}

export const getWeComCode = () => {
  return new Promise((resolve, reject) => {
    wx.invoke('getContext', {}, res => {
      if (res.err_msg === 'getContext:ok') {
        if (res.entry === 'contact') {
          // Handle contact context
          const userId = res.userId
          resolve({ code: null, userId })
        } else {
          // Get auth code
          wx.invoke('getAuthCode', {
            scope: 'snsapi_base'
          }, authRes => {
            if (authRes.err_msg === 'getAuthCode:ok') {
              resolve({ code: authRes.code, userId: null })
            } else {
              reject(new Error('Failed to get auth code'))
            }
          })
        }
      } else {
        reject(new Error('Failed to get context'))
      }
    })
  })
}

export const sendWeComNotification = (userId, message) => {
  return new Promise((resolve, reject) => {
    wx.invoke('sendChatMessage', {
      toUser: userId,
      msgType: 'text',
      content: message
    }, res => {
      if (res.err_msg === 'sendChatMessage:ok') {
        resolve()
      } else {
        reject(new Error('Failed to send message'))
      }
    })
  })
}
