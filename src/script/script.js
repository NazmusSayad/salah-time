const main_section = {
    salah_times: document.querySelector("#salah-time"),
    clock: document.querySelector("#clock"),
    next_prayer: document.querySelector("#next-prayer [-wrap---]"),
  },
  salah_times__element = {
    Fajr: main_section.salah_times.querySelector("#salah-time .today.Fajr span"),
    Sunrise: main_section.salah_times.querySelector("#salah-time .today.Sunrise span"),
    Dhuhr: main_section.salah_times.querySelector("#salah-time .today.Dhuhr span"),
    Asr: main_section.salah_times.querySelector("#salah-time .today.Asr span"),
    Maghrib: main_section.salah_times.querySelector("#salah-time .today.Maghrib span"),
    Isha: main_section.salah_times.querySelector("#salah-time .today.Isha span"),
    Midnight: main_section.salah_times.querySelector("#salah-time .today.Midnight span"),

    Fajr2: main_section.salah_times.querySelector("#salah-time .other.Fajr span"),
    Sunrise2: main_section.salah_times.querySelector("#salah-time .other.Sunrise span"),
    Dhuhr2: main_section.salah_times.querySelector("#salah-time .other.Dhuhr span"),
    Asr2: main_section.salah_times.querySelector("#salah-time .other.Asr span"),
    Maghrib2: main_section.salah_times.querySelector("#salah-time .other.Maghrib span"),
    Isha2: main_section.salah_times.querySelector("#salah-time .other.Isha span"),
    Midnight2: main_section.salah_times.querySelector("#salah-time .other.Midnight span"),
  },
  clock_element = {
    time_h: main_section.clock.querySelector("#clock .time_h"),
    time_m: main_section.clock.querySelector("#clock .time_m"),
    time_s: main_section.clock.querySelector("#clock .time_s"),
    time_t: main_section.clock.querySelector("#clock .time_t"),
    date_all: main_section.clock.querySelector("#clock .date"),
  };

(() => {
  if (config.latitude && config.longitude) {
    get_data_from_server();
  } else {
    navigator.geolocation.watchPosition(
      (position) => {
        update_latt_long_config(position.coords.latitude, position.coords.longitude);
      },
      () => {
        update_latt_long_ip();
      }
    );
  }
})();

// Clock Block
setfirstDate();

const loadInterval = setInterval(() => {
  if (!Math.round(new Date().getMilliseconds() / 100)) {
    clearInterval(loadInterval);
    startClock();
    setInterval(() => {
      startClock();
      if (config.current === "Fajr") {
        check_Fajr_prayer();
      }
      check_Next_prayer();
    }, 1000);
  }
}, 1);
