// Clock Area
const fix = (e) => (e < 10 ? "0" + e : String(e)),
  updateSec = (e) => {
    (sec = e.getSeconds()), (clock_element.time_s.textContent = fix(sec));
  },
  updateMin = (e) => {
    (min = e.getMinutes()), (clock_element.time_m.textContent = fix(min)), check_current_prayer();
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
    update_all_dates();
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
  },
  json = (t, e) => {
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
  },
  update_latt_long_location = () => {
    navigator.geolocation.watchPosition(
      (position) => {
        update_latt_long_config(position.coords.latitude, position.coords.longitude);
      },
      () => alert("Geolocation service not working.")
    );
  },
  update_latt_long_ip = () => {
    json("https://json.geoiplookup.io", (data) => {
      config.userIpData = data;
      update_latt_long_config(data.latitude, data.longitude);
    });
  };

const get_data_from_server = () => {
  prayTimes.setMethod(config.method);
  prayTimes.adjust({ asr: config.juristic });

  config.data.today = prayTimes.getTimes(new Date(), [config.latitude, config.longitude], config.timezone, 0, "12h");

  if (new Date(today + " " + config.data.today.fajr) >= new Date()) {
    config.data.other = prayTimes.getTimes(new Date(Date.now() - 86400000), [config.latitude, config.longitude], config.timezone, 0, "12h");
    main_section.salah_times.className = "yesterday";
    update_page();
  } else {
    config.data.other = prayTimes.getTimes(new Date(Date.now() + 86400000), [config.latitude, config.longitude], config.timezone, 0, "12h");
    main_section.salah_times.className = "tomorrow";
    update_page();
  }
};

update_page = () => {
  salah_times__element.fajr.innerHTML = config.data.today.fajr;
  salah_times__element.sunrise.innerHTML = config.data.today.sunrise;
  salah_times__element.dhuhr.innerHTML = config.data.today.dhuhr;
  salah_times__element.asr.innerHTML = config.data.today.asr;
  salah_times__element.maghrib.innerHTML = config.data.today.maghrib;
  salah_times__element.isha.innerHTML = config.data.today.isha;

  salah_times__element.fajr2.innerHTML = config.data.other.fajr;
  salah_times__element.sunrise2.innerHTML = config.data.other.sunrise;
  salah_times__element.dhuhr2.innerHTML = config.data.other.dhuhr;
  salah_times__element.asr2.innerHTML = config.data.other.asr;
  salah_times__element.maghrib2.innerHTML = config.data.other.maghrib;
  salah_times__element.isha2.innerHTML = config.data.other.isha;

  check_current_prayer();
  check_Fajr_prayer();
  check_Next_prayer();
  main_section.settings.classList.remove("open");
};

const find_prayer_time = (input) => {
    if (input.slice(-1) !== "2") {
      return config.data.today[input];
    } else {
      return config.data.other[input.slice(0, input.length - 1)];
    }
  },
  check_current_prayer = () => {
    const dates = [
      new Date(today + " " + config.data.today.sunrise),
      new Date(today + " " + config.data.today.fajr),
      new Date(today + " " + config.data.today.dhuhr),
      new Date(today + " " + config.data.today.asr),
      new Date(today + " " + config.data.today.maghrib),
      new Date(today + " " + config.data.today.isha),
    ];
    if (dates[5] <= Date.now()) {
      config.current = "isha";
      config.next = "fajr2";
    } else if (dates[4] <= Date.now()) {
      config.current = "maghrib";
      config.next = "isha";
    } else if (dates[3] <= Date.now()) {
      config.current = "asr";
      config.next = "maghrib";
    } else if (dates[2] <= Date.now()) {
      config.current = "dhuhr";
      config.next = "asr";
    } else if (dates[1] <= Date.now()) {
      config.current = "";
      if (new Date() < dates[0]) {
        config.current = "fajr";
        if (!config.loaded) {
          get_data_from_server();
          config.loaded = true;
        }
      }
      config.next = "dhuhr";
    } else {
      config.current = "isha2";
      config.next = "fajr";
      config.loaded = false;
    }
    for (let key in salah_times__element) {
      if (key !== config.current) {
        salah_times__element[key].parentNode.classList.remove("current");
      }
      if (key !== config.next) {
        salah_times__element[key].parentNode.classList.remove("next");
      }
    }

    if (config.current) {
      salah_times__element[config.current].parentNode.classList.add("current");
    }
    salah_times__element[config.next].parentNode.classList.add("next");
  },
  check_Fajr_prayer = () => {
    const time = check_difference_between_two_time(new Date(today + " " + find_prayer_time("sunrise")));
    salah_times__element["sunrise"].parentNode.querySelector(".salah-time__item--remain").innerHTML = time;
  },
  check_Next_prayer = () => {
    const time = check_difference_between_two_time(
      new Date(
        (config.next === "fajr2" && new Date() > new Date(today + " " + config.data.today.isha) ? tomorrow : today) + " " + find_prayer_time(config.next)
      )
    );
    salah_times__element[config.next].parentNode.querySelector(".salah-time__item--remain").innerHTML = time;
  };

const update_all_dates = (input) => {
    let date = new Date().getTime();
    date = new Date(date);
    today = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();

    date = new Date().getTime() + 86400000;
    date = new Date(date);
    tomorrow = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();

    date = new Date().getTime() - 86400000;
    date = new Date(date);
    yesterday = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
  },
  check_difference_between_two_time = (endDate, currentDatesdf = new Date()) => {
    const hours = parseInt((Math.abs(endDate - currentDatesdf) / (1000 * 60 * 60)) % 24);
    const minutes = parseInt((Math.abs(endDate.getTime() - currentDatesdf.getTime()) / (1000 * 60)) % 60);
    const seconds = parseInt((Math.abs(endDate.getTime() - currentDatesdf.getTime()) / 1000) % 60);

    return hours + ":" + fix(minutes) + ":" + fix(seconds);
  };
const settings__open = () => {
    main_section.settings.querySelector(`.settings__juristic--list input[value=${config.juristic}]`).click();
    main_section.settings.querySelector(`.settings__method--list input[value=${config.method}]`).click();

    main_section.settings.classList.add("open");
  },
  settings__submit = function () {
    event.preventDefault();
    const juristic__list = this.querySelector(".settings__juristic--list input"),
      method__list = this.querySelectorAll(".settings__method--list input"),
      location__lat_long = this.querySelectorAll(".settings__location--lat-long input");

    if (juristic__list.checked) {
      config.juristic = "Standard";
      cookie.set("juristic", config.juristic);
    } else {
      config.juristic = "Hanafi";
      cookie.set("juristic", config.juristic);
    }

    for (let item of method__list) {
      if (item.checked) {
        config.method = item.value;
        cookie.set("method", config.method);
      }
    }

    const latt = location__lat_long[0].value;
    if (latt) {
      config.latitude = latt;
      cookie.set("latitude", latt);
    }

    const long = location__lat_long[1].value;
    if (long) {
      config.longitude = long;
      cookie.set("longitude", long);
    }
    get_data_from_server();
  };
