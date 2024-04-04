// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import classes from "./PageEntDetail.module.css";
// import { Button, Layout, Menu } from "antd";
// import Sider from "antd/es/layout/Sider";
// import ProfileUser from "./Introduce/ProfileUser";
// import ChangePassword from "./ChangePassword/ChangePassword";
// import PaymentWallett from "./Payment/PaymentWallett";
// import HistoryBooking from "./HistoryBooking/Booking";
// import UpdateProfile from "./UpdateProfile/UpdateProfile";
// import RequireBooking from "./RequireBooking/RequireBooking";

// const PageDetail = () => {
//   const [infoEnt, setInfoEnt] = useState();
//   const navigate = useNavigate();
//   const [selectedMenuItem, setSelectedMenuItem] = useState("1");

//   const [type, setType] = useState('2KOL');

//   let { id } = useParams();

//   useEffect(() => {
//     // getEnt(id).then((res) => {
//     //   setInfoEnt(res.enterprise);
//     // });
//   }, [id]);

//   useEffect(() => {
//     document.title = `HINT | ${infoEnt?.firstName} ${infoEnt?.lastName}`;

//     return () => {
//       document.title = "HINT";
//     };
//   }, [infoEnt?.id]);

//   const handleMenuClick = (e) => {
//     setSelectedMenuItem(e.key);
//   };

//   const logoutHandler = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     navigate("../login");
//   }
//   return (
//     <>
//       <div className={classes["mainCT"]}>
//         <div className={classes["mainContainer"]}>
//           <Layout theme="light"  >
//             <Sider
//               theme="light"
//               width={200} className={classes["header"]} >
//               <Menu
//                 theme="light"
//                 style={{ width: 200 }}
//                 selectedKeys={[selectedMenuItem]}
//                 onClick={handleMenuClick}
//                 mode="inline"
//               >
//                 <Menu.SubMenu className="submenu" key="sub1" title="Tài Khoản">
//                   <Menu.Item key="1">Trang cá nhân</Menu.Item>
//                   <Menu.Item key="2">Chỉnh sửa thông tin</Menu.Item>
//                   <Menu.Item key="3">Đổi mật khẩu</Menu.Item>
//                 </Menu.SubMenu>

//                 <Menu.Item key="4">Ví</Menu.Item>
//                 { type === 'Interpreters' &&  <Menu.Item key="5">Yêu cầu Booking</Menu.Item>}
               
//                 <Menu.Item key="6">Lịch sử booking</Menu.Item>
//                 <Button
//                   onClick={logoutHandler}
//                   className={classes['btn-logout']}
//                 >Đăng xuất</Button>
//               </Menu>
//             </Sider>
//             <Layout className={classes['container']}>
//               <Layout.Content className={classes["site-layout-content"]}>
//                 {selectedMenuItem === "1" && <ProfileUser id={id} type= {type} ></ProfileUser>}
//                 {selectedMenuItem === "2" && <UpdateProfile id={id} type= {type} ></UpdateProfile>}
//                 {selectedMenuItem === "3" && <ChangePassword id={id} type={type}></ChangePassword>}
//                 {selectedMenuItem === "4" && <PaymentWallett id={id} type={type}></PaymentWallett>}
//                 {selectedMenuItem === "5" && <RequireBooking id={id} type={type}></RequireBooking>}
//                 {selectedMenuItem === "6" && <HistoryBooking id={id} type={type}></HistoryBooking>}
//               </Layout.Content>
//             </Layout>
//           </Layout>
//         </div>
//       </div >
//     </>
//   );
// };

// export default PageDetail;
