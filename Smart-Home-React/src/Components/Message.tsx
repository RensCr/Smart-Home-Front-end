import { useState } from "react";

function Message() {
  const [text, setText] = useState("Hello world");

  const handleClick = () => {
    setText(text + ".");
  };

  return <h1 onClick={handleClick}>{text}</h1>;
}

export default Message;
