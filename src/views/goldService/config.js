import { computed } from "vue";
import { textI18n } from "@/utils/utils";

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

export const dialogConfig = computed(() => {
	return {
		title: textI18n('con.a13'),
		oktext: textI18n('con.a14'),  //确认按钮文字
		canceltext: textI18n('con.a15'), // 取消按钮文字
	}
})

/**
 * 表格列
 */

export const bigDealColumns = computed(() => {
	return [
		{
			title: textI18n('stockTable.a15'),
			dataIndex: 'stockName',
			ellipsis: true,
		},
		{
			title: textI18n('stockTable.a16'),
			dataIndex: 'stockCode',
			ellipsis: true,
			align: 'right'
		},
		{
			title: textI18n('stockTable.a7'),
			dataIndex: 'priceMarket',
			align: 'right'
		},
		{
			title: textI18n('stockTable.a8'),
			dataIndex: 'price',
			align: 'right'
		},
		{
			title: textI18n('stockTable.a9'),
			dataIndex: 'minBuyAmt',
			align: 'right'
		},
		{
			title: textI18n('record.a4'),
			key: 'action',
			align: 'right'
		}
	]
})


/**
* 表格列
*/

export const newStockColumns = computed(() => {
	return [
		{
			title: textI18n('stockTable.a15'),
			dataIndex: 'stockName',
			ellipsis: true,
		},
		{
			title: textI18n('stockTable.a16'),
			dataIndex: 'stockCode',
			ellipsis: true,
			align: 'right'
		},
		{
			title: textI18n('stockTable.a13'),
			dataIndex: 'price',
			align: 'right'
		},
		{
			title: textI18n('stockTable.a14'),
			dataIndex: 'endTime',
			align: 'right'
		},
		{
			title: textI18n('record.a4'),
			key: 'action',
			align: 'right'
		}
	];
})


/**
* 表格列
*/

export const placementColumns = computed(() => {
	return [
		{
			title: textI18n('stockTable.a15'),
			dataIndex: 'stockName',
			ellipsis: true,
		},
		{
			title: textI18n('stockTable.a16'),
			dataIndex: 'stockCode',
			ellipsis: true,
			align: 'right'
		},
		{
			title: textI18n('stockTable.a13'),
			dataIndex: 'price',
			align: 'right'
		},
		{
			title: textI18n('stockTable.a14'),
			dataIndex: 'endTime',
			align: 'right'
		},
		{
			title: textI18n("record.a4"),
			key: 'action',
			align: 'right'
		}
	];
})

