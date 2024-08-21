import MyReact, { useEffect, useState } from "./MyReact.mjs";

function ExampleComponent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("foo");
  useEffect(() => {
    console.log("effect", count, text);
    return () => {
      console.log("cleanup", count, text);
    };
  }, [count, text]);
  return {
    click: () => setCount(count + 1),
    type: (text) => setText(text),
    noop: () => setCount(count),
    render: () => console.log("render", { count, text }), // 현재 상태 출력하도록 변경
  };
}

let App = MyReact.render(ExampleComponent); // 초기 렌더링

App.click();
App = MyReact.render(ExampleComponent);

App.type("bar");
App = MyReact.render(ExampleComponent);

App.noop();
App = MyReact.render(ExampleComponent);

App.click();
App = MyReact.render(ExampleComponent);
