import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, useParams, Outlet } from 'react-router-dom'
import { Layout, Menu, Card, message } from 'antd'
import {
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MailOutlined,
  BarsOutlined,
  SearchOutlined,
} from '@ant-design/icons'
// import AuthProvider from '../../context/useAuth'

import './index.less'

import LogoSvg from '@/assets/logo.svg'

const { Header, Sider, Content, Footer } = Layout

const collapsedWidth = 60

const SiderTitle = `TI-Order`

/**
 * key 就是页面路由
 */
const SideMenuItem = [
  {
    key: 'accountAuthorize',
    icon: <HomeOutlined />,
    label: `账户授权`,
  },
  {
    key: 'productSearch',
    icon: <SearchOutlined />,
    label: '商品检索',
  },
  {
    key: 'order',
    icon: <BarsOutlined />,
    label: '订单操作',
    children: [
      {
        key: 'orderCreate',
        label: '创建订单',
      },
      {
        key: 'orderList',
        label: '管理订单',
      },
    ],
  },
]

const getMenuKeyTitleObj = (menu, prefix) => {
  let obj = {}
  menu.forEach((item) => {
    obj[item.key] = (prefix && `${prefix}/`) + item.label
    if (item.children) {
      Object.assign(
        obj,
        getMenuKeyTitleObj(item.children, (prefix && `${prefix}/`) + item.label)
      )
    }
  })
  return obj
}

const MenuKeyTitle = getMenuKeyTitleObj(SideMenuItem, '')

const App = (props) => {
  const [collapsed, setCollapsed] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState([])
  const [headerTitle, setHeaderTitle] = useState()
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()

  const handleMenuItemClick = ({ key, keyPath }) => {
    const path = `/${keyPath.reverse().join('/')}`
    if (localStorage.getItem('isLogin') === 'true') {
      setSelectedKeys([key])
      navigate(path)
    } else {
      message.warning('请先登录连接！')
      navigate('/accountAuthorize')
    }
  }

  useEffect(() => {
    pathCheck()
  }, [location.pathname])

  const pathCheck = async () => {
    const { pathname } = location
    const pathArr = pathname.split('/')
    const paramCount = Object.keys(params).length
    const key = pathArr.at(-paramCount - 1)

    setSelectedKeys([key])
    setHeaderTitle(MenuKeyTitle[key])
  }

  return (
    <Layout className="basic-layout">
      <Sider
        className="layout-sider"
        trigger={null}
        collapsible
        collapsedWidth={collapsedWidth}
        collapsed={collapsed}>
        <div className="layout-header-logo">
          <img src={LogoSvg} />
          <div
            className={`layout-header-title ${
              collapsed ? `layout-header-title-collapsed` : ``
            }`}>
            {SiderTitle}
          </div>
        </div>
        <Menu
          mode="inline"
          items={SideMenuItem}
          defaultSelectedKeys={['home']}
          selectedKeys={selectedKeys}
          onClick={handleMenuItemClick}
        />
      </Sider>
      <Layout className="layout-main">
        <Header className="layout-header">
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            }
          )}
          <div className="layout-main-title">{headerTitle}</div>
        </Header>
        <Content className="layout-content">
          <Card className="layout-content-container">
            {/* <AuthProvider> */}
            <Outlet />
            {/* </AuthProvider> */}
          </Card>
          <div className="layout-footer">
            <Footer>Copyright© 2022 Minieye</Footer>
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
