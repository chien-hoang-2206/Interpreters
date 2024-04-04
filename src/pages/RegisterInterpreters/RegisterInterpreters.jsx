import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RegisterInterpreters.module.css";
import { Card, Avatar, Button, InputNumber, Steps } from "antd";
import Meta from "antd/es/card/Meta";
import { Typography } from 'antd';
import { toast } from "react-toastify";
import CategoriesFactories from "../../services/CategoriesFatories";
import AccountFactories from "../../services/AccountFactories";
import { AuthContext } from "../../context/auth.context";
import DestinationFactories from "../../services/DestinationFatories";
const { Text } = Typography;

const RegisterInterpreters = (props) => {
  const [selectedCardsDes, setSelectedCardsDes] = useState();
  const [selectedCards, setSelectedCards] = useState([]);
  const [categoryList, setCategoryList] = useState()
  const [price, setPrice] = useState()
  const [error, setError] = useState()
  const [step, setStep] = useState(0)


  const [TouristDes, setTouristDes] = useState()
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
  function handleChangePrice(e) {
    setError();
    setPrice(e)
  }
  function handleNextStep2() {
    if (!price || price === 0 || price === '') {
      setError('Hãy chọn giá thuê')
    }
    else {
      setStep(2)
      onSubmit();
    }
  }
  const { user, setUser } = useContext(AuthContext);

  async function onSubmit() {
    const data = {
      categories: selectedCards,
      price: price
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
                <h3>Giá thuê theo giờ</h3>
                <InputNumber
                  placeholder="Nhập số tiền"
                  addonAfter="VND"
                  style={{ width: '100%' }}
                  value={price}
                  onChange={(value) => handleChangePrice(value)}
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
                  value={price}
                  onChange={(value) => handleChangePrice(value)}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </div>
              {error && <Text type="danger">{error}</Text>}
            </div>

            <h2 className="mt-5 font-bold">Khách đi theo nhóm</h2>
            <div className='flex flex-row gap-10'>
              <div className="flex flex-col gap-3">
                <h3>Giá thuê theo giờ</h3>
                <InputNumber
                  placeholder="Nhập số tiền"
                  addonAfter="VND"
                  style={{ width: '100%' }}
                  value={price}
                  onChange={(value) => handleChangePrice(value)}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </div>
              <div className="flex flex-col gap-3">
                <h3>Giá thuê trung bình mỗi người</h3>
                <InputNumber
                  placeholder="Nhập số tiền"
                  addonAfter="VND"
                  style={{ width: '100%' }}
                  value={price}
                  onChange={(value) => handleChangePrice(value)}
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
                  value={price}
                  onChange={(value) => handleChangePrice(value)}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </div>
              {error && <Text type="danger">{error}</Text>}
            </div>

            
          </div>}

          {step === 3 && <div className={styles.price}>
            <h1>
              Gửi yêu cầu thanh công, admin đang duyệt yêu cầu của bạn.
            </h1>
          </div>}
          <div className={styles.btnFooter}>
            {(step !== 0 && step < 3) && <Button type='default' style={{ marginTop: 20, height: 35, width: 80, background: 'transparent', color: '#111' }} size={'small'} onClick={handleBackStep} >Quay lại</Button>}
            {(step === 0 || step === 1) && <Button type='primary'
              style={{
                height: 35, width: 100
              }}
              size={'small'} onClick={handleNextStep1} className={styles.btnSubmit}>Tiếp tục</Button>}
            {step === 2 && <Button type='primary'
              style={{
                height: 35, width: 100
              }}
              size={'small'} onClick={handleNextStep2} className={styles.btnSubmit}>Gửi yêu cầu</Button>}
            {step === 3 && <Button type='primary'
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
