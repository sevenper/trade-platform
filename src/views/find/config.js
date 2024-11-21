import { computed } from 'vue'
import { textI18n } from '@/utils/utils'

export const tablePage = {
    isLoading: false,
    pageNum: 1, //当前页码
    pageSize: 25, // 每页数据
    total: 0 // 总数据量

}

export const typeConfig = computed(() => {
	return [
		{
			label: textI18n('con.a17'),
			key: '3'
		}, {
			label: textI18n('con.a18'),
			key: '1'
		},
	]
})
 
 

