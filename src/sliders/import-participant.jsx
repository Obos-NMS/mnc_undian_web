import React, { useEffect, useState } from "react";
import { XClose } from "untitledui-js";
import SimpleBar from "simplebar-react";
import Reguest from "../services/request";
import { myToaster } from "../components/Toaster/MyToaster";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { importParticipant as importParticipantSchema } from "../yup/schema";
import MyButton from "../components/Button/MyButton";
import MyTextField from "../components/TextField/MyTextField";
import MyDropzone from "../components/Dropzone/MyDropzone";
import FormData from "form-data";
import socketio from "socket.io-client";
import { sum } from "lodash";

const baseURL = process.env.REACT_APP_API_HOST ||
    `http://${window.location.hostname}:${process.env.REACT_APP_API_PORT}`;

const Slider = ({ data = {}, done, close }) => {
    const { setValue, handleSubmit, register, control, watch, trigger, formState: { errors } } = useForm({ resolver: yupResolver(importParticipantSchema) });
    const [socket, setSocket] = useState(null);

    const [progressUpload, setProgressUpload] = useState(null);
    const [failedFile, setFailedFile] = useState();

    const handleDone = (value) => {
        done && done(value?.data);
        close && close();
        return value;
    }

    const importParticipant = async (body) => {
        const formData = new FormData();
        body.participants.forEach(e => {
            formData.append("participants", e);
        });

        await Reguest.importParticipant(formData, {
            onUploadProgress: (progressEvent) => {
                setProgressUpload(progressEvent);
            },
        }).then((res) => {
            setProgressUpload({ progress: 0, import: true });
            const socketOff = () => {
                socket.off(res?.data?.progress);
                socket.off(res?.data?.result);
                console.log("socket off");
            };
            var timeout = setTimeout(socketOff, 1 * 60 * 1000);
            socket.on(res?.data?.progress, (a) => {
                clearTimeout(timeout);
                timeout = setTimeout(socketOff, 1 * 60 * 1000);
                console.log(a);
                setProgressUpload({ progress: a.progress / 100, import: true });
            });
            socket.on(res?.data?.result, (b) => {
                console.log(b.result);
                setFailedFile(b?.result);
                setProgressUpload({ progress: 100, import: true });
                clearTimeout(timeout);
                socketOff();

                if (b?.result?.failed?.length === 0) {
                    myToaster({
                        status: 200,
                        title: "Your data has been successfully imported",
                        message: "Your data has been imported and is now ready to be utilized",
                    });

                    handleDone();
                }

            });
        }).catch((res) => {
            close && close();
            myToaster(res);
        });
    };

    const submit = importParticipant;

    const downloadTemplateImportParticipant = async () => {
        const url = Reguest.downloadTemplateImportParticipant();
        window.open(url, "_blank").focus();
    };

    useEffect(() => {
        const socket = socketio.connect(baseURL + "/v1", {
            transports: ["websocket"],
            upgrade: false,
        });
        setSocket(socket);
        return () => {
            socket.disconnect();
        };
    }, []);

    console.log("errors", errors)

    return (
        <div className="w-[400px] h-screen flex flex-col gap-8">
            <header className="px-6 flex items-start gap-x-4 relative">
                <button onClick={close}
                    className=" absolute top-[12px] right-[12px] w-11 h-11 flex items-center justify-center text-gray-light/400 rounded-lg p-2">
                    <XClose size={24} stroke={"currentColor"} />
                </button>
                <div className="flex flex-col gap-6 w-full pt-6">
                    <div className="flex flex-col gap-1">
                        <p className="text-xl-semibold text-gray-light/900">Import Peserta</p>
                        <p className="text-sm-regular">Unggah data peserta</p>
                    </div>
                    <div>
                        <MyButton color={"primary"} variant={"filled"} size={"md"}
                            onClick={downloadTemplateImportParticipant} >
                            <p className="text-sm-semibold">Download Template</p>
                        </MyButton>
                    </div>
                </div>
                <hr className="border-gray-light/200 w-100%" />
            </header>
            <div className="flex-1 overflow-hidden">
                <SimpleBar forceVisible="y" style={{ height: "100%" }}>
                    <form className="h-full flex flex-col" onSubmit={handleSubmit(submit)}>
                        <div className="flex flex-col px-6">
                            <div>
                                <MyDropzone
                                    multiple={false}
                                    accept={[".xlsx"]}
                                    onChange={(files) => {
                                        console.log(files);
                                    }}
                                    progressUpload={progressUpload}
                                    onDrop={(acceptedFiles, rejectedFiles, e) => {
                                        console.log(acceptedFiles, rejectedFiles, e);
                                    }}
                                    onDropAccepted={async (acceptedFiles, handleDeleteFile) => {
                                        setValue('participants', acceptedFiles)

                                        const isValid = await trigger();
                                        if (isValid) {
                                            handleSubmit(submit)();
                                        }
                                    }}
                                    onDropRejected={(rejectedFiles, e) => { }}
                                    failedFile={failedFile}
                                ></MyDropzone>
                            </div>
                            <div className="p-4">
                                <p className="text-sm-regular text-gray-light/600">Kolom pertama dalam tabel akan menjadi acuan dalam pengundian. Mengupload data baru akan menghapus data lama.</p>
                            </div>
                        </div>

                    </form>
                </SimpleBar>
            </div>
        </div>
    );
};

export default Slider;