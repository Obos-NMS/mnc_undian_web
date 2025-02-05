import React from 'react';
import { toast } from 'react-toastify';
import MyIconDecorativeOutline from '../Decorative/MyIconDecorativeOutline';
import { AlertCircle, CheckCircle, XClose } from 'untitledui-js';
import MyButton from '../Button/MyButton';

const Content = ({ closeToast, toastProps,
    response: { status = null, message = null, title = null, user = null }={},
    onUndo, onDismiss, onViewChange }) => {

    const toasterIcon = React.useMemo(() => {
        if (status === 200 || status === 201 || status === "200" || status === "201") {
            return <MyIconDecorativeOutline color={'success'}>
                <CheckCircle size={20} stroke={'currentColor'} />
            </MyIconDecorativeOutline>
        } else if (status === 500 || status === "500") {
            return <MyIconDecorativeOutline color={'warning'}>
                <AlertCircle size={20} stroke={'currentColor'} />
            </MyIconDecorativeOutline>
        }

        return <MyIconDecorativeOutline color={'warning'}>
        <AlertCircle size={20} stroke={'currentColor'} />
    </MyIconDecorativeOutline>
    }, [status])

    return (
        <div className='relative  p-4 bg-white rounded-xl border border-gray-light/300 shadow-shadows/shadow-lg'>
            <button onClick={closeToast} className="absolute top-0 right-0 text-gray-light/400 p-2">
                <XClose size={20} stroke={'currentColor'} />
            </button>
            <div className='flex items-start gap-4'>
                {toasterIcon && <div>{toasterIcon}</div>}
                <div className='flex flex-col gap-3 w-full'>
                    <div className='w-full flex flex-col gap-y-1'>
                        <p className='text-gray-light/900 text-sm-semibold'>{title ?? 'Sukses Menyimpan'}</p>
                        <p className='text-gray-light/700 text-sm-regular line-clamp-2 whitespace-pre-line'
                            dangerouslySetInnerHTML={{ __html: message ?? 'Something wrong!' }}></p>
                    </div>
                    {(onDismiss || onViewChange || onUndo) &&
                        <div className='w-full flex items-center gap-x-3'>
                            {onDismiss && <MyButton color={"gray"} variant={'text'} >
                                <p className='text-sm-semibold'>Dismiss</p>
                            </MyButton>}
                            {onViewChange && <MyButton color={"primary"} variant={'text'} >
                                <p className='text-sm-semibold'>View changes</p>
                            </MyButton>}
                            {onUndo && <MyButton color={"primary"} variant={'text'} >
                                <p className='text-sm-semibold'>Undo action</p>
                            </MyButton>}
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

export const myToaster = (response, { onUndo = null, onDismiss = null, onViewChange = null } = {}) => {
    toast(<Content response={response}
        onUndo={onUndo} onDismiss={onDismiss} onViewChange={onViewChange}
    />, { containerId: 'default' });

    return response;
};