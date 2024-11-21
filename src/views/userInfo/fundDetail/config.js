import { textI18n } from "@/utils/utils";
// 枚举值映射
export const recordTypeToText = {
    1: textI18n('fundDetail.a1'),
    2: textI18n('fundDetail.a2'),
    3: textI18n('fundDetail.a3'),
    4: textI18n('fundDetail.a4'),
    5: textI18n('fundDetail.a5'),
    6: textI18n('fundDetail.a6'),
    7: textI18n('fundDetail.a7'),
    8: textI18n('fundDetail.a8'),
    9: textI18n('fundDetail.a9'),
    21: textI18n('fundDetail.a10'),
    22: textI18n('menu.a18'),
    23: textI18n('menu.a19'),
    69: textI18n('fundDetail.a12'),
};


export const tablePage = {
    isLoading: false,
    pageNum: 1, //当前页码
    pageSize: 20, // 每页数据
    total: 0 // 总数据量

}