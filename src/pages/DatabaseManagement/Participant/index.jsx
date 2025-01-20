import { useEffect, useState } from "react";
import {
  Plus,
  RefreshCCW01,
  SearchLG,
  Share01,
  UploadCloud01,
} from "untitledui-js";
import { debounce } from "lodash";
import { useApp } from "../../../contexts/AppContext";
import Reguest from "../../../services/request";
import { myToaster } from "../../../components/Toaster/MyToaster";
import MyDataTable from "../../../components/Table/MyDataTable";
import MyColumn from "../../../components/Table/MyColumn";
import MyTextField from "../../../components/TextField/MyTextField";
import MyModalSlider from "../../../components/ModalSlider/MyModalSlider";
import { default as SImportParticipant } from "../../../sliders/import-participant";
import { default as MResetParticipant } from "../../../modals/reset-participant";
import MyButton from "../../../components/Button/MyButton";
import MyModal from "../../../components/Modal/MyModal";

const Page = () => {
  const {
    modal,
    handleOpenModal,
    handleCloseModal,
    slider,
    handleOpenSlider,
    handleCloseSlider,
  } = useApp();
  const [params, setParams] = useState({ page: 1 });
  const [details, setDetails] = useState({ data: [], meta: [] });

  const getParticipant = async () => {
    await Reguest.getParticipant(params)
      .then((res) => setDetails({ data: res.data, meta: res.meta }))
      .catch(myToaster);
  };
  const search = (e) => {
    setParams((value) => {
      return { ...value, search: e?.target?.value };
    });
  };
  const debounceSearch = debounce(search, 1000);

  const downloadExportParticipant = async () => {
    const url = Reguest.downloadExportParticipant(params);
    window.open(url, "_blank").focus();
  };

  useEffect(() => {
    getParticipant();
    return () => {};
  }, [params]);

  return (
    <>
      <MyModalSlider
        open={slider.current === "import-participant"}
        onClose={handleCloseSlider}
        element={
          <SImportParticipant done={getParticipant} close={handleCloseSlider} />
        }
      />
      <MyModal
        maxWidth={400}
        open={modal.current === "reset-participant"}
        onClose={handleCloseModal}
      >
        <MResetParticipant done={getParticipant} close={handleCloseModal} />
      </MyModal>

      <main className="flex flex-col gap-8">
        <div className="px-8 w-full">
          <div className="w-full rounded-xl shadow-shadows/shadow-xs border border-gray-light/200">
            <div className="flex flex-col gap-5">
              <div className="pt-5 px-6 flex-1 flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-lg-semibold text-gray-light/900">
                    Data peserta undian
                  </p>
                  <p className="text-sm-regular text-gray-light/600">
                    Kumpulan data peserta undian.
                  </p>
                </div>
                <div className="flex items-center gap-x-3">
                  <MyButton
                    color={"secondary"}
                    variant={"outlined"}
                    size={"md"}
                    disabled={!details?.meta || details?.meta?.total === 0}
                    onClick={downloadExportParticipant}
                  >
                    <Share01 size={20} stroke={"currentColor"} />
                    <p className="text-sm-semibold">Export</p>
                  </MyButton>
                  <MyButton
                    color={"primary"}
                    variant={"filled"}
                    size={"md"}
                    onClick={() =>
                      handleOpenSlider({ current: "import-participant" })
                    }
                  >
                    <UploadCloud01 size={20} stroke={"currentColor"} />
                    <p className="text-sm-semibold">Import Daftar Peserta</p>
                  </MyButton>
                </div>
              </div>
              <hr className="border-gray-light/200" />
            </div>
            <div className="p-5 flex items-center justify-between flex-wrap gap-3 border-b border-gray-light/200">
              <div className="flex flex-col gap-2">
                <p className="text-sm-medium text-gray-light/700">
                  Cari peserta
                </p>
                <div className="w-full max-w-[332px] min-w-[200px]">
                  <MyTextField
                    placeholder={"Informasi peserta"}
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
              <MyButton
                color={"primary"}
                variant={"filled"}
                size={"md"}
                disabled={!details?.meta || details?.meta?.total === 0}
                onClick={() => handleOpenModal({ current: "reset-participant" })}
              >
                <RefreshCCW01 size={20} stroke={"currentColor"} />
                <p className="text-sm-semibold">Reset</p>
              </MyButton>
            </div>
            <div>
              <MyDataTable
                values={{ data: details.data.participants, meta: details.meta }}
                paginator
                onChangePagination={(page) => {
                  setParams((value) => ({ ...value, page: page }));
                }}
              >
                {/* <MyColumn
                  field={"raffle_code"}
                  header={"No. Undian"}
                  body={(value) => (
                    <p className="text-gray-light/900 text-sm-medium">
                      {value.raffle_code}
                    </p>
                  )}
                ></MyColumn> */}
                <MyColumn
                  field={"identifier_code"}
                  header={"Kode unik undian"}
                  body={(value) => (
                    <p className="text-gray-light/900 text-sm-medium">
                      {value.identifier_code}
                    </p>
                  )}
                ></MyColumn>
                {(details.data?.field_names ?? []).map((e, i) => {
                  return (
                    <MyColumn
                      header={e.name}
                      key={i}
                      body={(value) => {
                        const item = (
                          value?.participant_field_values ?? []
                        ).find((ePf) => ePf.participant_field_name_id === e.id);
                        return (
                          <p className="text-gray-light/900 text-sm-regular truncate">
                            {item?.value ?? ""}
                          </p>
                        );
                      }}
                    ></MyColumn>
                  );
                })}
              </MyDataTable>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;
