import ApiConstants from "../adapter/ApiConstants";
import ApiOperation from "../adapter/ApiOperation";

const AccountFactories = {
  requestLogin: async data => {
    return ApiOperation.request({
      url: ApiConstants.LOGIN,
      method: "POST",
      data: data
    });
  },
  requestLSignUp: async data => {
    return ApiOperation.request({
      url: ApiConstants.SIGNUP,
      method: "POST",
      data: data
    });
  },
  requestUpdate: async (id, data) => {
    return ApiOperation.request({
      url: `${ApiConstants.ACCOUNT}/${id}`,
      method: "PUT",
      data: data
    });
  },
  requestUpdatePhotoList: async (id, data) => {
    return ApiOperation.request({
      url: `${ApiConstants.ACCOUNT_PHOTO}/${id}`,
      method: "PUT",
      data: data
    });
  },
  requestHint: async (id, data) => {
    return ApiOperation.request({
      url: `${ApiConstants.Interpreters}/${id}`,
      method: "POST",
      data: data
    });
  },
  updateStatusRequestHINT: async (id,Type) => {
    let params = {};
    if (Type){
      params.Type = Type;
    }
    return ApiOperation.request({
      url: `${ApiConstants.Interpreters}/${id}`,
      method: "PUT",
      params: params
    });
  },
  getListAccount: async (data,type = 10) => {
    let params={};
    if (data) {
      params.Keyword = data
    }
    if (type ){
      params.Type = type
    }
    return ApiOperation.request({
      url: `${ApiConstants.ACCOUNT}`,
      method: "GET",
      params: params
    });
  },
};

export default AccountFactories;
