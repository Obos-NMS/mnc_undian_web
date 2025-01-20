import { get, post, patch, remove, download } from "./network";
const Reguest = {
  // auth
  login: async (data) => await post("/v1/auth/login/", data),

  // setting
  getSetting: async () => await get("/v1/settings/"),
  updateSetting: async (data) =>
    await post("/v1/settings/", data, "form-data", null),

  // raffle-prize
  getRafflePrize: async (params) =>
    await get("/v1/database-management/raffle-prize/", params),
  createRafflePrize: async (data, config) =>
    await post(
      "/v1/database-management/raffle-prize/",
      data,
      "form-data",
      null,
      config
    ),
  showRafflePrize: async (id) =>
    await get("/v1/database-management/raffle-prize/" + id),
  updateRafflePrize: async (id, data, config) =>
    await patch(
      "/v1/database-management/raffle-prize/" + id,
      data,
      "form-data",
      null,
      config
    ),
  updateRafflePrizePhoto: async (id, data) =>
    await patch(
      "/v1/database-management/raffle-prize/" + id + "/photo",
      data,
      {},
      "form-data"
    ),
  deleteRafflePrize: async (id) =>
    await remove("/v1/database-management/raffle-prize/" + id),
  downloadExportRafflePrize: (params) =>
    download("/v1/database-management/raffle-prize/export", params),

  // participant
  getParticipant: async (params) =>
    await get("/v1/database-management/participant/", params, null),
  resetParticipant: async (data) =>
    await post("/v1/database-management/participant/reset", data, "json", null),
  downloadTemplateImportParticipant: (params) =>
    download("/v1/database-management/participant/example", params),
  downloadExportParticipant: (params) =>
    download("/v1/database-management/participant/export", params),
  importParticipant: async (data, config) =>
    await post(
      "/v1/database-management/participant/import",
      data,
      "form-data",
      null,
      config
    ),

  // winner
  getWinner: async (params) => await get("/v1/winner/", params),
  getRandomWinner: async () => await post("/v1/winner/get-random-winner"),
  getMultipleWinner: async (count) => await post("/v1/winner/get-multiple-winner/" + count),
  setWinner: async (data) => await post("/v1/winner/set-winner", data),
  setMultipleWinner: async (data) => await post("/v1/winner/set-multiple-winner", data),
  setStatusWinner: async (id, data) =>
    await patch("/v1/winner/" + id + "/set-status", data),
  resetWinner: async (data) => await post("/v1/winner/reset", data),
  deleteWinner: async (id) => await remove("/v1/winner/" + id),
  downloadExportWinner: (params) => download("/v1/winner/export", params),

  // search
  searchRafflePrizeList: async (params) =>
    await get("/v1/option/raffle-prize-list", params),
  searchParticipantFieldNameList: async (params) =>
    await get("/v1/option/participant-field-name-list", params),
};

export default Reguest;
