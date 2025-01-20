import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

// component
import MyTooltip from "../Tooltip/MyTooltip";
// icon
import { Database01, PresentationChart01, Settings02 } from "untitledui-js";

const MyNavigation = () => {
    const location = useLocation();
    const checkSelectPage = (value, segment) => {
        if (segment) {
            var urlSplit = location.pathname.split('/');
            return urlSplit[segment] === value;
        } else {
            const isExistPath = checkSelectPage(value);
            return isExistPath;
        }
    }

    return (
        <div className="w-20 hidden sm:flex flex-col justify-between bg-white duration-300 ease-out h-screen border-r border-gray-light/200">
            <div className="flex flex-col w-full items-center gap-y-6 pt-8">
                <div className="flex flex-col gap-1.5 w-full px-3">
                    <MyTooltip placement="right"
                        target={<Link to={'/'}>
                            <div className={`${checkSelectPage('', 1) ? 'text-gray-light/700 bg-gray-light/50' : 'text-gray-light/500'} w-full h-12 px-4 flex items-center justify-start gap-3  hover:text-gray-light/700 hover:bg-gray-light/50 cursor-pointer rounded-md`} >
                                <div className="min-w-[24px] min-h-[24px]">
                                    <PresentationChart01 size={24} stroke={"currentColor"} />
                                </div>
                            </div>
                        </Link>}>
                        <p className="text-white text-xs-semibold">Dashboard</p>
                    </MyTooltip>
                    <MyTooltip placement="right"
                        target={<Link to={'/database-management'}>
                            <div className={`${checkSelectPage('database-management', 1) ? 'text-gray-light/700 bg-gray-light/50' : 'text-gray-light/500'} w-full h-12 px-4 flex items-center justify-start gap-3 hover:text-gray-light/700 hover:bg-gray-light/50 cursor-pointer rounded-md`} >
                                <div className="min-w-[24px] min-h-[24px]">
                                    <Database01 size={24} stroke={"currentColor"} />
                                </div>
                            </div>
                        </Link>}>
                        <p className="text-white text-xs-semibold">Database management</p>
                    </MyTooltip>
                    <MyTooltip placement="right"
                        target={<Link to={'/settings'}>
                            <div className={`${checkSelectPage('settings', 1) ? 'text-gray-light/700 bg-gray-light/50' : 'text-gray-light/500'} w-full h-12 px-4 flex items-center justify-start gap-3 hover:text-gray-light/700 hover:bg-gray-light/50 cursor-pointer rounded-md`} >
                                <div className="min-w-[24px] min-h-[24px]">
                                    <Settings02 size={24} stroke={"currentColor"} />
                                </div>
                            </div>
                        </Link>}>
                        <p className="text-white text-xs-semibold">Settings</p>
                    </MyTooltip>
                </div>
            </div>
        </div>
    );
};

export default MyNavigation;
