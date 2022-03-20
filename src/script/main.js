const config = {
  method: cookie("m") ? cookie("m") : 1,
  juristic: cookie("j") ? cookie("j") : 0,
  latitude: cookie("la") ? cookie("la") : null,
  longitude: cookie("lo") ? cookie("lo") : null,
  data: null,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

const update_latt_long_ip = () => {
  json("https://json.geoiplookup.io", (data) => {
    config.latitude = data.latitude;
    config.longitude = data.longitude;
    cookie("la", data.latitude, 99999);
    cookie("lo", data.longitude, 99999);
    get_data_from_server();
  });
};

const update_latt_long_location = () => {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
      config.latitude = position.coords.latitude;
      config.longitude = position.coords.longitude;
      cookie("la", position.coords.latitude, 99999);
      cookie("lo", position.coords.longitude, 99999);
      get_data_from_server();
    });
  }
};

const get_data_from_server = () => {
  json(
    `https://www.islamicfinder.us/index.php/api/prayer_times/?timezone=${config.timezone}&time_format=1&high_latitude=0&latitude=${config.latitude}&longitude=${config.longitude}&method=${config.method}&juristic=${config.juristic}`,
    (data) => {
      data = data.results;

      for (let key in data) {
        data[key] = data[key];
      }
      data.Sunrise = data.Duha;
      delete data.Duha;
      config.data = data;
      update_page();
    }
  );
};

const update_page = () => {
  for (let key in config.data) {
    salah_times__element[key].innerHTML =
      key + ":- " + config.data[key].replace(/%/gim, "").toUpperCase();
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
