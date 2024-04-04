import { Table } from "antd";
import { useContext, useEffect, useState } from "react";
// import { getPaymentHistory } from "../../../services/getApiProfile";
import { displayDateTime } from "../../../services/DateTimeUtil";
import { formatCurrency } from "../../../services/CurrencyUtil";
import PaymentFactories from "../../../services/PaymentFactories";
import { ToastNotiError } from "../../../utils/Utils";
import { AuthContext } from "../../../context/auth.context";

const columns = [
  {
    title: "Mã giao dịch",
    dataIndex: "txnNo",
    key: "txnNo",
    align: "center",
  },
  {
    title: "Người gửi",
    dataIndex: "user",
    key: "user",
    align: "center",
    render: (text, data) => (
      <div>
        {data.user.firstName} {data.user.lastName}
      </div>
    ),
  },
  {
    title: "Số tiền",
    dataIndex: "amount",
    key: "amount",
    align: "center",
    render: (text, data) => (
      <div>{formatCurrency("vi-VN", "VND", data.amount / 100)}</div>
    ),
  },
  {
    title: "Nội dung",
    dataIndex: "description",
    key: "description",
    align: "center",
  },
  {
    title: "Thời gian",
    key: "timestamp",
    dataIndex: "timestamp",
    align: "center",
    render: (text, data) => <div>{displayDateTime(data.timestamp)}</div>,
  },
];

export default function FormActivity(props) {
  const [payment, setPayment] = useState();
  const { user} = useContext(AuthContext);

  useEffect(() => {
    try {
      const resp  = PaymentFactories.getPaymentListForUser(user?.id);      
      if (resp?.status === 200){
        setPayment(resp.data);
      }
    } catch (error) {
      ToastNotiError(error);
    }
  }, []);

  return (
    <>
      <h1 style={{ marginLeft: 30 }}>Lịch sử giao dịch</h1>
      <Table columns={columns} dataSource={payment} />
    </>
  );
}
