const getParams = () => {
  return {
    query: {
      submit: 0,
      order_number: '',
      ti_order_number: '',
    },
    range: {
      submit: 1,
      start: 0,
      end: 10,
    },
    operation: {
      submit: 0,
      order_number: '',
      operate: 0,
    },
  }
}
const OrderKeysDict = new Map([
  ['id', 'ID'],
  ['order_number', 'MINIEYE订单号'],
  ['ti_order_number', 'TI订单号'],
  ['minieye_pn', 'MINIEYE PN'],
  ['ti_pn', 'TI PN'],
  ['order_time', 'MINIEYE下单时间'],
  ['ti_order_time', 'TI下单时间'],
  ['expect_quantity', '期待下单数量'],
  ['expect_unit_price', '期待单价'],
  ['real_quantity', '实际下单数量'],
  ['real_unit_price', '实际单价($)'],
  ['real_money', '实际金额($)'],
  ['refresh_status', '刷单状态'],
  ['order_status', '成交状态'],
  ['operator', '操作人'],
])
const refershStatusMap = new Map([
  [0, '完成'],
  [1, '进行中'],
  [2, '终止'],
])

const orderStatusMap = new Map([
  [0, '未成交'],
  [1, '成交'],
  [2, '折单成交'],
  [3, '欠料成交'],
])
const StatusMap = new Map([
  ['refresh_status', refershStatusMap],
  ['order_status', orderStatusMap],
])

export { getParams, OrderKeysDict, StatusMap }