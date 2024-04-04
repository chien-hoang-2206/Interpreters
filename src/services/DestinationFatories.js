import ApiConstants from "../adapter/ApiConstants";
import ApiOperation from "../adapter/ApiOperation";

const DestinationFactories = {
  getListDestination: async data => {
    let params = {};
    if (data) {
      params.Keyword = data;
    }
    return ApiOperation.request({
      url: ApiConstants.Destination,
      method: "GET",
      params: params
    });
  },
  createDestination: async data => {
    return ApiOperation.request({
      url: ApiConstants.Destination,
      method: "POST",
      data: data,
    });
  },
  updateDestination: async (id,data) => {
    return ApiOperation.request({
      url: `${ApiConstants.Destination}/${id}`,
      method: "PUT",
      data: data
    });
  },
  deleteDestination: async id => {
    return ApiOperation.request({
      url: `${ApiConstants.Destination}/${id}`,
      method: "DELETE",
    });
  }
};

export default DestinationFactories;
