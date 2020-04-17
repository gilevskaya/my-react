import { Element, Props } from "./element";

export type Fiber = {
  dom: any;
  type: string;
  props: Props;
  parent?: Fiber; // no parent if root
  child?: Fiber;
  sibling?: Fiber;
};

export type Container = {
  [p: string]: any;
};

let nextUnitOfWork: Fiber | null = null;
let wipRoot: Fiber | null = null;

export function render(element: Element, container: Container) {
  wipRoot = {
    dom: container,
    type: element.type,
    props: {
      children: [element],
    },
  };
  nextUnitOfWork = wipRoot;
}

// @ts-ignore
requestIdleCallback(workLoop);

function workLoop(deadline: any) {
  console.log("workLoop", nextUnitOfWork);
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  // @ts-ignore
  requestIdleCallback(workLoop);
}

function createDom(fiber: Fiber) {
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  console.log("createDom", fiber, dom);

  Object.keys(fiber.props)
    .filter((key: string) => key !== "children")
    .forEach((name) => {
      dom[name] = fiber.props[name];
    });

  return dom;
}

function performUnitOfWork(fiber: Fiber): Fiber | null {
  console.log("performUtitOfWork", fiber);
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  const elements = fiber.props.children;
  let index = 0;
  let prevSibling = null;

  while (index < elements.length) {
    const element = elements[index];

    const newFiber: Fiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    };

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;

    if (fiber.child) {
      return fiber.child;
    }
    let nextFiber = fiber;
    while (nextFiber) {
      if (nextFiber.sibling) {
        return nextFiber.sibling;
      }
      nextFiber = nextFiber.parent;
    }
  }
}

function commitRoot() {
  commitWork(wipRoot.child);
  wipRoot = null;
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }
  const domParent = fiber.parent.dom;
  domParent.appendChild(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}
