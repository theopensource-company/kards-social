import React, {
  createRef,
  ReactNode,
  RefObject,
  useEffect,
  useState,
} from "react";
import { TFormItem } from "../../constants/Types";
import { v4 as uuidv4 } from "uuid";

/*
 *  Used only as a template class for other form item components.
 *  Handles a lot of the logic for them.
 */

export abstract class FormItem<
  TConfig extends TFormItem<TValueType>,
  TFormItemType = HTMLInputElement,
  TValueType = string
> extends React.Component {
  protected readonly config: TConfig;
  protected readonly ref: RefObject<TFormItemType>;
  public readonly name: string;

  constructor(config: TConfig) {
    if (!config.invalidClass) config.invalidClass = `invalid`;
    if (!config.size) config.size = `Large`;
    super(config);
    this.name = config.name;
    this.config = config;
    this.ref = createRef<TFormItemType>();
    this.render = this.render.bind(this);
    this.value = this.value.bind(this);
    this.isValid = this.isValid.bind(this);
  }

  value(raw = false): TValueType {
    return raw || !this.config.process
      ? this.getValue()
      : this.config.process(this.getValue());
  }

  /*
   *  If defined for the field, uses it's validation function to see if the field has a valid value. 
   *  Adds an a component defined invalid class, or simply the "invalid" class to the field.
   */

  isValid(): boolean {
    const res = this.config.isValid ? this.config.isValid(this.value()) : true;
    (this.ref.current as HTMLElement).classList[res ? "remove" : "add"](
      this.config.invalidClass!
    );
    return res;
  }

  protected abstract getValue(): TValueType;
  protected abstract renderer(): ReactNode;

  render() {
    return RenderFormItem(this);
  }
}

/*
 *  Class components cannot use React Hooks, but we need them in this case to prevent a mismatch in randomly generated ID's for client and server.
 *  Solution: Place the hooks in a functional component and let the class component use the functional component.
 */

const RenderFormItem = (t: any) => {
  const [randId, setRandId] = useState("");
  useEffect(() => setRandId(`kards:formitem:${uuidv4()}`), []);
  if (!t.config.id) t.config.id = randId;
  return t.renderer();
};
