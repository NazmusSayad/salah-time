const config = {
  method: cookie.get("method") ? cookie.get("method") : 1,
  juristic: cookie.get("juristic") ? cookie.get("juristic") : 1,
  latitude: cookie.get("latitude") ? cookie.get("latitude") : null,
  longitude: cookie.get("longitude") ? cookie.get("longitude") : null,
  data: {
    today: {},
    other: {},
    settings: null,
  },
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  loaded: false,
};
let currentDate, sec, min, hou, ampm, today, tomorrow, yesterday;
update_all_dates();
