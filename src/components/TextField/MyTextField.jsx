import React, { useEffect, useState } from "react";
import { default as MuiTextField } from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { Controller } from "react-hook-form";
import { AlertCircle } from "untitledui-js";
import { debounce } from "lodash";

const getDataByField = (data, field) => {
    const fields = field.split('.');
    return fields.reduce((result, f) => (result && typeof result === 'object' && f in result) ? result[f] : null, data);
};
const MyTextField = ({
    type = "text", placeholder, name, value, label, control, trigger, errors, isErrorInput = false,
    alignment = "left", hideSpinButton = false, autoFocus, readOnly, disabled, startAdornment, endAdornment, helperText,
    onChangeForm, onKeyDown, onFocusForm, onClick, cypress,
    minLength, maxLength, min, max, toUpperCase, toLowerCase, validationRegex,
}) => {

    // Local state to manage the input value
    const [inputValue, setInputValue] = useState(value ?? '');

    // Update the local state when the external value changes
    useEffect(() => {
        setInputValue(value ?? '');
    }, [value]);

    // Handle the input value change
    const handleChange = (e, callback) => {
        let value = e.target.value;
        if (toUpperCase) {
            value = value.toUpperCase();
        }

        if (toLowerCase) {
            value = value.toLowerCase();
        }

        if (type === 'number') {
            if (max && parseInt(value) > max) return;
            if (min && parseInt(value) < min) return;

        }

        if (validationRegex && value) {
            var regex = new RegExp(validationRegex);
            if (!regex.test(value)) return;
        }

        if (value.length > maxLength) return;

        setInputValue(value ?? "");
        callback && callback(value ?? "");
        onChangeForm && onChangeForm(e);
        if (control && trigger && name) {
            const handleChangeDebounce = debounce((e) => {
                trigger(name);
            }, 1000);
            handleChangeDebounce(e);
        }
    };

    // Styles for the TextField component
    const Style = React.useMemo(() => {
        let xs = {
            // Styles for the container
            '&': { display: 'flex', flexDirection: 'column', gap: '6px' },
            // Styles for the TextField
            '& .MuiInputBase-root': {
                borderRadius: '8px',
                //     padding: '10px 14px',
                height: '100%',
                display: "flex",
                // gap: "8px",
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
                '& .MuiInputBase-input': { padding: "0px", margin: "10px 14px", textAlign: alignment, appearance: 'none' },
                '& .MuiInputBase-input::-webkit-inner-spin-button': { appearance: hideSpinButton ? 'none' : null },
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


        return xs;
    }, [alignment, hideSpinButton]);

    // Common props for MuiTextField
    const commonProps = React.useMemo(() => {
        const props = {
            name, type, value: inputValue, autoFocus, sx: Style,
            placeholder, helperText, variant: "outlined", autoComplete: "off", fullWidth: true,
            disabled, onKeyDown, onFocus: onFocusForm, onClick: onClick,
            InputProps: {
                readOnly: Boolean(readOnly),
                startAdornment: startAdornment && <InputAdornment position="start">{startAdornment}</InputAdornment>,
            },
        }

        // If there are errors for the field, display an error icon
        if (errors && name && errors[name]) {
            props.InputProps.endAdornment = <InputAdornment position="end">
                <AlertCircle size={20} className={'text-error/500'} stroke={'currentColor'} />
            </InputAdornment>
        } else {
            // If no errors, display the specified endAdornment
            props.InputProps.endAdornment = endAdornment &&
                <InputAdornment position="end">{endAdornment}</InputAdornment>;
        }
        if (cypress)
            props['data-test'] = cypress;
        return props;
    }, [Style, autoFocus, cypress, disabled, endAdornment, errors, helperText, inputValue, name, onClick, onFocusForm, onKeyDown, placeholder, readOnly, startAdornment, type]);

    return (
        <>
            {control ? (
                // If using Controller from react-hook-form, render with its props
                <Controller name={name} control={control} render={(e) => {
                    const { formState: { errors }, field: { value, onChange } } = e;
                    const isError = Boolean(getDataByField(errors, name)?.message);
                    return <MuiTextField {...commonProps} value={value ?? ''}
                        error={isError} helperText={isError ? getDataByField(errors, name)?.message : helperText}
                        onChange={(e) => handleChange(e, onChange)}
                        onWheel={(e) => {
                            e.target.blur();
                        }} />
                }} />
            ) : (
                // If not using Controller, render MuiTextField directly
                <MuiTextField {...commonProps}
                    error={isErrorInput}
                    onChange={handleChange}
                    onWheel={(e) => {
                        e.target.blur();
                    }} />
            )}
        </>
    );
}

export default MyTextField;