import { computed } from 'vue'
import { textI18n } from '@/utils/utils';

export const tablePage = {
    apiLoading: false,
    isLoading: false,
    pageNum: 1, //当前页码
    pageSize: 30, // 每页数据
    total: 0, // 总数据量
	isPage: true,
	source: 'stockDetail',


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

export const columnsCun = computed(() => {
	return [
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
	  align:'right',
      sorter: (a, b) => a.last - b.last,
    },
    {
      title: textI18n('stockTable.a3'),
      dataIndex: 'high',
	  align:'right',
    },
    {
        title: textI18n('stockTable.a4'),
        dataIndex: 'low',
		align:'right',
      },
      {
        title: textI18n('stockTable.a5'),
        dataIndex: 'chg_pct',
		align:'right',
        sorter: (a, b) => a.chg_pct - b.chg_pct,
      },
      {
        title: '',
        key: 'action',
		align:'right',
      },
  ];
})

export const columnsZS = computed(() => {
	return [
    {
       title: textI18n('stockTable.a1'),
      dataIndex: 'indexName',
      isZixuan: true,
      ellipsis: true,
    },
    {
      title: textI18n('stockTable.a2'),
      className: 'column-money',
      dataIndex: 'last',
	  align:'right',
      sorter: (a, b) => a.last - b.last,
    },
    {
      title: textI18n('stockTable.a3'),
      dataIndex: 'high',
	  align:'right',
    },
    {
        title: textI18n('stockTable.a4'),
        dataIndex: 'low',
		align:'right',
      },
      {
        title: textI18n('stockTable.a5'),
        dataIndex: 'chg_pct',
		align:'right',
        sorter: (a, b) => a.chg_pct - b.chg_pct,
      },
      {
        title: '',
        key: 'action',
		align:'right',
      },
  ];
})

export const columnsZX = computed(() => {
	return [
    {
       title: textI18n('stockTable.a1'),
      dataIndex: 'stock_name',
      isZixuan: true,
      ellipsis: true,
    },
    {
      title: textI18n('stockTable.a2'),
      className: 'column-money',
      dataIndex: 'last',
	  align:'right',
      sorter: (a, b) => a.last - b.last,
    },
    {
      title: textI18n('stockTable.a3'),
      dataIndex: 'high',
	  align:'right',
    },
    {
        title: textI18n('stockTable.a4'),
        dataIndex: 'low',
		align:'right',
      },
      {
        title: textI18n('stockTable.a5'),
        dataIndex: 'chg_pct',
		align:'right',
        sorter: (a, b) => a.chg_pct - b.chg_pct,
      },
      {
        title: '',
        key: 'action',
		align:'right',
      },
  ];
})

