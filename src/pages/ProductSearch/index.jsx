import React, { useState, useEffect } from 'react'
import {
  Input,
  Button,
  Badge,
  Descriptions,
  Empty,
  Table,
  message,
  Spin,
  Modal,
} from 'antd'
import axios from 'axios'
import { useRoutes, useNavigate } from 'react-router-dom'
import { nanoid } from 'nanoid'
import './index.less'
const { Search } = Input

const productInfoKeysDict = new Map([
  ['tiPartNumber', '完整PN'],
  ['lifeCycle', '生命周期'],
  ['packageType', '包装类型'],
  ['description', '描述'],
  ['quantity', '库存数量'],
  ['minimumOrderQuantity', '单次下单数量限制'],
  ['standardPackQuantity', '标准包装数量'],
  ['packageCarrier', '包裹承运人'],
  ['pricing', '阶梯价格表'],
])

const ProductSearch = () => {
  const [searchData, setSearchDate] = useState(new Map())
  const [spinning, setSpinning] = useState(false)

  const columns = [
    {
      title: '数量(个)',
      dataIndex: 'priceBreakQuantity',
      key: 'priceBreakQuantity',
    },
    {
      title: '价格($)',
      dataIndex: 'price',
      key: 'price',
    },
  ]
  const searchProduct = (key, event) => {
    // console.log(event.target.tagName)
    if (event.type === 'click' && event.target.tagName === 'INPUT') {
      return
    }
    setSpinning(true)
    axios
      .post('/tiOrder/productSearch', {
        productId: key,
      })
      .then((res) => {
        let productInfo = new Map()

        if (res.data.data.errors) {
          message.warning('商品不存在, 请确认输入的TI PN是否正确！')
          setSearchDate(productInfo)
          return
        }

        for (let item of productInfoKeysDict.keys()) {
          productInfo.set(item, res.data.data?.[item])
        }
        setSearchDate(productInfo)
      })
      .catch((error) => {
        console.log(error)
        message.error('查找失败！！！')
      })
      .finally(() => {
        setSpinning(false)
      })
  }
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('isLogin') === 'false') {
      navigate('/accountAuthorize')
    }
  }, [])

  return (
    <Spin tip="努力搜索中..." spinning={spinning}>
      <div className="productSearchPage">
        <div className="list-operate-container">
          <Search
            className="input-search"
            type="primary"
            allowClear
            enterButton
            onSearch={searchProduct}
            placeholder="请输入TI PN！"
          />
          <Button>
            <a href="https://www.ti.com/" target="_blank">
              打开TI.com产品页面
            </a>
          </Button>
        </div>
        <div className="productContent">
          <div className="productItem">
            {searchData.size === 0 ? (
              <Empty />
            ) : (
              <>
                <Descriptions
                  title={searchData.get('tiPartNumber')}
                  layout="vertical"
                  bordered
                  size={'small'}>
                  <Descriptions.Item
                    label={productInfoKeysDict.get('lifeCycle')}>
                    {searchData.get('lifeCycle')}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={productInfoKeysDict.get('packageType')}>
                    {searchData.get('packageType')}
                  </Descriptions.Item>

                  <Descriptions.Item
                    label={productInfoKeysDict.get('standardPackQuantity')}>
                    {searchData.get('standardPackQuantity')}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={productInfoKeysDict.get('quantity')}>
                    {searchData.get('quantity')}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={productInfoKeysDict.get('minimumOrderQuantity')}>
                    {searchData.get('minimumOrderQuantity')}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={productInfoKeysDict.get('packageCarrier')}>
                    {searchData.get('packageCarrier')}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={productInfoKeysDict.get('description')}
                    span={3}>
                    {searchData.get('description')}
                  </Descriptions.Item>
                  <Descriptions.Item label={productInfoKeysDict.get('pricing')}>
                    <Table
                      dataSource={searchData
                        .get('pricing')
                        .find((item) => item.currency === 'USD')
                        .priceBreaks.map((item) => {
                          const key = nanoid()
                          return { ...item, key }
                        })}
                      columns={columns}
                      pagination={{ hideOnSinglePage: true }}
                      style={{ padding: '30px 150px' }}
                    />
                  </Descriptions.Item>
                </Descriptions>
                {/* <Button type="primary" className="autoOrder">
                  自动下单
                </Button>
                <Button type="primary" className="manualOrder">
                  手动下单
                </Button> */}
              </>
            )}
          </div>
        </div>
      </div>
    </Spin>
  )
}

export default ProductSearch
