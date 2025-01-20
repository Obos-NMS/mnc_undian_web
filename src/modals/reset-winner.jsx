/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import SimpleBar from "simplebar-react";
import MyTextField from "../components/TextField/MyTextField";
import { Eye, EyeOff, InfoCircle, XClose } from "untitledui-js";
import MyButton from "../components/Button/MyButton";
import MyBgPatternDecorativeCircle from "../components/Decorative/MyBgPatternDecorativeCircle";
import Reguest from "../services/request";
import { myToaster } from "../components/Toaster/MyToaster";
import { useForm } from "react-hook-form";
import { resetWinner as resetWinnerSchema } from "../yup/schema";
import { yupResolver } from "@hookform/resolvers/yup";

const Modal = ({ data = {}, done, close }) => {
    const { setValue, handleSubmit, register, control, watch, formState: { errors } } = useForm({ resolver: yupResolver(resetWinnerSchema) });
    const [isShowPass, setIsShowPass] = useState(false);
    const handleDone = (value) => {
        done && done(value?.data);
        close && close();
        return value;
    }

    const resetWinner = async (body) => {
        var input = {
            reset_data_password: body.reset_data_password
        }

        await Reguest.resetWinner(input)
            .then(myToaster)
            .then(handleDone)
            .catch(myToaster);
    };
    const submit = resetWinner;


    return (
        <div className="bg-white w-full max-h-[480px] relative rounded-xl shadow-shadows/shadow-xl overflow-hidden">
            <SimpleBar forceVisible="y" style={{ maxHeight: "480px" }} className="w-full">
                <form onSubmit={handleSubmit(submit)}>
                    <div className="flex flex-col w-full">
                        <header className="px-6 pt-6 pb-5  relative">
                            <button onClick={close}
                                className="z-30 absolute top-[12px] right-[12px] w-11h-11 flex items-center justify-center text-gray-light/400 rounded-lg p-2" >
                                <XClose size={24} stroke={"currentColor"} />
                            </button>
                            <div className="flex flex-col gap-4">
                                <div>
                                    <MyBgPatternDecorativeCircle>
                                        <div className="flex items-center justify-center border border-gray-light/200 text-gray-light/700 rounded-xl w-14 h-14">
                                            <InfoCircle size={24} stroke={"currentColor"} />
                                        </div>
                                    </MyBgPatternDecorativeCircle>
                                </div>
                                <div className="z-30 flex flex-col items-start justify-start gap-1">
                                    <p className="text-lg-semibold text-gray-light/900">Reset Sistem Undian</p>
                                    <p className="text-sm-regular text-gray-light/600">Perhatian! Melakukan reset berarti akan menghapus seluruh riwayat data undian</p>
                                </div>
                            </div>
                        </header>
                        <div className="z-30 px-6">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="reset_data_password" className="text-sm-medium text-gray-light/700">Kata Sandi</label>
                                <MyTextField
                                    type={isShowPass ? "text" : "password"}
                                    name="reset_data_password"
                                    placeholder={"Masukkan kata sandi"}
                                    control={control}
                                    errors={errors}
                                    endAdornment={<span className="p-1 cursor-pointer" onClick={() => setIsShowPass(!isShowPass)}>
                                        {isShowPass ? <Eye size={20} stroke={"currentColor"} /> :
                                            <EyeOff size={20} stroke={"currentColor"} />}
                                    </span>}
                                />
                            </div>
                        </div>
                        <footer className="z-30 pt-8">
                            <hr className="border-gray-light/200" />
                            <div className="p-6 flex items-center gap-3">
                                <MyButton type="reset" expanded color={"secondary"} variant={"outlined"} size={"lg"}
                                    onClick={close}>
                                    <p className="text-sm-semibold">Batal</p>
                                </MyButton>
                                <MyButton type="submit" expanded color={"primary"} variant={"filled"} size={"lg"}>
                                    <p className="text-sm-semibold">Konfirmasi</p>
                                </MyButton>
                            </div>
                        </footer>
                    </div>
                </form>
            </SimpleBar>
        </div>
    );
};

export default Modal;