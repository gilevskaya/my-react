export type Text = string | number;

export type Node = Element | Text;

export type Props = {
  children?: Node[];
  [prop: string]: any;
};

export type Element =
  | {
      type: string;
      props: Props;
    }
  | {
      type: "TEXT_ELEMENT";
      props: {
        nodeValue: string | number;
        children: [];
      };
    };

export function createElement(
  type: string,
  props: Props | null,
  ...children: Node[]
): Element {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

export function createTextElement(text: Text): Element {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}
