import React, { useRef, useState, useEffect } from 'react'
import { Form, Input, Button, message, Spin } from 'antd'
import axios from 'axios'
import PubSub from 'pubsub-js'
import Logout from './Logout'
import './index.less'

const { Item } = Form

const AccountAuthorize = () => {
  const [isLogin, setLogin] = useState(
    localStorage.getItem('isLogin') || 'false'
  )
  const [spinning, setSpinning] = useState(false)
  const form = useRef()
  useEffect(() => {
    if (localStorage.getItem('isLogin') === 'false') {
      message.warning('请先登录连接！')
    }
    let timer = null

    let token = PubSub.subscribe('isLogin', (_, data) => {
      setLogin(localStorage.getItem('isLogin'))
      const loginExpireTime = localStorage.getItem('loginExpireTime')
      if (loginExpireTime && loginExpireTime - Date.now() > 10 * 60 * 1000) {
        timer = setTimeout(() => {
          localStorage.removeItem('loginExpireTime')
          localStorage.setItem('isLogin', 'false')
          PubSub.publish('isLogin', 'false')
        }, loginExpireTime - Date.now())
      } else {
        localStorage.removeItem('loginExpireTime')
        localStorage.setItem('isLogin', 'false')
        PubSub.publish('isLogin', 'false')
      }
    })
    return () => {
      PubSub.unsubscribe(token)
      clearTimeout(timer)
    }
  }, [])

  const clearForm = () => {
    form.current.resetFields()
  }

  const handleSubmit = (params) => {
    setSpinning(true)
    axios
      .post('/tiOrder/accountAuthorize', {
        ...params,
      })
      .then((res) => {
        if (!res.data.data.Success) {
          message.warning('账号或密码错误！')
        }
        localStorage.setItem('isLogin', String(res.data.data.Success))
        PubSub.publish('isLogin', String(res.data.data.Success))
        if (res.data.data.Success) {
          localStorage.setItem(
            'loginExpireTime',
            Date.now() + 1000 * 3600 * 24 * 7
            // Date.now() + 1000 * 10
          )
        }
      })
      .catch((error) => {
        console.log('error', error)
        message.error('error!!!')
      })
      .finally(() => {
        setSpinning(false)
      })
  }

  return (
    <Spin tip="连接中..." spinning={spinning}>
      <div className="accountAuthorizePage">
        {isLogin === 'true' ? (
          <Logout></Logout>
        ) : (
          <Form
            ref={form}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 8 }}
            onFinish={handleSubmit}>
            <Item label="API Key" name="Key" rules={[{ required: true }]}>
              <Input />
            </Item>
            <Item label="API Secret" name="Secret" rules={[{ required: true }]}>
              <Input.Password />
            </Item>
            <Item
              label="Checkout Profiles ID"
              name="CheckoutId"
              rules={[{ required: true }]}>
              <Input />
            </Item>
            <Item wrapperCol={{ offset: 8 }} className="form-button-area">
              <Button htmlType="submit" type="primary">
                连接并登录
              </Button>
              <Button onClick={clearForm}>重置</Button>
            </Item>
          </Form>
        )}
      </div>
    </Spin>
  )
}

export default AccountAuthorize
