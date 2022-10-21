import React, { useRef, useState, useEffect } from 'react'
import { Form, Input, Button, message, Spin } from 'antd'
import { useNavigate, useLocation, useParams, Outlet } from 'react-router-dom'

import axios from 'axios'
import Logout from './Logout'
import './index.less'
// import { useAuthContext } from '../../context/useAuth'

const { Item } = Form

const AccountAuthorize = () => {
  const [isLogin, setLogin] = useState(
    localStorage.getItem('isLogin') || 'false'
  )
  const [timer, setTimer] = useState(null)
  const [spinning, setSpinning] = useState(false)
  const form = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLogin === 'false') {
      message.warning('请先登录连接！')
    } else {
      loginChange('true')
    }

    return () => {}
  }, [])

  const clearForm = () => {
    form.current.resetFields()
  }
  const loginChange = (status) => {
    if (status === 'true') {
      setLogin('true')
      const loginExpireTime = localStorage.getItem('loginExpireTime')
      if (loginExpireTime && loginExpireTime - Date.now() > 10 * 60 * 1000) {
        const timerTmp = setTimeout(() => {
          setLogin('false')
          localStorage.removeItem('loginExpireTime')
          localStorage.setItem('isLogin', 'false')
          if (window.location.pathname !== '/accountAuthorize') {
            navigate('/accountAuthorize')
          }
        }, loginExpireTime - Date.now())
        clearTimeout(timer)
        setTimer(timerTmp)
      } else {
        setLogin('false')
        localStorage.removeItem('loginExpireTime')
        localStorage.setItem('isLogin', 'false')
        clearTimeout(timer)
        if (window.location.pathname !== '/accountAuthorize') {
          navigate('/accountAuthorize')
        }
      }
    } else {
      clearTimeout(timer)
      setLogin('false')
    }
  }
  const handleSubmit = (params) => {
    setSpinning(true)
    axios
      .post('/tiOrder/accountAuthorize', {
        ...params,
      })
      .then((res) => {
        if (res.data.data.Success) {
          localStorage.setItem('isLogin', 'true')
          localStorage.setItem('loginExpireTime', Date.now() + 1000 * 3600 * 24)
          loginChange('true')
        } else {
          throw new Error('账号或密码错误！')
        }
      })
      .catch((error) => {
        console.log('error', error)
        message.error(error.message)
      })
      .finally(() => {
        setSpinning(false)
      })
  }

  return (
    <Spin tip="连接中..." spinning={spinning}>
      <div className="accountAuthorizePage">
        {isLogin === 'true' ? (
          <Logout loginChange={loginChange}></Logout>
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
