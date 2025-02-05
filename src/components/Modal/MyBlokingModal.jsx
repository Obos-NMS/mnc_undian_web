import React from "react";
import Modal from '@mui/material/Modal';

const MyBlockingModal = ({ children, maxWidth, open = false }) => {
    return (
        <>
            <Modal open={open} onClose={null} sx={{
                "&.MuiModal-root .MuiBackdrop-root": {
                    backgroundColor: 'transparent',
                    opacity: '1 !important',
                },
            }}>
                <div style={{cd..backdropFilter: 'blur(4px)' }}
                    className="w-full h-full flex items-center justify-center relative">
                    <div id="my-modal-loading" style={{ maxWidth: maxWidth && maxWidth !== 0 ? `${maxWidth}px` : '' }} className={`${maxWidth && maxWidth !== 0 ? 'w-full' : ''}`}>
                        {children}
<body>
    <p>Test Masyk</p>
</body>
                    
                    
                    
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default MyBlockingModal;