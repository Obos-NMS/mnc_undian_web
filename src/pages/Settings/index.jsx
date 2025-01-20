import { useEffect, useState } from "react";
import { Eye, EyeOff, HelpCircle, UploadCloud02 } from "untitledui-js";
import Reguest from "../../services/request";
import { myToaster } from "../../components/Toaster/MyToaster";
import SimpleBar from "simplebar-react";
import MyTextArea from "../../components/TextField/MyTextArea";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { setting as settingSchema } from "../../yup/schema";
import MyAutocomplete from "../../components/Autocomplete/MyAutocomplete";
import { debounce } from "lodash";
import MySwicth from "../../components/Switch/MySwitch";
import MyTextField from "../../components/TextField/MyTextField";
import MyButton from "../../components/Button/MyButton";
import FormData from "form-data";

const Page = () => {
  const {
    setValue,
    handleSubmit,
    setError,
    clearErrors,
    register,
    control,
    trigger,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(settingSchema) });
  const {
    title,
    shuffle_duration,
    reset_data_password,
    company_logo,
    participant_display_fields,
  } = watch();

  const [urlFileCompanyLogo, setUrlFileCompanyLogo] = useState(null);
  const [isShowPass, setIsShowPass] = useState(false);
  const [durationList, setDurationList] = useState({
    data: Array.from({ length: 15 }, (_, index) => ({
      label: `${index + 1} detik`,
      value: index + 1,
    })),
  });

  const [participantFieldList, setParticipantFieldList] = useState({
    data: [],
  });

  const handleFileChange = (file) => {
    try {
      const blob = new Blob([file], { type: file.type });
      const objectURL = URL.createObjectURL(blob);

      return objectURL;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const uploadFileCompanyLogo = (event) => {
    const file = event.target.files[0];
    const maxSize = 200 * 1024 * 1024; // 200MB in bytes

    if (file) {
      if (file.size > maxSize) {
        setError("company_logo", {
          type: "manual",
          message: "File size exceeds 200MB",
        });
        setValue("company_logo", null);
      } else {
        clearErrors("company_logo");
        setValue("company_logo", file);
      }
    } else {
      setValue("company_logo", null);
      clearErrors("company_logo");
    }
  };
  const searchParticipantFieldNameList = async (text) => {
    await Reguest.searchParticipantFieldNameList(text)
      .then((res) => {
        setParticipantFieldList({ data: res.data });
      })
      .catch((value) => {});
  };

  const getSetting = async () => {
    return await Reguest.getSetting()
      .then((res) => {
        const data = res.data;
        setValue("title", data.title);
        setValue("is_repeat_win_allowed", data.is_repeat_win_allowed || false);
        setValue("reset_data_password", data.reset_data_password);
        setValue("headline_text", data.headline_text);
        setValue("headline_supporting_text", data.headline_supporting_text);
        setValue(
          "shuffle_duration",
          data.shuffle_duration
            ? {
                label: `${data.shuffle_duration} detik`,
                value: data.shuffle_duration,
              }
            : null
        );
        setValue("participant_display_fields", [
          { label: "No undian", value: "No undian", disabled: true },
          { label: "Kode unik undian", value: "Kode unik undian", disabled: true },
          ...(data.participant_display_fields?.map((e) => ({
            label: e.participant_field_name?.name,
            value: e.participant_field_name?.id,
          })) || []),
        ]);
        setValue("company_logo", null);

        setUrlFileCompanyLogo(data.company_logo);
      })
      .catch(myToaster);
  };

  const updateSetting = async (body) => {
    const formData = new FormData();
    formData.append("title", body.title);
    formData.append(
      "is_repeat_win_allowed",
      body.is_repeat_win_allowed || false
    );
    formData.append("reset_data_password", body.reset_data_password || "");
    formData.append("company_logo", body.company_logo);
    formData.append("headline_text", body.headline_text || "");
    formData.append(
      "headline_supporting_text",
      body.headline_supporting_text || ""
    );
    formData.append("shuffle_duration", body.shuffle_duration?.value);
    if (Array.isArray(body.participant_display_fields)) {
      const filteredFields = body.participant_display_fields
        .filter((e) => !e?.disabled)
        .map((e, i) => ({ participant_field_name_id: e.value, index: i }));

      formData.append(
        "participant_display_fields",
        JSON.stringify(filteredFields)
      );
    } else {
      formData.append("participant_display_fields", JSON.stringify([]));
    }

    await Reguest.updateSetting(formData)
      .then(myToaster)
      .then(getSetting)
      .catch(myToaster);
  };

  const submit = updateSetting;

  useEffect(() => {
    getSetting();
    return () => {};
  }, []);

  useEffect(() => {
    if (company_logo) {
      const blob = handleFileChange(company_logo);
      if (blob) setUrlFileCompanyLogo(blob);
    }

    return () => {};
  }, [company_logo]);

  return (
    <>
      <SimpleBar
        forceVisible="y"
        className="flex-1"
        style={{ height: "100vh" }}
      >
        <main className="pt-24 sm:pt-8 pb-12 flex flex-col gap-8">
          <div className="flex flex-col gap-8">
            <div className="px-8 ">
              <p className="display-sm-semibold text-gray-light/900">
                Pengaturan
              </p>
            </div>
            <div className="px-8">
              <form
                className="flex flex-col gap-5"
                onSubmit={handleSubmit(submit, (e) => {
                  console.log(e);
                })}
              >
                <div className="flex items-start gap-8">
                  <div className="flex-1 flex flex-col items-start justify-start max-w-[280px]">
                    <p className="text-sm-semibold text-gray-700">
                      Judul undian
                    </p>
                    <p className="text-sm-regular text-gray-600">
                      Judul yang akan ditampilkan pada menu leaderboard
                    </p>
                  </div>
                  <div className="flex-1 flex flex-col gap-1.5 max-w-80">
                    <div>
                      <MyTextArea
                        max={96}
                        name={"title"}
                        rows={2}
                        control={control}
                        errors={errors}
                        placeholder={"Masukkan title"}
                      />
                    </div>
                    <p className="text-sm-regular text-gray-light/600">
                      {96 - (title?.length ?? 0)} characters left
                    </p>
                  </div>
                </div>
                <hr className="border-gray-light/200" />
                <div className="flex items-start gap-8">
                  <div className="flex-1 flex flex-col items-start justify-start max-w-[280px]">
                    <p className="text-sm-semibold text-gray-700">
                      Lama proses acakan undian
                    </p>
                    <p className="text-sm-regular text-gray-600">
                      Lama waktu delay ketika proses pengacakan sedang
                      berlangsung
                    </p>
                  </div>
                  <div className="flex-1 flex flex-col gap-1.5 max-w-80">
                    <MyAutocomplete
                      options={durationList.data}
                      name="shuffle_duration"
                      error={errors?.shuffle_duration?.message}
                      control={control}
                      placeholder={"Pilih lama proses"}
                      onChange={async (e, value) => {
                        setValue("shuffle_duration", value);
                        await trigger("shuffle_duration");
                      }}
                      value={shuffle_duration}
                      getOptionLabel={(e) => e.label}
                      isOptionEqualToValue={(option, value) =>
                        option.value === value.value
                      }
                    />
                  </div>
                </div>
                <hr className="border-gray-light/200" />
                <div className="flex items-start gap-8">
                  <div className="flex-1 flex flex-col items-start justify-start max-w-[280px]">
                    <div className="flex items-center gap-0.5">
                      <p className="text-sm-semibold text-gray-700">
                        Data peserta yang ditampilkan
                      </p>
                      {/* <HelpCircle className={"text-gray-light/400"} size={16} stroke={"currentColor"} /> */}
                    </div>
                    <p className="text-sm-regular text-gray-600">
                      Informasi tabel yang ditampilkan pada menu leaderboard
                    </p>
                  </div>
                  <div className="flex-1 flex flex-col gap-1.5 max-w-80">
                    <div>
                      <MyAutocomplete
                        multiple
                        options={[
                          {
                            label: "No undian",
                            value: "No undian",
                            disabled: true,
                          },
                          {
                            label: "Kode unik undian",
                            value: "Kode unik undian",
                            disabled: true,
                          },
                          ...participantFieldList.data,
                        ]}
                        name="shuffle_duration"
                        error={errors?.categorie?.message}
                        control={control}
                        placeholder={"Pilih column"}
                        onInputFocus={(e) =>
                          searchParticipantFieldNameList({ search: "" })
                        }
                        onInputChange={debounce(
                          (e) =>
                            searchParticipantFieldNameList({
                              search: e.target.value,
                            }),
                          1000
                        )}
                        onChange={async (e, value) => {
                          setValue("participant_display_fields", value);
                          await trigger("participant_display_fields");
                        }}
                        value={participant_display_fields}
                        getOptionLabel={(e) => e.label}
                        isOptionEqualToValue={(option, value) =>
                          option.value === value.value
                        }
                      />
                    </div>
                    <p className="text-sm-regular text-gray-light/600">
                      Urutan di sini akan menjadi acuan yang ditampilkan pada
                      menu leaderboard.
                    </p>
                  </div>
                </div>
                <hr className="border-gray-light/200" />
                {/* <div className="flex items-start gap-8">
                                    <div className="flex-1 flex flex-col items-start justify-start max-w-[280px]">
                                        <p className="text-sm-semibold text-gray-700">Company logo</p>
                                        <p className="text-sm-regular text-gray-600">Logo yang akan ditampilkan</p>
                                    </div>
                                    <div className="flex-1 flex items-start gap-8">
                                        {urlFileCompanyLogo && <div className="w-[200px] h-16">
                                            <img className="w-full h-full object-contain" src={urlFileCompanyLogo} alt="" />
                                        </div>}
                                        <div>
                                            <div className="flex flex-col gap-1.5">
                                                <label htmlFor="file-upload-company-logo" className="">
                                                    <div className="py-4 px-6 border border-gray-light/200 rounded-xl flex flex-col gap-3">
                                                        <div className="w-full flex justify-center">
                                                            <div className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-light/200 shadow-shadows/shadow-xs">
                                                                <UploadCloud02 className={"text-gray-light/700"} size={20} stroke={"currentColor"} />
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-1 items-center justify-center text-center">
                                                            <p className="text-sm-semibold text-brand/600">Klik untuk upload</p>
                                                            <p className="text-xs-regular text-gray-light/600">JPG atau PNG (200MB)</p>
                                                        </div>
                                                    </div>
                                                </label>
                                                {errors.company_logo && <p>{errors.company_logo.message}</p>}
                                            </div>                               
                                                         <input accept="image/*" id="file-upload-company-logo" {...register('company_logo')} type="file" style={{ display: 'none' }}
                                                onChange={uploadFileCompanyLogo} />
                                        </div>
                                    </div>
                                </div>
                                <hr className="border-gray-light/200" />
                                <div className="flex items-start gap-8">
                                    <div className="flex-1 flex flex-col items-start justify-start max-w-[280px]">
                                        <p className="text-sm-semibold text-gray-700">Headline text undian</p>
                                        <p className="text-sm-regular text-gray-600">Headline text pada bagian mulai tombol undian</p>
                                    </div>
                                    <div className="flex-1 flex flex-col gap-1.5 max-w-80">
                                        <div>
                                            <MyTextArea name={"headline_text"} control={control} errors={errors} placeholder={"Masukkan headline"} />
                                        </div>
                                        <p className="text-sm-regular text-gray-light/600">36 characters left</p>
                                    </div>
                                </div>
                                <hr className="border-gray-light/200" />
                                <div className="flex items-start gap-8">
                                    <div className="flex-1 flex flex-col items-start justify-start max-w-[280px]">
                                        <p className="text-sm-semibold text-gray-700">Headline supporting text undian</p>
                                        <p className="text-sm-regular text-gray-600">Headline supporting text pada bagian mulai tombol undian</p>
                                    </div>
                                    <div className="flex-1 flex flex-col gap-1.5 max-w-80">
                                        <div>
                                            <MyTextArea name={"headline_supporting_text"} control={control} errors={errors} placeholder={"Masukkan headline supporting"} />
                                        </div>
                                        <p className="text-sm-regular text-gray-light/600">36 characters left</p>
                                    </div>
                                </div>
                                <hr className="border-gray-light/200" /> */}
                <div className="flex items-center gap-8">
                  <div className="flex-1 flex flex-col items-start justify-start max-w-[280px]">
                    <p className="text-sm-semibold text-gray-700">
                      Pemenang dapat menang kembali
                    </p>
                    <p className="text-sm-regular text-gray-600">
                      Aktivasi fungsi undian di mana pemenang yang telah
                      terpilih dan tervalidasi dapat menang kembali
                    </p>
                  </div>
                  <div className="flex-1 flex items-center gap-1.5 max-w-80">
                    <MySwicth
                      name={"is_repeat_win_allowed"}
                      control={control}
                      onChange={(e) =>
                        setValue("is_repeat_win_allowed", e.target.checked)
                      }
                    />
                  </div>
                </div>
                <hr className="border-gray-light/200" />
                <div className="flex items-center gap-8">
                  <div className="flex-1 flex flex-col items-start justify-start max-w-[280px]">
                    <p className="text-sm-semibold text-gray-700">
                      Ubah kata sandi reset
                    </p>
                    <p className="text-sm-regular text-gray-600">
                      Atur kata sandi untuk melakukan reset
                    </p>
                  </div>
                  <div className="flex-1 flex items-center gap-1.5 max-w-80">
                    <MyTextField
                      type={isShowPass ? "text" : "password"}
                      name="reset_data_password"
                      placeholder={"Enter your password"}
                      control={control}
                      value={reset_data_password}
                      errors={errors?.reset_data_password?.message}
                      endAdornment={
                        <span
                          className="p-1 cursor-pointer"
                          onClick={() => setIsShowPass(!isShowPass)}
                        >
                          {isShowPass ? (
                            <Eye size={20} stroke={"currentColor"} />
                          ) : (
                            <EyeOff size={20} stroke={"currentColor"} />
                          )}
                        </span>
                      }
                    />
                  </div>
                </div>
                <hr className="border-gray-light/200" />
                <footer className="h-10 w-full flex items-center justify-end gap-3">
                  <MyButton
                    color={"secondary"}
                    variant={"outlined"}
                    size={"md"}
                    onClick={getSetting}
                  >
                    <p className="text-sm-semibold">Batal</p>
                  </MyButton>
                  <MyButton
                    type="submit"
                    color={"primary"}
                    variant={"filled"}
                    size={"md"}
                  >
                    <p className="text-sm-semibold">Simpan</p>
                  </MyButton>
                </footer>
              </form>
            </div>
          </div>
        </main>
      </SimpleBar>
    </>
  );
};

export default Page;
