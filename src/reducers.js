import {
  SET_TAGS,
  UPDATE_TAG_DETAILS,
  UPDATE_TAG_COLOR,
  UPDATE_TAG_TEXT,
  DELETE_TAG
} from "./actions";

const initialState = {
  tagDetails: [], // Array to store tag details
};

function tagsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_TAGS:
      return {
        ...state,
        tags: action.payload,
      };
    case UPDATE_TAG_DETAILS:
      const updateIndex = state.tagDetails.findIndex(
        (detail) => detail.id === action.payload.id
      );
      if (updateIndex !== -1) {
        let updatedTagDetails = [...state.tagDetails];
        updatedTagDetails[updateIndex] = {
          ...updatedTagDetails[updateIndex],
          tags: action.payload.tags, // Update with the new set of tags
        };
        return {
          ...state,
          tagDetails: updatedTagDetails,
        };
      } else {
        // Add new entry if the ID doesn't exist
        return {
          ...state,
          tagDetails: [...state.tagDetails, action.payload],
        };
      }
    case UPDATE_TAG_COLOR:
      const { tagName, color } = action.payload;

      return {
        ...state,
        tagDetails: state.tagDetails.map((detail) => {
          // Check if this is the detail object that contains the tag
          if (detail.tags.some((tag) => tag.text === tagName)) {
            // Map over the tags and update the color of the matching tag
            return {
              ...detail,
              tags: detail.tags.map((tag) =>
                tag.text === tagName ? { ...tag, color: color } : tag
              ),
            };
          }
          return detail;
        }),
      };
    case UPDATE_TAG_TEXT:
      const { tagId, oldText, newText } = action.payload;

      return {
        ...state,
        tagDetails: state.tagDetails.map((detail) => {
          // Check if this is the detail object that contains the tag
          if (detail.id === tagId) {
            // Map over the tags and update the text of the matching tag
            return {
              ...detail,
              tags: detail.tags.map((tag) =>
                tag.text === oldText ? { ...tag, text: newText } : tag
              ),
            };
          }
          return detail;
        }),
      };
    case DELETE_TAG:
    const { id, tagToDelete } = action.payload;
    return {
      ...state,
      tagDetails: state.tagDetails.map(detail => 
        detail.id === id ? { ...detail, tags: detail.tags.filter(tag => tag.text !== tagToDelete) } : detail
      )
    };
  
    default:
      return state;
  }
}

export default tagsReducer;
