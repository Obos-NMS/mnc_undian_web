import React, { useEffect, useState } from "react";
import { XClose } from "untitledui-js";
import SimpleBar from "simplebar-react";
import Reguest from "../services/request";
import { myToaster } from "../components/Toaster/MyToaster";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { rafflePrize as rafflePrizeSchema } from "../yup/schema";
import MyButton from "../components/Button/MyButton";
import MyTextField from "../components/TextField/MyTextField";
import MyDropzone from "../components/Dropzone/MyDropzone";
import FormData from "form-data";

const Slider = ({ data = {}, done, close }) => {
  const {
    setValue,
    handleSubmit,
    register,
    control,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(rafflePrizeSchema) });

  const { photo } = watch();
  const [progressUpload, setProgressUpload] = useState(null);

  const handleDone = (value) => {
    done && done(value?.data);
    close && close();
    return value;
  };

  const showRafflePrize = async (id) => {
    return await Reguest.showRafflePrize(id)
      .then((res) => res.data)
      .catch(myToaster);
  };

  const createRafflePrize = async (body) => {
    try {
      const formData = new FormData();
      formData.append("name", body.name);
      if (body.photo instanceof File) {
        formData.append("photo", body.photo);
      }

      await Reguest.createRafflePrize(formData, {
        onUploadProgress: (progressEvent) => {
          setProgressUpload(progressEvent);
        },
      })
        .then(myToaster)
        .then(handleDone);
    } catch (error) {
      myToaster(error);
    }
  };

  const updateRafflePrize = async (body) => {
    const formData = new FormData();
    formData.append("name", body.name);
    formData.append("photo", body.photo);

    await Reguest.updateRafflePrize(data?.id, formData, {
      onUploadProgress: (progressEvent) => {
        setProgressUpload(progressEvent);
      },
    })
      .then(myToaster)
      .then(handleDone)
      .catch(myToaster);
  };

  const submit = data.id ? updateRafflePrize : createRafflePrize;
  useEffect(() => {
    if (data.id) {
      showRafflePrize(data.id).then((data) => {
        setValue("name", data.name);
        setValue("photo", data.photo);
      });
    }
  }, []);

  return (
    <div className="w-[400px] h-screen flex flex-col gap-8">
      <header className="px-6 flex items-start gap-x-4 relative">
        <button
          onClick={close}
          className=" absolute top-[12px] right-[12px] w-11 h-11 flex items-center justify-center text-gray-light/400 rounded-lg p-2">
          <XClose size={24} stroke={"currentColor"} />
        </button>
        <section className="flex flex-col gap-1 w-full pt-6">
          <p className="text-xl-semibold text-gray-light/900">
            {data.id ? "Edit hadiah" : "Tambah hadiah"}
          </p>
          <p className="text-sm-regular">Tambah data hadiah</p>
        </section>
        <hr className="border-gray-light/200 w-100%" />
      </header>
      <div className="flex-1 overflow-hidden">
        <SimpleBar forceVisible="y" style={{ height: "100%" }}>
          <form
            className="h-full flex flex-col gap-8"
            onSubmit={handleSubmit(submit)}>
            <div className="flex flex-1 flex-col gap-6 px-6">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="name"
                  className="text-sm-medium text-gray-light/700">
                  Nama hadiah
                </label>
                <MyTextField
                  name={"name"}
                  control={control}
                  errors={errors}
                  placeholder={"Masukkan nama hadiah"}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="photo"
                  className="text-sm-medium text-gray-light/700">
                  Foto hadiah
                </label>
                <div>
                  <MyDropzone
                    multiple={false}
                    maxSize={157286400}
                    accept={[".png", ".jpeg", ".jpg"]}
                    progressUpload={progressUpload}
                    onDropAccepted={async (acceptedFiles, handleDeleteFile) => {
                      setValue("photo", acceptedFiles[0]);
                    }}></MyDropzone>
                </div>
              </div>
            </div>
            <footer className="border-t border-gray-light/200 px-4 py-4 flex items-center justify-end gap-4">
              <MyButton
                type="reset"
                color={"secondary"}
                variant={"outlined"}
                size={"md"}
                onClick={close}>
                <p className="text-sm-semibold">Cancel</p>
              </MyButton>
              <MyButton
                type="submit"
                color={"primary"}
                variant={"filled"}
                size={"md"}>
                <p className="text-sm-semibold">Submit</p>
              </MyButton>
            </footer>
          </form>
        </SimpleBar>
      </div>
    </div>
  );
};

export default Slider;
