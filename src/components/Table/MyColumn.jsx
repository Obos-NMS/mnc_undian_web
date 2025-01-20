import React, { useMemo, useState } from "react";
import MyCheckbox from "../Checkbox/MyCheckbox";
import { ArrowDown, ArrowUp, ChevronDown } from "untitledui-js";

const getDataByField = (data, field) => {
    const fields = field.split('.');
    return fields.reduce((result, f) => (result && typeof result === 'object' && f in result) ? result[f] : null, data);
};

const MyColumn = ({
    tag,
    indexValue,
    indexChild,
    field,
    isHideHeader = false,
    header,
    headerBody,
    expander = false,
    expanderBody,
    body,
    value,
    values,
    onExpander,
    onChange,
    onChangeAll,
    sortable,
    onSort,
    selectionMode = null,
    scrollable = false,
    alignment = "left",
    colSpan = 1,
    rowSpan = 1,
    width,
    className,
    border,
}) => {
    const [sort, setSort] = useState();

    const getClassAlignment = useMemo(() => {
        let className = "";
        if (alignment === "center") className += "justify-center text-center";
        else if (alignment === "left") className += "justify-start text-left";
        else if (alignment === "right") className += "justify-end text-right";
        return className;
    }, [alignment]);

    const isHeader = useMemo(() => {
        return tag === 'th' ? true : false;
    }, [tag]);

    const Tag = isHeader ? 'th' : 'td';
    const handleSort = () => {
        const _sort = sort === 'asc' ? 'desc' : 'asc';
        setSort(_sort);
        onSort && onSort(_sort);
    };
    return (
        <Tag colSpan={colSpan} rowSpan={isHeader ? rowSpan : 1} width={width} onClick={sortable && handleSort} className={`${scrollable ? 'border-y' : 'border-b'} ${border ? 'border' : ''} border-gray-light/200 ${sortable ? 'cursor-pointer' : ''} ${expander ? 'pl-3' : 'px-5'} py-3 ${isHeader ? '' : ''} ${((value?.checked ?? false) || (value?.expand ?? false)) ? 'bg-gray-light/50' : ''} ${className}`}>
            {isHeader ? <div className={`w-full h-full flex items-center gap-3 ${getClassAlignment}`}>
                {(indexChild === 0 && selectionMode === "multiple")
                    && <MyCheckbox checked={values.checkedAll} onChangeForm={({ target: { checked } }) => {
                        onChangeAll(checked);
                    }} />
                }
                {headerBody ? headerBody : <p className="text-xs-medium text-gray-light/600 whitespace-nowrap">{header}</p>}
                {(sortable) && (sort === 'asc' ? <ArrowUp size={16} className={'text-gray-light/600'} stroke={'currentColor'} /> : <ArrowDown size={16} className={'text-gray-light/600'} stroke={'currentColor'} />)}
            </div> : <div className={`w-full h-full flex gap-3 items-center  ${getClassAlignment}`}>
                {(indexChild === 0 && (selectionMode === "multiple" || selectionMode === "single"))
                    && <MyCheckbox checked={value.checked} onChangeForm={({ target: { checked } }) => {
                        onChange(checked, value);
                    }} />
                }
                {(expander) && (expanderBody ? expanderBody(value, indexValue, onExpander) : <button onClick={() => onExpander(value)}
                    className="rounded-full hover:bg-gray-light/100 h-7 w-7 flex items-center justify-center">
                    <span className={`duration-300 ${value.expand ? 'rotate-180' : ''}`}>
                        <ChevronDown className={'text-gray-light/600'} size={20} stroke={'currentColor'} />
                    </span>
                </button>)}
                {body ? body(value, indexValue) : field && <p className="text-sm-regular text-gray-light/600 whitespace-nowrap">{field && getDataByField(value, field)}</p>}
            </div>}
        </Tag>
    );
};


export default MyColumn;