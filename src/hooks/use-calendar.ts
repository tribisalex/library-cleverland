import { useMemo, useState } from 'react';

import {
    createDate,
    createMonth,
    getMonthesNames,
    getMonthNumberOfDays,
    getWeekDaysNames,
} from '../utils/date';
import { createMonthDays } from '../utils/date/create-month-days';

interface UseCalendarParams {
    locale?: string;
    selectedDate: Date;
    firstWeekDayNumber?: number;
}

const DAYS_IN_WEEK = 7;

const getYearsInterval = (year: number) => {
    const startYear = Math.floor(year / 10) * 10;

    return [...Array(10)].map((_, index) => startYear + index);
};

export const useCalendar = ({
    locale = 'default',
    selectedDate: date,
    firstWeekDayNumber = 2,
}: UseCalendarParams) => {
    const [selectedDay, setSelectedDay] = useState(createDate({ date }));
    const [selectedMonth, setSelectedMonth] = useState(
        createMonth({ date: new Date(selectedDay.year, selectedDay.monthIndex), locale }),
    );
    const [selectedYear, setSelectedYear] = useState(selectedDay.year);
    const [selectedYearsInterval, setSelectedYearsInterval] = useState(
        getYearsInterval(selectedDay.year),
    );

    const monthesNames = useMemo(() => getMonthesNames(locale), [locale]);

    const weekDaysNames = useMemo(
        () => getWeekDaysNames(firstWeekDayNumber, locale),
        [firstWeekDayNumber, locale],
    );

    const days = useMemo(
        () => createMonthDays(selectedMonth.monthIndex, selectedYear),
        [selectedMonth.monthIndex, selectedYear],
    );

    const calendarDays = useMemo(() => {
        const monthNumberOfDays = getMonthNumberOfDays(selectedMonth.monthIndex, selectedYear);

        const prevMonthDays = createMonth({
            date: new Date(selectedYear, selectedMonth.monthIndex - 1),
            locale,
        }).createMonthDays();

        const nextMonthDays = createMonth({
            date: new Date(selectedYear, selectedMonth.monthIndex + 1),
            locale,
        }).createMonthDays();

        const firstDay = days[0];
        const lastDay = days[monthNumberOfDays - 1];

        const shiftIndex = firstWeekDayNumber - 1;
        const numberOfPrevDays =
            firstDay.dayNumberInWeek - 1 - shiftIndex < 0
                ? DAYS_IN_WEEK - (firstWeekDayNumber - firstDay.dayNumberInWeek)
                : firstDay.dayNumberInWeek - 1 - shiftIndex;

        const numberOfNextDays =
            DAYS_IN_WEEK - lastDay.dayNumberInWeek + shiftIndex > 6
                ? DAYS_IN_WEEK - lastDay.dayNumberInWeek - (DAYS_IN_WEEK - shiftIndex)
                : DAYS_IN_WEEK - lastDay.dayNumberInWeek + shiftIndex;

        const totalCalendarDays = days.length + numberOfPrevDays + numberOfNextDays;

        const result = [];

        for (let i = 0; i < numberOfPrevDays; i += 1) {
            const inverted = numberOfPrevDays - i;

            result[i] = prevMonthDays[prevMonthDays.length - inverted];
        }

        for (let i = numberOfPrevDays; i < totalCalendarDays - numberOfNextDays; i += 1) {
            result[i] = days[i - numberOfPrevDays];
        }

        for (let i = totalCalendarDays - numberOfNextDays; i < totalCalendarDays; i += 1) {
            result[i] = nextMonthDays[i - totalCalendarDays + numberOfNextDays];
        }

        return result;
    }, [selectedMonth.monthIndex, selectedYear, locale, days, firstWeekDayNumber]);

    // eslint-disable-next-line consistent-return
    const onClickArrow = (direction: 'right' | 'left') => {
        const monthIndex =
            direction === 'left' ? selectedMonth.monthIndex - 1 : selectedMonth.monthIndex + 1;

        if (monthIndex === -1) {
            const year = selectedYear - 1;

            setSelectedYear(year);
            if (!selectedYearsInterval.includes(year))
                setSelectedYearsInterval(getYearsInterval(year));

            return setSelectedMonth(createMonth({ date: new Date(selectedYear - 1, 11), locale }));
        }

        if (monthIndex === 12) {
            const year = selectedYear + 1;

            setSelectedYear(year);
            if (!selectedYearsInterval.includes(year))
                setSelectedYearsInterval(getYearsInterval(year));

            return setSelectedMonth(createMonth({ date: new Date(year, 0), locale }));
        }

        setSelectedMonth(createMonth({ date: new Date(selectedYear, monthIndex), locale }));
    };

    const setSelectedMonthByIndex = (monthIndex: number) => {
        setSelectedMonth(createMonth({ date: new Date(selectedYear, monthIndex), locale }));
    };

    return {
        state: {
            calendarDays,
            weekDaysNames,
            monthesNames,
            selectedDay,
            selectedMonth,
            selectedYear,
            selectedYearsInterval,
        },
        functions: {
            onClickArrow,
            setSelectedDay,
            setSelectedMonthByIndex,
            setSelectedYear,
            setSelectedYearsInterval,
        },
    };
};
