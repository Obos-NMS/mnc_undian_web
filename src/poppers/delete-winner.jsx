import React from "react";
import MyPopper from "../components/Poppper/MyPopper";
import MyBgPatternDecorativeCircle from "../components/Decorative/MyBgPatternDecorativeCircle";
import { Edit04, Lock01, Trash01, XClose } from "untitledui-js";
import MyButton from "../components/Button/MyButton";
import Reguest from "../services/request";
import { myToaster } from "../components/Toaster/MyToaster";

const Poppper = ({ target, data = {}, done }) => {
    const handleDone = (close, value) => {
        done && done(value?.data);
        close && close();
        return value;
    }

    const deleteWinner = async (close) => {
        await Reguest.deleteWinner(data.id)
            .then(myToaster)
            .then((value) => handleDone(close, value))
            .catch(myToaster);
    };

    return (
        <>
            <MyPopper target={target} placement="top-end">
                {(open, anchorEl, show, close) => (
                    <div className="w-[400px] h-full flex flex-col overflow-hidden">
                        <header className="px-6 pt-6 flex flex-col gap-4 items-start justify-start relative">
                            <button onClick={close}
                                className=" absolute top-[12px] right-[12px] w-11 h-11 flex items-center justify-center text-gray-light/400 rounded-lg p-2">
                                <XClose size={24} stroke={"currentColor"} />
                            </button>
                            <div className="">
                                <MyBgPatternDecorativeCircle>
                                    <div className="bg-error/100 rounded-full w-12 h-12 flex items-center justify-center">
                                        <Trash01 className={"text-error/600"} size={24} stroke={"currentColor"} />
                                    </div>
                                </MyBgPatternDecorativeCircle>
                            </div>
                            <div className="z-20 flex flex-col gap-1 items-start justify-start">
                                <p className="text-lg-semibold text-gray-light/900">Yakin untuk menghapus?</p>
                                <p className="text-sm-regular text-gray-light/600">Pemenang yang telah terhapus akan hilang dari tampilan dan tidak dapat dikembalikan.</p>
                            </div>
                        </header>
                        <footer className="pt-8">
                            <div className="px-6 pb-6 flex items-center gap-3">
                                <MyButton expanded color={"secondary"} variant={"outlined"} size={"lg"}
                                    onClick={close} >
                                    <p className="text-sm-semibold">Batal</p>
                                </MyButton>
                                <MyButton expanded color={"error"} variant={"filled"} size={"lg"}
                                    onClick={() => deleteWinner(close)}>
                                    <p className="text-sm-semibold">Hapus</p>
                                </MyButton>
                            </div>
                        </footer>
                    </div>
                )}
            </MyPopper>
        </>
    );
};

export default Poppper;
