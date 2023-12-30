// Action Types
export const SET_TAGS = 'SET_TAGS';
export const UPDATE_TAG_DETAILS = 'UPDATE_TAG_DETAILS'; // New action type
export const UPDATE_TAG_COLOR = 'UPDATE_TAG_COLOR';
export const UPDATE_TAG_TEXT = 'UPDATE_TAG_TEXT';
export const DELETE_TAG = 'DELETE_TAG';

// Action Creators
export function setTags(tags) {
  return {
    type: SET_TAGS,
    payload: tags
  };
}

export function updateTagDetails(tagDetails) {
  return {
    type: UPDATE_TAG_DETAILS,
    payload: tagDetails
  };
}

export function updateTagColor  (tagName, color) {
  return {
    type: UPDATE_TAG_COLOR,
    payload: { tagName, color }
  };
};


export function updateTagText(tagId, oldText, newText) {
  return {
    type: UPDATE_TAG_TEXT,
    payload: { tagId, oldText, newText }
  };
}


export function deleteTag(id, tagToDelete) {
  return {
    type: DELETE_TAG,
    payload: { id, tagToDelete }
  };
}