import React, { useEffect, useState } from "react";
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



const Modal = ({ data = {}, done, close, counter }) => {
  const [setting, setSetting] = useState(null);
  const [detail, setDetail] = useState(null);
  const [lotteryCodeList, setLotteryCodeList] = useState([]);
  const [buttonLabel, setButtonLabel] = useState("Start");
  const [isLotteryRunning, setIsLotteryRunning] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [playDrumRoll, setPlayDrumRoll] = useState(false);
  const [playWinningSound, setPlayWinningSound] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [animationInterval, setAnimationInterval] = useState(null);
  const [canStop, setCanStop] = useState(false);

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
    try {
      const res = await Reguest.getMultipleWinner(counter);
      if (res.status === 200) {
        setDetail(res.data);
        return true;
      }
      return false;
    } catch (error) {
      myToaster(error);
      return false;
    } finally {
      setIsFetching(false);
    }
  };

  const startAnimation = () => {
    setPlayDrumRoll(true);
    const interval = setInterval(() => {
      const lotteryCode = [
        'A',
        ...Array.from({ length: 8 }, generateRandomNumber)
      ];
      
      setLotteryCodeList(lotteryCode);
    }, 100);
    setAnimationInterval(interval);
  };

  const stopAnimation = () => {
    if (animationInterval) {
      clearInterval(animationInterval);
      setAnimationInterval(null);
    }
    setPlayDrumRoll(false);
    setPlayWinningSound(true);
  };

  const startLottery = async () => {
    setHasStarted(true);
    setIsLotteryRunning(true);
    setButtonLabel("Stop");
    setCanStop(false);

    // Start the animation while waiting for API response
    startAnimation();

    // Get the winner
    const success = await getRandomWinner();
    if (!success) {
      stopAnimation();
      setIsLotteryRunning(false);
      setButtonLabel("Start");
      setHasStarted(false);
    } else {
      setCanStop(true); // Enable stop button only after successful response
    }
  };

  const stopLottery = () => {
    stopAnimation();
    setIsLotteryRunning(false);
    handleDone();
  };

  const handleKeyDown = (event) => {
    console.log("Key pressed:", event.code);
    console.log("Current state:", {
      isLotteryRunning,
      canStop,
      buttonLabel,
      isFetching,
    });
    if (event.code === "Space") {
      event.preventDefault(); // Prevent default space behavior (scrolling, etc.)
  
      if (buttonLabel === "Start" && !isLotteryRunning && !isFetching) {
        startLottery();
      } else if (buttonLabel === "Stop" && isLotteryRunning && canStop) {
        stopLottery();
      }
    }
  };

  useEffect(() => {
    setLotteryCodeList(Array.from({ length: 9 }, () => "-"));

    getSetting().then((data) => {
      setSetting(data);
    });

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      if (animationInterval) {
        clearInterval(animationInterval);
      }
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [animationInterval]);

  return (
    
    <div className="bg-white w-full max-h-[480px] min-h-[850px] relative rounded-xl shadow-shadows/shadow-xl overflow-hidden">
    <br/><br/><br/><br/><br/><br/><br/><br/><br/>
      <SimpleBar
        forceVisible="y"
        style={{ maxHeight: "480px" }}
        className="w-full">
        <div className="flex flex-col w-full">
          <div className="p-6 ">
            <div className="w-full h-[200px] rounded-lg overflow-hidden">
              <img className="w-full h-full object-cover" src={diceImage} />
            </div>
          </div>
          <div className="pb-6 flex items-center justify-center text-center">
            <p className="text-lg-semibold text-gray-light/900">
              {!hasStarted
                ? "Klik Start untuk memulai"
                : isLotteryRunning
                ? "Proses pengacakan sedang berjalan, mohon menunggu..."
                : "Pemenang telah dipilih!!"}
            </p>
          </div>
          <div className="flex justify-center flex-wrap gap-3 px-6">
            {lotteryCodeList.map((e, i) => (
              <div
                key={i}
                className="w-20 h-20 border-2 border-brand/600 p-2 rounded-[10px] flex items-center justify-center text-center">
                <p className="display-lg-medium text-brand/600">{e}</p>
              </div>
            ))}
          </div>
          <div className="pt-8 pb-6 px-6">
            <MyButton
              expanded
              color="primary"
              variant="filled"
              size="md"
              disabled={isLotteryRunning && !canStop}
              onClick={() => {
                if (isLotteryRunning && canStop) {
                  stopLottery();
                } else {
                  startLottery();
                }
              }}>
              <p className="text-sm-semibold">{buttonLabel}</p>
            </MyButton>
          </div>
        </div>
      </SimpleBar>

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
