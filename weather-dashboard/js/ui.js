/**
 * UI Rendering Functions for Weather Dashboard
 */

class WeatherUI {
    constructor() {
        this.currentWeatherCard = document.querySelector('.current-weather-card');
        this.forecastCards = document.getElementById('forecastCards');
        this.locationName = document.getElementById('locationName');
        this.lastUpdate = document.getElementById('lastUpdate');
        this.mainContent = document.querySelector('.main-content');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.errorToast = document.getElementById('errorToast');
        this.errorMessage = document.getElementById('errorMessage');
    }
    
    /**
     * Update current weather display
     */
    updateCurrentWeather(data) {
        const temp = roundTemp(data.main.temp);
        const feelsLike = roundTemp(data.main.feels_like);
        const weatherMain = data.weather[0].main;
        const description = data.weather[0].description;
        
        // Update location and time
        this.locationName.textContent = `${data.name}, ${data.sys.country}`;
        this.lastUpdate.textContent = `Updated ${formatTime(Date.now() / 1000)}`;
        
        // Update weather icon and description
        const isDaytime = data.dt > data.sys.sunrise && data.dt < data.sys.sunset;
        const iconClass = getWeatherIcon(weatherMain, isDaytime);
        document.getElementById('weatherIcon').className = `wi ${iconClass}`;
        document.getElementById('weatherDescription').textContent = capitalize(description);
        
        // Update temperatures
        document.getElementById('temperature').textContent = `${temp}°`;
        document.getElementById('feelsLike').textContent = `${feelsLike}°`;
        document.getElementById('minTemp').textContent = `${roundTemp(data.main.temp_min)}°`;
        document.getElementById('maxTemp').textContent = `${roundTemp(data.main.temp_max)}°`;
        
        // Update weather details
        document.getElementById('humidity').textContent = `${data.main.humidity}%`;
        document.getElementById('windSpeed').textContent = `${data.wind.speed.toFixed(1)} m/s`;
        document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
        document.getElementById('visibility').textContent = `${(data.visibility / 1000).toFixed(1)} km`;
        document.getElementById('cloudCoverage').textContent = `${data.clouds.all}%`;
        document.getElementById('precipitation').textContent = `${(data.rain?.['1h'] || 0).toFixed(1)} mm`;
        
        // Update sunrise and sunset
        document.getElementById('sunrise').textContent = formatTime(data.sys.sunrise);
        document.getElementById('sunset').textContent = formatTime(data.sys.sunset);
        
        // Update background gradient
        const gradientClass = getWeatherGradient(weatherMain);
        this.mainContent.className = `main-content ${gradientClass}`;
    }
    
    /**
     * Render forecast cards
     */
    renderForecast(forecastData) {
        const dailyForecasts = {};
        
        // Group forecast by day
        forecastData.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const day = date.toLocaleDateString('en-US');
            
            if (!dailyForecasts[day]) {
                dailyForecasts[day] = [];
            }
            dailyForecasts[day].push(item);
        });
        
        // Get one forecast per day (noon)
        const dailyForcastArray = Object.entries(dailyForecasts)
            .slice(0, 5)
            .map(([date, forecasts]) => {
                // Find forecast closest to noon (12:00)
                let bestForecast = forecasts[0];
                for (let forecast of forecasts) {
                    const hour = new Date(forecast.dt * 1000).getHours();
                    if (Math.abs(hour - 12) < Math.abs(new Date(bestForecast.dt * 1000).getHours() - 12)) {
                        bestForecast = forecast;
                    }
                }
                return { date, forecast: bestForecast };
            });
        
        // Render forecast cards
        this.forecastCards.innerHTML = dailyForcastArray.map(({ date, forecast }) => {
            const temp = roundTemp(forecast.main.temp);
            const minTemp = roundTemp(forecast.main.temp_min);
            const maxTemp = roundTemp(forecast.main.temp_max);
            const weatherMain = forecast.weather[0].main;
            const description = forecast.weather[0].description;
            const icon = getWeatherIcon(weatherMain, true);
            
            const forecastDate = new Date(forecast.dt * 1000);
            const dayName = forecastDate.toLocaleDateString('en-US', { weekday: 'short' });
            
            return `
                <div class="forecast-card">
                    <div class="forecast-day">${dayName}</div>
                    <div class="forecast-icon">
                        <i class="wi ${icon}"></i>
                    </div>
                    <div class="forecast-temp">
                        <span class="forecast-temp-high">${maxTemp}°</span>
                        <span class="forecast-temp-low">${minTemp}°</span>
                    </div>
                    <div class="forecast-condition">${capitalize(description)}</div>
                </div>
            `;
        }).join('');
    }
    
    /**
     * Show loading spinner
     */
    showLoading() {
        this.loadingSpinner.classList.add('show');
    }
    
    /**
     * Hide loading spinner
     */
    hideLoading() {
        this.loadingSpinner.classList.remove('show');
    }
    
    /**
     * Show error toast
     */
    showError(message) {
        this.errorMessage.textContent = message;
        this.errorToast.classList.add('show');
        
        setTimeout(() => {
            this.errorToast.classList.remove('show');
        }, 5000);
    }
    
    /**
     * Update search suggestions
     */
    updateSearchSuggestions(suggestions) {
        const suggestionsContainer = document.getElementById('searchSuggestions');
        
        if (suggestions.length === 0) {
            suggestionsContainer.classList.remove('show');
            return;
        }
        
        suggestionsContainer.innerHTML = suggestions.map(city => `
            <div class="suggestion-item" data-city="${city.name}" data-country="${city.country}">
                ${city.name}, ${city.country}
            </div>
        `).join('');
        
        suggestionsContainer.classList.add('show');
    }
    
    /**
     * Hide search suggestions
     */
    hideSuggestions() {
        document.getElementById('searchSuggestions').classList.remove('show');
    }
}

// Create global UI instance
const weatherUI = new WeatherUI();
