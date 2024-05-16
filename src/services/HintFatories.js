import ApiConstants from "../adapter/ApiConstants";
import ApiOperation from "../adapter/ApiOperation";

const HintFactories = {
  getListHINT: async ( Type = 10  , KeyWord, Category) => {
    let params = {} ; 
    if (KeyWord){
      params.KeyWord = KeyWord;
    }
    if (Category){
      params.Category = Category;
    }
    if (Type){
      params.Type = Type;
    }
    return ApiOperation.request({
      url: ApiConstants.Interpreters,
      method: "GET",
      params: params, 
    });
  },
  getHINTDetail: async data => {
    return ApiOperation.request({
      url: `${ApiConstants.Interpreters}/${data}`,
      method: "GET",
    });
  },
  getHINTFeedbackList: async data => {
    return ApiOperation.request({
      url: `${ApiConstants.HINT_FEEDBACK}/${data}`,
      method: "GET",
    });
  },
  requestBooking: async data => {
    return ApiOperation.request({
      url: ApiConstants.BOOKING_Hint,
      method: "POST",
      data: data,
    });
  },
};

export default HintFactories;
