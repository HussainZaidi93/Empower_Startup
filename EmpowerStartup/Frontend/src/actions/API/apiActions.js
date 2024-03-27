import PropTypes from 'prop-types';
import axios from 'axios';

export async function Get(payload, actionURL, onSuccess, onError) {
  try {
    const response = await axios.get(actionURL, { params: payload });
    onSuccess(response);
  } catch (error) {
    if (onError) onError(error.message);
  }
}

Get.PropTypes = {
  payload: PropTypes.node.isRequired,
  actionURL: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};

export async function Post(payload, actionURL, onSuccess, onError) {
  try {
    const response = await axios.post(actionURL, payload);
    onSuccess(response);
  } catch (error) {
    onError(error.message);
  }
}

Post.PropTypes = {
  payload: PropTypes.node.isRequired,
  actionURL: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};
