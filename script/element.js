const main_section = {
    salah_times: document.querySelector("#salah-time"),
    clock: document.querySelector("#clock"),
    next_prayer: document.querySelector("#next-prayer [-wrap---]"),
    settings: document.querySelector("#settings"),
  },
  salah_times__element = {
    fajr: main_section.salah_times.querySelector(".salah-time__item.today.fajr .salah-time__item--time"),
    sunrise: main_section.salah_times.querySelector(".salah-time__item.today.sunrise .salah-time__item--time"),
    dhuhr: main_section.salah_times.querySelector(".salah-time__item.today.dhuhr .salah-time__item--time"),
    asr: main_section.salah_times.querySelector(".salah-time__item.today.asr .salah-time__item--time"),
    maghrib: main_section.salah_times.querySelector(".salah-time__item.today.maghrib .salah-time__item--time"),
    isha: main_section.salah_times.querySelector(".salah-time__item.today.isha .salah-time__item--time"),

    fajr2: main_section.salah_times.querySelector(".salah-time__item.other.fajr .salah-time__item--time"),
    sunrise2: main_section.salah_times.querySelector(".salah-time__item.other.sunrise .salah-time__item--time"),
    dhuhr2: main_section.salah_times.querySelector(".salah-time__item.other.dhuhr .salah-time__item--time"),
    asr2: main_section.salah_times.querySelector(".salah-time__item.other.asr .salah-time__item--time"),
    maghrib2: main_section.salah_times.querySelector(".salah-time__item.other.maghrib .salah-time__item--time"),
    isha2: main_section.salah_times.querySelector(".salah-time__item.other.isha .salah-time__item--time"),
  },
  clock_element = {
    time_h: main_section.clock.querySelector("#clock .time_h"),
    time_m: main_section.clock.querySelector("#clock .time_m"),
    time_s: main_section.clock.querySelector("#clock .time_s"),
    time_t: main_section.clock.querySelector("#clock .time_t"),
    date_all: main_section.clock.querySelector("#clock .date"),
  },
  settings_element = {
    settings__method_list: main_section.settings.querySelector(".settings__method--list"),
  };

for (let key in methods) {
  const element = document.createElement("div");
  element.classList.add("method__list--item");
  element.innerHTML = `
  <input type="radio" name="aiowehriowehr" value="${key}" />
  <div class="label">${methods[key].name}</div>
  <div class="tip">Fajir: ${methods[key].params.fajr}° Isha: ${methods[key].params.isha}°</div>
  `;
  settings_element.settings__method_list.appendChild(element);
}
