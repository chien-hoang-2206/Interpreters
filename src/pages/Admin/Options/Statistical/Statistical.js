import React, { useEffect, useState } from "react";
import { DatePicker, Select, Spin, Tabs } from "antd";
import ChartYear from "./ChartYear";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import AccountFactories from "../../../../services/AccountFactories";

const Statistical = () => {
  const [year, setYear] = useState(2024);
  const [month, setMonth] = useState();
  const [chooseHint, setHint] = useState();
  const { t } = useTranslation()
  const handleChangeYear = key => {
    setYear(key?.$y)
  };
  const handleChangeMonth = key => {
    setMonth(key?.month() + 1)
  };


  const [hintList, seHintList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApiList = async (value) => {
    try {
      setLoading(true)
      const response = await AccountFactories.getListAccount(value, 20);
      if (response && response.data) {
        const newList = response?.data?.map(i => ({
          value: i.id,
          label: `${i.user_name} - ${i.phone}`,
          text: `${i.user_name} - ${i.phone}`
        }))
        seHintList(newList);
      } else {
        console.error("API response does not contain expected data:", response);
      }
      setLoading(false)

    } catch (error) {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchApiList();
  }, []);

  return (
    <div className="booking-container" style={{ overflow: 'scroll', height: '100vh' }}>
      <div className="booking-title">
        <span>{t('Statistical')}</span>
      </div>

      <div className="booking-title">
        <div style={{ float: 'right', display: 'flex', gap: 15 }}>
          <Select onChange={(id) => setHint(id)} options={hintList ?? []} placeholder={t('choose_hint')} />
          <DatePicker defaultValue={dayjs('2024')} onChange={handleChangeYear} picker="year" placeholder={t('year')} />
          <DatePicker onChange={handleChangeMonth} picker="month" placeholder={t('month')} />
        </div>
      </div>

      <div className="booking-search" style={{ width: '100%' }}>
        {loading ? <Spin /> :
          <ChartYear chooseHint={chooseHint} year={year} month={month} />
        }
      </div>
    </div>
  );
};

export default Statistical;
