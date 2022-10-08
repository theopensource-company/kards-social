import React, {
  createRef,
  ReactNode,
  RefObject,
  useEffect,
  useState,
} from "react";
import { TFormItem } from "../../constants/Types";
import { v4 as uuidv4 } from "uuid";

export abstract class FormItem<
  TConfig extends TFormItem<TValueType>,
  TFormItemType = HTMLInputElement,
  TValueType = string
> extends React.Component {
  protected readonly config: TConfig;
  protected readonly ref: RefObject<TFormItemType>;
  public readonly name: string;

  constructor(config: TConfig) {
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

  isValid(): boolean {
    const res = this.config.isValid ? this.config.isValid(this.value()) : true;
    (this.ref.current as HTMLElement).classList[res ? "remove" : "add"](
      "invalid"
    );
    return res;
  }

  protected abstract getValue(): TValueType;
  protected abstract renderer(): ReactNode;

  render() {
    return RenderFormItem(this);
  }
}

const RenderFormItem = (t: any) => {
  const [randId, setRandId] = useState("");
  useEffect(() => setRandId(`kards:formitem:${uuidv4()}`), []);
  if (!t.config.id) t.config.id = randId;
  return t.renderer();
};
