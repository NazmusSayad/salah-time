const config = {
  method: cookie.get("method") ? cookie.get("method") : 1,
  juristic: cookie.get("juristic") ? cookie.get("juristic") : 0,
  latitude: cookie.get("latitude") ? cookie.get("latitude") : null,
  longitude: cookie.get("longitude") ? cookie.get("longitude") : null,
  data: cookie.get("data") ? JSON.parse(cookie.get("data")) : null,
  data_settings: cookie.get("data_settings") ? JSON.parse(cookie.get("data_settings")) : null,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

const update_latt_long_config = (latt, long) => {
  config.latitude = latt;
  config.longitude = long;
  cookie.set("longitude", long);
  cookie.set("latitude", latt);
  get_data_from_server();
};

const update_latt_long_location = () => {
  navigator.geolocation.watchPosition((position) => {
    update_latt_long_config(position.coords.latitude, position.coords.longitude);
  });
};

const update_latt_long_ip = () => {
  json("https://json.geoiplookup.io", (data) => {
    update_latt_long_config(data.latitude, data.longitude);
  });
};

const get_data_from_server = () => {
  if (config.data_settings === config.latitude + config.longitude + new Date().toDateString()) {
    update_page();
    console.log("uploaded");
    return;
  }
  json(
    `https://www.islamicfinder.us/index.php/api/prayer_times/?timezone=${config.timezone}&time_format=1&high_latitude=0&latitude=${config.latitude}&longitude=${config.longitude}&method=${config.method}&juristic=${config.juristic}`,
    (data) => {
      config.data = data.results;
      config.data_settings = config.latitude + config.longitude + new Date().toDateString();

      cookie.set("data", JSON.stringify(config.data));
      cookie.set("data_settings", JSON.stringify(config.data_settings));
      update_page();
    }
  );
};

const update_page = () => {
  for (let key in config.data) {
    salah_times__element[key].innerHTML = key + ":- " + config.data[key].replace(/%/gim, "").toUpperCase();
  }
};

// Clock Section
let currentDate, sec, min, hou, ampm;
const fix = (input) => {
  return input < 10 ? "0" + input : String(input);
};
const updateSec = (date) => {
  sec = date.getSeconds();
  clock_element.time_s.textContent = fix(sec);
};
const updateMin = (date) => {
  min = date.getMinutes();
  clock_element.time_m.textContent = fix(min);
};
const updateHou = (date) => {
  hou = date.getHours();
  if (!hou) {
    updateDate(date);
    get_data_from_server();
  }
  ampm = hou >= 12 ? "PM" : "AM";
  hou = hou % 12;
  hou = hou ? hou : 12;
  clock_element.time_h.textContent = fix(hou);
  clock_element.time_t.textContent = ampm;
};
const updateDate = (date) => {
  clock_element.date_all.textContent = date.toLocaleString("en-US", {
    day: "2-digit",
    year: "numeric",
    month: "long",
    weekday: "long",
  });
};
const setfirstDate = () => {
  const dateWhenLoad = new Date();
  updateSec(dateWhenLoad);
  updateMin(dateWhenLoad);
  updateHou(dateWhenLoad);
  updateDate(dateWhenLoad);
};
const startClock = () => {
  currentDate = new Date();
  updateSec(currentDate);
  if (!sec) {
    updateMin(currentDate);
    if (!min) {
      updateHou(currentDate);
    }
  }
};
