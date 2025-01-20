// Libraries
import * as Yup from "yup";

export const rafflePrize = Yup.object().shape({
  name: Yup.string().required(),
  photo: Yup.mixed().notRequired(),
});
export const rafflePrizePhoto = Yup.object().shape({
  photo: Yup.mixed().required(),
});

export const setting = Yup.object().shape({
  title: Yup.string().required(),
  shuffle_duration: Yup.object().required(),
  is_repeat_win_allowed: Yup.boolean().required(),
  reset_data_password: Yup.string().required(),
  company_logo: Yup.mixed().notRequired(),
  headline_text: Yup.string().notRequired(),
  headline_supporting_text: Yup.string().notRequired(),
  participant_display_fields: Yup.array()
    .of(Yup.object({
      label: Yup.string().required('label is a required'),
      value: Yup.string().required('value is a required'),
    })),
});

export const importParticipant = Yup.object().shape({
  participants: Yup.array().test("fileSize", "The file is too large", (value) => {
    if (!value?.length) return false; // attachment is optional
    return value.find((e) => e).size <= 200000000;
  }),
});

export const resetWinner = Yup.object().shape({
  reset_data_password: Yup.string().required(),
});
export const resetParticipant = Yup.object().shape({
  reset_data_password: Yup.string().required(),
});
