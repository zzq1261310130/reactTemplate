import React from 'react'
import { LogoutOutlined } from '@ant-design/icons'
import { Col, Statistic } from 'antd'
const { Countdown } = Statistic

import './logout.less'

export default function logout(prop) {
  const clickLogout = () => {
    localStorage.setItem('isLogin', 'false')
    localStorage.removeItem('loginExpireTime')
    prop.loginChange('false')
  }
  const deadline = +localStorage.getItem('loginExpireTime')

  return (
    <>
      <div className="deadline">
        <Countdown
          title="连接有效期倒计时"
          value={deadline}
          format="D 天 HH 时 mm 分 ss 秒"
        />
      </div>

      <div className="logout">
        <div className="logoutContain" onClick={clickLogout}>
          <LogoutOutlined className="logoutIcon" />
          <span className="logoutText">退出连接</span>
        </div>
      </div>
    </>
  )
}
