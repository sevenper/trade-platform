import { computed } from 'vue'
import { textI18n } from "@/utils/utils";

export const moneyConfig = [ 
    '50000',
    '100000', 
    '150000', 
    '200000', 
    '250000', 
    '500000'
]


export const tablePage = {
    apiLoading: false,
    isLoading: false,
    pageNum: 1, //当前页码
    pageSize: 20, // 每页数据
    total: 0,// 总数据量
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

export const rechargeColumns = computed(() => {
	return [
		{
		  title: textI18n('record.a1'),
		  dataIndex: 'forTime',
		},
		{
		  title: textI18n('record.a2'),
		  className: 'column-money',
		  dataIndex: 'payAmt',
		  align: 'right'
		},
		{
		  title: textI18n('record.a3'),
		  dataIndex: 'statusStr',
		  align: 'right'
		},
		// {
		//     title: textI18n('record.a4'),
		//     key: 'action'
		// }
	  ];
})

  export const extractColumns = computed(() => {
	  return  [
		{
		  title: textI18n('record.a1'),
		  dataIndex: 'forTime',
		},
		{
		  title: textI18n('record.a2'),
		  className: 'column-money',
		  dataIndex: 'withAmt',
		  align: 'right'
		},
		{
		  title: textI18n('record.a3'),
		  dataIndex: 'statusStr',
		   align: 'right'
		}
	  ];
  })
 

