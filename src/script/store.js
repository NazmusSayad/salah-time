const json = (t, e) => {
  fetch(t)
    .then((t) => t.json())
    .then((t) => {
      e(t)
    })
}
const cookie = function (t, e, n = 0, o = 0, r = 0, i = 0) {
  switch (arguments.length) {
    case 1:
      {
        let e = t + "=",
          n = document.cookie.split(";")
        for (let t = 0; t < n.length; t++) {
          let o = n[t]
          for (; " " == o.charAt(0); ) o = o.substring(1)
          if (0 == o.indexOf(e)) return o.substring(e.length, o.length)
        }
        return ""
      }
      break
    default:
      {
        const a = new Date()
        a.setTime(a.getTime() + (864e5 * n + 36e5 * o + 6e4 * r + 1e3 * i)), (document.cookie = t + "=" + e + ";expires=" + a.toUTCString() + ";path=/")
      }
      break
  }
}