/* ;(function () {
  const output = { status: false }
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
      output.status = true
      output.latitude = position.coords.latitude
      output.longitude = position.coords.longitude
    })
  }
  return output
})()
 */

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
  }






if (config.latitude && config.longitude) {

  get_data_from_server()

} else {

  if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
      config.latitude = position.coords.latitude
      config.longitude = position.coords.longitude
      cookie("la", position.coords.latitude, 99999)
      cookie("lo", position.coords.longitude, 99999)
      get_data_from_server()
    })
  }
  if (!config.latitude && !config.longitude) {
    json("https://json.geoiplookup.io", (data) => {
      config.latitude = data.latitude
      config.longitude = data.longitude
      cookie("la", data.latitude, 99999)
      cookie("lo", data.longitude, 99999)
      get_data_from_server()
    })
  }
}


// Clock Block
setfirstDate()



const loadInterval = window.setInterval(() => {
  if (!Math.round(new Date().getMilliseconds() / 100)) {
    window.clearInterval(loadInterval)
    startClock()
    setInterval(() => {
      startClock()
    }, 1000)
  }
}, 1)
