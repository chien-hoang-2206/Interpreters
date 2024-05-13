import ApiConstants from "../adapter/ApiConstants";
import ApiOperation from "../adapter/ApiOperation";

const PostFactories = {
  getListPost: async data => {
    let params = {};
    if (data.user_id) {
      params.user_id = data.user_id;
    }
    if (data.Keyword) {
      params.Keyword = data.Keyword;
    }
    if (data.date) {
      params.date = data.date;
    }
    return ApiOperation.request({
      url: ApiConstants.POST,
      method: "GET",
      params: params
    });
  },
  createPost: async data => {
    return ApiOperation.request({
      url: ApiConstants.POST,
      method: "POST",
      data: data,
    });
  },
  getDetailPost: async (id, data) => {
    return ApiOperation.request({
      url: `${ApiConstants.POST}/${id}`,
      method: "GET",
      data: data
    });
  },
  updatePost: async (id, data) => {
    return ApiOperation.request({
      url: `${ApiConstants.POST}/${id}`,
      method: "PUT",
      data: data
    });
  },
  deletePost: async id => {
    return ApiOperation.request({
      url: `${ApiConstants.POST}/${id}`,
      method: "DELETE",
    });
  }
};

export default PostFactories;
