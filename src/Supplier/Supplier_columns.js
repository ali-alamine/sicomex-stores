export const columns = [
  { title: `ID`, dataIndex: `supplier_id`,defaultSortOrder: 'descend',
  sorter: (a, b) => a.supplier_id - b.supplier_id, },
  { title: `Name`, dataIndex: `supplier_name` },
  { title: `amount`, dataIndex: `supplier_amount`,defaultSortOrder: 'descend',
  sorter: (a, b) => a.supplier_amount - b.supplier_amount, },

]

// export const data = [
//   {
//     key: `1`,
//     name: `John Brown`,
//     age: 32,
//     address: `New York No. 1 Lake Park`,
//   }, {
//     key: `2`,
//     name: `Jim Green`,
//     age: 42,
//     address: `London No. 1 Lake Park`,
//   }, {
//     key: `3`,
//     name: `Joe Black`,
//     age: 32,
//     address: `Sidney No. 1 Lake Park`,
//   }, {
//     key: `4`,
//     name: `Jim Red`,
//     age: 32,
//     address: `London No. 2 Lake Park`,
//   }]
  