import React, {  useState } from "react";
import { Popover } from "@mui/material";


const MyPopper = ({ children, id, placement = "bottom", target }) => {
    var anchorOrigin, transformOrigin;
    const style = {
        '&.MuiPopover-root .MuiPaper-root': {
            boxShadow: '0px 8px 8px -4px rgba(16, 24, 40, 0.03)',
            border: '1px solid #EAECF0',
            borderRadius: '12px',
            width: 'max-content',
        },
        '&.MuiPopover-root .MuiBackdrop-root': {
            // background: 'rgba(12, 17, 29, 0.3)',
            // backdropFilter: 'blur(4px)'
        }
    };

    if (placement === 'top-start') {
        anchorOrigin = { vertical: "top", horizontal: "left" };
        transformOrigin = { vertical: "bottom", horizontal: "right" };
        style['&.MuiPopover-root .MuiPaper-root'].marginTop = "8px";
    } else if (placement === 'top') {
        anchorOrigin = { vertical: "top", horizontal: "center" };
        transformOrigin = { vertical: "bottom", horizontal: "center" };
        style['&.MuiPopover-root .MuiPaper-root'].marginTop = "8px";
    } else if (placement === 'top-end') {
        anchorOrigin = { vertical: "top", horizontal: "right" };
        transformOrigin = { vertical: "bottom", horizontal: "right" };
        style['&.MuiPopover-root .MuiPaper-root'].marginTop = "-8px";
    } else if (placement === 'left-start') {
        anchorOrigin = { vertical: "top", horizontal: "left" };
        transformOrigin = { vertical: "top", horizontal: "right" };
        style['&.MuiPopover-root .MuiPaper-root'].marginLeft = "-8px";
    } else if (placement === 'left') {
        anchorOrigin = { vertical: "top", horizontal: "right" };
        transformOrigin = { vertical: "bottom", horizontal: "right" };
        style['&.MuiPopover-root .MuiPaper-root'].marginTop = "8px";
    } else if (placement === 'left-end') {
        anchorOrigin = { vertical: "top", horizontal: "right" };
        transformOrigin = { vertical: "bottom", horizontal: "right" };
        style['&.MuiPopover-root .MuiPaper-root'].marginTop = "8px";
    } else if (placement === 'bottom-start') {
        anchorOrigin = { vertical: "bottom", horizontal: "left" };
        transformOrigin = { vertical: "top", horizontal: "left" };
        style['&.MuiPopover-root .MuiPaper-root'].marginTop = "8px";
    } else if (placement === 'bottom') {
        anchorOrigin = { vertical: "top", horizontal: "right" };
        transformOrigin = { vertical: "bottom", horizontal: "right" };
        style['&.MuiPopover-root .MuiPaper-root'].marginTop = "8px";
    } else if (placement === 'bottom-end') {
        anchorOrigin = { vertical: "bottom", horizontal: "right" };
        transformOrigin = { vertical: "top", horizontal: "right" };
        style['&.MuiPopover-root .MuiPaper-root'].marginTop = "8px";
    } else if (placement === 'right-start') {
        anchorOrigin = { vertical: "top", horizontal: "right" };
        transformOrigin = { vertical: "bottom", horizontal: "right" };
        style['&.MuiPopover-root .MuiPaper-root'].marginTop = "8px";
    } else if (placement === 'right') {
        anchorOrigin = { vertical: "top", horizontal: "right" };
        transformOrigin = { vertical: "bottom", horizontal: "right" };
        style['&.MuiPopover-root .MuiPaper-root'].marginTop = "8px";
    } else if (placement === 'right-end') {
        anchorOrigin = { vertical: "top", horizontal: "right" };
        transformOrigin = { vertical: "bottom", horizontal: "right" };
        style['&.MuiPopover-root .MuiPaper-root'].marginTop = "8px";
    }

    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    const show = (event) => {
        setAnchorEl(event?.currentTarget ?? event);
        setOpen(true);
    };
    const close = () => {
        setAnchorEl(null);
        setOpen(false);
    };

    return (
        <>
            <div className="flex">
                {target && target(open, show)}
                <Popover
                    id={id} open={open} anchorEl={anchorEl} onClose={close}
                    anchorOrigin={anchorOrigin} transformOrigin={transformOrigin}
                    placement={placement} sx={style} >
                    {children && children(open, anchorEl, show, close)}
                </Popover>
            </div>
        </>
    );
};

export default MyPopper;