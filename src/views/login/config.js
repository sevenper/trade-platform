import {
	textI18n
} from '@/utils/utils'
/** 
 * 表单基础配置
 * 
 * label方向配置，参考值，horizontal:水平，vertical: 垂直
 * labelCol  label宽度 span: 14, offset: 4   || style: {width: '100px'}
 * wrapperCol  input 宽度 span: 14, offset: 4
 * isBtn true false 是否展示表单保存按钮
 */
export const querySet = {
	direction: 'horizontal',
	labelCol: {},
	wrapperCol: {
		span: 24
	},
	isBtn: true,
	btnName: '',
	btnStyle: 'width: 100%',
	btnSize: 'large',
}

/** 
 * 表单项配置
 * 
 * value model绑定值
 * type  类型 input or
 * inputType  如果是input 需要input类型，，text password number
 * label  input名称
 * bindV  绑定字段名
 */
export const queryForm = [{
		placeholder: textI18n('placeholder.a2'),
		type: 'input',
		bindV: "phone",
		size: 'large',
	},

	{
		placeholder: textI18n('placeholder.a3'),
		type: 'inputPWD',
		bindV: "userPwd",
		size: 'large'
	},
	{
		placeholder: textI18n('placeholder.a8'),
		type: 'input',
		bindV: "invitecode",
		size: 'large'
	},
]

export const paramsForm = {
	phone: '',
	userPwd: '',
	invitecode: ''
}