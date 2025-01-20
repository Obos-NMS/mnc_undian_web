import React from "react";
import MyPopper from "../components/Poppper/MyPopper";
import MyBgPatternDecorativeCircle from "../components/Decorative/MyBgPatternDecorativeCircle";
import { Edit04, Lock01, XClose } from "untitledui-js";
import MyButton from "../components/Button/MyButton";
import Reguest from "../services/request";
import { myToaster } from "../components/Toaster/MyToaster";

const Poppper = ({ target, data = {}, done }) => {
    const handleDone = (close, value) => {
        done && done(value?.data);
        close && close();
        return value;
    }

    const setStatusWinner = async (close, status) => {
        var input = {
            participant_id: data.participant_id,
            raffle_prize_id: data.raffle_prize_id,
            status: status,
        };

        await Reguest.setStatusWinner(data.id, input)
            .then(myToaster)
            .then((value) => handleDone(close, value))
            .catch(myToaster);
    };

    return (
        <>
            <MyPopper target={target} placement="top-end">
                {(open, anchorEl, show, close) => (
                    <div className="w-[800px] h-full flex flex-col overflow-hidden">
                        <header className="px-6 pt-6 flex flex-col gap-4 items-start justify-start relative">
                            <button onClick={close}
                                className=" absolute top-[12px] right-[12px] w-11 h-11 flex items-center justify-center text-gray-light/400 rounded-lg p-2">
                                <XClose size={24} stroke={"currentColor"} />
                            </button>
                            <div className="">
                                <MyBgPatternDecorativeCircle>
                                    <div className="bg-warning/100 rounded-full w-12 h-12 flex items-center justify-center">
                                        <Edit04 className={"text-warning/600"} size={24} stroke={"currentColor"} />
                                    </div>
                                </MyBgPatternDecorativeCircle>
                            </div>
                            <div className="z-20 flex flex-col gap-1 items-start justify-start">
                                <p className="text-lg-semibold text-gray-light/900">Ubah Status Pemenang</p>
                                <p className="text-sm-regular text-gray-light/600">Pilih tombol di bawah untuk merubah status pemenang</p>
                            </div>
                        </header>
                        <footer className="pt-8">
                            <div className="px-6 pb-6 flex items-center gap-3">
                                <MyButton expanded color={"secondary"} variant={"outlined"} size={"lg"}
                                    onClick={() => setStatusWinner(close, 'invalid')} >
                                    <p className="text-sm-semibold">Tidak simpan</p>
                                </MyButton>
                                <MyButton expanded color={"success"} variant={"filled"} size={"lg"}
                                    onClick={() => setStatusWinner(close, 'valid')}>
                                    <Lock01 size={20} stroke={"currentColor"} />
                                    <p className="text-sm-semibold">Simpan</p>
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
