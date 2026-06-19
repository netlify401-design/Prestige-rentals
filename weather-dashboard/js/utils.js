/**
 * Utility Functions for Weather Dashboard
 */

// Format timestamp to readable date
function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Format timestamp to time
function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// Get weather icon class based on weather condition
function getWeatherIcon(weatherMain, isDaytime = true) {
    const iconMap = {
        'Clear': isDaytime ? 'wi-day-sunny' : 'wi-night-clear',
        'Clouds': isDaytime ? 'wi-day-cloudy' : 'wi-night-cloudy',
        'Rain': 'wi-rain',
        'Drizzle': 'wi-sprinkle',
        'Thunderstorm': 'wi-thunderstorm',
        'Snow': 'wi-snow',
        'Mist': 'wi-fog',
        'Smoke': 'wi-smoke',
        'Haze': 'wi-haze',
        'Dust': 'wi-dust',
        'Fog': 'wi-fog',
        'Sand': 'wi-sandstorm',
        'Ash': 'wi-volcano',
        'Squall': 'wi-strong-wind',
        'Tornado': 'wi-tornado'
    };
    
    return iconMap[weatherMain] || (isDaytime ? 'wi-day-sunny' : 'wi-night-clear');
}

// Get background gradient based on weather
function getWeatherGradient(weatherMain) {
    const gradients = {
        'Clear': 'clear-sky',
        'Clouds': 'cloudy',
        'Rain': 'rainy',
        'Drizzle': 'rainy',
        'Thunderstorm': 'rainy',
        'Snow': 'snowy',
        'Mist': 'cloudy',
        'Smoke': 'cloudy',
        'Haze': 'cloudy',
        'Dust': 'cloudy',
        'Fog': 'cloudy',
        'Sand': 'cloudy',
        'Ash': 'cloudy',
        'Squall': 'rainy',
        'Tornado': 'rainy'
    };
    
    return gradients[weatherMain] || 'clear-sky';
}

// Debounce function
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Save to localStorage
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('LocalStorage save error:', error);
    }
}

// Get from localStorage
function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('LocalStorage get error:', error);
        return null;
    }
}

// Remove from localStorage
function removeFromLocalStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('LocalStorage remove error:', error);
    }
}

// Get geolocation
function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
        } else {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                },
                (error) => {
                    reject(new Error(`Geolocation error: ${error.message}`));
                }
            );
        }
    });
}

// Format string
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Round temperature
function roundTemp(temp) {
    return Math.round(temp);
}

// Convert Celsius to Fahrenheit
function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

// Convert Celsius to Kelvin
function celsiusToKelvin(celsius) {
    return celsius + 273.15;
}

// Get time of day
function getTimeOfDay(timestamp, timezone = 0) {
    const date = new Date((timestamp + timezone) * 1000);
    const hour = date.getUTCHours();
    
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
}

// Check if it's daytime
function isDaytime(sunrise, sunset, currentTime = Date.now() / 1000) {
    return currentTime >= sunrise && currentTime < sunset;
}
