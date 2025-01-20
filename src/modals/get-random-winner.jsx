/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import { XClose } from "untitledui-js";
import SimpleBar from "simplebar-react";
import Reguest from "../services/request";
import { myToaster } from "../components/Toaster/MyToaster";
import diceImage from "../assets/get-winner-dice.jpeg";
import ReactPlayer from "react-player";
import MyButton from "../components/Button/MyButton";

// const generateRandomAlphanumeric = () => {
//   const characters =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   const randomIndex = Math.floor(Math.random() * characters.length);
//   return characters[randomIndex].toUpperCase();
// };

const generateRandomNumber = () => {
  const numbers = "0123456789";
  const randomIndex = Math.floor(Math.random() * numbers.length);
  return numbers[randomIndex];
};

const Modal = ({ data = {}, done, close }) => {
  const [setting, setSetting] = useState(null);
  const [detail, setDetail] = useState(null);
  const [lotteryCodeList, setLotteryCodeList] = useState([]);
  const [buttonLabel, setButtonLabel] = useState("Start");
  const [isLotteryRunning, setIsLotteryRunning] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [playDrumRoll, setPlayDrumRoll] = useState(false);
  const [playWinningSound, setPlayWinningSound] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const handleDone = () => {
    close && close();
    done && done(detail);
  };

  const getSetting = async () => {
    return await Reguest.getSetting()
      .then((res) => res.data)
      .catch(myToaster);
  };

  const getRandomWinner = async () => {
    setIsFetching(true);
    return await Reguest.getRandomWinner()
      .then((res) => {
        if (res.status === 200) {
          setDetail(res.data);
        }
      })
      .catch(myToaster)
      .finally(() => {
        setIsFetching(false);
      });
  };

  const startLottery = () => {
    setIsLotteryRunning(true);
    setPlayDrumRoll(true);
    setButtonLabel("Stop");
    setHasStarted(true);
    getRandomWinner();
  };

  const stopLottery = () => {
    setIsLotteryRunning(false);
    setPlayWinningSound(true);
    setPlayDrumRoll(false);
    console.log(detail);

    handleDone();
    // setLotteryCodeList(detail.raffle_code.split(''));
    // if(setPlayWinningSound) {
    //     handleDone();
    // }
  };

  const handleKeyDown = (event) => {
    if (event.code === "Space" && !isFetching) {
      if (isLotteryRunning) {
        stopLottery();
      } else {
        startLottery();
      }
    }
  };

  useEffect(() => {
    // Initial state with 'A00' + 6 dashes
    setLotteryCodeList(['A', '0', '0', '-', '-', '-', '-', '-', '-']);
  
    getSetting().then((data) => {
      setSetting(data);
    });
  
    let intervalId = null;
    if (isLotteryRunning) {
      intervalId = setInterval(() => {
        setLotteryCodeList([
          'A',
         
          ...Array.from({ length: 8 }, generateRandomNumber)
        ]);
      }, 100);
    }
  
    window.addEventListener("keydown", handleKeyDown);
  
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLotteryRunning]);

  return (
    <div className="bg-white w-full max-h-[480px] relative rounded-xl shadow-shadows/shadow-xl overflow-hidden">
      <SimpleBar
        forceVisible="y"
        style={{ maxHeight: "480px" }}
        className="w-full">
        <div className="flex flex-col w-full">
          <div className="p-6 ">
            <div className="w-full h-[200px] rounded-lg overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={diceImage}
                alt=""
              />
            </div>
          </div>
          <div className="pb-6 flex items-center justify-center text-center">
            <p className="text-lg-semibold text-gray-light/900">
              {!hasStarted
                ? "Klik Start untuk memulai"
                : isLotteryRunning
                ? "Proses pengacakan sedang berjalan, mohon menunggu..."
                : "Pemenang telah dipilih!"}
            </p>
          </div>
          <div className="flex justify-center flex-wrap gap-3 px-6">
            {lotteryCodeList.map((e, i) => (
              <div
                key={i}
                className="w-20 h-20 border-2 border-brand/600 p-2 rounded-[10px] flex items-center justify-center text-center">
                <p className="display-lg-medium text-brand/600">
                  {hasStarted ? e : "-"}
                </p>
              </div>
            ))}
          </div>
          <div className="pt-8 pb-6 px-6">
            <MyButton
              expanded
              color={"primary"}
              variant={"filled"}
              size={"md"}
              disabled={isFetching}
              onClick={() => {
                if (isLotteryRunning) {
                  stopLottery();
                } else {
                  startLottery(); // Start the lottery if not running
                }
              }}>
              <p className="text-sm-semibold">{buttonLabel}</p>
            </MyButton>
          </div>
        </div>
      </SimpleBar>

      {/* ReactPlayer elements for sound effects */}
      <ReactPlayer
        url="/sounds/drum-roll.mp3"
        playing={playDrumRoll}
        loop
        volume={1}
        height={0}
        width={0}
      />
      <ReactPlayer
        url="/sounds/winning.mp3"
        playing={playWinningSound}
        volume={1}
        height={0}
        width={0}
      />
    </div>
  );
};

export default Modal;
