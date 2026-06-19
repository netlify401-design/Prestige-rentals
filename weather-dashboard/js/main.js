/**
 * Weather Dashboard Main Application
 */

const DEFAULT_CITY = 'New York';
const AUTO_REFRESH_INTERVAL = 600000; // 10 minutes
const FAVORITES_KEY = 'weather_favorites';
const RECENT_KEY = 'weather_recent';
let autoRefreshTimer;

// Initialize the application
function init() {
    setupEventListeners();
    loadDefaultWeather();
    loadFavorites();
    loadRecentCities();
    startAutoRefresh();
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Search
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    // Search suggestions
    searchInput.addEventListener('input', debounce(handleSearchInput, 300));
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-box')) {
            weatherUI.hideSuggestions();
        }
    });
    
    // Suggestion click
    document.addEventListener('click', (e) => {
        if (e.target.closest('.suggestion-item')) {
            const city = e.target.closest('.suggestion-item').dataset.city;
            const country = e.target.closest('.suggestion-item').dataset.country;
            searchInput.value = `${city}, ${country}`;
            handleSearch();
            weatherUI.hideSuggestions();
        }
    });
    
    // Settings buttons
    document.getElementById('darkModeBtn').addEventListener('click', toggleDarkMode);
    document.getElementById('refreshBtn').addEventListener('click', () => {
        handleSearch();
    });
    
    // Share button
    document.getElementById('shareBtn').addEventListener('click', shareWeather);
    
    // Forecast card clicks
    document.addEventListener('click', (e) => {
        if (e.target.closest('.forecast-card')) {
            // Can add additional functionality here
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

/**
 * Handle search
 */
async function handleSearch() {
    const city = document.getElementById('searchInput').value.trim();
    
    if (!city) {
        weatherUI.showError('Please enter a city name');
        return;
    }
    
    try {
        weatherUI.showLoading();
        const weatherData = await weatherAPI.getCompleteWeatherData(city);
        
        weatherUI.updateCurrentWeather(weatherData.current);
        weatherUI.renderForecast(weatherData.forecast);
        
        // Add to recent cities
        addToRecentCities(weatherData.current.name);
        
        // Clear search suggestions
        weatherUI.hideSuggestions();
    } catch (error) {
        weatherUI.showError(error.message || 'Failed to fetch weather data');
    } finally {
        weatherUI.hideLoading();
    }
}

/**
 * Handle search input
 */
async function handleSearchInput(e) {
    const query = e.target.value.trim();
    
    if (query.length < 2) {
        weatherUI.hideSuggestions();
        return;
    }
    
    try {
        const suggestions = await weatherAPI.searchCities(query);
        const formattedSuggestions = suggestions.map(city => ({
            name: city.name,
            country: city.country || 'Unknown'
        }));
        weatherUI.updateSearchSuggestions(formattedSuggestions);
    } catch (error) {
        console.error('Search error:', error);
    }
}

/**
 * Load default weather
 */
async function loadDefaultWeather() {
    try {
        weatherUI.showLoading();
        const weatherData = await weatherAPI.getCompleteWeatherData(DEFAULT_CITY);
        weatherUI.updateCurrentWeather(weatherData.current);
        weatherUI.renderForecast(weatherData.forecast);
        document.getElementById('searchInput').value = DEFAULT_CITY;
    } catch (error) {
        weatherUI.showError(error.message || 'Failed to load weather');
    } finally {
        weatherUI.hideLoading();
    }
}

/**
 * Add to favorites
 */
function addToFavorites(city) {
    const favorites = getFromLocalStorage(FAVORITES_KEY) || [];
    
    if (!favorites.includes(city)) {
        favorites.push(city);
        saveToLocalStorage(FAVORITES_KEY, favorites);
        loadFavorites();
    }
}

/**
 * Remove from favorites
 */
function removeFromFavorites(city) {
    const favorites = getFromLocalStorage(FAVORITES_KEY) || [];
    const filtered = favorites.filter(fav => fav !== city);
    saveToLocalStorage(FAVORITES_KEY, filtered);
    loadFavorites();
}

/**
 * Load favorites
 */
function loadFavorites() {
    const favorites = getFromLocalStorage(FAVORITES_KEY) || [];
    const favoritesList = document.getElementById('favoritesList');
    
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p class="no-favorites">No favorites yet. Add one!</p>';
        return;
    }
    
    favoritesList.innerHTML = favorites.map(city => `
        <div class="favorite-item" data-city="${city}">
            <span>${city}</span>
            <button class="remove-favorite" data-city="${city}">×</button>
        </div>
    `).join('');
    
    // Add event listeners
    document.querySelectorAll('.favorite-item').forEach(item => {
        item.addEventListener('click', () => {
            document.getElementById('searchInput').value = item.dataset.city;
            handleSearch();
        });
    });
    
    document.querySelectorAll('.remove-favorite').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeFromFavorites(btn.dataset.city);
        });
    });
}

/**
 * Add to recent cities
 */
function addToRecentCities(city) {
    const recent = getFromLocalStorage(RECENT_KEY) || [];
    
    // Remove if already exists
    const filtered = recent.filter(c => c !== city);
    
    // Add to beginning
    filtered.unshift(city);
    
    // Keep only 5 recent
    if (filtered.length > 5) {
        filtered.pop();
    }
    
    saveToLocalStorage(RECENT_KEY, filtered);
    loadRecentCities();
}

/**
 * Load recent cities
 */
function loadRecentCities() {
    const recent = getFromLocalStorage(RECENT_KEY) || [];
    const recentList = document.getElementById('recentList');
    
    if (recent.length === 0) {
        recentList.innerHTML = '<p class="no-recent">No history yet</p>';
        return;
    }
    
    recentList.innerHTML = recent.map(city => `
        <div class="recent-item" data-city="${city}">
            <span>${city}</span>
        </div>
    `).join('');
    
    document.querySelectorAll('.recent-item').forEach(item => {
        item.addEventListener('click', () => {
            document.getElementById('searchInput').value = item.dataset.city;
            handleSearch();
        });
    });
}

/**
 * Toggle dark mode
 */
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    saveToLocalStorage('dark_mode', isDarkMode);
}

/**
 * Load dark mode preference
 */
function loadDarkModePreference() {
    const isDarkMode = getFromLocalStorage('dark_mode');
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
}

/**
 * Share weather
 */
function shareWeather() {
    const location = document.getElementById('locationName').textContent;
    const temp = document.getElementById('temperature').textContent;
    const description = document.getElementById('weatherDescription').textContent;
    const text = `Current weather in ${location}: ${temp} and ${description}. Check the Weather Dashboard!`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Weather Dashboard',
            text: text,
            url: window.location.href
        }).catch(err => console.log('Share error:', err));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(text).then(() => {
            weatherUI.showError('Weather info copied to clipboard!');
        });
    }
}

/**
 * Start auto-refresh
 */
function startAutoRefresh() {
    autoRefreshTimer = setInterval(() => {
        const city = document.getElementById('searchInput').value;
        if (city) {
            handleSearch();
        }
    }, AUTO_REFRESH_INTERVAL);
}

/**
 * Handle keyboard shortcuts
 */
function handleKeyboardShortcuts(e) {
    // D: Dark mode
    if (e.key.toLowerCase() === 'd' && !e.ctrlKey && !e.metaKey) {
        toggleDarkMode();
    }
    // R: Refresh
    if (e.key.toLowerCase() === 'r' && !e.ctrlKey && !e.metaKey) {
        handleSearch();
    }
    // F: Favorite
    if (e.key.toLowerCase() === 'f' && !e.ctrlKey && !e.metaKey) {
        const city = document.getElementById('searchInput').value;
        if (city) {
            addToFavorites(city);
        }
    }
}

// Load dark mode preference on startup
loadDarkModePreference();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
