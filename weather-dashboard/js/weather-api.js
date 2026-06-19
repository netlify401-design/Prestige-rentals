/**
 * Weather API Integration
 * Uses OpenWeatherMap API
 */

const WEATHER_API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your OpenWeatherMap API key
const WEATHER_API_BASE = 'https://api.openweathermap.org';
const WEATHER_API_VERSION = '2.5';
const UNITS = 'metric'; // Use 'metric' for Celsius, 'imperial' for Fahrenheit

class WeatherAPI {
    constructor(apiKey = WEATHER_API_KEY) {
        this.apiKey = apiKey;
        this.baseUrl = `${WEATHER_API_BASE}/data/${WEATHER_API_VERSION}`;
    }
    
    /**
     * Get current weather by city name
     */
    async getCurrentWeatherByCity(city) {
        if (!this.apiKey || this.apiKey === 'YOUR_API_KEY_HERE') {
            throw new Error('API key not configured. Please add your OpenWeatherMap API key.');
        }
        
        const url = `${this.baseUrl}/weather?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=${UNITS}`;
        return this.fetchData(url);
    }
    
    /**
     * Get current weather by coordinates
     */
    async getCurrentWeatherByCoordinates(lat, lon) {
        if (!this.apiKey || this.apiKey === 'YOUR_API_KEY_HERE') {
            throw new Error('API key not configured.');
        }
        
        const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=${UNITS}`;
        return this.fetchData(url);
    }
    
    /**
     * Get 5-day forecast by city name
     */
    async getForecastByCity(city) {
        if (!this.apiKey || this.apiKey === 'YOUR_API_KEY_HERE') {
            throw new Error('API key not configured.');
        }
        
        const url = `${this.baseUrl}/forecast?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=${UNITS}`;
        return this.fetchData(url);
    }
    
    /**
     * Get 5-day forecast by coordinates
     */
    async getForecastByCoordinates(lat, lon) {
        if (!this.apiKey || this.apiKey === 'YOUR_API_KEY_HERE') {
            throw new Error('API key not configured.');
        }
        
        const url = `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=${UNITS}`;
        return this.fetchData(url);
    }
    
    /**
     * Search for cities
     */
    async searchCities(query) {
        if (!this.apiKey || this.apiKey === 'YOUR_API_KEY_HERE') {
            throw new Error('API key not configured.');
        }
        
        const url = `${WEATHER_API_BASE}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${this.apiKey}`;
        return this.fetchData(url);
    }
    
    /**
     * Fetch data from API with error handling
     */
    async fetchData(url) {
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Weather API Error:', error);
            throw error;
        }
    }
    
    /**
     * Get current weather and forecast together
     */
    async getCompleteWeatherData(city) {
        try {
            const [currentWeather, forecast] = await Promise.all([
                this.getCurrentWeatherByCity(city),
                this.getForecastByCity(city)
            ]);
            
            return {
                current: currentWeather,
                forecast: forecast
            };
        } catch (error) {
            console.error('Error fetching complete weather data:', error);
            throw error;
        }
    }
    
    /**
     * Get current weather and forecast by coordinates
     */
    async getCompleteWeatherDataByCoordinates(lat, lon) {
        try {
            const [currentWeather, forecast] = await Promise.all([
                this.getCurrentWeatherByCoordinates(lat, lon),
                this.getForecastByCoordinates(lat, lon)
            ]);
            
            return {
                current: currentWeather,
                forecast: forecast
            };
        } catch (error) {
            console.error('Error fetching complete weather data:', error);
            throw error;
        }
    }
}

// Create global instance
const weatherAPI = new WeatherAPI();
