import React, { useEffect, useMemo, useState } from "react";
import MyPopper from "../Poppper/MyPopper";
import { Calendar } from "react-date-range";
import { ChevronLeft, ChevronRight } from "untitledui-js";
import { addDays, format, isAfter, isBefore, isSameDay, isWithinInterval, parse } from "date-fns";
import { AlertTriangle } from "untitledui-js";
import MyTextField from "../TextField/MyTextField";
import { TimePicker } from "@mui/x-date-pickers";
import MyButton from "../Button/MyButton";
import dayjs from 'dayjs';

// TODO CARA PAKE MINDATE & MAXDATE
// minDate = addDays(new Date(), 1);
// maxDate = addDays(new Date(), 2);
const MyCalendar = ({ target, value = null, showTime, minDate, maxDate, onChange }) => {
    const [isInvalidDate, setIsInvalidDate] = useState(false);
    const [inputDate, setInputDate] = useState(
        value && format(value, "MMM d, yyyy")
    );
    const [date, setDate] = useState();
    const [time, setTime] = useState(dayjs()); // Initialize with some default value

    const isDisabledToday = useMemo(() => {
        var disabled = false;

        if (minDate && maxDate) {
            disabled = !isWithinInterval(new Date(), { start: minDate, end: maxDate })
        } else if (minDate) {
            disabled = !isAfter(new Date(), minDate);
        } else if (maxDate) {
            disabled = !isBefore(new Date(), maxDate);
        }


        return disabled;
    }, [minDate, maxDate]);

    let timeXs = {
        // Styles for the TextField
        '& .MuiInputBase-root': {
            borderRadius: '8px',
            height: '100%',
            display: "flex",
            alignItems: "center",
            boxShadow: '0px 1px 2px 0px #1018280D',
            backgroundColor: '#FFFFFF',
            border: '1px solid #D0D5DD',
            '&.Mui-error': { border: '1px solid #FDA29B' },
            '& .MuiInputBase-input::placeholder': {
                fontSize: "16px",
                fontFamily: "'Inter', sans-serif",
                fontWeight: "400",
                lineHeight: "24px",
                wordWrap: "break-word",
                color: "#667085",
                opacity: 1,
            },
            "&.Mui-focused": { border: '1px solid #AA8E45', boxShadow: '0px 0px 0px 4px #f3e7bb' },
            "&.Mui-focused.Mui-error": { border: '1px solid #FDA29B', boxShadow: '0px 0px 0px 4px #F044383D, 0px 1px 2px 0px #1018280D' },
            '& .MuiInputBase-input': { padding: "0px", margin: "10px 14px", textAlign: 'left', appearance: 'none' },
            '&.Mui-disabled': { backgroundColor: '#F9FAFB', cursor: 'not-allowed' },
            '&.Mui-disabled .MuiInputBase-input': { WebkitTextFillColor: '#667085', color: '#667085' },
            '& .MuiInputAdornment-root': { height: '100%', maxHeight: 'unset', paddingTop: '0px', paddingBottom: '0px', margin: "0px" },
            '& fieldset': { padding: 0, border: 'none' },
            '&:hover fieldset': { border: 'none' },
            "&.Mui-focused fieldset": { border: 'none' },
            "&.Mui-disabled fieldset": { border: 'none' },
        },
        // Styles for the FormHelperText
        "& .MuiFormHelperText-root": {
            margin: "0px !important",
            fontSize: "14px",
            fontWeight: "400",
            lineHeight: "20px",
            wordWrap: "break-word",
            color: '#475467',
            '&.Mui-error': { color: '#D92D20' }
        },
    };

    useEffect(() => {
        if (date) {
            setInputDate(format(date, "MMM d, yyyy"));
            setIsInvalidDate(false);
        }
    }, [date]);
    useEffect(() => {
        if (value) {
            setDate(new Date(value));

            showTime && setTime(dayjs(value));
            setInputDate(format(value, "MMM d, yyyy"));
        }
    }, [value]);


    return (
        <>
            <MyPopper target={target} placement={"bottom-start"}>
                {(open, anchorEl, show, close) => (
                    <div className="flex flex-col w-[328px]">
                        <div className="px-6 py-5 flex flex-col gap-3">
                            <Calendar
                                months={1}
                                minDate={minDate}
                                maxDate={maxDate}
                                onChange={(item) => setDate(item)}
                                date={date}
                                navigatorRenderer={(focusedDate, changeShownDate, props) => {
                                    return (
                                        <div
                                            className="flex flex-col gap-3 pb-3"
                                            onMouseUp={(e) => e.stopPropagation()}
                                        >
                                            <div className="flex items-center justify-between">
                                                <button
                                                    onClick={() => changeShownDate(-1, "monthOffset")}
                                                    className="w-10 h-10 p-2 flex items-center justify-center"
                                                >
                                                    <ChevronLeft size={20} stroke={"currentColor"} />
                                                </button>
                                                <p className="text-md-semibold text-gray-light/700">
                                                    {format(focusedDate, "MMMM yyyy")}
                                                </p>
                                                <button
                                                    onClick={() => changeShownDate(+1, "monthOffset")}
                                                    className="w-10 h-10 p-2 flex items-center justify-center"
                                                >
                                                    <ChevronRight size={20} stroke={"currentColor"} />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <MyTextField
                                                    value={inputDate}
                                                    isRealtime={true}
                                                    placeholder={"MMM d, yyyy"}
                                                    isError={isInvalidDate}
                                                    onChangeForm={(e) => setInputDate(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            const parsedDate = parse(
                                                                e.target.value,
                                                                "MMM d, yyyy",
                                                                new Date()
                                                            );


                                                            let valid = true;
                                                            if (isNaN(parsedDate.getTime())) valid = false;

                                                            if (minDate && maxDate && !isSameDay(parsedDate, minDate) && !isSameDay(parsedDate, maxDate)) {
                                                                valid = isWithinInterval(parsedDate, { start: minDate, end: maxDate })
                                                            } else if (minDate && !isSameDay(parsedDate, minDate)) {
                                                                valid = isAfter(parsedDate, minDate);
                                                            } else if (maxDate && !isSameDay(parsedDate, maxDate)) {
                                                                valid = isBefore(parsedDate, maxDate);
                                                            }

                                                            if (valid) {
                                                                changeShownDate(parsedDate);
                                                                setDate(parsedDate);
                                                            } else {
                                                                setIsInvalidDate(true);
                                                            }
                                                        }
                                                    }}
                                                    endAdornment={
                                                        isInvalidDate && (
                                                            <AlertTriangle
                                                                className={"text-error/700"}
                                                                size={20}
                                                                stroke={"currentColor"}
                                                            />
                                                        )
                                                    }
                                                />
                                                <MyButton disabled={isDisabledToday} color={"secondary"} variant={"outlined"} size={'md'}
                                                    onClick={() => {
                                                        if (!isDisabledToday) {
                                                            var now = new Date();
                                                            changeShownDate(now);
                                                            setDate(now);
                                                        }
                                                    }}>
                                                    <p className="text-sm-semibold">Today</p>
                                                </MyButton>
                                            </div>
                                        </div>
                                    );
                                }}
                                showMonthAndYearPickers={false}
                                weekStartsOn={1}
                                weekdayDisplayFormat={"EEEEEE"}
                                rangeColors={['#dc2626']}
                                color={'#dc2626'}
                            />
                            {showTime && (
                                <div className="w-full flex justify-center">
                                    <TimePicker
                                        value={time}
                                        ampm={false}
                                        sx={timeXs}
                                        onChange={(newValue) => {
                                            setTime(dayjs(newValue));
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        <footer className="border-t border-gray-light/200 p-4 flex items-center gap-3">
                            <div className="flex-1">
                                <MyButton expanded color={"secondary"} variant={"outlined"} size={'md'}
                                    onClick={close}>
                                    <p className="text-sm-semibold">Cancel</p>
                                </MyButton>
                            </div>
                            <div className="flex-1">
                                <MyButton expanded disabled={!date || isInvalidDate} color={"primary"} variant={"filled"} size={'md'}
                                    onClick={() => {
                                        if (date) {
                                            var _date = parse(
                                                time && showTime ? time.format("HH:mm:ss") : "00:00:00",
                                                "HH:mm:ss",
                                                date
                                            );
                                            onChange && onChange(_date);
                                            close();
                                        }

                                    }}>
                                    <p className="text-sm-semibold">Apply</p>
                                </MyButton>
                            </div>
                        </footer>
                    </div>
                )}
            </MyPopper>
        </>
    );
};

export default MyCalendar;