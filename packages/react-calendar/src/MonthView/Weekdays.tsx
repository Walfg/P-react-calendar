// Weekdays.tsx

import React, { useState, useEffect, FC, MouseEventHandler, HTMLAttributes } from 'react';
import clsx from 'clsx';
import { getYear, getMonth, getMonthStart } from '@wojtekmaj/date-utils';
import Flex from '../Flex';
import { getDayOfWeek, isCurrentDayOfWeek, isWeekend } from '../shared/dates';
import {
    formatShortWeekday as defaultFormatShortWeekday,
    formatWeekday as defaultFormatWeekday,
} from '../shared/dateFormatter';

interface WeekdaysProps extends HTMLAttributes<HTMLDivElement> {
    calendarType: string;
    formatShortWeekday?: (locale: string, date: Date) => string;
    formatWeekday?: (locale: string, date: Date) => string;
    locale: string;
    onMouseLeave?: MouseEventHandler<HTMLDivElement>;
}

const Weekdays: FC<WeekdaysProps> = ({
    calendarType,
    formatShortWeekday = defaultFormatShortWeekday,
    formatWeekday = defaultFormatWeekday,
    locale,
    onMouseLeave,
    ...otherProps
}) => {
    // Determines if is a Phone
    const [isPhone, setIsPhone] = useState<boolean>(false);

    useEffect(() => {
        const detectDevice = () => {
            const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
            let device = 'PC';

            if (/android/i.test(userAgent)) {
                device = 'Android';
            } else if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
                device = 'iOS';
            } else if (/windows phone/i.test(userAgent)) {
                device = 'Windows Phone';
            }

            setIsPhone(device !== 'PC');
        };

        detectDevice();
    }, []);

    const className = isPhone
        ? 'react-calendar__month-view__weekdays-mobile'
        : 'react-calendar__month-view__weekdays';
    const weekdayClassName = `${className}__weekday`;

    const anyDate = new Date();
    const beginOfMonth = getMonthStart(anyDate);
    const year = getYear(beginOfMonth);
    const monthIndex = getMonth(beginOfMonth);

    const weekdays: JSX.Element[] = [];

    for (let weekday = 1; weekday <= 7; weekday += 1) {
        const weekdayDate = new Date(
            year,
            monthIndex,
            weekday - getDayOfWeek(beginOfMonth, calendarType)
        );
        const abbr = formatWeekday(locale, weekdayDate);
        weekdays.push(
            <div
                key={weekday}
                className={clsx(
                    `${weekdayClassName}`,
                    isCurrentDayOfWeek(weekdayDate) && `${weekdayClassName}--current`,
                    isWeekend(weekdayDate, calendarType) && `${weekdayClassName}--weekend`
                )}
            >
                <abbr aria-label={abbr} title={abbr}>
                    {formatShortWeekday(locale, weekdayDate).replace('.', '')}
                </abbr>
            </div>
        );
    }

    return (
        <Flex
            className={className}
            count={7}
            onFocus={onMouseLeave}
            onMouseOver={onMouseLeave}
            {...otherProps}
        >
            {weekdays}
        </Flex>
    );
};

export default Weekdays;
