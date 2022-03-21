// Clock Area
let currentDate,
  sec,
  min,
  hou,
  ampm,
  date = new Date().toLocaleDateString();
const fix = (e) => (e < 10 ? "0" + e : String(e)),
  updateSec = (e) => {
    (sec = e.getSeconds()), (clock_element.time_s.textContent = fix(sec));
  },
  updateMin = (e) => {
    (min = e.getMinutes()), (clock_element.time_m.textContent = fix(min));
    check_current_prayer();
  },
  updateHou = (e) => {
    (hou = e.getHours()),
      hou || updateDate(e),
      (ampm = hou >= 12 ? "PM" : "AM"),
      (hou %= 12),
      (hou = hou || 12),
      (clock_element.time_h.textContent = hou),
      (clock_element.time_t.textContent = ampm);
  },
  updateDate = (e) => {
    clock_element.date_all.textContent = e.toLocaleString("en-US", { day: "2-digit", year: "numeric", month: "long", weekday: "long" });
    date = new Date().toLocaleDateString();
  },
  setfirstDate = () => {
    const e = new Date();
    updateSec(e), updateMin(e), updateHou(e), updateDate(e);
  },
  startClock = () => {
    (currentDate = new Date()), updateSec(currentDate), sec || (updateMin(currentDate), min || updateHou(currentDate));
  };

const cookie = {
  get: (key) => {
    let name = key + "=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  },
  set: (key, value, day = 365, hour = 0, minute = 0, second = 0) => {
    const d = new Date();
    d.setTime(d.getTime() + (day * 86400000 + hour * 3600000 + minute * 60000 + second * 1000));
    document.cookie = key + "=" + value + ";" + "expires=" + d.toUTCString() + ";path=/";
  },
  remove: (key) => {
    document.cookie = key + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  },
};

const json = (t, e) => {
  fetch(t)
    .then((t) => t.json())
    .then((t) => {
      e(t);
    });
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

const calculateMidNIght = (inp) => {
  const startTime = new Date("2013/10/08 " + config.data[inp].Maghrib).getTime();
  const endTime = new Date("2013/10/09 " + config.data[inp].Duha).getTime();
  const difference = endTime - startTime;
  config.data[inp].Midnight = new Date(3600000 + startTime + difference / 2).toLocaleTimeString().replace(/:00 /gim, " ");
};
const update_page = () => {
  calculateMidNIght("today");
  calculateMidNIght("other");

  salah_times__element.Fajr.innerHTML = config.data.today.Fajr;
  salah_times__element.Sunrise.innerHTML = config.data.today.Duha;
  salah_times__element.Dhuhr.innerHTML = config.data.today.Dhuhr;
  salah_times__element.Asr.innerHTML = config.data.today.Asr;
  salah_times__element.Maghrib.innerHTML = config.data.today.Maghrib;
  salah_times__element.Isha.innerHTML = config.data.today.Isha;
  salah_times__element.Midnight.innerHTML = config.data.today.Midnight;

  salah_times__element.Fajr2.innerHTML = config.data.other.Fajr;
  salah_times__element.Sunrise2.innerHTML = config.data.other.Duha;
  salah_times__element.Dhuhr2.innerHTML = config.data.other.Dhuhr;
  salah_times__element.Asr2.innerHTML = config.data.other.Asr;
  salah_times__element.Maghrib2.innerHTML = config.data.other.Maghrib;
  salah_times__element.Isha2.innerHTML = config.data.other.Isha;
  salah_times__element.Midnight2.innerHTML = config.data.other.Midnight;

  if (!config.loaded) {
    check_current_prayer();
    config.loaded = true;
  }
};
const get_tomorrow = () => {
  return new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toLocaleDateString();
};
const get_yesterday = () => {
  return new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toLocaleDateString();
};
const get_data_from_server = () => {
  json(
    `https://www.islamicfinder.us/index.php/api/prayer_times/?timezone=${config.timezone}&time_format=1&high_latitude=0&latitude=${config.latitude}&longitude=${config.longitude}&method=${config.method}&juristic=${config.juristic}`,
    (data) => {
      for (let key in data.results) {
        config.data.today[key] = data.results[key].replace(/%/gim, "").toUpperCase();
      }

      if (new Date(date + " " + config.data.today.Fajr) >= new Date()) {
        json(
          `https://www.islamicfinder.us/index.php/api/prayer_times/?timezone=${
            config.timezone
          }&date=${get_yesterday()}&time_format=1&high_latitude=0&latitude=${config.latitude}&longitude=${config.longitude}&method=${config.method}&juristic=${
            config.juristic
          }`,
          (data) => {
            for (let key in data.results) {
              config.data.other[key] = data.results[key].replace(/%/gim, "").toUpperCase();
            }
            cookie.set("data", JSON.stringify(config.data));
            update_page();
            main_section.salah_times.className = "yerterday";
          }
        );
      } else {
        json(
          `https://www.islamicfinder.us/index.php/api/prayer_times/?timezone=${config.timezone}&date=${get_tomorrow()}&time_format=1&high_latitude=0&latitude=${
            config.latitude
          }&longitude=${config.longitude}&method=${config.method}&juristic=${config.juristic}`,
          (data) => {
            for (let key in data.results) {
              config.data.other[key] = data.results[key].replace(/%/gim, "").toUpperCase();
            }

            cookie.set("data", JSON.stringify(config.data));
            update_page();
            main_section.salah_times.className = "tomorrow";
          }
        );
      }
    }
  );
};
const check_current_prayer = () => {
  const dates = [
    new Date(date + " " + config.data.today.Duha),
    new Date(date + " " + config.data.today.Fajr),
    new Date(date + " " + config.data.today.Dhuhr),
    new Date(date + " " + config.data.today.Asr),
    new Date(date + " " + config.data.today.Maghrib),
    new Date(date + " " + config.data.today.Isha),
  ];
  if (dates[5] <= Date.now()) {
    config.current = "Isha";
    config.next = "Fajr2";
  } else if (dates[4] <= Date.now()) {
    config.current = "Maghrib";
    config.next = "Isha";
  } else if (dates[3] <= Date.now()) {
    config.current = "Asr";
    config.next = "Maghrib";
  } else if (dates[2] <= Date.now()) {
    config.current = "Dhuhr";
    config.next = "Asr";
  } else if (dates[1] <= Date.now()) {
    config.current = "";
    if (new Date() < dates[0]) {
      config.current = "Fajr";
      if (!config.loaded2) {
        get_data_from_server();
        config.loaded2 = true;
      }
    }
    config.next = "Dhuhr";
  } else {
    config.current = "Isha2";
    config.next = "Fajr";
    config.loaded2 = false;
  }
  for (let key in salah_times__element) {
    if (key !== config.current) {
      salah_times__element[key].parentNode.classList.remove("active");
    }
    if (key !== config.next) {
      salah_times__element[key].parentNode.classList.remove("next");
    }
  }

  if (config.current) {
    salah_times__element[config.current].parentNode.classList.add("active");
  }
  salah_times__element[config.next].parentNode.classList.add("next");
};

const check_Fajr_prayer = () => {
  const time = check_difference_between_two_time(new Date(date + " " + find_prayer_time("Duha")));
  salah_times__element["Fajr"].parentNode.querySelector(".remain").innerHTML = time;
};
const check_Next_prayer = () => {
  const time = check_difference_between_two_time(new Date(date + " " + find_prayer_time(config.next)));
  salah_times__element[config.next].parentNode.querySelector(".remain").innerHTML = time;
};
const check_difference_between_two_time = (endDate, today = new Date()) => {
  const hours = parseInt((Math.abs(endDate - today) / (1000 * 60 * 60)) % 24);
  const minutes = parseInt((Math.abs(endDate.getTime() - today.getTime()) / (1000 * 60)) % 60);
  const seconds = parseInt((Math.abs(endDate.getTime() - today.getTime()) / 1000) % 60);

  return hours + ":" + fix(minutes) + ":" + fix(seconds);
};
const find_prayer_time = (input) => {
  if (input.slice(-1) !== "2") {
    return config.data.today[input];
  } else {
    return config.data.other[input.slice(0, input.length - 1)];
  }
};
