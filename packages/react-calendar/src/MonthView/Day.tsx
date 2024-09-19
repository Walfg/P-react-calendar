// Day.tsx

import React, { FC } from 'react';
import { getDayStart, getDayEnd } from '@wojtekmaj/date-utils';
import Tile from '../Tile';
import { isWeekend } from '../shared/dates';
import {
    formatDay as defaultFormatDay,
    formatLongDate as defaultFormatLongDate,
} from '../shared/dateFormatter';

interface DayProps {
    calendarType: string;
    classes?: string[];
    currentMonthIndex: number;
    formatDay?: (locale: string, date: Date) => string;
    formatLongDate?: (locale: string, date: Date) => string;
    date: Date;
    locale: string;
}

const Day: FC<DayProps> = ({
    calendarType,
    classes = [],
    currentMonthIndex,
    formatDay = defaultFormatDay,
    formatLongDate = defaultFormatLongDate,
    date,
    locale,
    ...otherProps
}) => {
    const isMobile = typeof navigator !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent);
    const baseClassName = isMobile
        ? 'react-calendar__month-view__days__day-mobile'
        : 'react-calendar__month-view__days__day';

    const classesProps: string[] = [...classes, baseClassName];

    if (isWeekend(date, calendarType)) {
        classesProps.push(`${baseClassName}--weekend`);
    }
    if (date.getMonth() !== currentMonthIndex) {
        classesProps.push(`${baseClassName}--neighboringMonth`);
    }

    return (
        <Tile
            {...otherProps}
            classes={classesProps}
            formatAbbr={formatLongDate}
            maxDateTransform={getDayEnd}
            minDateTransform={getDayStart}
            view="month"
        >
            {formatDay(locale, date)}
        </Tile>
    );
};

export default Day;
