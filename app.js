const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const request = require('request')
const apiKey = '9f3cf13afba71ac4b78c7779c246be01'
const port = 3030

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true  }))

app.get('/', (req, res) => {
  res.render('index', {
    weather: null, 
    error: null, 
    lat: null, 
    lon: null,
    main:  null,
    description: null,
    icon: null,
    location: null
  })
})

app.post('/', (req, res) => {
  let city = req.body.city
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

  request(url, (err, response, body) => {
    if (err) {
      res.render('index', {
        weather: null, 
        error: 'Error, please try again',
        lat: null, 
        lon: null,
        main:  null,
        description: null,
        icon: null,
        location: null
      })
    } else {
      let weathers = JSON.parse(body)

      if (weathers.main === undefined) {
        res.render('index', {
          weather: null, 
          error: 'Error, please try again', 
          lat: null, 
          lon: null,
          main:  null,
          description: null,
          icon: null,
          location: null
        })
      } else {
        let convertSuhu = Math.floor((weathers.main.temp - 32) * 5/9)
        let weatherText =  `${convertSuhu}°C`
        let latitude = weathers.coord.lat
        let longitude = weathers.coord.lon
        let weatherMain = weathers.weather[0].main
        let weatherDescription = weathers.weather[0].description
        let weatherIcon = weathers.weather[0].icon
        let location = weathers.name

        res.render('index', {
          weather: weatherText, 
          error: null, 
          lat: latitude, 
          lon: longitude,
          main: weatherMain,
          description: weatherDescription,
          icon: weatherIcon,
          location: location
        })
      }
    }
  })
})

app.listen(port, () => {
  console.log(`Listening port on http://localhost:${port}`)
})

