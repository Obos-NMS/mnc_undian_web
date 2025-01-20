import React, { useEffect, useState } from 'react'
import { Calendar, DateRange } from 'react-date-range';
import moment from 'moment';
import MyPopper from '../Poppper/MyPopper';
import { AlertTriangle, ChevronLeft, ChevronRight } from 'untitledui-js';
import MyTextField from '../TextField/MyTextField';

const MyDateRange = ({ target, startDate, endDate, onChange }) => {
    const [isInvalidStartDate, setIsInvalidStartDate] = useState(false);
    const [isInvalidEndDate, setIsInvalidEndDate] = useState(false);
    const [inputStartDate, setInputStartDate] = useState(() => {
        if (startDate) return format(startDate, 'MMM d, yyyy');
        return null;
    });
    const [inputEndDate, setInputEndDate] = useState(() => {
        if (endDate) return format(endDate, 'MMM d, yyyy');
        return null;
    });
    const [state, setState] = useState([{
        startDate: null,
        endDate: null,
        key: 'selection'
    }]);

    useEffect(() => {
        if (state && state[0] && (state[0].startDate || state[0].endDate)) {
            if (state[0].startDate) {
                setInputStartDate(format(state[0].startDate, 'MMM d, yyyy'));
                setIsInvalidStartDate(false);
            }
            if (state[0].endDate) {
                setInputEndDate(format(state[0].endDate, 'MMM d, yyyy'));
                setIsInvalidEndDate(false);
            }
        }
    }, [state])

    return (
        <>
            <MyPopper id={'my-date-range'} target={target} placement={'bottom-start'}>
                {(open, handleOpen, handleClose) => (
                    <div className='flex flex-col w-[328px]'>
                        <div className='px-6 py-5'>
                            <DateRange
                                editableDateInputs={true}
                                moveRangeOnFirstSelection={false} retainEndDateOnFirstSelection={false}
                                weekStartsOn={1} weekdayDisplayFormat={'EEEEEE'}
                                rangeColors={['#dc2626']} color={'#dc2626'}
                                ranges={state}
                                onChange={item => {
                                    console.log(item);
                                    setState([item.selection])
                                }}
                                navigatorRenderer={(focusedDate, changeShownDate, props) => {
                                    return (<div className='flex flex-col gap-3 pb-3' onMouseUp={e => e.stopPropagation()}>
                                        <div className='flex items-center justify-between'>
                                            <button onClick={() => changeShownDate(-1, 'monthOffset')} className='w-10 h-10 p-2 flex items-center justify-center'>
                                                <ChevronLeft size={20} stroke={'currentColor'} />
                                            </button>
                                            <p className='text-md-semibold text-gray-light/700'>{format(focusedDate, 'MMMM yyyy')}</p>
                                            <button onClick={() => changeShownDate(+1, 'monthOffset')} className='w-10 h-10 p-2 flex items-center justify-center'>
                                                <ChevronRight size={20} stroke={'currentColor'} />
                                            </button>
                                        </div>
                                        <div className='flex items-center gap-3'>
                                            <MyTextField value={inputStartDate} isRealtime={true}
                                                placeholder={"MMM d, yyyy"}
                                                onChangeForm={(e) => setInputStartDate(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        const parsedDate = parse(e.target.value, 'MMM d, yyyy', new Date());
                                                        if (!isNaN(parsedDate.getTime())) {
                                                            changeShownDate(parsedDate);
                                                            setState([{
                                                                startDate: parsedDate,
                                                                endDate: state[0].endDate,
                                                                key: "selection"
                                                            }])
                                                        } else {
                                                            setIsInvalidStartDate(true);
                                                        }
                                                    }
                                                }}
                                                endAdornment={isInvalidStartDate && <AlertTriangle className={'text-error/700'} size={20} stroke={'currentColor'} />}
                                            />
                                            <p className='text-md-regular text-gray-light/500'>-</p>
                                            <MyTextField value={inputEndDate} isRealtime={true}
                                                placeholder={"MMM d, yyyy"}
                                                onChangeForm={(e) => setInputEndDate(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        const parsedDate = parse(e.target.value, 'MMM d, yyyy', new Date());
                                                        if (!isNaN(parsedDate.getTime())) {
                                                            changeShownDate(parsedDate);
                                                            setState([{
                                                                startDate: state[0].startDate,
                                                                endDate: parsedDate,
                                                                key: "selection"
                                                            }])
                                                        } else {
                                                            setIsInvalidEndDate(true);
                                                        }
                                                    }
                                                }}
                                                endAdornment={isInvalidEndDate && <AlertTriangle className={'text-error/700'} size={20} stroke={'currentColor'} />}
                                            />
                                        </div>
                                        <div className='flex items-center justify-between px-2 pt-1'>
                                            <button className='text-sm-semibold text-brand/700' onClick={() => {
                                                const today = new Date();
                                                setState([{
                                                    startDate: startOfWeek(subWeeks(today, 1)),
                                                    endDate: endOfWeek(subWeeks(today, 1)),
                                                    key: "selection"
                                                }])
                                            }}>Last week</button>
                                            <button className='text-sm-semibold text-brand/700' onClick={() => {
                                                const today = new Date();
                                                setState([{
                                                    startDate: startOfMonth(subMonths(today, 1)),
                                                    endDate: endOfMonth(subMonths(today, 1)),
                                                    key: "selection"
                                                }])
                                            }}>Last month</button>
                                            <button className='text-sm-semibold text-brand/700' onClick={() => {
                                                const today = new Date();
                                                setState([{
                                                    startDate: startOfYear(subYears(today, 1)),
                                                    endDate: endOfYear(subYears(today, 1)),
                                                    key: "selection"
                                                }])
                                            }}>Last year</button>
                                        </div>
                                    </div>);
                                }}
                            />
                        </div>
                        <footer className="border-t border-gray-light/200 p-4 flex items-center gap-3">
                            <button onClick={handleClose} type="button" className="flex-1 text-center px-[14px] py-2.5 flex items-center justify-center gap-x-1 shadow-shadows/shadow-xs border border-gray-light/300 rounded-md">
                                <p className="text-sm-semibold text-gray-light/700">Cancel</p>
                            </button>
                            <button type="button" disabled={!state[0].startDate || !state[0].endDate} className={`${state[0].startDate && state[0].endDate ? 'bg-brand/600 text-white' : 'bg-gray-light/100 border border-gray-light/200 text-gray-light/400'} flex-1 text-sm-semibold text-center px-[14px] py-2.5 flex items-center justify-center gap-x-1 shadow-shadows/shadow-xs rounded-md`}
                                onClick={() => {
                                    if (state[0].startDate && state[0].endDate) {
                                        onChange && onChange(state[0].startDate, state[0].endDate);
                                        handleClose();
                                    }
                                }} >
                                Apply
                            </button>
                        </footer>
                    </div>
                )}
            </MyPopper>
        </>
    )
}

export default MyDateRange