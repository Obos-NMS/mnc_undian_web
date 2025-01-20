import React from 'react';
import { Controller } from "react-hook-form";
import { Checkbox } from '@mui/material';
import { Check } from 'untitledui-js';

const style = {
    '&.MuiButtonBase-root.MuiCheckbox-root': {
        margin: 0, padding: 0,
        borderRadius: '6px',
        '&.Mui-focusVisible.Mui-checked': {
            boxShadow: '0px 0px 0px 4px #f3e7bb',
        },
        '&.Mui-focusVisible': {
            boxShadow: '0px 0px 0px 4px #98a2b324',
        }
    },
};

const MyCheckbox = ({
    name, value, checked, control,
    disabled, onChangeForm
}) => {
    return (
        <div className='flex items-center input-checkbox'>
            {control ? <Controller name={name} control={control} render={({ field }) => {
                return (
                    <Checkbox name={name} value={value} checked={checked || field?.value === value} disabled={disabled} disableRipple
                        onChange={(e) => {
                            var { target: { checked } } = e;
                            field?.onChange && field?.onChange((checked) ? value : null);
                            onChangeForm && onChangeForm(e);
                        }}
                        icon={<span className={`${disabled ? 'bg-gray-light/50 cursor-not-allowed' : ''} flex items-center justify-center min-h-[20px] min-w-[20px] w-5 h-5 rounded-md border border-gray-light/300`}> </span>}
                        checkedIcon={<span className={`${disabled ? 'bg-gray-light/50 cursor-not-allowed text-gray-light/300 border border-gray-light/300' : 'text-white bg-brand/600'} flex items-center justify-center min-h-[20px] min-w-[20px] w-5 h-5 rounded-md `}>
                            <Check size={14} stroke="currentColor" strokeWidth={3.5} />
                        </span>}
                        sx={style}
                    />
                )
            }} /> : <Checkbox name={name} value={value} disabled={disabled} disableRipple
                onChange={onChangeForm} checked={checked ?? false}
                icon={<span className={`${disabled ? 'bg-gray-light/50 cursor-not-allowed' : ''} flex items-center justify-center min-h-[20px] min-w-[20px] w-5 h-5 rounded-md border border-gray-light/300`}> </span>}
                checkedIcon={<span className={`${disabled ? 'bg-gray-light/50 cursor-not-allowed text-gray-light/300 border border-gray-light/300' : 'text-white bg-brand/600'} flex items-center justify-center min-h-[20px] min-w-[20px] w-5 h-5 rounded-md `}>
                    <Check size={14} stroke="currentColor" strokeWidth={3.5} />
                </span>}
                sx={style}
            />}
        </div>
    );
};


export default MyCheckbox;
