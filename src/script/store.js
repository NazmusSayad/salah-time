// Clock Area

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
  update_latt_long_location = (alt) => {
    navigator.geolocation.watchPosition(
      (position) => {
        update_latt_long_config(position.coords.latitude, position.coords.longitude);
      },
      () => {
        if (alt) {
          alert("Geolocation service not working.");
        }
      }
    );
  },
  update_latt_long_ip = () => {
    json("https://json.geoiplookup.io", (data) => {
      update_latt_long_config(data.latitude, data.longitude);
    });
  };

const get_data_from_server = () => {
    json(
      `https://www.islamicfinder.us/index.php/api/prayer_times/?timezone=${config.timezone}&time_format=1&high_latitude=0&latitude=${config.latitude}&longitude=${config.longitude}&method=${config.method}&juristic=${config.juristic}`,
      (data) => {
        for (let key in data.results) {
          config.data.today[key] = data.results[key].replace(/%/gim, "").toUpperCase();
        }
        if (new Date(today + " " + config.data.today.Fajr) >= new Date()) {
          json(
            `https://www.islamicfinder.us/index.php/api/prayer_times/?timezone=${config.timezone}&date=${yesterday}&time_format=1&high_latitude=0&latitude=${config.latitude}&longitude=${config.longitude}&method=${config.method}&juristic=${config.juristic}`,
            (data) => {
              for (let key in data.results) {
                config.data.other[key] = data.results[key].replace(/%/gim, "").toUpperCase();
              }
              update_page();
              main_section.salah_times.className = "yerterday";
            }
          );
        } else {
          json(
            `https://www.islamicfinder.us/index.php/api/prayer_times/?timezone=${config.timezone}&date=${tomorrow}&time_format=1&high_latitude=0&latitude=${config.latitude}&longitude=${config.longitude}&method=${config.method}&juristic=${config.juristic}`,
            (data) => {
              for (let key in data.results) {
                config.data.other[key] = data.results[key].replace(/%/gim, "").toUpperCase();
              }

              update_page();
              main_section.salah_times.className = "tomorrow";
            }
          );
        }
      }
    );
  },
  update_page = () => {
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

    check_current_prayer();
    check_Fajr_prayer();
    check_Next_prayer();
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
      new Date(today + " " + config.data.today.Duha),
      new Date(today + " " + config.data.today.Fajr),
      new Date(today + " " + config.data.today.Dhuhr),
      new Date(today + " " + config.data.today.Asr),
      new Date(today + " " + config.data.today.Maghrib),
      new Date(today + " " + config.data.today.Isha),
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
        if (!config.loaded) {
          get_data_from_server();
          config.loaded = true;
        }
      }
      config.next = "Dhuhr";
    } else {
      config.current = "Isha2";
      config.next = "Fajr";
      config.loaded = false;
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
  },
  check_Fajr_prayer = () => {
    const time = check_difference_between_two_time(new Date(today + " " + find_prayer_time("Duha")));
    salah_times__element["Fajr"].parentNode.querySelector(".remain").innerHTML = time;
  },
  check_Next_prayer = () => {
    const time = check_difference_between_two_time(
      new Date(
        ((config.next = "Fajr2") && new Date() > new Date(today + " " + config.data.today.Isha) ? tomorrow : today) + " " + find_prayer_time(config.next)
      )
    );
    salah_times__element[config.next].parentNode.querySelector(".remain").innerHTML = time;
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
  },
  calculateMidNIght = (inp) => {
    const startTime = new Date("2013/10/08 " + config.data[inp].Maghrib).getTime();
    const endTime = new Date("2013/10/09 " + config.data[inp].Duha).getTime();
    const difference = endTime - startTime;
    config.data[inp].Midnight = new Date(3600000 + startTime + difference / 2).toLocaleTimeString().replace(/:00 /gim, " ");
  };
const settings__open = () => {
    const juristic__list = main_section.settings.querySelectorAll(".settings__juristic--list input");
    const method__list = main_section.settings.querySelectorAll(".settings__method--list input");

    juristic__list[config.juristic].click();
    method__list[config.method].click();

    main_section.settings.classList.add("open");
  },
  settings__submit = function () {
    event.preventDefault();
    const juristic__list = this.querySelector(".settings__juristic--list input"),
      method__list = this.querySelectorAll(".settings__method--list input"),
      location__lat_long = this.querySelectorAll(".settings__location--lat-long input");

    if (juristic__list.checked) {
      config.juristic = "0";
      cookie.set("juristic", "0");
    } else {
      config.juristic = "1";
      cookie.set("juristic", "1");
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
