import React, {CSSProperties, ReactNode, useRef, useState} from 'react'
import  classNames from 'classnames';
import FormContext from "@/components/Form/FormContext";

export interface FormProps extends React.HTMLAttributes<HTMLFormElement> {
    className?: string; // 类名
    style?: CSSProperties;  // 样式
    initialValues?: Record<string, any>; // 初始值
    onFinish?: (values: Record<string, any>) => void; // 提交
    onFinishFailed?: (errorInfo: Record<string, any>) => void; // 提交失败
    children?: ReactNode; // dom元素
}

const Form = (props: FormProps) => {

    const {
        className,
        style,
        initialValues,
        onFinish,
        onFinishFailed,
        children,
        ...others
    } = props;

    const [values, setValue] = useState<Record<string, any>>(initialValues || {})

    // 为啥不用useState ,修改 state 调用 setState 的时候会触发重新渲染, ref 的值保存在 current 属性上，修改它不会触发重新渲染。
    const validatorMap = useRef(new Map<string, Function>())
    const errors  = useRef<Record <string, any>>({})

    //  ====方法====
    const onValueChange = (key: string, value: any) => {
        values[key] = value
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        debugger
        for (const [key, callBackFn] of validatorMap.current) {
            if(typeof callBackFn === 'function') {
                errors.current[key] = callBackFn()
            }
        }

        //  Fill Boolean是什么意思？
        const errList = Object.keys(errors.current).map(key => {
            return errors.current[key]
        }).filter(Boolean)

        if(errList.length) {
            onFinishFailed?.(errors.current)
        }else{
            onFinish?.(values)
        }

    }

    const handleValidateRegister = (name: string, cb: Function) => {
        validatorMap.current.set(name, cb)
    }

    const cls = classNames('ant-form', className)

    return <>
        <FormContext.Provider value={{
            onValueChange,
            values,
            setValues: (v) => setValue(v),
            validateRegister:handleValidateRegister
        }}>
            <form className={cls} style={style} onSubmit={handleSubmit} {...others}>
                {children}
            </form>
        </FormContext.Provider>
    </>
}


export default Form;