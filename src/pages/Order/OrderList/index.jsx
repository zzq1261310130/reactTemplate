import React, { useState, useEffect, useRef } from 'react'
import { useRoutes, useNavigate } from 'react-router-dom'
import { WarningOutlined, SearchOutlined } from '@ant-design/icons'
import Draggable from 'react-draggable'
import {
  Space,
  Table,
  Popover,
  Button,
  Empty,
  Modal,
  message,
  Pagination,
  Descriptions,
  Form,
  Input,
  Select,
} from 'antd'
import axios from 'axios'
import { getParams, OrderKeysDict, StatusMap } from './const'
import './index.less'

const operateUI = (type, item, ref) => {
  switch (type) {
    case '订单号':
      return (
        <Descriptions title="" column={1}>
          <Descriptions.Item label="TI订单号">
            {item['ti_order_number']}
          </Descriptions.Item>
          <Descriptions.Item label="MINIEYE订单号">
            {item['order_number']}
          </Descriptions.Item>
        </Descriptions>
      )
    case '详情/修改':
      return (
        <div className="detailAndModify">
          <Form
            name="详情/修改"
            ref={ref}
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 10,
            }}
            autoComplete="off">
            {[...OrderKeysDict.keys()].map((orderKey) => {
              return [...StatusMap.keys()].includes(orderKey) ? (
                <Form.Item
                  key={orderKey}
                  label={OrderKeysDict.get(orderKey)}
                  name={orderKey}>
                  <Select
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    disabled={
                      orderKey === 'refresh_status' && item[orderKey] === 1
                        ? false
                        : true
                    }>
                    {[...StatusMap.get(orderKey).entries()].map((item) => {
                      return (
                        <Select.Option
                          disabled={item[0] != 0 ? false : true}
                          key={item[0]}>
                          {item[1]}
                        </Select.Option>
                      )
                    })}
                  </Select>
                </Form.Item>
              ) : (
                <Form.Item
                  key={orderKey}
                  label={OrderKeysDict.get(orderKey)}
                  name={orderKey}>
                  <Input disabled />
                </Form.Item>
              )
            })}
          </Form>
        </div>
      )
    case '删除':
      return (
        <div className="modalDel">
          <WarningOutlined className="delWarning" />
          确定删除该刷单？
        </div>
      )
  }
}
const OrderList = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [orderList, setOrderList] = useState([])
  const [totalOrder, setTotalOrder] = useState(0)
  const [isLoading, setLoading] = useState(false)
  const [itemDetail, setItem] = useState({})
  const [curPage, setCurPage] = useState(1)
  const [disabled, setDisabled] = useState(false)
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  })
  const draggleRef = useRef(null)
  const detailForm = useRef(null)

  const navigate = useNavigate()
  useEffect(() => {
    if (localStorage.getItem('isLogin') === 'false') {
      navigate('/accountAuthorize')
    }
    postOrderList(getParams())
  }, [])
  useEffect(() => {
    if (detailForm.current) {
      const initialValues = {
        ...itemDetail,
        refresh_status: String(itemDetail.refresh_status),
        order_status: String(itemDetail.order_status),
      }
      detailForm.current.setFieldsValue(initialValues)
    }
  }, [itemDetail])

  const postOrderList = (params) => {
    setLoading(true)
    axios
      .post('/tiOrder/orderList', { ...params })
      .then((res) => {
        const orderList = res.data.range.slice(1)
        orderList.forEach((item) => (item.key = item.id))
        setOrderList(orderList)
        setTotalOrder(res.data.range[0].order_count)
        if (params.operation.submit === 1) {
          if (res.statusText === 'OK') {
            message.success('success。。。')
          } else {
            message.error('error!!!')
          }
        }
      })
      .catch((e) => {
        message.error('出错了！！！')
      })
      .finally((x) => {
        setLoading(false)
      })
  }
  const showModal = (title, r) => {
    setModalTitle(title)
    setIsModalOpen(true)
    setItem({ ...r })
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const handleOk = (_, pageSize = 10) => {
    setIsModalOpen(false)

    if (modalTitle === '详情/修改') {
      const form = { ...detailForm.current.getFieldValue() }
      if (form.refresh_status === '2') {
        const curParams = {
          ...getParams(),
          range: {
            submit: 1,
            start: pageSize * (curPage - 1),
            end: pageSize * curPage,
          },
          operation: {
            submit: 1,
            order_number: form.order_number,
            operate: 0,
          },
        }
        postOrderList(curParams)
      }
    }
    if (modalTitle === '删除') {
      console.log(itemDetail)
      const curParams = {
        ...getParams(),
        range: {
          submit: 1,
          start: pageSize * (curPage - 1),
          end: pageSize * curPage,
        },
        operation: {
          submit: 1,
          order_number: itemDetail.order_number,
          operate: 1,
        },
      }
      postOrderList(curParams)
    }
  }

  const changePage = (page, pageSize = 10) => {
    setCurPage(page)
    const curParmas = {
      ...getParams(),
      range: {
        submit: 1,
        start: pageSize * (page - 1),
        end: pageSize * page,
      },
    }
    postOrderList(curParmas)
  }

  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement
    const targetRect = draggleRef.current?.getBoundingClientRect()

    if (!targetRect) {
      return
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    })
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'MINIEYE下单时间',
      dataIndex: 'order_time',
      key: 'order_time',
    },
    {
      title: 'TI PN',
      dataIndex: 'ti_pn',
      key: 'ti_pn',
    },
    {
      title: '实际下单数量',
      key: 'real_quantity',
      dataIndex: 'real_quantity',
    },
    {
      title: '实际金额($)',
      key: 'real_money',
      dataIndex: 'real_money',
    },
    {
      title: '刷单状态',
      key: 'refresh_status',
      dataIndex: 'refresh_status',
      render: (item, _) => StatusMap.get('refresh_status').get(item),
    },
    {
      title: '成交状态',
      key: 'order_status',
      dataIndex: 'order_status',
      render: (item, _) => StatusMap.get('order_status').get(item),
    },
    {
      title: '操作人',
      key: 'operator',
      dataIndex: 'operator',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <a
            onClick={() => {
              showModal('详情/修改', record)
            }}>
            <Button size="small" type="primary">
              详情/修改
            </Button>
          </a>

          <a
            onClick={() => {
              showModal('订单号', record)
            }}>
            <Button size="small" type="primary">
              订单号
            </Button>
          </a>
          <a
            onClick={() => {
              if (record.refresh_status === 1) {
                return
              }
              showModal('删除', record)
            }}>
            {record.refresh_status === 1 ? (
              <Popover
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                content={<span>进行中的刷单不能删除，请先终止！</span>}
                placement="topLeft">
                <Button
                  size="small"
                  type="primary"
                  disabled={record.refresh_status === 1 ? true : false}>
                  删除
                </Button>
              </Popover>
            ) : (
              <Button
                size="small"
                type="primary"
                disabled={record.refresh_status === 1 ? true : false}>
                删除
              </Button>
            )}
          </a>
        </Space>
      ),
    },
  ]

  return (
    <div>
      {orderList.length === 0 ? (
        <Empty />
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={orderList}
            size="small"
            pagination={false}
            loading={isLoading}
          />
          <div>
            <Pagination
              className="pagination"
              defaultCurrent={1}
              total={totalOrder}
              showSizeChanger={false}
              onChange={changePage}
            />
          </div>
        </>
      )}
      <Modal
        title={
          <div
            style={{
              cursor: 'move',
            }}
            onMouseOver={() => {
              if (disabled) {
                setDisabled(false)
              }
            }}
            onMouseOut={() => {
              setDisabled(true)
            }}
            onFocus={() => {}}
            onBlur={() => {}}>
            {modalTitle}
          </div>
        }
        open={isModalOpen}
        onOk={handleOk}
        centered
        width={modalTitle === '详情/修改' ? 800 : 520}
        onCancel={handleCancel}
        modalRender={(modal) => (
          <Draggable
            disabled={disabled}
            bounds={bounds}
            onStart={(event, uiData) => onStart(event, uiData)}>
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}>
        {operateUI(modalTitle, itemDetail, detailForm)}
      </Modal>
    </div>
  )
}

export default OrderList
