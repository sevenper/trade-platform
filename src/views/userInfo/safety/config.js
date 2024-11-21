import { computed } from 'vue'
import { textI18n } from '@/utils/utils'

export const dialogConfig = {
    title: textI18n('user.a12'),
    oktext: textI18n('con.a14'),  //确认按钮文字
    canceltext: textI18n('con.a15'), // 取消按钮文字
    footer: false
}
export const imgSet = {
  width: '100%',
  height: '',
  borderRadius: ''
}


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
    btnName: textI18n('user.a3'),
    btnStyle: 'width: 100%',
    btnSize: 'large'
    
}

/** 
 * 表单项配置
 * 
 * value model绑定值
 * type  类型 input or  inputPWD
 * inputType  如果是input 需要input类型，，text  password
 * label  input名称
 * bindV  绑定字段名
 */
export const queryFormPass = computed(() => {
	return [
    {
        placeholder: textI18n('placeholder.a10'),
        type: 'inputPWD', 
        inputType: 'password',
        label: textI18n('label.a1'),
        bindV: "oldPwd",
		size: 'large'
    },
    {
        placeholder: textI18n('placeholder.a11'),
        type: 'inputPWD', 
        inputType: 'password',
        label: textI18n('label.a2'),
        bindV: "newPwd",
		size: 'large'
    },
    {
        placeholder: textI18n('placeholder.a12'),
        type: 'inputPWD', 
        inputType: 'password',
        label: textI18n('label.a3'),
        bindV: "newPwdConfirm",
		size: 'large'
    },
]
})



export const queryFormFund = computed(() => {
	return [
    {
        value: "",
        placeholder: textI18n('placeholder.a13'),
        type: 'inputPWD', 
        inputType: 'password',
        label: textI18n('label.a4'),
        bindV: "tixian_password",
		size: 'large'
    },

    {
        value: "",
        placeholder: textI18n('placeholder.a14'),
        type: 'inputPWD', 
        inputType: 'password',
        label: textI18n('label.a5'),
        bindV: "new_tixian_password",
		size: 'large'
    }
]

})


export const paramsFormPass = {
	oldPwd: '',
	newPwd: '',
	newPwdConfirm: ''
}

export const paramsFormFund = {
	tixian_password: '',
	new_tixian_password: '',
}