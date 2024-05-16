import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RegisterInterpreters.module.css";
import Meta from "antd/es/card/Meta";
import { toast } from "react-toastify";
import CategoriesFactories from "../../services/CategoryFactories";
import AccountFactories from "../../services/AccountFactories";
import { AuthContext } from "../../context/auth.context";
import DestinationFactories from "../../services/DestinationFatories";

import { Card, Avatar, InputNumber, Steps, Typography, Image, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { uploadFirebase } from "../../utils/FirebaseService";
import { CameraOutlined } from "@ant-design/icons";
import { Button } from "@nextui-org/react";
const { Text } = Typography;

const RegisterInterpreters = (props) => {
  const [selectedCardsDes, setSelectedCardsDes] = useState();
  const [selectedCards, setSelectedCards] = useState([]);
  const [categoryList, setCategoryList] = useState()
  const [price, setPrice] = useState({
    individual1: 0,
    individual2: 0,
    group1: 0,
    group2: 0,
    group3: 0,
  })
  const [error, setError] = useState()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation()
  const [TouristDes, setTouristDes] = useState()

  function checkPrice() {
    // const arePricesNullOrZero = Object.values(price).some(value => value === null || value === 0);
    // if (arePricesNullOrZero) {
    //   setError({
    //     price: 'Nhập đầy đủ các đơn giá'
    //   })
    //   return false
    // } else {
    // }
    return true
  }

  const fetchData = async (Keyword) => {
    const response = await DestinationFactories.getListDestination({});
    setTouristDes(response);

  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCardClickDes = (cardId) => {
    setSelectedCardsDes(cardId);
    setStep(1)
  };


  const handleCardClick = (cardId) => {
    const cardIndex = selectedCards.indexOf(cardId);
    if (cardIndex === -1) {
      setSelectedCards([...selectedCards, cardId]);
    } else {
      const updatedSelectedCards = [...selectedCards];
      updatedSelectedCards.splice(cardIndex, 1);
      setSelectedCards(updatedSelectedCards);
    }
  };
  const navigate = useNavigate();
  function navigateHome() {
    navigate('/');
  }
  function handleBackStep() {
    setStep(step - 1)
  }
  function handleNextStep1() {
    setStep(parseInt(step) + 1)
  }
  function handleChangePrice(field, e) {
    setError();
    let newPrice = { ...price }
    newPrice[field] = e
    setPrice(newPrice)
  }
  function handleNextStepSubmit() {
    if (checkPrice()) {
      setStep(parseInt(step) + 1)
      onSubmit()
    } else {
      setStep(2)
    }
  }
  const { user, setUser } = useContext(AuthContext);
  const [imageList, setImageList] = useState([]);
  const [fileUpload, setFileUpload] = useState([]);


  const handleChange = (e) => {
    const file = e.target.files[0];
    setFileUpload(e.target.files[0]);
    if (file) {
      const url = URL.createObjectURL(file);
      const newObject = { url: url, name: file.name };
      const newList = [...imageList, newObject];


      const newObjectFile = file
      const newListFile = [...fileUpload, newObjectFile];
      setFileUpload(newListFile)
      setImageList(newList);
    }
  };
  const handleDeleteImg = (name) => {
    const newList = imageList.filter(v => v.name !== name)
    setImageList(newList);
  };

  async function onSubmit() {
    try {
      const data = {
        categories: selectedCards,
        personal_price_session: price.individual1,
        personal_price_day: price.individual2,
        group_price_avge: price.group1,
        group_price_session: price.group2,
        group_price_day: price.group3,
        destination_id: selectedCardsDes,
      }
      let images = []
      if (fileUpload) {
        const uploadImages = async () => {
          for (const file of fileUpload) {
            const url = await uploadFirebase(file);
            images.push(url);
          }
        };
        await uploadImages();
      }
      data.images = images
      const response = await AccountFactories.requestHint(user.id, data);
      if (response?.status === 200) {
        toast.success('Gửi yêu cầu thành công, admin đang duyệt yêu cầu của bạn.');
        user.role_id = 4;
        localStorage.setItem("user", JSON.stringify(user));
        const storedUser = localStorage.getItem("user");
        setUser(JSON.parse(storedUser));
        setLoading(false)
      } else {
        toast.error('Hệ thống lỗi');
        setLoading(false)
      }
    } catch (error) {
      console.log("🚀 ~ onSubmit ~ error:", error)
      setLoading(false)
    }
  }


  useEffect(() => {
    const fetchData = async () => {
      const response = await CategoriesFactories.getListCategories();
      setCategoryList(response);
    };
    fetchData();
  }, []);


  return (
    <div>
      <main className={styles["main-details"]} >
        <div
          className={`${styles["container"]}  `}
        >
          <div className={styles.step}>
            <Steps
              current={step}
              items={[
                {
                  title: 'Chọn điểm du lịch',
                  onClick: () => setStep(0)
                },
                {
                  title: 'Chọn lĩnh vực',
                  onClick: () => step > 1 && setStep(1)
                },
                {
                  title: 'Xác nhận giá thuê',
                  onClick: () => step > 2 && setStep(2)
                },
                {
                  title: 'Điều khoản',
                  onClick: () => step > 3 && setStep(3)
                },
                {
                  title: 'Văn bằng / Chứng chỉ',
                  onClick: () => step > 4 && setStep(4)
                },
                {
                  title: 'Xác nhận',
                },
              ]}
            />
          </div>
          {step === 0 && <>
            <div className={styles.listCard}>
              <h1 className="text-2xl my-4 text-center" style={{ padding: '0px 21%' }}>{t('choose_des')}</h1>
              <div className="flex w-full justify-between flex-wrap gap-10" >
                {TouristDes?.map((item) => (
                  <div className="">
                    <Card
                      hoverable
                      style={{ width: 240 }}
                      className="shadow-lg"
                      onClick={() => handleCardClickDes(item.id)}
                      cover={<img alt="example" src={item?.image} />}
                    >
                      <Meta title={item?.name} />
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </>}
          {step === 1 && <>
            <div className={styles.listCard}>
              <h1 className="text-2xl text-center" style={{ padding: '0px 21%' }}>{t('choose_field')}</h1>
              <div className="flex w-full justify-between flex-wrap " >
                {categoryList?.map((item) => (
                  <div className="">
                    <Card
                      style={{
                        minWidth: 450,
                        marginTop: 16,
                        userSelect: 'none',
                        border: selectedCards.includes(item.id) ? "3px solid #ff7421" : "3px solid #008DDA",
                      }}
                      onClick={() => handleCardClick(item.id)}
                    >
                      <Meta
                        avatar={<Avatar src={item?.image ?? ''} />}
                        title={item?.name}
                      />
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </>}

          {step === 2 && <div className={styles.price}>
            <h1>Bạn hãy đưa ra giá thuê phù hợp với các dịch vụ sau đây</h1>

            <h2 className="mt-5 font-bold">Khách cá nhân</h2>
            <div className='flex flex-row gap-10'>
              <div className="flex flex-col gap-3">
                <h3>Giá thuê theo buổi</h3>
                <InputNumber
                  placeholder="Nhập số tiền"
                  addonAfter="VND"
                  style={{ width: '100%' }}
                  value={price?.individual1}
                  onChange={(value) => handleChangePrice('individual1', value)}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </div>
              <div className="flex flex-col gap-3">
                <h3>Giá thuê theo ngày</h3>
                <InputNumber
                  placeholder="Nhập số tiền"
                  addonAfter="VND"
                  style={{ width: '100%' }}
                  value={price?.individual2}
                  onChange={(value) => handleChangePrice('individual2', value)}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </div>
              {error && <Text type="danger">{error}</Text>}
            </div>

            <h2 className="mt-5 font-bold">Khách đi theo nhóm</h2>
            <div className='flex flex-row gap-10'>

              {/* <div className="flex flex-col gap-3">
                <h3>Giám giá theo trung bình mỗi người</h3>
                <InputNumber
                  placeholder="Nhập số tiền"
                  addonAfter="VND"
                  style={{ width: '100%' }}
                  value={price?.group1}
                  onChange={(value) => handleChangePrice('group1', value)}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </div> */}
              <div className="flex flex-col gap-3">
                <h3>Giá thuê mỗi người / theo buổi</h3>
                <InputNumber
                  placeholder="Nhập số tiền"
                  addonAfter="VND"
                  style={{ width: '100%' }}
                  value={price?.group2}
                  onChange={(value) => handleChangePrice('group2', value)}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </div>


              <div className="flex flex-col gap-3">
                <h3>Giá thuê mỗi người / theo ngày</h3>
                <InputNumber
                  placeholder="Nhập số tiền"
                  addonAfter="VND"
                  style={{ width: '100%' }}
                  value={price?.group3}
                  onChange={(value) => handleChangePrice('group3', value)}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </div>
              {error && <Text type="danger">{error}</Text>}
            </div>


          </div>}


          {step === 3 && <div className={styles.price}>
            <h1 className="font-bold">
              Điều khoản dành cho hướng dẫn viên / phiên dịch viên khi tham gia hệ thống
            </h1>
            <div className="flex flex-col shadow-md p-5 gap-3 mt-3 ">
              <span>
                Khoản 11 Điều 3 Luật Du lịch 2017 định nghĩa hướng dẫn viên du lịch là người được cấp thẻ để hành nghề hướng dẫn du lịch. Hãy cùng tìm hiểu quy định liên quan đến hướng dẫn viên du lịch qua nội dung dưới đây.
              </span>
              <p className="text-align: justify;">
                <span className="font-size:14px;"><span className="font-family:arial,helvetica,sans-serif;"><strong>1. Quy định về hướng dẫn viên du lịch</strong></span></span></p>

              <p className="text-align: justify;">
                <span className="font-size:14px;"><span className="font-family:arial,helvetica,sans-serif;">- Hướng dẫn viên du lịch bao gồm hướng dẫn viên du lịch quốc tế, hướng dẫn viên du lịch nội địa và hướng dẫn viên du lịch tại điểm. Phạm vi hành nghề của hướng dẫn viên du lịch được quy định tại khoản 2 Điều 58 <a href="https://thuvienphapluat.vn/van-ban/Van-hoa-Xa-hoi/Luat-du-lich-2017-322936.aspx" target="_blank" rel="noreferrer">Luật Du lịch 2017</a> như sau:</span></span></p>

              <p className="text-align: justify;">
                <span className="font-size:14px;"><span className="font-family:arial,helvetica,sans-serif;">+ Hướng dẫn viên du lịch quốc tế được hướng dẫn cho khách du lịch nội địa, khách du lịch quốc tế đến Việt Nam trong phạm vi toàn quốc và đưa khách du lịch ra nước ngoài;</span></span></p>

              <p className="text-align: justify;">
                <span className="font-size:14px;"><span className="font-family:arial,helvetica,sans-serif;">+ Hướng dẫn viên du lịch nội địa được hướng dẫn cho khách du lịch nội địa là công dân Việt Nam trong phạm vi toàn quốc;</span></span></p>

              <p className="text-align: justify;">
                <span className="font-size:14px;"><span className="font-family:arial,helvetica,sans-serif;"><strong>2. Điều kiện cấp thẻ hướng dẫn viên du lịch</strong></span></span></p>

              <p className="text-align: justify;">
                <span className="font-size:14px;"><span className="font-family:arial,helvetica,sans-serif;">- Đối với hướng dẫn viên du lịch nội địa điều kiện cấp thẻ bao gồm:</span></span></p>
              <p className="text-align: justify;">
                <span className="font-size:14px;"><span className="font-family:arial,helvetica,sans-serif;">+ Có quốc tịch Việt Nam, thường trú tại Việt Nam;</span></span></p>
              <p className="text-align: justify;">
                <span className="font-size:14px;"><span className="font-family:arial,helvetica,sans-serif;">+ Có năng lực hành vi dân sự đầy đủ;</span></span></p>
              <p className="text-align: justify;">
                <span className="font-size:14px;"><span className="font-family:arial,helvetica,sans-serif;">+ Không mắc bệnh truyền nhiễm, không sử dụng chất ma túy;</span></span></p>
              <p className="text-align: justify;">
                <span className="font-size:14px;"><span className="font-family:arial,helvetica,sans-serif;">+ Tốt nghiệp trung cấp trở lên chuyên ngành hướng dẫn du lịch; trường hợp tốt nghiệp trung cấp trở lên chuyên ngành khác phải có chứng chỉ nghiệp vụ hướng dẫn du lịch nội địa.</span></span></p>
              <p className="text-align: justify;">
                <span className="font-size:14px;"><span className="font-family:arial,helvetica,sans-serif;">- Đối với hướng dẫn viên du lịch quốc tế điều kiện cấp thẻ bao gồm các điều kiện như đối với hướng dẫn viên du lịch nội địa tuy nhiên phải tốt nghiệp cao đẳng trở lên chuyên ngành hướng dẫn du lịch; trường hợp tốt nghiệp cao đẳng trở lên chuyên ngành khác phải có chứng chỉ nghiệp vụ hướng dẫn du lịch quốc tế.</span></span></p>
              <p className="text-align: justify;">
                <span className="font-size:14px;"><span className="font-family:arial,helvetica,sans-serif;">Đồng thời, đối với hướng dẫn viên du lịch quốc tế thì còn phải đáp ứng điều kiện là sử dụng thành thạo ngoại ngữ đăng ký hành nghề. Tiêu chuẩn thành thạo ngoại ngữ của hướng dẫn viên du lịch quốc tế quy định tại Điều 13 <a href="https://thuvienphapluat.vn/van-ban/Bo-may-hanh-chinh/Thong-tu-06-2017-TT-BVHTTDL-huong-dan-Luat-Du-lich-373023.aspx" target="_blank" rel="noreferrer">Thông tư 06/2017/TT-BVHTTDL</a> (được sửa đổi bởi Khoản 10 Điều 1 <a href="https://thuvienphapluat.vn/van-ban/Van-hoa-Xa-hoi/Thong-tu-13-2019-TT-BVHTTDL-sua-doi-Thong-tu-06-2017-TT-BVHTTDL-huong-dan-Luat-Du-lich-429466.aspx" target="_blank" rel="noreferrer">Thông tư 13/2019/TT-BVHTTDL</a>) như sau:</span></span></p>
              <p className="text-align: justify;">
                <span className="font-size:14px;"><span className="font-family:arial,helvetica,sans-serif;">+ Có bằng tốt nghiệp cao đẳng trở lên chuyên ngành ngoại ngữ;</span></span></p>
              <p className="text-align: justify;">
                <span className="font-size:14px;"><span className="font-family:arial,helvetica,sans-serif;">+ Có bằng tốt nghiệp cao đẳng trở lên theo chương trình đào tạo bằng tiếng nước ngoài;</span></span></p>
              <p className="text-align: justify;">
                <span className="font-size:14px;"><span className="font-family:arial,helvetica,sans-serif;">+ Có bằng tốt nghiệp cao đẳng trở lên ở nước ngoài theo chương trình đào tạo bằng ngôn ngữ chính thức của nước sở tại. Trường hợp được đào tạo bằng ngôn ngữ khác với ngôn ngữ chính thức của nước sở tại, cần bổ sung giấy tờ chứng minh ngôn ngữ được sử dụng để đào tạo;</span></span></p>

              <p className="text-align: justify;">
                <span className="font-size:14px;"><span className="font-family:arial,helvetica,sans-serif;">+ Có chứng chỉ ngoại ngữ bậc 4 trở lên theo Khung năng lực ngoại ngữ 6 bậc dùng cho Việt Nam hoặc có chứng chỉ ngoại ngữ đạt mức yêu cầu theo quy định tại Phụ lục I <a href="https://thuvienphapluat.vn/van-ban/Van-hoa-Xa-hoi/Thong-tu-13-2019-TT-BVHTTDL-sua-doi-Thong-tu-06-2017-TT-BVHTTDL-huong-dan-Luat-Du-lich-429466.aspx" target="_blank" rel="noreferrer">Thông tư 13/2019/TT-BVHTTDL</a> còn thời hạn, do tổ chức, cơ quan có thẩm quyền cấp.</span></span></p>
              <p className="text-align: justify;">
                <span className="font-size:14px;"><span className="font-family:arial,helvetica,sans-serif;">+ Có chứng chỉ ngoại ngữ bậc 4 trở lên theo Khung năng lực ngoại ngữ 6 bậc dùng cho Việt Nam hoặc có chứng chỉ ngoại ngữ đạt mức yêu cầu theo quy định tại Phụ lục I <a href="https://thuvienphapluat.vn/van-ban/Van-hoa-Xa-hoi/Thong-tu-13-2019-TT-BVHTTDL-sua-doi-Thong-tu-06-2017-TT-BVHTTDL-huong-dan-Luat-Du-lich-429466.aspx" target="_blank" rel="noreferrer">Thông tư 13/2019/TT-BVHTTDL</a> còn thời hạn, do tổ chức, cơ quan có thẩm quyền cấp.</span></span></p>
              <p className="text-align: justify;">
                <span className="font-size:14px;"><span className="font-family:arial,helvetica,sans-serif;">- Đối với hướng dẫn viên du lịch tại điểm điều kiện cấp thẻ bao gồm các điều kiện như đối với hướng dẫn viên du lịch nội địa tuy nhiên không yêu cầu về trình độ đào tạo (trung cấp hoặc cao đẳng trở lên) mà chỉ cần đạt yêu cầu kiểm tra nghiệp vụ hướng dẫn du lịch tại điểm do cơ quan chuyên môn về du lịch cấp tỉnh tổ chức là được.</span></span></p>
              <p className="text-align: justify;">
                <span className="font-size:14px;"><span className="font-family:arial,helvetica,sans-serif;"><strong>3. Các trường hợp bị thu hồi thẻ hướng dẫn viên du lịch</strong></span></span></p>
              <p className="text-align: justify;">
                <span className="font-size:14px;"><span className="font-family:arial,helvetica,sans-serif;">Tại khoản 1 Điều 64 <a href="https://thuvienphapluat.vn/van-ban/Van-hoa-Xa-hoi/Luat-du-lich-2017-322936.aspx" target="_blank" rel="noreferrer">Luật Du lịch 2017 </a>quy định thẻ hướng dẫn viên du lịch bị thu hồi trong trường hợp hướng dẫn viên du lịch có một trong các hành vi sau đây:</span></span></p>
              <p className="text-align: justify;">
                <span className="font-size:14px;"><span className="font-family:arial,helvetica,sans-serif;">- Làm phương hại đến chủ quyền, lợi ích quốc gia, quốc phòng, an ninh;</span></span></p>

              <p className="text-align: justify;">
                <span className="font-size:14px;"><span className="font-family:arial,helvetica,sans-serif;">- Cho cá nhân khác sử dụng thẻ hướng dẫn viên du lịch để hành nghề;</span></span></p><p className="text-align: justify;">
                <span className="font-size:14px;"><span className="font-family:arial,helvetica,sans-serif;">- Không bảo đảm điều kiện hành nghề, điều kiện cấp thẻ hướng dẫn viên du lịch theo quy định của Luật này;</span></span></p>

              <p className="text-align: justify;">
                <span className="font-size:14px;"><span className="font-family:arial,helvetica,sans-serif;">- Giả mạo hồ sơ cấp, cấp đổi, cấp lại thẻ hướng dẫn viên du lịch.</span></span></p>
              <p className="text-align: justify;">
                <span className="font-size:14px;"><span className="font-family:arial,helvetica,sans-serif;">Cơ quan nhà nước có thẩm quyền cấp thẻ hướng dẫn viên du lịch quyết định thu hồi thẻ hướng dẫn viên du lịch và công bố công khai trên trang thông tin điện tử quản lý hướng dẫn viên du lịch của Tổng cục Du lịch và cơ quan thu hồi thẻ. Hướng dẫn viên du lịch đã bị thu hồi thẻ chỉ được đề nghị cơ quan nhà nước có thẩm quyền cấp thẻ hướng dẫn viên du lịch sau 12 tháng kể từ ngày bị thu hồi thẻ.</span></span></p>
            </div>
          </div>}

          {step === 4 && <div className={styles.price}>
            <h1 className="font-bold text-xl">
              {t('provide_image')}
            </h1>
            <div className="flex flex-row gap-4 w-full justify-between">

              <div className="w-full mt-5 p-10">
                <input
                  id="uploadInput"
                  type="file"
                  accept="image/*"
                  className='uploadInput'
                  style={{ display: 'none' }}
                  onChange={(e) => handleChange(e)}
                />
                <Button className="w-fit px-0 pr-3" color="primary" endContent={<CameraOutlined />}>
                  <label htmlFor="uploadInput" className='w-44'>
                    {t('upload_image')}
                  </label>
                </Button>
                <div className="fllex flex-col gap-10 my-20 ">
                  {imageList?.map((item, index) => (
                    <div className="mt-3 w-full flex flex-row justify-between items-center border border-dashed boder-1 border-blue-600 rounded-lg p-4" >
                      <div className="flex flex-row gap-5 items-center justify-start">
                        <Image
                          src={item?.url}
                          alt="avatar"
                          className="max"
                          style={{ width: 50, height: 50 }}
                          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                        />
                        <span className="text-xl  text-blue-500 text-bold">{item?.name}</span>
                      </div>

                      <Button onClick={() => handleDeleteImg(item.name)} size='small' type="primary" danger>
                        {t('Delete')}
                      </Button>
                    </div>
                  ))}
                </div>

                {/* <Upload
                  action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                  listType="picture"
                  defaultFileList={[...fileList]}
                  className="w-full"
                >
                  <Button icon={<UploadOutlined />}>Select your files</Button>
                </Upload> */}
              </div>
            </div>
          </div>
          }

          {step === 5 && <div className={styles.price}>
            {loading ? <Spin></Spin> :
              <h1>
                {t('send_suscess_rq')}
              </h1>
            }
          </div>
          }

          <div className={styles.btnFooter}>
            {(step !== 0 && step < 5) &&
              <Button
                variant='light'
                color='primary'
                onClick={handleBackStep}
              >{t('back')}</Button>}
            {(step == 1 || step == 4) &&
              <Button
                color='primary'
                style={{
                  height: 35, width: 100
                }}
                onClick={handleNextStep1}>Tiếp tục</Button>}
            {step === 4 && <Button
              color='success'
              style={{
                height: 35, width: 100
              }}
              disabled={imageList.length == 0}
              onClick={handleNextStepSubmit} >Gửi yêu cầu</Button>}
            {step === 6 &&
              <Button color='secondary'
                size={'small'} onClick={navigateHome} >Trang chủ</Button>}
          </div>

        </div>
      </main>
    </div>
  );
};

export default RegisterInterpreters;
