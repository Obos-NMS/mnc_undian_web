import React, { useEffect, useState } from "react";
import SimpleBar from "simplebar-react";
import MyButton from "../components/Button/MyButton";
import { Lock01 } from "untitledui-js";
import { Firework } from "../components/Icon/Addons";
import MyBgPatternDecorativeCircle from "../components/Decorative/MyBgPatternDecorativeCircle";
import ParticipantList from "../components/Table/ParticipantList";
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
  };

  const setWinner = async (status) => {
    var input = {
      participants: detail,
      raffle_prize_id: rafflePrize.value,
      status: status,
    };

    await Reguest.setMultipleWinner(input)
      .then(myToaster)
      .then(handleDone)
      .catch(myToaster);
  };

  useEffect(() => {
    if (detail) {
      setPlayWinningSound(true);
    }
  }, [detail]);
  return (
    <div className="bg-white min-w-[800px] min-h-[850px] relative rounded-xl shadow-shadows/shadow-xl overflow-hidden">
      <ReactPlayer
        url="/sounds/winning.mp3"
        playing={playWinningSound}
        volume={1}
        onEnded={() => setPlayWinningSound(false)}
        height={0}
        width={0}
      />
      <SimpleBar
        forceVisible="y"
        style={{ maxHeight: "90vh", maxWidth: "100vw" }}
        className="">
        <div className="flex flex-col w-full">
          <div className="relative h-20 w-full flex items-center justify-center">
            <MyBgPatternDecorativeCircle></MyBgPatternDecorativeCircle>
            <div className="z-30 absolute top-4">
              <Firework />
            </div>
          </div>
          <div className="z-30 p-6 flex flex-col items-center justify-center text-center">
            <div className="flex flex-col gap-1">
              <p className="text-lg-semibold text-gray-light/900">
                Selamat! kepada semua pemenang
              </p>
              {/* <p className="display-sm-semibold text-brand/600">{detail && detail?.identifier_code.split('').join(' ')}</p> */}
            </div>
          </div>
          <div className="z-30 w-full h-[143px] flex items-center justify-center">
            <div className="h-full w-full max-w-[261px]">
              {rafflePrize && rafflePrize.photo ? (
                <div className="w-full h-full">
                  <img
                    className="w-full h-full object-cover"
                    src={convertUrlImage(rafflePrize.photo)}
                    alt=""
                  />
                </div>
              ) : (
                <p className="text-sm-medium text-gray-light/700">
                  Foto Monyet
                </p>
              )}
            </div>
          </div>
          <div className="z-30">
            <ParticipantList participants={detail} />
          </div>
          <footer className="pt-8">
            <hr className="border-gray-light/200" />
            <div className="p-6 flex items-center gap-3">
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
             <br/>
             <br/>
             <br/>
             <br/>
             <br/>
             <br/>
             <br/>
             <br/>
             <br/>
             
              <MyButton
                disabled={!detail || !rafflePrize}
                expanded
                color={"secondary"}
                variant={"outlined"}
                size={"lg"}
                onClick={close}>
                <p className="text-sm-semibold">Tidak simpan</p>
              </MyButton>
              <MyButton
                disabled={!detail || !rafflePrize}
                expanded
                color={"success"}
                variant={"filled"}
                size={"lg"}
                onClick={() => setWinner("valid")}>
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
