import {
	computed
} from "vue";

import {
	textI18n
} from '@/utils/utils';

export const tablePage = {
	apiLoading: false,
	isLoading: false,
	pageNum: 1, //当前页码
	pageSize: 20, // 每页数据
	total: 0, // 总数据量
	isPage: false, //
	source: 'stockDetail',

	actionStyle: {
		background: '#0066FF',
		borderRadius: '4px 4px 4px 4px',
		fontWeight: '500',
		color: '#FFFFFF',
		cursor: 'pointer',
		whiteSpace: 'nowrap'
	}
}

export const proList = computed(() => {
	return [{
			title: textI18n("home.a15"),
			text: textI18n("home.a16"),
		},
		{
			title: textI18n("home.a17"),
			text: textI18n("home.a18"),
		},
		{
			title: textI18n("home.a19"),
			text: textI18n("home.a20"),
		},
	]
})
/**
 * 表格列
 */

export const columnsCun = computed(() => {
	return [{
			title: textI18n('stockTable.a1'),
			dataIndex: 'stockName',
			ellipsis: true,
		},
		{
			title: textI18n('stockTable.a2'),
			className: 'column-money',
			dataIndex: 'last',
			align: 'right'
		},
		{
			title: textI18n('stockTable.a3'),
			dataIndex: 'high',
			align: 'right'
		},
		{
			title: textI18n('stockTable.a4'),
			dataIndex: 'low',
			align: 'right'
		},
		{
			title: textI18n('stockTable.a5'),
			dataIndex: 'chg_pct',
			align: 'right'
		},
		{
			title: '',
			key: 'action',
			align: 'right'
		}
	]
})


export const columnsZS = computed(() => {
	return [{
			title: textI18n('stockTable.a1'),
			dataIndex: 'indexName',
			ellipsis: true,
		},

		{
			title: textI18n('stockTable.a2'),
			className: 'column-money',
			dataIndex: 'last',
			align: 'right'
		},
		{
			title: textI18n('stockTable.a3'),
			dataIndex: 'high',
			align: 'right'
		},
		{
			title: textI18n('stockTable.a4'),
			dataIndex: 'low',
			align: 'right'
		},
		{
			title: textI18n('stockTable.a5'),
			dataIndex: 'chg_pct',
			align: 'right'
		},
		{
			title: '',
			key: 'action',
			align: 'right'
		}
	]
})