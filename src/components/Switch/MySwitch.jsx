import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import Switch from '@mui/material/Switch';

const style = {
    '&.MuiSwitch-root': {
        width: "36px", height: "20px",
        padding: "0px",
        overflow: "inherit",
        '& .MuiButtonBase-root': {
            padding: 0, transitionDuration: '300ms',
            margin: 0, marginTop: '2px',
            marginLeft: '2px',
            '&.Mui-checked': {
                marginLeft: '-2px',
                '& + .MuiSwitch-track': {
                    backgroundColor: '#AA8E45',
                    opacity: 1,
                },
                "& .MuiSwitch-thumb": {
                    background: '#FFFFFF',
                    boxShadow: '0px 1px 2px #1018280f'
                },
            },
            "& .MuiSwitch-thumb": {
                width: 16,
                height: 16,
                background: '#F9FAFB',
                boxShadow: '0px 1px 2px #1018280f'
            },
            '&.Mui-focusVisible.Mui-checked': {
                '& + .MuiSwitch-track': {
                    boxShadow: '0px 0px 0px 4px #f3e7bb',
                },
            },
            '&.Mui-focusVisible': {
                '& + .MuiSwitch-track': {
                    boxShadow: '0px 0px 0px 4px #98a2b324',
                },
            },
        },
        '& .MuiSwitch-track': {
            borderRadius: '20px',
            backgroundColor: '#F2F4F7',
            opacity: 1,
        },
    },
}

const MySwicth = ({ name, checked = false, control, disabled, onChange }) => {
    const [isChecked, setIsChecked] = useState(checked);
    useEffect(() => {
        setIsChecked(checked);
    }, [checked]);

    const handleChange = (e, callback) => {
        const { target: { checked } } = e;
        setIsChecked(checked);
        callback && callback(e);
        onChange && onChange(e);
    };

    const commonProps = { name, disabled, disableRipple: true, sx: style };
    return (
        <>
            {control ? <Controller name={name} control={control} render={({ field: { value, onChange } }) =>
                <Switch {...commonProps} checked={value ?? false} onChange={(e) => handleChange(e, onChange)} />
            } /> : <Switch {...commonProps} checked={isChecked} onChange={(e) => handleChange(e)} />}
        </>
    );
};

export default MySwicth;