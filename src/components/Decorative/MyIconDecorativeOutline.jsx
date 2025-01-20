import React from "react";

const MyIconDecorativeOutline = ({ children, color }) => {
    const makeStyleIcon = React.useMemo(() => {
        let className = '';
        if (color === 'gray') {
            className += 'text-gray-light/600';
        } else if (color === 'primary') {
            className += 'text-brand/600';
        } else if (color === 'success') {
            className += 'text-success/600';
        } else if (color === 'warning') {
            className += 'text-warning/600';
        } else if (color === 'error') {
            className += 'text-error/600';
        }

        return className;
    }, [color])

    const makeStyleBorder = React.useMemo(() => {
        let className = '';
        if (color === 'gray') {
            className += '[&>*:nth-child(1)]:border-gray-light/600/30 [&>*:nth-child(2)]:border-gray-light/600/10';
        } else if (color === 'primary') {
            className += '[&>*:nth-child(1)]:border-brand/600/30 [&>*:nth-child(2)]:border-brand/600/10';
        } else if (color === 'success') {
            className += '[&>*:nth-child(1)]:border-success/600/30 [&>*:nth-child(2)]:border-success/600/10';
        } else if (color === 'warning') {
            className += '[&>*:nth-child(1)]:border-warning/600/30 [&>*:nth-child(2)]:border-warning/600/10';
        } else if (color === 'error') {
            className += '[&>*:nth-child(1)]:border-error/600/30 [&>*:nth-child(2)]:border-error/600/10';
        }

        return className;
    }, [color])

    return (
        <>
            {children && <div className='w-max relative flex items-center justify-center'>
                <div className={`${makeStyleIcon}`}>
                    {children}
                </div>
                <div className={`w-[38px] h-[38px] absolute flex items-center justify-center ${makeStyleBorder}`}>
                    <span className="block w-7 h-7 absolute border-2 rounded-full"></span>
                    <span className="block w-[38px] h-[38px] absolute border-2 rounded-full"></span>
                </div>
            </div>}
        </>
    );
};

export default MyIconDecorativeOutline;