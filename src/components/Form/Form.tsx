import React, {CSSProperties, ReactNode, useRef, useState} from 'react'
import  classNames from 'classnames';

export interface FormProps extends React.HTMLAttributes<HTMLFormElement> {
    className?: string;
    style?: CSSProperties;
    initialValues?: Record<string, any>;
    onFinsih?: (values: Record<string, any>) => void;
    onFinsihFailed?: (errorInfo: Record<string, any>) => void;
    children?: ReactNode;
}

type Function = () => void;

const Form = (props: FormProps) => {

    const {
        className,
        style,
        initialValues,
        onFinsih,
        onFinsihFailed,
        children,
        ...others
    } = props;

    const [values, setValues] = useState<Record<string, any>>(initialValues || {})

    // 为啥不用useState ,修改 state 调用 setState 的时候会触发重新渲染, ref 的值保存在 current 属性上，修改它不会触发重新渲染。
    const validatorMap = useRef(new Map<string, () => void>())
    const errors  = useRef<Record <string, any>>({})

    //  ====方法====
    const onValueChange = (key: string, value: any) => {
        values[key] = value
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        for (let [key, callBackFn] of validatorMap.current) {
            if(typeof callBackFn === 'function') {
                errors.current[key] = callBackFn()
            }
        }

        //  Fill Boolean是什么意思？
        const errList = Object.keys(errors.current).map(key => {
            return errors.current[key]
        }).fill(Boolean)

        if(errList.length) {
            onFinsihFailed?.(errors.current)
        }else{
            onFinsih?.(values)
        }

    }



    return <>

    </>
}


export default Form;