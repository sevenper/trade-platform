import { computed } from "vue";
import { textI18n } from "@/utils/utils"

/**
 * 定义股票类型 key值
 */
export const stockType = computed(() => {
	return [
    {
        label: textI18n('type.a0'),
        key: '-1'
    },
    {
        label: textI18n('type.a17'),
        key: '0'
    },
    {
        label: textI18n('type.a9'),
        key: '5',
        amt: 'USD'
    },
    {
        label: textI18n('type.a12'),
        key: '63',
        amt: 'TRY'
    },
    {
        label: textI18n('type.a1'),
        key: '1'
    },
    {
        label: textI18n('type.a2'),
        key: '11'
    },
    {
        label: textI18n('type.a3'),
        key: '46'
    },
    {
        label: textI18n('type.a4'),
        key: '36'
    },
    {
        label: textI18n('type.a5'),
        key: '35'
    }, 
    {
        label: textI18n('type.a6'),
        key: '32'
    },
    {
        label: textI18n('type.a7'),
        key: '14'
    },
    {
        label: textI18n('type.a8'),
        key: '41'
    },
   
    {
        label: textI18n('type.a10'),
        key: '42'
    },
    {
        label: textI18n('type.a11'),
        key: '178'
    },
   
    {
        label: textI18n('type.a13'),
        key: '48'
    },
    {
        label: textI18n('type.a14'),
        key: '25'
    },
    {
        label: textI18n('type.a15'),
        key: '26'
    },
    {
        label: textI18n('type.a16'),
        key: '10'
    }
]
}) 








// 1//     香港 1   
// 2// 韩国 11 
// 3// 台湾 46
// 4// 新加坡 36
// 5// 日本 35
// 6// 巴西 32
// 7// 印度 14
// 8// 泰国 41
// 9// 美国 5
// 10// 马来 42
// 11// 越南178
// 12// 土耳其 63
// 13// 印度尼西亚 48
// 14// 澳大利亚 25
// 15// 西班牙 26
// 16// 意大利 10
