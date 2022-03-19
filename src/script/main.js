const config = {
  method: cookie("m") ? cookie("m") : 1,
  juristic: cookie("j") ? cookie("j") : 0,
  latitude: 22,
  longitude: 23,
  data: null,
  updated: false,
}

if (!config.updated && navigator.geolocation) {
  navigator.geolocation.watchPosition((position) => {
    config.latitude = position.coords.latitude
    config.longitude = position.coords.longitude
    json("http://worldtimeapi.org/api/ip", (data) => {
      config.timezone = data.timezone
      config.updated = true
      get_data_from_server()
    })
  })
}

if (!config.updated) {
  json("http://ip-api.com/json", (data) => {
    config.latitude = data.lat
    config.longitude = data.lon
    config.timezone = data.timezone
    config.updated = true
    get_data_from_server()
  })
}

const get_data_from_server = () => {
  json(
    `https://www.islamicfinder.us/index.php/api/prayer_times/?timezone=${config.timezone}&time_format=1&high_latitude=0&latitude=${config.latitude}&longitude=${config.longitude}&method=${config.method}&juristic=${config.juristic}`,
    (data) => {
      data = data.results

      for (let key in data) {
        data[key] = data[key]
      }
      data.Sunrise = data.Duha
      delete data.Duha
      config.data = data
      update_page()
    }
  )
}

const update_page = () => {
  for (let key in config.data) {
    salah_times__element[key].innerHTML = key + ":- " + config.data[key].replace(/%/gim, "").toUpperCase()
  }
}



// Clock Section
let currentDate, sec, min, hou, ampm
const fix = (input) => {
  return input < 10 ? "0" + input : String(input)
}
const updateSec = (date) => {
  sec = date.getSeconds()
  clock_element.time_s.textContent = fix(sec)
}
const updateMin = (date) => {
  min = date.getMinutes()
  clock_element.time_m.textContent = fix(min)
}
const updateHou = (date) => {
  hou = date.getHours()
  if (!hou) {
    updateDate(date)
    get_data_from_server()
  }
  ampm = hou >= 12 ? "PM" : "AM"
  hou = hou % 12
  hou = hou ? hou : 12
  clock_element.time_h.textContent = fix(hou)
  clock_element.time_t.textContent = ampm
}
const updateDate = (date) => {
  clock_element.date_all.textContent = date.toLocaleString("en-US", {
    day: "2-digit",
    year: "numeric",
    month: "long",
    weekday: "long",
  })
}
const setfirstDate = () => {
  const dateWhenLoad = new Date()
  updateSec(dateWhenLoad)
  updateMin(dateWhenLoad)
  updateHou(dateWhenLoad)
  updateDate(dateWhenLoad)
}
const startClock = () => {
  currentDate = new Date()
  updateSec(currentDate)
  if (!sec) {
    updateMin(currentDate)
    if (!min) {
      updateHou(currentDate)
    }
  }
}
