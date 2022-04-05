const config = {
  method: localStorage.getItem("method") ? localStorage.getItem("method") : "Karachi",
  juristic: localStorage.getItem("juristic") ? localStorage.getItem("juristic") : "Hanafi",
  latitude: localStorage.getItem("latitude") ? localStorage.getItem("latitude") : null,
  longitude: localStorage.getItem("longitude") ? localStorage.getItem("longitude") : null,
  data: {
    today: {},
    other: {},
    settings: null,
  },
  timezone: new Date().getTimezoneOffset() / -60,
  loaded: false,
  userIpData: null,
};
let currentDate, sec, min, hou, ampm, today, tomorrow, yesterday;
update_all_dates();
