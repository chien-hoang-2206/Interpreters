import React from "react";
import FormProfileUser from "../FormContent/FormProfileUser";
import FormEmail from "../FormContent/FormEmail";
import FormPassword from "../FormContent/FormPassword";
import FormActivity from "../FormContent/FormActivity";
import PaymentWallett from "../FormContent/Payment/PaymentWallett";
import RequestBooking from "../FormContent/Book/RequestBooking";
import FormProfileHint from "../FormContent/FormProfileHint";
import ManagerPost from "../FormContent/ManagerPost/ManagerPost";

const componentPgt = [
  { key: "1", component: <FormProfileHint /> },
  { key: "sub1", component: <FormEmail /> },
  { key: "sub2", component: <FormPassword /> },
  { key: "3", component: <FormActivity /> },
  { key: "4", component: <PaymentWallett /> },
  { key: "5", component: <RequestBooking /> },
  { key: "6", component: <ManagerPost /> },

];

const componentUser = [
  { key: "1", component: <FormProfileUser /> },
  { key: "sub1", component: <FormEmail /> },
  { key: "sub2", component: <FormPassword /> },
  { key: "3", component: <FormActivity /> },
  { key: "4", component: <PaymentWallett /> },
  { key: "5", component: <RequestBooking /> },
];

const SubContext = (props) => {
  return (
    <div className="sub-context" style={{ width: "100%"  , height: 'calc(100vh - 60px)' , overflow: 'scroll' }}>
      {props.user?.role_id === 2 &&
        Object.keys(props.changeContent).length === 0 && <FormProfileHint />}

      {props.user?.role_id === 2 &&
        componentPgt.map((component) => {
          if (component.key === props.changeContent) return component.component;
        })}

      {props.user?.role_id === 1 &&
        Object.keys(props.changeContent).length === 0 && (
          <FormProfileUser />
        )}
      {props.user?.role_id === 1 &&
        componentUser.map((component) => {
          if (component.key === props.changeContent) return component.component;
        })}
    </div>
  );
};

export default SubContext;
