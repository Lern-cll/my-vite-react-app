import InternalForm from './Form'
import Item from './Item'

type InternalFormType = typeof InternalForm;

// 给Form组件增加Item类型
interface FormInterface extends  InternalFormType {
  Item: typeof Item
}

const Form = InternalForm as FormInterface;

Form.Item = Item;

export default Form;