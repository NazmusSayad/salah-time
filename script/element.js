const main_section = {
    salah_times: document.querySelector("#salah-time"),
    clock: document.querySelector("#clock"),
    next_prayer: document.querySelector("#next-prayer [-wrap---]"),
    settings: document.querySelector("#settings"),
  },
  salah_times__element = {
    Fajr: main_section.salah_times.querySelector(".salah-time__item.today.Fajr .salah-time__item--time"),
    Sunrise: main_section.salah_times.querySelector(".salah-time__item.today.Sunrise .salah-time__item--time"),
    Dhuhr: main_section.salah_times.querySelector(".salah-time__item.today.Dhuhr .salah-time__item--time"),
    Asr: main_section.salah_times.querySelector(".salah-time__item.today.Asr .salah-time__item--time"),
    Maghrib: main_section.salah_times.querySelector(".salah-time__item.today.Maghrib .salah-time__item--time"),
    Isha: main_section.salah_times.querySelector(".salah-time__item.today.Isha .salah-time__item--time"),

    Fajr2: main_section.salah_times.querySelector(".salah-time__item.other.Fajr .salah-time__item--time"),
    Sunrise2: main_section.salah_times.querySelector(".salah-time__item.other.Sunrise .salah-time__item--time"),
    Dhuhr2: main_section.salah_times.querySelector(".salah-time__item.other.Dhuhr .salah-time__item--time"),
    Asr2: main_section.salah_times.querySelector(".salah-time__item.other.Asr .salah-time__item--time"),
    Maghrib2: main_section.salah_times.querySelector(".salah-time__item.other.Maghrib .salah-time__item--time"),
    Isha2: main_section.salah_times.querySelector(".salah-time__item.other.Isha .salah-time__item--time"),
  },
  clock_element = {
    time_h: main_section.clock.querySelector("#clock .time_h"),
    time_m: main_section.clock.querySelector("#clock .time_m"),
    time_s: main_section.clock.querySelector("#clock .time_s"),
    time_t: main_section.clock.querySelector("#clock .time_t"),
    date_all: main_section.clock.querySelector("#clock .date"),
  }
