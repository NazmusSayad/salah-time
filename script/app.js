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
      if (config.current === "fajr") {
        check_Fajr_prayer();
        salah_times__element["sunrise"].parentNode.classList.add("currentFajr");
      } else {
        salah_times__element["sunrise"].parentNode.classList.remove("currentFajr");
      }
      check_Next_prayer();
    }, 1000);
  }
}, 1);

main_section.settings.addEventListener("submit", settings__submit);

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
