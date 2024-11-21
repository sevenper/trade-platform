import { computed } from 'vue'
import { textI18n } from '@/utils/utils'
/** 
 * 表单基础配置
 * 
 * label方向配置，参考值，horizontal:水平，vertical: 垂直
 * labelCol  label宽度 span: 14, offset: 4   || style: {width: '100px'}
 * wrapperCol  input 宽度 span: 14, offset: 4
 */
export const querySet = {
    direction: 'vertical',
    labelCol: {span: 24},
    wrapperCol: {span: 24},
    btnName: textI18n('con.a25'),
    btnStyle: 'width: 100%',
    btnSize: 'large'
}


export const imgSet = {
  width: '100%',
  height: '',
  borderRadius: ''
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
export const queryForm = computed(() => {
	return [
		{
		  placeholder: textI18n('placeholder.a7'),
		  type: 'input', 
		  inputType: 'text',
		  label: textI18n('con.a26'),
		  bindV: "realName",
		  size: 'large',

		},
	   
		{
			placeholder: textI18n('placeholder.a16'),
			type: 'input', 
			inputType: 'input',
			label: textI18n('con.a27'),
			bindV: "idCard",
			size: 'large',
		},
	  ]
})


export const paramsForm = {
	realName: '',
	idCard: '',
	invitecode: '',
	img1key: '',
	img2key: ''
}