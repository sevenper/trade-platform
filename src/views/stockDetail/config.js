import { textI18n } from "@/utils/utils"

export const dialogConfig = {
    title: textI18n('stockD.a6'),
    oktext: textI18n('con.a14'),  //确认按钮文字
    canceltext: textI18n('con.a15'), // 取消按钮文字
    footer: false
}

export const numConfig = [ 
    '50',
    '100', 
    '150', 
    '200', 
    '250', 
    '300'
]

export const tablePage = {
    apiLoading: false,
    isLoading: false,
    pageNum: 1, //当前页码
    pageSize: 20, // 每页数据
    total: 0, // 总数据量
	source: 'stockDetail',
	isPage: true,


    actionStyle: {
      background: '#0066FF',
      borderRadius: '4px 4px 4px 4px',
      fontWeight: '500',
      color: '#FFFFFF',
      cursor: 'pointer'
  }
}

/**
 * 表格列
 */

export const columns = [
    {
      title: textI18n('stockTable.a1'),
      dataIndex: 'stockName',
      isZixuan: true,
      ellipsis: true,
    },
    {
      title: textI18n('stockTable.a2'),
      className: 'column-money',
      dataIndex: 'last',
      // sorter: (a, b) => a.last - b.last,
    },
    // {
    //   title: textI18n('stockTable.a3'),
    //   dataIndex: 'high',
    // },
    // {
    //     title: textI18n('stockTable.a4'),
    //     dataIndex: 'low',
    //   },
      {
        title: textI18n('stockTable.a5'),
        dataIndex: 'chg_pct',
        // sorter: (a, b) => a.chg_pct - b.chg_pct,
      },
      // {
      //   title: '',
      //   key: 'action'
      // },
  ];