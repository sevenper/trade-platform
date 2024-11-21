import { computed } from "vue"
import { textI18n } from "@/utils/utils"
/** 
 * 表单基础配置
 * 
 * label方向配置，参考值，horizontal:水平，vertical: 垂直
 * labelCol  label宽度 span: 14, offset: 4   || style: {width: '100px'}
 * wrapperCol  input 宽度 span: 14, offset: 4
 */
export const querySet = {
    direction: 'vertical',
    labelCol: { span: 24},
    wrapperCol: { span: 24 },
    btnName: '',
    btnStyle: 'width: 100%',
    btnSize: 'large'
}

export const dialogConfig = {
    title: textI18n('user.a12'),
    oktext: textI18n('con.a14'),  //确认按钮文字
    canceltext: textI18n('con.a15'), // 取消按钮文字
    footer: false
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
      placeholder: textI18n('placeholder.a17'),
      type: 'input', 
      inputType: 'text',
      label: textI18n('con.a31'),
      bindV: "bankName",
	  size: 'large'
    },
   
    {
        placeholder: textI18n('placeholder.a18'),
        type: 'input', 
        inputType: 'text',
        label: textI18n('con.a32'),
        bindV: "bankNo",
		 size: 'large'
    },
    {
        placeholder: textI18n('placeholder.a19'),
        type: 'input', 
        inputType: 'text',
        label: textI18n('con.a33'),
        bindV: "userName",
		 size: 'large'
    },
  ]
})


  
  export const paramsForm = {
	  bankName: '',
	  bankNo: '',
	  userName: '',
  }