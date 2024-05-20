import React, {ChangeEvent, CSSProperties, ReactElement, ReactNode, useContext, useEffect, useState} from "react";
import FormContext from "@/components/Form/FormContext";
import Schema, { Rules } from 'async-validator';
import  classNames from 'classnames';
export  interface  ItemProps {
    className?: string;
    style?: CSSProperties
    label?: ReactNode;
    name?: string;
    valuePropName?: string;
    rules?: Array<Record<string, any>>;
    children?: ReactElement; // 渲染的组件 ReactElement包含了string、 number等类型
}



const getValueFromEvent = (e: ChangeEvent<HTMLFormElement>) => {
    const {target} = e
    if(target.type === 'checkbox') {
        return target.checked
    }else if(target.type === 'radio') {
        return target.value
    }

    return target.value
}

const Item = (props: ItemProps) => {
    const {
        className,
        label,
        children,
        style,
        name,
        valuePropName,
        rules,
    } = props


    const [value, setValue] = useState<string | number | boolean>()
    const [error, setError] = useState('')

    const {values, onValueChange, validateRegister} = useContext(FormContext)

    // 校验
    const handleValidate = (value: any) => {
        let errorMsg = null;
        if(Array.isArray(rules) && rules.length) {
            const validator = new Schema({
                [name]: rules.map(rule => {
                    return {
                        type: 'string',
                        ...rule
                    }
                })
            })

            validator.validate({[name]: value}, (errors) => {
                if(errors) {
                    setError(errors[0].message)
                    errorMsg = errors[0].message
                }else{
                    setError('')
                    errorMsg = null
                }
            })
        }

        return errorMsg;
    }


    useEffect(() => {
        if(value !== values?.[name]) {
            setValue(values?.[name])
        }
    }, [values, values?.[name]])


    const propsName: Record<string, any> = {};
    if(valuePropName) {
        propsName[valuePropName] = value
    }else{
        propsName.value = value
    }

    const childELe = React.Children.toArray(children).length > 1 ? children : React.cloneElement(children!, {
        ...propsName,
        onChange: (e: ChangeEvent<HTMLFormElement>) => {
            const value = getValueFromEvent(e);
            setValue(value)
            onValueChange?.(name as string, value);

            handleValidate(value)
        }
    })

    const cls  = classNames('ant-form-item', className)


    //  如果没有属性就返回节点
    if(!name) {
        return children;
    }
    // ================方法======================


    return (
        <div className={cls} style={style}>
            <div>
                {
                    label && <label>{label}</label>
                }
            </div>
            <div>
                {childELe}
                {error && <div style={{color: 'red'}}>{error}</div>}
            </div>
        </div>
    )
}


export default  Item