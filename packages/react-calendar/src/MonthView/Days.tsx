// Days.tsx

import React, { useState, useEffect, FC } from 'react';
import { getYear, getMonth, getDaysInMonth, getDayStart } from '@wojtekmaj/date-utils';
import TileGroup from '../TileGroup';
import Day from './Day';
import { getDayOfWeek } from '../shared/dates';

interface DaysProps {
    activeStartDate: Date;
    calendarType: string;
    hover?: boolean;
    showFixedNumberOfWeeks?: boolean;
    showNeighboringMonth?: boolean;
    value?: Date | Date[] | null;
    valueType?: string;
    // Puedes extender esta interfaz con otros props si es necesario
}

const Days: FC<DaysProps> = ({
    activeStartDate,
    calendarType,
    hover = false,
    showFixedNumberOfWeeks = false,
    showNeighboringMonth = false,
    value = null,
    valueType = 'day',
    ...otherProps
}) => {
    const year = getYear(activeStartDate);
    const monthIndex = getMonth(activeStartDate);
    const hasFixedNumberOfWeeks = showFixedNumberOfWeeks || showNeighboringMonth;
    const dayOfWeek = getDayOfWeek(activeStartDate, calendarType);
    const offset = hasFixedNumberOfWeeks ? 0 : dayOfWeek;
    const start = (hasFixedNumberOfWeeks ? -dayOfWeek : 0) + 1;

    const end = (() => {
        if (showFixedNumberOfWeeks) {
            return start + 6 * 7 - 1;
        }
        const daysInMonth = getDaysInMonth(activeStartDate);
        if (showNeighboringMonth) {
            const activeEndDate = new Date(activeStartDate);
            activeEndDate.setDate(daysInMonth);
            activeEndDate.setHours(0, 0, 0, 0);
            const daysUntilEndOfTheWeek = 7 - getDayOfWeek(activeEndDate, calendarType) - 1;
            return daysInMonth + daysUntilEndOfTheWeek;
        }
        return daysInMonth;
    })();

    // Estado para detectar si es un teléfono
    const [isPhone, setIsPhone] = useState<boolean>(false);

    // Detección del dispositivo
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

    // Asegurar que React no sea eliminado por el compilador
    console.log(React.version);

    const className = isPhone
        ? 'react-calendar__month-view__days-mobile'
        : 'react-calendar__month-view__days';

    return (
        <TileGroup
            className={className}
            count={7}
            dateTransform={(day: number) => {
                const date = new Date(activeStartDate);
                date.setFullYear(year, monthIndex, day);
                return getDayStart(date);
            }}
            dateType="day"
            hover={hover}
            end={end}
            renderTile={({ date, ...otherTileProps }) => (
                <Day
                    {...otherProps}
                    {...otherTileProps}
                    activeStartDate={activeStartDate}
                    calendarType={calendarType}
                    currentMonthIndex={monthIndex}
                    date={date}
                />
            )}
            offset={offset}
            start={start}
            value={value}
            valueType={valueType}
            {...otherProps}
        />
    );
};

export default Days;
