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
      check_Next_prayer();
      check_Fajr_prayer();
    }, 1000);
  }
}, 1);

main_section.settings.addEventListener("submit", settings__submit);
