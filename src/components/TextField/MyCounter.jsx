import React, { useState } from "react";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

const MyCounter = ({ label = "Jumlah Pemenang Diundi", value = 50, min = 0, max = 1000, step = 1, onChange }) => {
    const [counterValue, setCounterValue] = useState(value);

    // Handle Increment Button Click
    const handleIncrement = () => {
        if (counterValue < max) {
            const newValue = counterValue + step;
            setCounterValue(newValue);
            onChange && onChange(newValue);
        }
    };

    // Handle Decrement Button Click
    const handleDecrement = () => {
        if (counterValue > min) {
            const newValue = counterValue - step;
            setCounterValue(newValue);
            onChange && onChange(newValue);
        }
    };

    // Handle Manual Input
    const handleInputChange = (e) => {
        let inputValue = e.target.value;

        // If input is not a valid number, ignore
        if (!/^\d*$/.test(inputValue)) return;

        // If input is within the valid range, update state
        const numberValue = Number(inputValue);
        if (numberValue >= min && numberValue <= max) {
            setCounterValue(numberValue);
            onChange && onChange(numberValue);
        } else if (inputValue === '') {
            // Allow clearing input temporarily
            setCounterValue('');
        }
    };

    // Handle input blur to set value to min or max if the field is left empty
    const handleBlur = () => {
        if (counterValue === '') {
            setCounterValue(min); // Reset to min if input is empty
            onChange && onChange(min);
        }
    };

    const buttonStyles = (isDisabled) => ({
        color: isDisabled ? "#A0A0A0" : "#374151", // text-gray-light/400 for disabled, text-brand/700 for normal
        backgroundColor: "#FFFFFF", // bg-white for both
        border: "1px solid #D1D5DB", // border-gray-light/200 for disabled, border-brand/300 for normal
        boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)", // shadow-xs
        width: "30px", // Smaller width
        height: "30px", // Smaller height
        minWidth: "30px", // Ensures minimum width
        padding: "0px", // Removes padding for a more compact button
        "&:hover": {
            backgroundColor: isDisabled ? "#FFFFFF" : "#F3E7BB", // hover:bg-brand/50 for enabled
            color: isDisabled ? "#A0A0A0" : "#374151", // hover text-brand/800
        },
        "&:focus": {
            outline: "none",
            ring: "2px",
            ringColor: "#f3e7bb", // focus:ring-[#f3e7bb]
        },
    });

    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <Typography>{label}</Typography>
            <Box display="flex" alignItems="center" mt={1}>
                <Button
                    variant="outlined"
                    onClick={handleDecrement}
                    disabled={counterValue <= min}
                    sx={buttonStyles(counterValue <= min)}
                >
                    −
                </Button>
                <TextField
                 //multiline={true}
                 //rows={1}
                    value={counterValue}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    // inputProps={{
                    //     min: min,
                    //     max: max,
                    //     step: step,
                    //     type: 'number',
                    //     style: { textAlign: 'center' }
                    // }}
                    sx={{
                        mx: 1,
                        width: '60px',
                        //height: '40px',
                        '& input': { padding: 1, textAlign: 'center' }
                    }}
                />
                <Button
                    variant="outlined"
                    onClick={handleIncrement}
                    disabled={counterValue >= max}
                    sx={buttonStyles(counterValue >= max)}
                >
                    +
                </Button>
            </Box>
        </Box>
    );
};

export default MyCounter;
