const config = {
  method: cookie.get("method") ? cookie.get("method") : "Karachi",
  juristic: cookie.get("juristic") ? cookie.get("juristic") : "Hanafi",
  latitude: cookie.get("latitude") ? cookie.get("latitude") : null,
  longitude: cookie.get("longitude") ? cookie.get("longitude") : null,
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
