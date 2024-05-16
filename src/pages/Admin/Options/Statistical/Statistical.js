import React, { useState } from "react";
import { DatePicker, Select, Tabs } from "antd";
import ChartYear from "./ChartYear";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

const Statistical = () => {
  const [year, setYear] = useState(2024);
  const [month, setMonth] = useState();
  const { t } = useTranslation()
  const handleChangeYear = key => {
    setYear(key?.$y)
  };
  const handleChangeMonth = key => {
    setMonth(key?.month() + 1)
  };

  return (
    <div className="booking-container" style={{ overflow: 'scroll', height: '100vh' }}>
      <div className="booking-title">
        <span>{t('Statistical')}</span>
      </div>

      <div className="booking-title">
        <div style={{ float: 'right', display: 'flex', gap: 15 }}>
          <DatePicker defaultValue={dayjs('2024')} onChange={handleChangeYear} picker="year" placeholder={t('year')}/>
          <DatePicker onChange={handleChangeMonth} picker="month" placeholder={t('month')} />
        </div>
      </div>

      <div className="booking-search" style={{ width: '100%' }}>
        <ChartYear year={year} month={month} />
      </div>
    </div>
  );
};

export default Statistical;
