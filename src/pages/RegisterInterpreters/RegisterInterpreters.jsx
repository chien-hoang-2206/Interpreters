import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RegisterInterpreters.module.css";
import Meta from "antd/es/card/Meta";
import { toast } from "react-toastify";
import CategoriesFactories from "../../services/CategoriesFatories";
import AccountFactories from "../../services/AccountFactories";
import { AuthContext } from "../../context/auth.context";
import DestinationFactories from "../../services/DestinationFatories";

import { UploadOutlined } from '@ant-design/icons';
import { Button, Card, Avatar, InputNumber, Steps, Upload, Typography } from "antd";
const { Text } = Typography;
const fileList = [
  {
    uid: '0',
    name: 'Chứng chỉ ngoại ngữ toeic 800.png',
    status: 'uploading',
    percent: 33,
  },
  {
    uid: '-1',
    name: 'Chứng chỉ ngoại ngữ Ielts 7.0.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '-2',
    name: 'Chứng chỉ ngoại ngữ Hướng dân viên 7.0.png',
    status: 'error',
  },
];

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


  const [TouristDes, setTouristDes] = useState()

  useEffect(() => {
    // const arePricesNullOrZero = Object.values(price).some(value => value === null || value === 0);

    // if (arePricesNullOrZero) {
    //   console.log("Some price values are null or zero");
    // } else {
    //   setError({
    //     price: 'Nhập đầy đủ các giá trị'
    //   })
    // }
  }, [price])

  const fetchData = async (Keyword) => {
    const response = await DestinationFactories.getListDestination(Keyword);
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
  function handleNextStep2() {
    if (!price || price === 0 || price === '') {
      setError('Hãy chọn giá thuê')
    }
    else {
      setStep(step + 1)
      onSubmit();
    }
  }
  const { user, setUser } = useContext(AuthContext);

  async function onSubmit() {
    const data = {
      categories: selectedCards,
      price: price.individual1
    }
    const response = await AccountFactories.requestPgt(user?.id, data);
    if (response?.status === 200) {
      toast.success('Gửi yêu cầu thành công, admin đang duyệt yêu cầu của bạn.');
      user.role_id = 4;
      localStorage.setItem("user", JSON.stringify(user));
      const storedUser = localStorage.getItem("user");
      setUser(JSON.parse(storedUser));
    } else {
      toast.error('Hệ thống lỗi');
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
                },
                {
                  title: 'Chọn lĩnh vực',
                },
                {
                  title: 'Xác nhận giá thuê',
                },
                {
                  title: 'Điều khoản',
                },
                {
                  title: 'Văn bằng / Chứng chỉ',
                },
                {
                  title: 'Xác nhận',
                },
              ]}
            />
          </div>
          {step === 0 && <>
            <div className={styles.listCard}>
              <h1 className="text-2xl text-center" style={{ padding: '0px 21%' }}>Chọn địa điểm du lịch</h1>
              <div className="flex w-full justify-between flex-wrap " >
                {TouristDes?.map((item) => (
                  <div className="">
                    <Card
                      hoverable
                      style={{ width: 240 }}
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
              <h1 className="text-2xl text-center" style={{ padding: '0px 21%' }}> Chọn lĩnh vực bạn  muốn tham gia</h1>
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

              <div className="flex flex-col gap-3">
                <h3>Giá thuê trung bình mỗi người</h3>
                <InputNumber
                  placeholder="Nhập số tiền"
                  addonAfter="VND"
                  style={{ width: '100%' }}
                  value={price?.group1}
                  onChange={(value) => handleChangePrice('group1', value)}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </div>
              <div className="flex flex-col gap-3">
                <h3>Giá thuê theo buổi</h3>
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
                <h3>Giá thuê theo ngày</h3>
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
            <div className="flex flex-col shadow-md p-5 gap-3 mt-3 overflow-scroll h-[400px]">
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
              Cung cấp hình ảnh cho minh chứng Văn bằng chứng chỉ của bạn
            </h1>
            <div className="flex flex-row gap-4  w-full justify-between">

              <div className="w-full mt-5">
                <Upload
                  action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                  listType="picture"
                  defaultFileList={[...fileList]}
                  className="w-full"
                >
                  <Button icon={<UploadOutlined />}>Select your files</Button>
                </Upload>
              </div>
            </div>
          </div>
          }

          {step === 5 && <div className={styles.price}>
            <h1>
              Gửi yêu cầu thanh công, admin đang duyệt yêu cầu của bạn.
            </h1>
          </div>
          }

          <div className={styles.btnFooter}>
            {(step !== 0 && step < 5) && <Button type='default' style={{ marginTop: 20, height: 35, width: 80, background: 'transparent', color: '#111' }} size={'small'} onClick={handleBackStep} >Quay lại</Button>}
            {(step < 4) && <Button type='primary'
              style={{
                height: 35, width: 100
              }}
              size={'small'} onClick={handleNextStep1} className={styles.btnSubmit}>Tiếp tục</Button>}
            {step === 4 && <Button type='primary'
              style={{
                height: 35, width: 100
              }}
              size={'small'} onClick={handleNextStep2} className={styles.btnSubmit}>Gửi yêu cầu</Button>}
            {step === 6 && <Button type='primary'
              style={{
                height: 35, width: 100
              }}
              size={'small'} onClick={navigateHome} className={styles.btnSubmit}>Trang chủ</Button>}
          </div>


          {/* <h1>Thêm lĩnh vực mới</h1>
          <div className={styles.addCategory}>
            <Input placeholder="Nhập tên lĩnh vực" />
            <TextArea placeholder="Giải thích về lĩnh vực mới này ..." />
          </div> */}
        </div>
      </main>
    </div>
  );
};

export default RegisterInterpreters;
