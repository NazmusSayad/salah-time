const config = {
  method: cookie.get("method") ? cookie.get("method") : 1,
  juristic: cookie.get("juristic") ? cookie.get("juristic") : 0,
  latitude: cookie.get("latitude") ? cookie.get("latitude") : null,
  longitude: cookie.get("longitude") ? cookie.get("longitude") : null,
  data: cookie.get("data")
    ? JSON.parse(cookie.get("data"))
    : {
        today: {},
        other: {},
        settings: null,
      },
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  loaded: false,
  loaded2: false,
};

