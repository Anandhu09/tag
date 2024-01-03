// CustomTag.jsx
import React from "react";
import { Tag } from "antd";

const CustomTag = ({ label, value, color, closable, onClose }) => {
  const truncateLabel = (label, maxLength = 15) => {
    return label.length > maxLength
      ? label.substring(0, maxLength) + "..."
      : label;
  };
  return (
    <Tag
      color={color || "default"}
      closable={closable}
      onClose={onClose}
      style={{ marginBottom: 3 }}
    >
      {truncateLabel(label)}
    </Tag>
  );
};

export default CustomTag;
