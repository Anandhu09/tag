import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  Select,
  Menu,
  Tag,
  Modal,
  notification,
  Empty,
} from "antd";
import {
  MoreOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  updateTagDetails,
  updateTagColor,
  // updateTagText,
  deleteTag,
} from "./actions";
import "./App.css";

const App = () => {
  const tagDetails = useSelector((state) => state.tagsReducer.tagDetails);
  const dispatch = useDispatch();
  const [options, setOptions] = useState([]);
  const [tagColorMap, setTagColorMap] = useState({});
  const [selectedValues, setSelectedValues] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTag, setActiveTag] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [inputTag, setInputTag] = useState("");
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [tagToDelete, setTagToDelete] = useState(null);

  const tagColors = [
    "magenta",
    "orange",
    "green",
    "cyan",
    "blue",
    "geekblue",
    "purple",
  ];

  useEffect(() => {
    if (activeTag) {
      setInputValue(activeTag);
    }
  }, [activeTag]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const updateTag = () => {
    const trimmedInput = inputValue.trim();
   
  
    if (trimmedInput && trimmedInput !== activeTag) {
      const newSelectedValues = selectedValues.includes(activeTag)
        ? selectedValues.map((value) =>
            value === activeTag ? trimmedInput : value
          )
        : selectedValues;
  
      const indexToUpdate = options.findIndex(
        (option) => option.value === activeTag
      );
  
      if (indexToUpdate > -1) {
        // Update options array with the new tag
        const newOptions = [
          ...options.slice(0, indexToUpdate),
          { value: trimmedInput, label: trimmedInput },
          ...options.slice(indexToUpdate + 1),
        ];
  
        // Update the tag color map with the new tag name
        const newTagColorMap = {
          ...tagColorMap,
          [trimmedInput]: tagColorMap[activeTag] || tagColors[Object.keys(tagColorMap).length % tagColors.length],
        };
        delete newTagColorMap[activeTag];
  
        // Create the updatedTagDetails array for the payload
        const updatedTagDetails = newSelectedValues.map((tag) => ({
          text: tag,
          color: newTagColorMap[tag],
        }));
  
        // Dispatch the update to the Redux store
        dispatch(updateTagDetails({ id: 2974, tags: updatedTagDetails }));
  
        // Update the local component state
        setTagColorMap(newTagColorMap);
        setOptions(newOptions);
        setSelectedValues(newSelectedValues);
  
        // Reset the active tag
        setActiveTag(null);
        setIsModalVisible(false);
      }
    }
  };
  

  const handleInputKeyPress = (e) => {
    const trimmedInput = inputValue.trim();
    if (e.key === "Enter") {
      const isDuplicate = options.some((option) => option.value === trimmedInput);
  
      if (isDuplicate) {
        notification.warning({
          message: "Duplicate Tag",
          description: "This tag already exists.",
          duration: 3,
        });
        return;
      }
      updateTag();
    }
  };

  const handleModalClose = () => {
    updateTag(); // Save the tag if needed
    setActiveTag(null);
    setIsModalVisible(false);
  };
  
  

  const handleEditClick = (event, value) => {
    event.stopPropagation();

    // Set active tag
    setActiveTag(value);

    if (event.currentTarget) {
      // const rect = event.currentTarget.getBoundingClientRect();
      // Calculate the position just below the three-dot icon
      // You might need to adjust '5' based on the exact visual offset you want
      // const positionBelowIcon = rect.bottom + 5;
      // setModalPosition({
      //   x: rect.left + window.scrollX, // Horizontal alignment
      //   y: positionBelowIcon + window.scrollY, // Vertical alignment just below the icon
      // });
    }
    // Show the modal
    setIsModalVisible(true);
  };

  const handleColorChange = (color) => {
    if (activeTag) {
      // Update the color map for the active tag
      const newTagColorMap = { ...tagColorMap, [activeTag]: color };
      setTagColorMap(newTagColorMap);

      // Dispatch action to update tag color in the Redux store
      dispatch(updateTagColor(activeTag, color));
    }
  };

  const renderColorModal = () => {
    return (
      <Modal
        title="Update Tag"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={300}
        centered
        style={{
          zIndex: 1000,
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", padding: "10px" }}
        >
          {/* Update Tag Input Field */}
          {activeTag && (
            <div style={{ marginBottom: "10px" }}>
              <Input
                value={inputValue}
                onChange={handleInputChange}
                onPressEnter={handleInputKeyPress}
                style={{ width: "100%" }}
              />
            </div>
          )}

          {/* Delete Tag Button */}
          <Button
            type="primary"
            style={{
              width: "100%",
              marginBottom: "10px",
              cursor: "pointer",
              color: "rgb(235, 87, 87)",
              border: "1px solid rgba(235, 87, 87, 0.5)",
              marginTop: "8px",
              background: "rgba(235, 87, 87, 0.1)",
            }}
            onClick={() => handleDeleteTag(activeTag)}
          >
            <DeleteOutlined />
            Delete Tag
          </Button>

          {/* Colors Heading */}
          <div style={{ fontWeight: "bold", marginBottom: "10px" }}>Colors</div>

          {/* Colors List */}
          {tagColors.map((color) => (
            <div
              key={color}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
                padding: "5px",
                backgroundColor:
                  tagColorMap[activeTag] === color ? "#f0f0f0" : "transparent",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => handleColorChange(color)}
            >
              <Tag
                color={color}
                icon={
                  tagColorMap[activeTag] === color ? (
                    <CheckCircleOutlined />
                  ) : null
                }
              >
                {color}
              </Tag>
            </div>
          ))}
        </div>
      </Modal>
    );
  };

  const handleDeleteTag = (tagName) => {
    setTagToDelete(tagName);
    setIsDeleteConfirmVisible(true);
  };

  const confirmDelete = () => {
    if (tagToDelete) {
      dispatch(deleteTag(2974, tagToDelete));

      // Remove the tag from the options
      const newOptions = options.filter(
        (option) => option.value !== tagToDelete
      );
      setOptions(newOptions);

      // Remove the tag from selectedValues
      const newSelectedValues = selectedValues.filter(
        (value) => value !== tagToDelete
      );
      setSelectedValues(newSelectedValues);

      // Remove the tag from the color map
      const newTagColorMap = { ...tagColorMap };
      delete newTagColorMap[tagToDelete];
      setTagColorMap(newTagColorMap);

      // Reset active tag and close the modals
      setActiveTag(null);
      setIsModalVisible(false);
      setIsDeleteConfirmVisible(false);
      setTagToDelete(null);
    }
  };

  const renderDeleteConfirmationModal = () => {
    return (
      <Modal
        title="Confirm Deletion"
        open={isDeleteConfirmVisible}
        onOk={confirmDelete}
        onCancel={() => setIsDeleteConfirmVisible(false)}
        footer={null} // Remove default footer
        centered
        width={300}
      >
        <div style={{ textAlign: "center" }}>
          {" "}
          {/* Center content */}
          <p>Are you sure you want to delete this option?</p>
          <Button
            key="delete"
            onClick={confirmDelete}
            style={{
              cursor: "pointer",
              color: "rgb(235, 87, 87)",
              border: "1px solid rgba(235, 87, 87, 0.5)",
              width: "100%",
              marginTop: "8px",
              marginBottom: "18px",
              background: "rgba(235, 87, 87, 0.1)",
            }}
          >
            Delete
          </Button>
          <Button
            key="cancel"
            onClick={() => setIsDeleteConfirmVisible(false)}
            style={{ width: "100%" }} // Full width button
          >
            Cancel
          </Button>
        </div>
      </Modal>
    );
  };

  useEffect(() => {
    console.log(tagDetails, "hey", options);
  }, [tagDetails, options]);

  const CustomTag = (props) => {
    const { label, value, closable, onClose } = props;
    const backgroundColor = tagColorMap[value] || "default";
    return (
      <Tag
        color={backgroundColor}
        closable={closable}
        onClose={onClose}
        style={{ marginBottom: 3 }}
      >
        {label}
      </Tag>
    );
  };

  const dropdownRender = (menu) => {
    // Filter options based on the input
    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(inputTag.toLowerCase())
    );

    // Check if the current input is part of the filtered options
    const isInputInOptions = filteredOptions.some(
      (option) => option.label.toLowerCase() === inputTag.toLowerCase()
    );

    // Show the user's input as a new option if it's not in the options
    const inputOption =
      inputTag && !isInputInOptions
        ? [
            <Menu.Item key="inputTag">
              <CustomTag label={inputTag} value={inputTag} />
            </Menu.Item>,
          ]
        : [];

    // If there are no options and no input, show the "Empty" state
    if (filteredOptions.length === 0 && !inputTag) {
      return <Empty />;
    }

    // Combine the input option with filtered options
    const menuItems = inputOption.concat(
      filteredOptions.map((option) => (
        <Menu.Item key={option.value}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
            onClick={() => toggleTagSelection(option.value)}
          >
            <div style={{ flex: 1, marginRight: "10px" }}>
              <CustomTag label={option.label} value={option.value} />
            </div>
            <div
              className="icon-hover-box"
              onClick={(event) => {
                event.stopPropagation();
                handleEditClick(event, option.value);
              }}
            >
              <MoreOutlined
                style={{
                  cursor: "pointer",
                  flexShrink: 0,
                  transform: "rotate(90deg)",
                  width: "auto",
                  height: "auto",
                }}
              />
            </div>
          </div>
        </Menu.Item>
      ))
    );

    return (
      <Menu
        style={{
          maxHeight: "300px",
          overflowY: "auto",
        }}
      >
        {menuItems}
      </Menu>
    );
  };

  const toggleTagSelection = (value) => {
    if (selectedValues.includes(value)) {
      // Remove the tag from selected values
      setSelectedValues(selectedValues.filter((tag) => tag !== value));
    } else {
      // Add the tag to selected values
      setSelectedValues([...selectedValues, value]);
    }
    setInputTag("");
  };

  const updateTagInformation = (newTags) => {
    const newTagColorMap = { ...tagColorMap };
    const updatedTagDetails = [];

    newTags.forEach((tag) => {
      if (!newTagColorMap[tag]) {
        newTagColorMap[tag] =
          tagColors[Object.keys(newTagColorMap).length % tagColors.length];
      }
      updatedTagDetails.push({ text: tag, color: newTagColorMap[tag] });
    });

    setTagColorMap(newTagColorMap);
    dispatch(updateTagDetails({ id: 2974, tags: updatedTagDetails }));

    // Update options
    const newOptions = [
      ...new Set([...options.map((option) => option.value), ...newTags]),
    ].map((text) => ({ value: text, label: text }));
    setOptions(newOptions);
  };

  const handleChange = (value, id) => {
    // Update the color map and tag details for selected values
    setSelectedValues(value);
    updateTagInformation(value);
  };

  const handleEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newTag = inputTag.trim();

      if (newTag && !options.some((option) => option.value === newTag)) {
        const newSelectedValues = [...selectedValues, newTag];
        setSelectedValues(newSelectedValues);
        updateTagInformation(newSelectedValues);
      }

      setInputTag("");
    }
  };

  return (
    <div className="App">
      <Select
        mode="tags"
        style={{ width: "340px" }}
        placeholder="Tags Mode"
        value={selectedValues}
        onSearch={setInputTag}
        searchValue={inputTag} 
        onChange={(value) => handleChange(value, 2974)}
        onBlur={() => setInputTag("")} 
        tagRender={CustomTag}
        dropdownRender={dropdownRender}
        dropdownStyle={{ zIndex: 500 }}
        showSearch
        onInputKeyDown={handleEnterKeyPress}
      />

      {renderColorModal()}
      {renderDeleteConfirmationModal()}
    </div>
  );
};

export default App;
