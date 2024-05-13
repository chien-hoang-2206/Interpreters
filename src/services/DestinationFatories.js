import ApiConstants from "../adapter/ApiConstants";
import ApiOperation from "../adapter/ApiOperation";

const DestinationFactories = {
  getListDestination: async data => {
    let params = {};
    if (data.Province) {
      params.Province = data.Province;
    }
    if (data.Type) {
      params.Type = data.Type;
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
  updateDestination: async (id, data) => {
    return ApiOperation.request({
      url: `${ApiConstants.Destination}/${id}`,
      method: "PUT",
      data: data
    });
  },
  getListDestinationDetail: async (id) => {
    return ApiOperation.request({
      url: `${ApiConstants.Destination}/${id}`,
      method: "GET",
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
