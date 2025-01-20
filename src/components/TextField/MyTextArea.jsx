import React from "react";
import { Controller } from "react-hook-form";

const MyTextArea = ({ value, name, rows = 4, placeholder, control, errors, max, min,
    disabled, helperText, onChangeInput, onKeyDown }) => {
    const commonProps = { value, placeholder, disabled, rows: rows, onKeyDown };

    let makeStyle = "w-full resize-none py-3 px-4 shadow-shadows/shadow-xs rounded-lg placeholder-gray-light/500 ";
    if (disabled) {
        makeStyle += " bg-gray-light/50 focus:outline-none cursor-not-allowed"
    } else {
        makeStyle += " bg-white focus:outline-none "
    }

    if (errors && name && errors[name]) {
        makeStyle += " border border-error/300 focus:border-error/300 focus:shadow-focus-rings/ring-error-shadow-xs"
    } else {
        makeStyle += " border border-gray-light/300 focus:border-brand/300 focus:shadow-focus-rings/ring-brand-shadow-xs"
    }

    const handleChange = (e, callback) => {
        const { target: { value } } = e;
        if (max && value.length > max) return;

        callback && callback(value ?? '');
        onChangeInput && onChangeInput(e);
    };

    return (
        <>
            {control ? <Controller name={name} control={control} render={(e) => {
                const { formState: { errors }, field: { value, onChange } } = e;
                return (
                    <div className="flex flex-col gap-1.5">
                        <textarea {...commonProps} value={value ?? ''}
                            onChange={(e) => handleChange(e, onChange)} className={`${makeStyle}`}></textarea>
                        {(errors[name] || helperText) && <p className={`text-sm-regular ${errors[name] ? 'text-error/600' : 'text-gray-light/600'}`}>
                            {errors[name] ? errors[name]?.message : helperText}
                        </p>}
                    </div>
                )
            }} /> : <div className="flex flex-col gap-1.5">
                <textarea {...commonProps} className={`${makeStyle}`} onChange={handleChange}></textarea>
                {helperText && <p className="text-sm-regular text-gray-light/600">{helperText}</p>}
            </div>}
        </>
    );
};

export default MyTextArea;