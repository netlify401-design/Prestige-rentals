# Weather Dashboard

A modern, responsive weather dashboard that fetches real-time weather data from OpenWeatherMap API. Display current conditions, forecasts, and detailed weather information for any location.

## Features

- 🌡️ **Real-time Weather Data** - Current temperature, humidity, wind speed
- 📍 **Location Search** - Search weather by city name
- 📅 **5-Day Forecast** - Extended weather forecast
- 🎨 **Dynamic UI** - Weather-based background themes
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🌙 **Dark Mode** - Easy on the eyes
- 🔄 **Auto-refresh** - Updates weather every 10 minutes
- 📊 **Detailed Metrics** - UV index, visibility, pressure, feels like

## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **API:** OpenWeatherMap API
- **Storage:** Local Storage for favorites
- **Icons:** Weather Icons CDN

## Project Structure

```
weather-dashboard/
├── index.html          # Main dashboard page
├── css/
│   ├── style.css       # Main styles
│   └── responsive.css  # Mobile responsive styles
├── js/
│   ├── main.js         # Main application logic
│   ├── weather-api.js  # API integration
│   ├── ui.js           # UI rendering functions
│   └── utils.js        # Utility functions
├── assets/
│   └── weather-icons/  # Weather condition icons
├── data/
│   └── cities.json     # Popular cities data
└── README.md           # This file
```

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- OpenWeatherMap API key (free tier available)

### Installation

1. Clone the repository
```bash
git clone https://github.com/netlify401-design/Prestige-rentals.git
cd Prestige-rentals/weather-dashboard
```

2. Get your API key
   - Visit https://openweathermap.org/api
   - Sign up for a free account
   - Generate your API key

3. Update the API key
   - Open `js/weather-api.js`
   - Replace `YOUR_API_KEY_HERE` with your actual API key

4. Open in browser
```bash
# Option 1: Direct file
open index.html

# Option 2: Using Python
python -m http.server 8000
# Then visit http://localhost:8000

# Option 3: Using Node.js
npx http-server
```

## Usage

### Search for Weather
1. Enter a city name in the search box
2. Press Enter or click the search button
3. View current weather and 5-day forecast

### Add to Favorites
1. Click the ⭐ icon to favorite a location
2. View favorites from the sidebar
3. Click favorites to quickly switch locations

### View Details
- Hover over forecast cards to see more details
- Check the "Details" section for extended metrics
- Toggle dark mode with the moon icon

## API Integration

### OpenWeatherMap API

**Current Weather Endpoint:**
```
https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric
```

**Forecast Endpoint:**
```
https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric
```

**Geocoding Endpoint:**
```
https://api.openweathermap.org/geo/1.0/direct?q={city}&limit=5&appid={API_KEY}
```

## Response Example

```json
{
  "coord": {"lon": -74.006, "lat": 40.7143},
  "weather": [{"id": 800, "main": "Clear", "description": "clear sky"}],
  "main": {
    "temp": 22.5,
    "feels_like": 21.8,
    "temp_min": 20.1,
    "temp_max": 24.3,
    "pressure": 1013,
    "humidity": 65
  },
  "wind": {"speed": 3.5, "deg": 230},
  "clouds": {"all": 10},
  "visibility": 10000,
  "name": "New York"
}
```

## Configuration

### Update Refresh Interval
In `js/main.js`, change the auto-refresh interval:
```javascript
const AUTO_REFRESH_INTERVAL = 600000; // 10 minutes in milliseconds
```

### Temperature Units
Change between Celsius, Fahrenheit, and Kelvin:
```javascript
const TEMPERATURE_UNIT = 'metric'; // 'metric' for Celsius, 'imperial' for Fahrenheit
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Search for weather |
| `D` | Toggle dark mode |
| `F` | Favorite current location |
| `R` | Refresh weather data |
| `Esc` | Clear search |

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### "Invalid API Key" Error
- Verify your API key is correct
- Check that it's activated in your OpenWeatherMap account
- Wait a few minutes if just created

### "Location Not Found"
- Check city spelling
- Use city, country format (e.g., "London, UK")
- Some small cities may not be available

### Slow Loading
- Check your internet connection
- Verify API rate limits haven't been exceeded
- Clear browser cache (Ctrl+Shift+Delete)

### CORS Errors
- Use a CORS proxy or
- Host on a web server instead of opening as file://

## Performance Tips

- Use the free tier API key for personal projects
- Implement caching to reduce API calls
- Use local storage for favorite locations
- Compress images for faster loading

## Future Enhancements

- [ ] Hourly forecast breakdown
- [ ] Weather alerts and warnings
- [ ] Air quality index (AQI)
- [ ] Pollen count information
- [ ] Weather maps integration
- [ ] Historical weather data
- [ ] Multiple location comparison
- [ ] Weather notifications
- [ ] Offline mode with cached data
- [ ] PWA installation support

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Visit OpenWeatherMap API docs

## Credits

- Weather data: [OpenWeatherMap](https://openweathermap.org/)
- Icons: [Weather Icons](https://erikflowers.github.io/weather-icons/)
- Inspiration: Modern weather apps

---

**Happy weather tracking! 🌤️**
