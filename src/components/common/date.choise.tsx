'use client';

import { useState } from 'react';
import { DatePicker, DateValue } from '@heroui/react';
import {
  now,
  getLocalTimeZone,
  CalendarDate,
  CalendarDateTime,
  ZonedDateTime,
  parseDateTime,
} from '@internationalized/date';
import { useDateFormatter } from '@react-aria/i18n';

interface IProps {
  setFormData: (value: string) => void;
}

const DateChoise = ({ setFormData }: IProps) => {
  const [value, setValue] = useState<DateValue | null>(now(getLocalTimeZone()));

  let formatter = useDateFormatter({ dateStyle: 'full' });

  const onChangeDate = (date: CalendarDate | CalendarDateTime | ZonedDateTime | null) => {
    setValue(date);

    if (date instanceof ZonedDateTime) {
      const day = formatter.format(date?.toDate()).split(',')[0].slice(0, 3);

      const regExp = /\d{2}$/g;
      let year = regExp.exec(date.year.toString());
      setFormData(
        `${date.day < 10 ? '0' + date.day : date.day}/${
          date.month < 10 ? '0' + date.month : date.month
        }/${year},${day}, ${date.hour < 10 ? '0' + date.hour : date.hour}:${
          date.minute < 10 ? '0' + date.minute : date.minute
        }`,
      );
    }
  };
  return (
    <>
      <DatePicker
        isRequired
        hideTimeZone
        showMonthAndYearPickers
        defaultValue={now(getLocalTimeZone())}
        label="Дата выдачи заказа (mm-dd-yyyy hh:mm)"
        granularity="minute"
        hourCycle={24}
        shouldForceLeadingZeros={true}
        autoFocus={true}
        value={value}
        onChange={(date) => onChangeDate(date)}
      />
      <p className="text-default-500 text-sm">
        Selected date: {value ? formatter.format(value.toDate(getLocalTimeZone())) : '--'}
      </p>
    </>
  );
};

export default DateChoise;
