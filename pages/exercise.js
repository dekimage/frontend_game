import React, { useEffect } from "react";
import { useState } from "react";
const Child = ({ name }) => {
  const [children, setChildren] = useState([]);
  const addChild = (name, childrenLength) => {
    let updatedChildren = children.slice();
    const newName =
      name == "Root"
        ? `${childrenLength + 1}`
        : `${name}.${childrenLength + 1}`;
    updatedChildren.push({ name: newName });
    setChildren(updatedChildren);
  };

  useEffect(() => {
    console.log(children);
  }, [children]);
  return (
    <div
      style={{
        margin: "0.75rem",
        padding: "0.75rem",
        boxShadow: "0px 0px 5px 1.5px rgba(0, 0, 0, 0.08)",
        borderRadius: "10px",
      }}
    >
      <div style={{ padding: "0.5rem", fontSize: "20px" }}>{name}</div>
      <button
        style={{ width: "50px", height: "50px", cursor: "pointer" }}
        onClick={() => addChild(name, children.length)}
      >
        +
      </button>
      {children.map((c) => {
        return <Child name={c.name} />;
      })}
    </div>
  );
};

const RootParent = () => {
  return <Child name={"Root"} />;
};

export default RootParent;
