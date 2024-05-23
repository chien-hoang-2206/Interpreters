import ApiConstants from "../adapter/ApiConstants";
import ApiOperation from "../adapter/ApiOperation";

const BookingFactories = {
  getListBooking: async (name, dateCreate, dateBooking) => {
    let params = {};
    if (name) {
      params.Keyword = name;
    }
    if (dateCreate) {
      params.DateCreate = dateCreate;
    }
    if (dateBooking) {
      params.DateBooking = dateBooking;
    }
    return ApiOperation.request({
      url: `${ApiConstants.BOOKING}`,
      method: "GET",
      params: params
    });
  },
  getListBookingForUser: async id => {
    return ApiOperation.request({
      url: `${ApiConstants.BOOKING_USER}/${id}`,
      method: "GET",
    });
  },
  getListRequestBookingForHint: async id => {
    return ApiOperation.request({
      url: `${ApiConstants.BOOKING_Hint}/${id}`,
      method: "GET",
    });
  },
  requestBooking: async data => {
    return ApiOperation.request({
      url: ApiConstants.BOOKING,
      method: "POST",
      data: data,
    });
  },
  checkrequestTimeBooking: async data => {
    return ApiOperation.request({
      url: ApiConstants.BOOKING_TIME,
      method: "POST",
      data: data,
    });
  },
  updateBooking: async (id, type, rate, comment, hint_id, amount, userName) => {
    const data = {
      rate: rate,
      comment: comment,
      hint_id: hint_id,
      amount: amount,
      user_name: userName,
    }
    return ApiOperation.request({
      url: `${ApiConstants.BOOKING}/${id}`,
      method: "PUT",
      data: data,
      params: {
        type: type
      }
    });
  },

  deleteBookingId: async (id) => {
    return ApiOperation.request({
      url: `${ApiConstants.BOOKING}/${id}`,
      method: "DELETE",
    });
  },
  getBookingDetail: async data => {
    return ApiOperation.request({
      url: `${ApiConstants.BOOKING}/${data}`,
      method: "GET",
    });
  },
  getBookingChart: async (year, month, date) => {
    let params = {
    };
    if (year) {
      params.Year = year;
    }
    if (month) {
      params.Month = month;
    }
    if (date) {
      params.Date = date;
    }
    return ApiOperation.request({
      url: `${ApiConstants.BOOKING_CHART}`,
      method: "GET",
      params: params,
    });
  },
  getBookingTopHINT: async (year, month, date) => {
    let params = {
    };
    if (year) {
      params.Year = year;
    }
    if (month) {
      params.Month = month;
    }
    if (date) {
      params.Date = date;
    }
    return ApiOperation.request({
      url: `${ApiConstants.BOOKING_TOP}`,
      method: "GET",
      params: params,
    });
  },
};

export default BookingFactories;
