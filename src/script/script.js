const main_section = {
    salah_times: document.querySelector("#salah-time"),
    clock: document.querySelector("#clock"),
    next_prayer: document.querySelector("#next-prayer [-wrap---]"),
    settings: document.querySelector("#settings"),
  },
  salah_times__element = {
    Fajr: main_section.salah_times.querySelector("#salah-time .today.Fajr .time"),
    Sunrise: main_section.salah_times.querySelector("#salah-time .today.Sunrise .time"),
    Dhuhr: main_section.salah_times.querySelector("#salah-time .today.Dhuhr .time"),
    Asr: main_section.salah_times.querySelector("#salah-time .today.Asr .time"),
    Maghrib: main_section.salah_times.querySelector("#salah-time .today.Maghrib .time"),
    Isha: main_section.salah_times.querySelector("#salah-time .today.Isha .time"),
    Midnight: main_section.salah_times.querySelector("#salah-time .today.Midnight .time"),

    Fajr2: main_section.salah_times.querySelector("#salah-time .other.Fajr .time"),
    Sunrise2: main_section.salah_times.querySelector("#salah-time .other.Sunrise .time"),
    Dhuhr2: main_section.salah_times.querySelector("#salah-time .other.Dhuhr .time"),
    Asr2: main_section.salah_times.querySelector("#salah-time .other.Asr .time"),
    Maghrib2: main_section.salah_times.querySelector("#salah-time .other.Maghrib .time"),
    Isha2: main_section.salah_times.querySelector("#salah-time .other.Isha .time"),
    Midnight2: main_section.salah_times.querySelector("#salah-time .other.Midnight .time"),
  },
  clock_element = {
    time_h: main_section.clock.querySelector("#clock .time_h"),
    time_m: main_section.clock.querySelector("#clock .time_m"),
    time_s: main_section.clock.querySelector("#clock .time_s"),
    time_t: main_section.clock.querySelector("#clock .time_t"),
    date_all: main_section.clock.querySelector("#clock .date"),
  }

;(() => {
  if (config.latitude && config.longitude) {
    get_data_from_server()
  } else {
    navigator.geolocation.watchPosition(
      (position) => {
        update_latt_long_config(position.coords.latitude, position.coords.longitude)
      },
      () => {
        update_latt_long_ip()
      }
    )
  }
})()

// Clock Block
setfirstDate()

const loadInterval = setInterval(() => {
  if (!Math.round(new Date().getMilliseconds() / 100)) {
    clearInterval(loadInterval)
    startClock()
    setInterval(() => {
      startClock()
      if (config.current === "Fajr") {
        check_Fajr_prayer()
        salah_times__element["Sunrise"].parentNode.classList.add("remain")
      } else {
        salah_times__element["Sunrise"].parentNode.classList.remove("remain")
      }
      check_Next_prayer()
    }, 1000)
  }
}, 1)

main_section.settings.addEventListener("submit", settings__submit)
