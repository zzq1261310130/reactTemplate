import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Modal,
  Form,
  Button,
  Input,
  Row,
  Col,
  Checkbox,
  InputNumber,
  Spin,
  AutoComplete,
} from 'antd'
import axios from 'axios'
import './index.less'

const { Item } = Form
const OrderCreate = () => {
  const form = useRef(null)
  const [lastCheckState, setLastCheckState] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const [modal, contextHolder] = Modal.useModal()
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('isLogin') === 'false') {
      navigate('/accountAuthorize')
    }
  }, [])
  const clearForm = () => {
    form.current.resetFields()
  }

  const handleSubmit = (values) => {}

  const twoFormItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  }

  const clickLastCheck = () => {
    setLastCheckState(!lastCheckState)
  }

  const doOrder = (e) => {
    setSpinning(true)
    e.preventDefault()
    let params
    form.current
      .validateFields()
      .then((values) => {
        params = {
          ...values,
          auto_split: +Boolean(values.auto_split),
          buy_max: +Boolean(values.buy_max),
          limit_min_pack: +Boolean(values.limit_min_pack),
          limit_min_order: +Boolean(values.limit_min_order),
          email: values.email.split(';'),
          max_price: values.max_price_ ? values.max_price : 9999,
          notify: 0,
        }
        return axios.post('/tiOrder/orderCreate', { ...params, buy_anyway: 0 })
      })
      .then((res) => {
        if (
          res.data.message ===
          '请确认TI_PN是否正确输入,或在TI官网购物页面最底部确认要下单的具体型号'
        ) {
          throw `请确认TI PN是否正确输入, 或在TI官网购物页面最底部确认要下单的具体型号`
        }
        if (res.data.order_lists.length) {
          return new Promise((resolve, reject) => {
            setSpinning(false)
            modal.confirm({
              title: '重复刷单',
              content: (
                <>
                  <div>查询到该商品的刷单已存在，是否继续此次刷单？</div>
                </>
              ),
              onCancel: (close) => {
                close()
                reject(new Error('订单已取消！'))
              },
              onOk: (close) => {
                close()
                setSpinning(true)
                resolve(
                  axios.post('/tiOrder/orderCreate', {
                    ...params,
                    buy_anyway: 1,
                  })
                )
              },
            })
          })
        } else {
          return res
        }
      })
      .then((res) => {
        Modal.success({
          content: res.data.message,
        })
      })
      .catch((e) => {
        Modal.error({
          title:
            e ===
            '请确认TI PN是否正确输入, 或在TI官网购物页面最底部确认要下单的具体型号'
              ? 'TI PN错误'
              : '请注意',
          content: e.message || e || '请求出错!!!',
        })
      })
      .finally(() => {
        setSpinning(false)
      })
  }
  const onlyNoticeClick = (e) => {
    setSpinning(true)
    e.preventDefault()
    form.current
      .validateFields()
      .then((values) => {
        const params = {
          ...values,
          auto_split: +Boolean(values.auto_split),
          buy_max: +Boolean(values.buy_max),
          limit_min_pack: +Boolean(values.limit_min_pack),
          limit_min_order: +Boolean(values.limit_min_order),
          email: values.email.split(';'),
          max_price: values.max_price_ ? values.max_price : 9999,
          notify: 1,
          buy_anyway: 0,
        }

        return axios.post('/tiOrder/orderCreate', { ...params })
      })
      .then((res) => {
        setSpinning(false)

        if (
          res.data.message ===
          '请确认TI_PN是否正确输入,或在TI官网购物页面最底部确认要下单的具体型号'
        ) {
          Modal.error({
            title: '请求出错',
            content:
              '请确认TI PN是否正确输入, 或在TI官网购物页面最底部确认要下单的具体型号',
          })
          return
        }
        Modal.success({
          content: res.data.message || '仅到货通知设置成功。。。',
        })
      })
      .catch((e) => {
        Modal.error({
          title: '请求出错',
          content: e.message || '请求出错!!!',
        })
      })
      .finally(() => {
        setSpinning(false)
      })
  }

  return (
    <Spin spinning={spinning}>
      <div>
        <Form
          id="area"
          className="order-create-form"
          ref={form}
          onFinish={handleSubmit}
          labelAlign
          labelWrap
          initialValues={{
            quantity: 0,
            max_price: 0.001,
            refresh_time: 10,
          }}
          // AutoComplete="off"
        >
          <Row gutter={24}>
            <Col span={12}>
              <Item
                label="TI PN"
                name="TI_PN"
                rules={[{ required: true }]}
                {...twoFormItemLayout}>
                <Input />
              </Item>
            </Col>
            <Col span={12}>
              <Item
                label="MINIEYE PN"
                name="MINIEYE_PN"
                rules={[{ required: true }]}
                {...twoFormItemLayout}>
                <Input />
              </Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Item
                label="订购数量"
                name="quantity"
                rules={[
                  { required: true },
                  {
                    type: 'number',
                    min: 1,
                  },
                ]}
                {...twoFormItemLayout}>
                <InputNumber
                  style={{
                    width: '100%',
                  }}
                />
              </Item>
            </Col>
            <Col span={12}>
              <Item
                label="操作人"
                name="operator"
                rules={[{ required: true }]}
                {...twoFormItemLayout}>
                <Input />
              </Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Item
                label="物料备注"
                name="comment"
                rules={[{ required: false }]}
                {...twoFormItemLayout}>
                <Input />
              </Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Item
                label=""
                name="auto_split"
                valuePropName="checked"
                wrapperCol={{
                  offset: 6,
                  span: 18,
                }}>
                <Checkbox>
                  当订购数量超过最大订购量时，自动拆分为多个订单
                </Checkbox>
              </Item>
            </Col>
            <Col span={12}>
              <Item
                name="limit_min_order"
                valuePropName="checked"
                wrapperCol={{
                  offset: 6,
                  span: 18,
                }}>
                <Checkbox>
                  当订购数量小于最小订购量时，自动修改为最小订购量
                </Checkbox>
              </Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Item
                name="limit_min_pack"
                valuePropName="checked"
                wrapperCol={{
                  offset: 6,
                  span: 18,
                }}>
                <Checkbox>
                  当订购数量小于最小包装量时，自动修改为一个最小包装的量
                </Checkbox>
              </Item>
            </Col>
            <Col span={12}>
              <Item
                name="buy_max"
                valuePropName="checked"
                wrapperCol={{
                  offset: 6,
                  span: 18,
                }}>
                <Checkbox>
                  当订购数量大于库存数量时，库存有多少，买多少
                </Checkbox>
              </Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Item
                name="max_price_"
                valuePropName="checked"
                wrapperCol={{
                  offset: 6,
                  span: 18,
                }}>
                <Checkbox onChange={clickLastCheck}>
                  只接受单价低于指定价格的订单
                </Checkbox>
              </Item>
            </Col>
            <Col span={4} className="maxpriceinput">
              <Item name="max_price" rules={[{ required: true }]} noStyle>
                <InputNumber
                  addonAfter="$"
                  min={0.001}
                  disabled={lastCheckState ? false : true}
                />
              </Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Item
                label="刷单时间间隔"
                name="refresh_time"
                rules={[{ required: true }]}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 8 }}>
                <InputNumber addonAfter="秒" />
              </Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Item
                label="成功后邮件通知"
                name="email"
                rules={[{ required: true }]}
                className="noticeEmail"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}>
                <Input
                  placeholder="请输入邮箱账号，多个账号间用英文分号间隔！"
                  style={{ width: '200%' }}
                />
              </Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={18}>
              <Item
                wrapperCol={{
                  offset: 4,
                  span: 14,
                }}>
                <div className="createOrderButton">
                  <Button
                    htmlType="submit"
                    type="primary"
                    value="large"
                    onClick={doOrder}>
                    确认下单
                  </Button>
                  <Button
                    onClick={onlyNoticeClick}
                    className="onlyNoticeButton"
                    danger>
                    仅到货通知
                  </Button>
                  <Button onClick={clearForm}>重置为默认值</Button>
                </div>
              </Item>
            </Col>
          </Row>
        </Form>
        {contextHolder}
      </div>
    </Spin>
  )
}

export default OrderCreate
