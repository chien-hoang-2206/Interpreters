import ApiConstants from "../adapter/ApiConstants";
import ApiOperation from "../adapter/ApiOperation";

const BannerFactories = {
  requestAdd: async data => {
    return ApiOperation.request({
      url: ApiConstants.BANNER,
      method: "POST",
      data: data
    });
  },
  requestEdit: async (id, data) => {
    return ApiOperation.request({
      url: `${ApiConstants.BANNER}/${id}`,
      method: "PUT",
      data: data
    });
  },
  requestDelete: async (id) => {
    return ApiOperation.request({
      url: `${ApiConstants.BANNER}/${id}`,
      method: "DELETE",
    });
  },
  getListBanner: async () => {
    return ApiOperation.request({
      url: `${ApiConstants.BANNER}`,
      method: "GET",
    });
  },
};

export default BannerFactories;
