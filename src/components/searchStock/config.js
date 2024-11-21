import { textI18n } from "@/utils/utils"
export const tablePage = {
    isLoading: false,
    apiLoading: false,
	pageNum: 1, //当前页码
	pageSize: 20, // 每页数据
	total: 0, // 总数据量

}

export const dialogConfig = {
    title: '',
    // title: textI18n('placeholder.a0'),
    oktext: textI18n('con.a14'),  //确认按钮文字
    canceltext: textI18n('con.a15'), // 取消按钮文字
	footer: false
}