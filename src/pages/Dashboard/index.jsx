import SimpleBar from "simplebar-react";

// component
import MyButton from "../../components/Button/MyButton";
import {
  Dice03,
  Edit04,
  Lock01,
  RefreshCCW01,
  SearchLG,
  Share01,
  Trash01,
} from "untitledui-js";
import MyAutocomplete from "../../components/Autocomplete/MyAutocomplete";
import { useEffect, useState } from "react";
import Reguest from "../../services/request";
import { debounce } from "lodash";
import { MncBank } from "../../components/Icon/Brand";
import MyTextField from "../../components/TextField/MyTextField";
import MyDataTable from "../../components/Table/MyDataTable";
import { myToaster } from "../../components/Toaster/MyToaster";
import MyColumn from "../../components/Table/MyColumn";
import MyAsyncDropDown from "../../components/Autocomplete/MyAsyncDropdown";
import MyChip from "../../components/Chip/MyChip";
import moment from "moment";
import { useApp } from "../../contexts/AppContext";
import MyModal from "../../components/Modal/MyModal";
import { default as MGetRandomWinner } from "../../modals/get-random-winner";
import { default as MGetMultipleWinner } from "../../modals/get-multiple-winner";
import { default as MDetailWinner } from "../../modals/detail-winner";
import { default as MDetailMultipleWinner } from "../../modals/detail-multiple-winner";
import { default as MResetWinner } from "../../modals/reset-winner";
import { default as PChangeStatusWinner } from "../../poppers/change-status-winner";
import { default as PDeleteWinner } from "../../poppers/delete-winner";
import { convertUrlImage } from "../../services/helper";
import mncBankLogo from "../../assets/mnc-bank-logo.png";
import MyTextArea from "../../components/TextField/MyTextArea";
import MyCounter from "../../components/TextField/MyCounter";

export default function Page() {
  const { modal, handleOpenModal, handleCloseModal, handleOpenWinnerModal } =
    useApp();

  const [counterValue, setCounterValue] = useState(0);

  const [detailWinner, setDetailWinner] = useState({ data: null });

  const [params, setParams] = useState({ page: 1 });
  const [setting, setSetting] = useState(null);
  const [winners, setWinners] = useState({ data: [], meta: [] });

  const [selectedRafflePrize, setSelectedRafflePrize] = useState(null);

  const searchRafflePrizeList = async (text) => {
    return await Reguest.searchRafflePrizeList(text).catch(myToaster);
  };

  const getSetting = async () => {
    return await Reguest.getSetting()
      .then((res) => setSetting(res.data))
      .catch(myToaster);
  };

  const getWinner = async () => {
    var query = {
      page: params.page,
      search: params.search,
      raffle_prize_id: params.raffle_prize?.value,
      status: params.status?.value,
    };
    await Reguest.getWinner(query)
      .then((res) => setWinners({ data: res.data, meta: res.meta }))
      .catch(myToaster);
  };

  const getMultipleWinner = async () => {
    return await Reguest.getMultipleWinner(counterValue).catch(myToaster);
  };

  const search = (e) => {
    setParams((value) => {
      return { ...value, search: e?.target?.value };
    });
  };
  const debounceSearch = debounce(search, 1000);

  const handleDoneGetWinner = (value) => {
    setDetailWinner(value);
    if (value) {
      handleOpenModal({ current: "detail-winner" });
    }
  };

  const handleDoneGetMultiple = (value) => {
    setDetailWinner(value);
    if (value) {
      handleOpenModal({ current: "detail-multiple-winner" });
    }
  };

  const downloadExportWinner = async () => {
    var query = {
      search: params.search,
      raffle_prize_id: params.raffle_prize?.value,
      status: params.status?.value,
    };
    const url = Reguest.downloadExportWinner(query);
    window.open(url, "_blank").focus();
  };

  useEffect(() => {
    getWinner();
    getSetting();
    return () => {};
  }, [params]);

  return (
    <>
      <MyModal
        maxWidth={864}
        open={modal.current === "get-random-winner"}
        onClose={handleCloseModal}>
        <MGetRandomWinner done={handleDoneGetWinner} close={handleCloseModal} />
      </MyModal>
      <MyModal
        maxWidth={864}
        open={modal.current === "get-multiple-winner"}
        onClose={handleCloseModal}>
        <MGetMultipleWinner
          done={handleDoneGetMultiple}
          close={handleCloseModal}
          counter={modal.counter}
        />
      </MyModal>
      <MyModal
        maxWidth={400}
        open={modal.current === "detail-winner"}
        onClose={handleCloseModal}>
        <MDetailWinner
          detail={detailWinner}
          rafflePrize={selectedRafflePrize}
          done={getWinner}
          close={handleCloseModal}
        />
      </MyModal>
      <MyModal
        maxWidth={864}
        open={modal.current === "detail-multiple-winner"}
        onClose={handleCloseModal}>
        <MDetailMultipleWinner
          detail={detailWinner}
          rafflePrize={selectedRafflePrize}
          done={getWinner}
          close={handleCloseModal}
        />
      </MyModal>
      <MyModal
        maxWidth={400}
        open={modal.current === "reset-winner"}
        onClose={handleCloseModal}>
        <MResetWinner done={getWinner} close={handleCloseModal} />
      </MyModal>

      <SimpleBar
        forceVisible="y"
        className="flex-1"
        style={{ height: "100vh" }}>
        <main className="flex flex-col gap-8 bg-gray-light/50">
          <div className=" flex flex-col gap-8 pt-24 sm:pt-8 pb-12">
            <div className="px-8 flex items-start justify-between">
              <p className="display-xs-semibold text-gray-light/900">
                {setting?.title ?? "Pengundian Tabungan Dahsyat Undian"}
              </p>
              <MyButton
                color={"primary"}
                variant={"filled"}
                size={"md"}
                disabled={!winners?.meta || winners?.meta?.total === 0}
                onClick={() => handleOpenModal({ current: "reset-winner" })}>
                <RefreshCCW01 size={20} stroke={"currentColor"} />
                <p className="text-sm-semibold">Reset</p>
              </MyButton>
            </div>
            <div className="px-8 flex flex-col gap-6">
              <div className="flex gap-6">
                <div className="flex-1 bg-white border border-gray-light/200 rounded-xl p-6 flex flex-col gap-6">
                  <div className="flex flex-col gap-y-1.5">
                    {/* <p className="text-sm-semibold text-gray-light/900">
                      Jumlah Pemenang Diundi                    </p> */}
                    <div className="flex">
                      {/* <MyButton type="submit" color={"primary"} variant={"outlined"} size={"sm"}>
                                    <p className="text-sm-semibold">-</p>
                                </MyButton> */}

                      {/* <MyTextArea
                        max={8}
                        name={"title"}
                        rows={1}
                        // control={control}
                        // errors={errors}
                        placeholder={"0"}
                      /> */}
                      {/* <MyTextField
                                    type={"text"}
                                    name="reset_data_password"
                                    placeholder={"0"}
                                    // control={control}
                                    // errors={errors}
                                    // endAdornment={<span className="p-1 cursor-pointer" onClick={() => setIsShowPass(!isShowPass)}>
                                    //     {isShowPass ? <Eye size={20} stroke={"currentColor"} /> :
                                    //         <EyeOff size={20} stroke={"currentColor"} />}
                                    // </span>}
                                /> */}
                      <MyCounter
                        value={1}
                        min={1}
                        max={1000}
                        step={1}
                        onChange={(newValue) => setCounterValue(newValue)}
                      />

                      {/* <MyButton type="submit" color={"primary"} variant={"outlined"} size={"sm"}>
                                    <p className="text-sm-semibold">+</p>
                                </MyButton> */}
                    </div>

                    <label
                      htmlFor="lottery-prize"
                      className="text-sm-medium text-gray-light/700">
                      Hadiah
                    </label>
                    <MyAsyncDropDown
                      asyncFunction={searchRafflePrizeList}
                      placeholder={"Pilih hadiah"}
                      getOptionLabel={(e) => e?.label}
                      isOptionEqualToValue={(option, value) =>
                        option.value === value.value
                      }
                      value={selectedRafflePrize}
                      onChange={(e, value) => {
                        setSelectedRafflePrize(value);
                      }}
                    />
                  </div>
                  <div className="w-full h-[214.22px] flex items-center justify-center text-center">
                    {selectedRafflePrize && selectedRafflePrize.photo ? (
                      <div className="w-full h-full">
                        <img
                          className="w-full h-full object-cover"
                          src={convertUrlImage(selectedRafflePrize.photo)}
                          alt=""
                        />
                      </div>
                    ) : (
                      <p className="text-sm-medium text-gray-light/700">
                        Foto tidak ditemukan
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex-1 bg-white border border-gray-light/200 rounded-xl p-6 flex flex-col justify-between">
                  <div className="pt-6 px-6 w-full h-full flex items-center justify-center text-center">
                    <div className="w-w-full h-full">
                      <img
                        className="w-full h-full object-contain"
                        src={mncBankLogo}
                        alt=""
                      />
                      {/* {setting?.company_logo && <img className="w-full h-full object-contain" src={setting.company_logo} alt="" />} */}
                      {/* <MncBank /> */}
                    </div>
                  </div>
                  {/* <div className="pt-6 px-6 w-full h-full flex items-center justify-center text-center">
                    <div className="flex flex-col gap-1">
                                            <p className="text-lg-semibold text-gray-light/900">{setting?.headline_text}</p>
                                            <p className="text-sm-regular text-gray-light/600">{setting?.headline_supporting_text}</p>
                                        </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-lg-semibold text-gray-light/900">
                        Dahsyat Undian MNC Bank
                      </p>
                      <p className="text-sm-regular text-gray-light/600">Terima kasih atas kepercayaan dan dukungan Anda kepada MNC Bank. Semoga keberuntungan selalu menyertai Anda!</p>
                    </div>
                  </div> */}
                  <div className="pt-8 pb-6 px-6">
                    <MyButton
                      expanded
                      disabled={!selectedRafflePrize}
                      color={"primary"}
                      variant={"filled"}
                      size={"md"}
                      onClick={() => {
                        if (counterValue > 1) {
                          handleOpenWinnerModal(
                            { current: "get-multiple-winner" },
                            counterValue
                          );
                        } else {
                          handleOpenModal({ current: "get-random-winner" });
                        }
                      }}>
                      <Dice03 size={20} stroke={"currentColor"} />
                      <p className="text-sm-semibold">Mulai Undian</p>
                    </MyButton>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-8">
              <div className="bg-white border border-gray-light/200 rounded-xl flex flex-col justify-between">
                <div className="w-full flex flex-col gap-5">
                  <div className="pt-5 px-6 flex items-center justify-between">
                    <p className="text-lg-semibold text-gray-light/900">
                      Riwayat Pemenang
                    </p>
                    <MyButton
                      color={"secondary"}
                      variant={"outlined"}
                      size={"md"}
                      disabled={!winners?.meta || winners?.meta?.total === 0}
                      onClick={downloadExportWinner}>
                      <Share01 size={20} stroke={"currentColor"} />
                      <p className="text-sm-semibold">Export</p>
                    </MyButton>
                  </div>
                  <hr className="border-gray-light/200" />
                </div>
                <div className="p-5 flex items-center gap-3">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm-medium text-gray-light/700">
                      Cari pemenang
                    </p>
                    <div className="w-full max-w-[332px] min-w-[200px]">
                      <MyTextField
                        placeholder={"Informasi pemenang"}
                        onChangeForm={debounceSearch}
                        startAdornment={
                          <SearchLG
                            size={20}
                            className={"text-gray-light/500"}
                            stroke={"currentColor"}
                          />
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-1.5 min-w-[192px]">
                    <label
                      htmlFor="raffle-prize"
                      className="text-sm-medium text-gray-light/700">
                      Hadiah
                    </label>
                    <MyAsyncDropDown
                      asyncFunction={searchRafflePrizeList}
                      placeholder={"Pilih hadiah"}
                      getOptionLabel={(e) => e?.label}
                      isOptionEqualToValue={(option, value) =>
                        option.value === value.value
                      }
                      value={params.raffle_prize}
                      onChange={(e, value) => {
                        setParams((oldValue) => {
                          return { ...oldValue, raffle_prize: value };
                        });
                      }}
                    />
                  </div>
                  {/* <div className="flex flex-col gap-y-1.5 min-w-[192px]">
                    <label
                      htmlFor="status"
                      className="text-sm-medium text-gray-light/700"
                    >
                      Status
                    </label>
                    <MyAutocomplete
                      options={[
                        { label: "Simpan", value: "valid" },
                        { label: "Tidak simpan", value: "invalid" },
                      ]}
                      placeholder={"Pilih status"}
                      onChange={(e, value) => {
                        setParams((oldValue) => {
                          return { ...oldValue, status: value };
                        });
                      }}
                      value={params.status}
                      getOptionLabel={(e) => e.label}
                      isOptionEqualToValue={(option, value) =>
                        option.value === value.value
                      }
                    />
                  </div> */}
                </div>
                <div>
                  <MyDataTable
                    values={{
                      data: winners.data.participants,
                      meta: winners.meta,
                    }}
                    paginator
                    onChangePagination={(page) => {
                      console.log(page);
                      setParams((value) => ({ ...value, page: page }));
                    }}>
                    <MyColumn
                      field={"identifier_code"}
                      header={"Kode unik undian"}
                      body={(value) => (
                        <p className="text-gray-light/900 text-sm-medium">
                          {value?.participant?.identifier_code}
                        </p>
                      )}></MyColumn>
                    {(winners.data?.display_fields ?? []).map((e, i) => {
                      return (
                        <MyColumn
                          header={e.participant_field_name?.name}
                          key={i}
                          body={(value) => {
                            const item = (
                              value?.participant?.participant_field_values ?? []
                            ).find(
                              (ePf) =>
                                ePf.participant_field_name.id ===
                                e.participant_field_name.id
                            );
                            return (
                              <p className="text-gray-light/900 text-sm-regular truncate">
                                {item?.value ?? ""}
                              </p>
                            );
                          }}></MyColumn>
                      );
                    })}
                    <MyColumn
                      field={"raffle_prize.name"}
                      header={"Hadiah"}
                      body={(value) => (
                        <p className="text-gray-light/900 text-sm-medium">
                          {value.raffle_prize.name}
                        </p>
                      )}></MyColumn>
                    <MyColumn
                      field={"created_at"}
                      header={"Tanggal pengundian"}
                      body={(value) => (
                        <p className="text-gray-light/700 text-sm-regular font-italic">
                          {value.created_at &&
                            moment(value.created_at).format(
                              "DD MMM YYYY, HH:mm"
                            )}
                        </p>
                      )}></MyColumn>
                    <MyColumn
                      alignment={"right"}
                      width={"1%"}
                      body={(value) => (
                        <div className="flex items-center justify-center gap-3">
                          <PDeleteWinner
                            done={getWinner}
                            data={{ id: value.id }}
                            target={(open, handleClick) => (
                              <button
                                onClick={handleClick}
                                className="flex items-center p-2.5">
                                <Trash01
                                  size={20}
                                  className={"text-error/700"}
                                  stroke={"currentColor"}
                                />
                              </button>
                            )}
                          />
                        </div>
                      )}></MyColumn>
                  </MyDataTable>
                </div>
                {(!winners?.meta || winners?.meta?.total === 0) && (
                  <div className="w-full h-[180px] flex items-center justify-center text-center">
                    <p className="text-sm-medium text-gray-light/700">
                      Data tidak ditemukan
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </SimpleBar>
    </>
  );
}
