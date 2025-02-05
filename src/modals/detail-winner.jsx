    import React, {useEffect, useState } from "react";
    import SimpleBar from "simplebar-react";
    import MyDetailView from "../components/DetailView/MyDetailView";
    import MyButton from "../components/Button/MyButton";
    import { Lock01 } from "untitledui-js";
    import { Firework } from "../components/Icon/Addons";
    import MyBgPatternDecorativeCircle from "../components/Decorative/MyBgPatternDecorativeCircle";
    import Reguest from "../services/request";
    import { myToaster } from "../components/Toaster/MyToaster";
    import { convertUrlImage } from "../services/helper";
import ReactPlayer from "react-player";

    const Modal = ({ detail = null, rafflePrize = null, done, close }) => {
        const [playWinningSound, setPlayWinningSound] = useState(false); 

        const handleDone = (value) => {
            done && done(value?.data);
            close && close();
            return value;
        }

        const setWinner = async (status) => {
            var input = {
                participant_id: detail.participant_id,
                raffle_prize_id: rafflePrize.value,
                status: status,
            };

            await Reguest.setWinner(input)
                .then(myToaster)
                .then(handleDone)
                .catch(myToaster);
        };

            // Play the winning sound when the modal is opened
    useEffect(() => {
        if (detail) {
            setPlayWinningSound(true); // Trigger the sound when modal is opened
        }
    }, [detail]);
        return (
           
           <div className="bg-white w-full min-w-[800px] min-h-[60vh] relative rounded-xl shadow-shadows/shadow-xl overflow-hidden">
                        <ReactPlayer
                url="/sounds/winning.mp3" // Replace with the actual path to the winning sound file
                playing={playWinningSound}
                volume={1}
                onEnded={() => setPlayWinningSound(false)} // Stop sound when it finishes
                height={0}
                width={0}
            />
                <SimpleBar forceVisible="y" style={{ maxHeight: "100vh" }} className="w-full">
                    <div className="flex flex-col w-full">
                        <div className="relative h-20 w-full flex items-center justify-center">
                            <MyBgPatternDecorativeCircle></MyBgPatternDecorativeCircle>
                            <div className="z-30 absolute top-4">
                                <Firework />
                            </div>
                        </div>
                        <br/>
                    
                        <br/>
                        <br/>
                        <br/>
                        <br/>
             
                        <div className="z-30 p-6 flex flex-col items-center justify-center text-center">
                            <div className="flex flex-col gap-1">
                                <p className="text-lg-semibold text-gray-light/900">Selamat! kepada pemenang dengan nomor undian</p>
                                <p className="display-sm-semibold text-brand/600">{detail && detail?.identifier_code.split('').join(' ')}</p>
                            </div>
                        </div>
                        <div className="z-30 w-full h-[350px] flex items-center justify-center">
                            <div className="h-full w-full max-w-[261px]">
                                {rafflePrize && rafflePrize.photo ? <div className="w-full h-full">
                                    <img className="w-full h-full object-cover" src={convertUrlImage(rafflePrize.photo)} alt="" />
                                </div> : <p className="text-sm-medium text-gray-light/700">Foto tidak ditemukan</p>}
                            </div>
                        </div>
                        <div className="z-30">
    {detail && (
        <MyDetailView
            datas={detail.participant_field_values
                .filter(
                    (item) =>
                        item.participant_field_name.name !== "No. Urut" &&
                        item.participant_field_name.name !== "Nama Cabang"
                )
                
                .sort((a, b) => a.participant_field_name.index - b.participant_field_name.index)
                .reduce((acc, item) => {
                    // Masking logic for item.value
                    let maskedValue = item.value;
                
                    // Check if value is a string and has sufficient length to mask
                    if (typeof item.value === "string" && item.value.length > 1) {
                        // Convert value to array to manipulate characters
                        let valueArray = item.value.split("");
                        const maskCount = Math.floor(item.value.length / 2); // Mask half of the length randomly
                        
                        for (let i = 0; i < maskCount; i++) {
                            // Generate random index to replace with an asterisk
                            const randomIndex = Math.floor(Math.random() * valueArray.length);
                            valueArray[randomIndex] = "*";
                        }
                        maskedValue = valueArray.join("");
                    }
                
                    acc[item.participant_field_name.name] = maskedValue;
                
                    console.log(item.value, "Original Value");
                    console.log(maskedValue, "Masked Value");
                    return acc;
                }, {})
                }
        />
    )}
</div>

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
             
                        <footer className="pt-8">
                            <hr className="border-gray-light/200" />
                            <div className="p-6 flex items-center gap-3">
                                <MyButton disabled={!detail || !rafflePrize} expanded color={"secondary"} variant={"outlined"} size={"lg"}
                                    onClick={close} >
                                    <p className="text-sm-semibold">Tidak simpan</p>
                                </MyButton>
                                <MyButton disabled={!detail || !rafflePrize} expanded color={"success"} variant={"filled"} size={"lg"}
                                    onClick={() => setWinner('valid')}>
                                    <Lock01 size={20} stroke={"currentColor"} />
                                    <p className="text-sm-semibold">Simpan</p>
                                </MyButton>
                            </div>
                        </footer>
                    </div>
                </SimpleBar>
            </div>
        );
    };

    export default Modal;