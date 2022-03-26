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
