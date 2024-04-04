import ApiConstants from "../adapter/ApiConstants";
import ApiOperation from "../adapter/ApiOperation";

const CategoriesFactories = {
  getListCategories: async data => {
    let params = {};
    if (data) {
      params.Keyword = data;
    }
    return ApiOperation.request({
      url: ApiConstants.CATEGORIES,
      method: "GET",
      params: params
    });
  },
  createCategory: async data => {
    return ApiOperation.request({
      url: ApiConstants.CATEGORIES,
      method: "POST",
      data: data,
    });
  },
  updateCategory: async (id,data) => {
    return ApiOperation.request({
      url: `${ApiConstants.CATEGORIES}/${id}`,
      method: "PUT",
      data: data
    });
  },
  deleteCategory: async id => {
    return ApiOperation.request({
      url: `${ApiConstants.CATEGORIES}/${id}`,
      method: "DELETE",
    });
  }
};

export default CategoriesFactories;
