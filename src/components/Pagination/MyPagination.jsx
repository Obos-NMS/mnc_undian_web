import React from "react";
import SimpleBar from "simplebar-react";
import { ArrowLeft, ArrowRight } from "untitledui-js";
import MyAutocomplete from "../Autocomplete/MyAutocomplete";

const MyPagination = ({ meta, rowsPerPageOptions, onChange, onChangePageSize }) => {
    const generatePagination = () => {
        const pagination_range = 2;
        const current_page = parseInt(meta?.current_page);
        const total_page = meta?.total_page;
        const pages_to_display = [];

        if (total_page > 5) {
            if (current_page <= pagination_range) {
                for (let page = 1; page <= 5; page++) {
                    pages_to_display.push({ page: page, text: page });
                }

                pages_to_display.push({ page: total_page, text: `...${total_page}` });
            } else if (current_page > (total_page - pagination_range)) {
                let end = Math.max(1, (total_page - 5));
                for (let page = total_page; page > end; page--) {
                    pages_to_display.push({ page: page, text: page });
                }

                if (end !== 1) {
                    pages_to_display.push({ page: 1, text: `1...` });
                }

                pages_to_display.reverse();
            } else {
                let start = Math.max(1, current_page - pagination_range);
                let end = Math.min(total_page, current_page + pagination_range);

                if (start !== 1) {
                    pages_to_display.push({ page: 1, text: `1...` });
                }

                for (let page = start; page <= end; page++) {
                    pages_to_display.push({ page: page, text: page });
                }

                if (end !== total_page) {
                    pages_to_display.push({ page: total_page, text: `...${total_page}` });
                }
            }
        } else {
            for (let page = 1; page <= total_page; page++) {
                pages_to_display.push({ page: page, text: page });
            }
        }

        return pages_to_display;
    };

    const renderPageButtons = () => {
        const pages_to_display = generatePagination();

        return pages_to_display.map((e, i) => (
            <button key={i} className={`${e.page === parseInt(meta?.current_page) ? 'bg-gray-light/50 text-gray-light/800' : 'text-gray-light/600'} text-sm-medium w-10 h-10 min-w-[40px] rounded-md truncate`}
                onClick={() => onChange && onChange(e.page)}
            // onClick={() => setParams((value) => { return { ...value, page: e.page }; })}
            >
                {e.text}
            </button>
        ));
    };

    const handlePrevious = () => {
        if (meta.prev_page) {
            onChange && onChange(meta.prev_page);
            // setParams((value) => {
            //     return { ...value, page: value.page - 1 };
            // })
        }
    }
    const handleNext = () => {
        if (meta.next_page) {
            onChange && onChange(meta.next_page);
            // setParams((value) => {
            //     return { ...value, page: value.page + 1 };
            // })
        }
    }

    return (
        <div className="w-full">
            <SimpleBar className="relative" style={{ maxWidth: "100%" }}>
                <div className="w-full flex justify-between items-center gap-x-3 pt-3 pb-4 px-6">
                    <div className="flex-1 flex justify-start">
                        {meta?.prev_page &&
                            <button disabled={!meta?.prev_page} onClick={handlePrevious}
                                className={`${meta?.prev_page ? 'text-gray-light/700 border border-gray-light/300 shadow-shadows/shadow-xs' : 'text-gray-light/400 border border-gray-light/200 cursor-not-allowed'} px-3 py-2 flex items-center gap-x-1.5 rounded-md`}>
                                <ArrowLeft size={20} stroke={'currentColor'} />
                                <p className="text-sm-semibold">Previous</p>
                            </button>
                        }
                    </div>
                    {(meta?.total != '0') && <div className="flex flex-col items-center">
                        <div className="flex items-center gap-0.5">{renderPageButtons()}</div>
                        {/* {(rowsPerPageOptions && rowsPerPageOptions.length) && <MyAutocomplete
                            options={rowsPerPageOptions.map((e) => ({ label: e, value: e }))}
                            placeholder={"Size"}
                            onChange={(e, value) => {
                                onChangePageSize && onChangePageSize(value.value)
                            }}
                            value={meta?.page_size ? { label: meta?.page_size, value: meta?.page_size } : null}
                            getOptionLabel={(e) => e.label}
                            isOptionEqualToValue={(option, value) =>
                                option.value == value.value
                            }
                        />} */}
                    </div>}
                    <div className="flex-1 flex justify-end">
                        {meta?.next_page && meta?.next_page <= meta?.total_page &&
                            <button disabled={!(meta?.next_page && meta?.next_page <= meta?.total_page)} onClick={handleNext}
                                className={`${meta?.next_page && meta?.next_page <= meta?.total_page ? 'text-gray-light/700 border border-gray-light/300 shadow-shadows/shadow-xs' : 'text-gray-light/400 border border-gray-light/200 cursor-not-allowed'} px-3 py-2 flex items-center gap-x-1.5 rounded-md`}>
                                <ArrowRight size={20} stroke={'currentColor'} />
                                <p className="text-sm-semibold">Next</p>
                            </button>
                        }
                    </div>
                </div>
            </SimpleBar>
        </div>
    );
};

export default MyPagination;
