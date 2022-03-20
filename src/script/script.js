const main_section = {
    salah_times: document.querySelector("#salah-time"),
    clock: document.querySelector("#clock"),
  },
  salah_times__element = {
    Fajr: main_section.salah_times.querySelector("#salah-time .Fajr"),
    Sunrise: main_section.salah_times.querySelector("#salah-time .Sunrise"),
    Dhuhr: main_section.salah_times.querySelector("#salah-time .Dhuhr"),
    Asr: main_section.salah_times.querySelector("#salah-time .Asr"),
    Maghrib: main_section.salah_times.querySelector("#salah-time .Maghrib"),
    Isha: main_section.salah_times.querySelector("#salah-time .Isha"),
  },
  clock_element = {
    time_h: main_section.clock.querySelector("#clock .time_h"),
    time_m: main_section.clock.querySelector("#clock .time_m"),
    time_s: main_section.clock.querySelector("#clock .time_s"),
    time_t: main_section.clock.querySelector("#clock .time_t"),
    date_all: main_section.clock.querySelector("#clock .date"),
  };

(()=>{
  if (config.latitude && config.longitude) {
    get_data_from_server();
  } else {
    navigator.geolocation.watchPosition(
      (position) => {
        update_latt_long_config(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      () => {
        update_latt_long_ip();
      }
    );
  }
})()

// Clock Block
setfirstDate();

const loadInterval = window.setInterval(() => {
  if (!Math.round(new Date().getMilliseconds() / 100)) {
    window.clearInterval(loadInterval);
    startClock();
    setInterval(() => {
      startClock();
    }, 1000);
  }
}, 1);
