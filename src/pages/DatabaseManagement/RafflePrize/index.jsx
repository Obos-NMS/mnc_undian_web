import { useEffect, useState } from "react";
import { Plus, SearchLG, Share01 } from "untitledui-js";
import { debounce } from "lodash";
import { useApp } from "../../../contexts/AppContext";
import Reguest from "../../../services/request";
import { myToaster } from "../../../components/Toaster/MyToaster";
import MyDataTable from "../../../components/Table/MyDataTable";
import MyColumn from "../../../components/Table/MyColumn";
import MyTextField from "../../../components/TextField/MyTextField";
import MyModalSlider from "../../../components/ModalSlider/MyModalSlider";
import { default as SRafflePrize } from "../../../sliders/raffle-prize";
import { default as MShowPhoto } from "../../../modals/show-photo";
import MyButton from "../../../components/Button/MyButton";
import MyModal from "../../../components/Modal/MyModal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { rafflePrizePhoto as rafflePrizePhotoSchema } from "../../../yup/schema";
import { convertUrlImage } from "../../../services/helper";

const Page = () => {
  const {
    slider,
    handleOpenSlider,
    handleCloseSlider,
    modal,
    handleOpenModal,
    handleCloseModal,
  } = useApp();
  const {
    setValue,
    handleSubmit,
    register,
    control,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(rafflePrizePhotoSchema) });

  const { raffle_prize_id } = watch();

  const [params, setParams] = useState({ page: 1 });
  const [rafflePrizes, setRafflePrizes] = useState({ data: [], meta: [] });

  const getRafflePrize = async () => {
    await Reguest.getRafflePrize(params)
      .then((res) => setRafflePrizes({ data: res.data, meta: res.meta }))
      .catch(myToaster);
  };

  const search = (e) => {
    setParams((value) => {
      return { ...value, search: e?.target?.value };
    });
  };
  const debounceSearch = debounce(search, 1000);

  const deleteRafflePrize = async (id) => {
    if (window.confirm("Anda yakin ingin menghapus data ini?"))
      return await Reguest.deleteRafflePrize(id)
        .then(myToaster)
        .then(getRafflePrize)
        .catch(myToaster);
  };

  const downloadExportRafflePrize = async () => {
    const url = Reguest.downloadExportRafflePrize(params);
    window.open(url, "_blank").focus();
  };

  const handleUploadFile = (e) => {
    if (e.target.files.length) {
      const file = e.target.files[0];
      console.log("file", file);
      setValue("photo", file);
      handleSubmit(submit)();
    }
  };

  const updateRafflePrizePhoto = async (body) => {
    const formData = new FormData();
    formData.append("photo", body.photo);

    console.log(body);

    await Reguest.updateRafflePrizePhoto(raffle_prize_id, formData)
      .then(myToaster)
      .then(getRafflePrize)
      .catch(myToaster);
  };

  const submit = updateRafflePrizePhoto;

  useEffect(() => {
    getRafflePrize();
    return () => {};
  }, [params]);

  return (
    <>
      <MyModalSlider
        open={slider.current === "create-raffle-prize"}
        onClose={handleCloseSlider}
        element={
          <SRafflePrize done={getRafflePrize} close={handleCloseSlider} />
        }
      />
      <MyModalSlider
        open={slider.current === "edit-raffle-prize"}
        onClose={handleCloseSlider}
        element={
          <SRafflePrize
            done={getRafflePrize}
            close={handleCloseSlider}
            data={{ id: slider.id }}
          />
        }
      />

      <MyModal
        maxWidth={400}
        open={modal.current === "show-photo"}
        onClose={handleCloseModal}>
        <MShowPhoto
          done={getRafflePrize}
          close={handleCloseModal}
          data={{ photo: modal.photo }}
        />
      </MyModal>

      <main className="flex flex-col gap-8">
        <div className="px-8 w-full">
          <div className="w-full rounded-xl shadow-shadows/shadow-xs border border-gray-light/200">
            <div className="flex flex-col gap-5">
              <div className="pt-5 px-6 flex-1 flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-lg-semibold text-gray-light/900">
                    Data hadiah undian
                  </p>
                  <p className="text-sm-regular text-gray-light/600">
                    Kumpulan hadiah undian.
                  </p>
                </div>
                <div className="flex items-center gap-x-3">
                  <MyButton
                    color={"secondary"}
                    variant={"outlined"}
                    size={"md"}
                    disabled={
                      !rafflePrizes?.meta || rafflePrizes?.meta?.total === 0
                    }
                    onClick={downloadExportRafflePrize}>
                    <Share01 size={20} stroke={"currentColor"} />
                    <p className="text-sm-semibold">Export</p>
                  </MyButton>
                  <MyButton
                    color={"primary"}
                    variant={"filled"}
                    size={"md"}
                    onClick={() =>
                      handleOpenSlider({ current: "create-raffle-prize" })
                    }>
                    <Plus size={20} stroke={"currentColor"} />
                    <p className="text-sm-semibold">Tambah hadiah</p>
                  </MyButton>
                </div>
              </div>
              <hr className="border-gray-light/200" />
            </div>
            <div className="p-5 flex items-center flex-wrap gap-3 border-b border-gray-light/200">
              <div className="w-full flex flex-col gap-2">
                <p className="text-sm-medium text-gray-light/700">
                  Cari hadiah
                </p>
                <div className="w-full max-w-[332px] min-w-[200px]">
                  <MyTextField
                    placeholder={"Informasi hadiah"}
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
            </div>
            <div>
              <MyDataTable
                values={rafflePrizes}
                paginator
                onChangePagination={(page) => {
                  setParams((value) => ({ ...value, page: page }));
                }}>
                <MyColumn
                  field={"name"}
                  header={"Nama hadiah"}
                  body={(value) => (
                    <p className="text-gray-light/900 text-sm-medium">
                      {value.name}
                    </p>
                  )}></MyColumn>
                <MyColumn
                  alignment={"right"}
                  width={"1%"}
                  body={(value) => (
                    <div className="flex items-center justify-center gap-3">
                      {value?.photo ? (
                        <MyButton
                          color={"primary"}
                          variant={"text"}
                          onClick={() =>
                            handleOpenModal({
                              current: "show-photo",
                              photo: convertUrlImage(value.photo),
                            })
                          }>
                          <p className="text-sm-semibold">Lihat photo</p>
                        </MyButton>
                      ) : (
                        <form>
                          <label htmlFor="file-upload" className="">
                            <div className="text-brand/700 hover:text-brand/800 focus:outline-none">
                              <p className="text-sm-semibold truncate">
                                Upload photo
                              </p>
                            </div>
                          </label>
                          <input
                            accept="image/*"
                            id="file-upload"
                            {...register("photo")}
                            type="file"
                            style={{ display: "none" }}
                            onChange={handleUploadFile}
                            onClick={() =>
                              setValue("raffle_prize_id", value.id)
                            }
                          />
                        </form>
                      )}
                      <MyButton
                        color={"secondary"}
                        variant={"text"}
                        onClick={() => deleteRafflePrize(value.id)}>
                        <p className="text-sm-semibold">Delete</p>
                      </MyButton>
                    </div>
                  )}></MyColumn>
              </MyDataTable>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Page;
