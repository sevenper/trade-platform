import { computed } from 'vue'
import { textI18n } from '@/utils/utils';

export const tablePage = {
    apiLoading: false,
    isLoading: false,
    pageNum: 1, //当前页码
    pageSize: 99,// 每页数据
    total: 0, // 总数据量
	isPage: true,


    actionStyle: {
      background: '#0066FF',
      borderRadius: '4px 4px 4px 4px',
      fontWeight: '500',
      color: '#FFFFFF',
      cursor: 'pointer'
  }
}

export const amtArray = computed(() => {
	return [
		textI18n("wallet.a2"),
		textI18n("wallet.a3"),
		textI18n("wallet.a4"),
		textI18n("wallet.a5"),
	  ]
})


export const dialogConfig = computed(() => {
	return {
		title: textI18n('other.a6'),
		oktext: textI18n('other.a6'),  //确认按钮文字
		canceltext: textI18n('con.a15'), // 取消按钮文字
	}
})

export const listType = computed(() => {
	return [
		{label: textI18n('menu.a17'), key: 0},
		{label: textI18n('stockD.a13'), key: 1},
		{label: textI18n('stockD.a14'), key: 2},
		{label: textI18n('stockD.a15'), key: 3}
	]
})


// 枚举值映射
export const ztsToText = {
    1: textI18n('stockD.a32'),
    2: textI18n('stockD.a29'),
    3: textI18n('stockD.a27')
};
// 枚举值映射
export const statusToText = {
    1: textI18n('stockD.a33'),
    2: textI18n('stockD.a34'),
    3: textI18n('stockD.a35')
};

/**
 * 表格列 持仓 平仓
 */
// 买入价格  数量  现价 总损益  浮动损亏 盈亏百分比  本金  总市值
export const columns = computed(() => {
	return [
    {
      title: textI18n('stockTable.a1'),
      dataIndex: 'stockName',
      ellipsis: true,
    },
    {
      title: textI18n('stockD.a16'),
      dataIndex: 'buyOrderPrice',
      ellipsis: true,
	  align: 'right'
    },
    {
      title: textI18n('money.a4'),
      dataIndex: 'orderNum',
      ellipsis: true,
	  align: 'right'
    },
    {
        title: textI18n('stockTable.a7'),
        dataIndex: 'now_price',
        ellipsis: true,
		align: 'right'
      },
    
    {
        title: textI18n('stockD.a17'),
        dataIndex: 'allProfitAndLose',
        ellipsis: true,
		align: 'right'
      },
      {
        title: textI18n('stockD.a18'),
        dataIndex: 'profitAndLose',
        ellipsis: true,
		align: 'right'
      },
      {
        title: textI18n('stockD.a19'),
        dataIndex: 'orderTotalPrice',
        ellipsis: true,
		align: 'right'
      },
      {
        title: textI18n('stockD.a20'),
        dataIndex: 'orderTotalPrice',
        ellipsis: true,
		align: 'right'
      },
      {
        title: textI18n('stockD.a21'),
        dataIndex: 'orderTotalPrice',
        ellipsis: true,
		align: 'right'
      },
      {
        title: '',
        key: 'action',
		align: 'right'
      },
  ];
  })

// 表格列 申购记录
  export const columnsIPO = computed(() => {
	  return  [
		{
		  title: textI18n('stockTable.a1'),
		  dataIndex: 'xgname',
		  ellipsis: true,
		},
		{
			title: textI18n('stockD.a24'),
			dataIndex: 'winnLotteryNum',
			ellipsis: true,
			align: 'right'
		  },
		  {
			title: textI18n('stockD.a25'),
			dataIndex: 'price',
			ellipsis: true,
			align: 'right'
		  },

		//   debit === 1 认购
		  {
			title: textI18n('stockD.a26'),
			dataIndex: 'statusStr',
			ellipsis: true,
			align: 'right'
		  },
		  {
			title: '',
			key: 'action',
			align: 'right'
		  },
	]

  })
  
 

// 表格列 我的挂单
export const columnsPending = computed(() => {
	return [
		{
		  title: textI18n('stockTable.a1'),
		  dataIndex: 'stockName',
		  ellipsis: true,
		},
		{
			title: textI18n('stockD.a30'),
			dataIndex: 'buyNum',
			ellipsis: true,
			align: 'right'
		  },
		  {
			title: textI18n('stockD.a16'),
			dataIndex: 'buyingPrice',
			ellipsis: true,
			align: 'right'
		  },
		  {
			title: textI18n('stockD.a36'),
			dataIndex: 'lever',
			ellipsis: true,
			align: 'right'
		  },
		  {
			title: textI18n('stockD.a26'),
			dataIndex: 'statusStr',
			ellipsis: true,
			align: 'right'
		  }
	]
})
