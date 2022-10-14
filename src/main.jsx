import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import Routes from '@/router/router'

import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'

import './main.less'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <Router>
    {/* <Routes> */}
    <ConfigProvider locale={zhCN}>
      <Routes></Routes>
    </ConfigProvider>
    {/* </Routes> */}
  </Router>
  // </React.StrictMode>
)
