/**
 * ==========================================
 * GuitarKit Storage Module
 * storage.js
 * ==========================================
 *
 * Handles:
 * - Favorites
 * - Search History
 * - Progressions
 * - Theme Preferences
 * - Daily Chord Cache
 */

/* ==========================================
   STORAGE KEYS
   ========================================== */

const FAVORITES_KEY = "guitarkit-favorites";
const HISTORY_KEY = "guitarkit-history";
const PROGRESSIONS_KEY = "guitarkit-progressions";
const THEME_KEY = "guitarkit-theme";
const DAILY_KEY = "guitarkit-daily";

/* ==========================================
   GENERIC HELPERS
   ========================================== */

/**
 * Save data to localStorage.
 *
 * @param {string} key
 * @param {*} value
 */
function save(key, value) {
    localStorage.setItem(
        key,
        JSON.stringify(value)
    );
}

/**
 * Retrieve data from localStorage.
 *
 * @param {string} key
 * @param {*} defaultValue
 * @returns {*}
 */
function load(key, defaultValue = []) {
    const data =
        localStorage.getItem(key);

    if (!data) {
        return defaultValue;
    }

    try {
        return JSON.parse(data);
    } catch (error) {
        console.error(
            "Storage parse error:",
            error
        );

        return defaultValue;
    }
}

/* ==========================================
   FAVORITES
   ========================================== */

/**
 * Get all favorites.
 *
 * @returns {Array}
 */
export function getFavorites() {
    return load(FAVORITES_KEY);
}

/**
 * Save a favorite chord/song.
 *
 * @param {object} item
 */
export function addFavorite(item) {
    const favorites =
        getFavorites();

    const exists =
        favorites.some(
            favorite =>
                favorite.id === item.id
        );

    if (!exists) {
        favorites.push(item);

        save(
            FAVORITES_KEY,
            favorites
        );
    }
}

/**
 * Remove favorite.
 *
 * @param {string} id
 */
export function removeFavorite(id) {
    const favorites =
        getFavorites();

    const updated =
        favorites.filter(
            item => item.id !== id
        );

    save(
        FAVORITES_KEY,
        updated
    );
}

/**
 * Check if item is favorite.
 *
 * @param {string} id
 * @returns {boolean}
 */
export function isFavorite(id) {
    const favorites =
        getFavorites();

    return favorites.some(
        item => item.id === id
    );
}

/* ==========================================
   SEARCH HISTORY
   ========================================== */

/**
 * Get search history.
 *
 * @returns {Array}
 */
export function getHistory() {
    return load(HISTORY_KEY);
}

/**
 * Add search term.
 *
 * @param {string} term
 */
export function addHistory(term) {
    let history =
        getHistory();

    history =
        history.filter(
            item => item !== term
        );

    history.unshift(term);

    if (history.length > 10) {
        history = history.slice(0, 10);
    }

    save(HISTORY_KEY, history);
}

/**
 * Clear search history.
 */
export function clearHistory() {
    localStorage.removeItem(
        HISTORY_KEY
    );
}

/* ==========================================
   PROGRESSIONS
   ========================================== */

/**
 * Retrieve saved progressions.
 *
 * @returns {Array}
 */
export function getProgressions() {
    return load(PROGRESSIONS_KEY);
}

/**
 * Save progression.
 *
 * @param {Array} progression
 */
export function saveProgression(
    progression
) {
    const progressions =
        getProgressions();

    progressions.push({
        id: Date.now(),
        chords: progression,
        created:
            new Date().toLocaleDateString()
    });

    save(
        PROGRESSIONS_KEY,
        progressions
    );
}

/**
 * Delete progression.
 *
 * @param {number} id
 */
export function deleteProgression(
    id
) {
    const progressions =
        getProgressions();

    const updated =
        progressions.filter(
            progression =>
                progression.id !== id
        );

    save(
        PROGRESSIONS_KEY,
        updated
    );
}

/* ==========================================
   THEME SETTINGS
   ========================================== */

/**
 * Save theme preference.
 *
 * @param {string} theme
 */
export function saveTheme(theme) {
    localStorage.setItem(
        THEME_KEY,
        theme
    );
}

/**
 * Get theme preference.
 *
 * @returns {string}
 */
export function getTheme() {
    return (
        localStorage.getItem(
            THEME_KEY
        ) || "dark"
    );
}

/* ==========================================
   DAILY CHORD
   ========================================== */

/**
 * Save daily chord.
 *
 * @param {object} chord
 */
export function saveDailyChord(
    chord
) {
    save(
        DAILY_KEY,
        chord
    );
}

/**
 * Retrieve daily chord.
 *
 * @returns {object|null}
 */
export function getDailyChord() {
    return load(
        DAILY_KEY,
        null
    );
}

/* ==========================================
   RESET STORAGE
   ========================================== */

/**
 * Clear all GuitarKit storage.
 */
export function clearAllData() {

    localStorage.removeItem(
        FAVORITES_KEY
    );

    localStorage.removeItem(
        HISTORY_KEY
    );

    localStorage.removeItem(
        PROGRESSIONS_KEY
    );

    localStorage.removeItem(
        THEME_KEY
    );

    localStorage.removeItem(
        DAILY_KEY
    );

    console.log(
        "GuitarKit storage cleared."
    );
}

/* ==========================================
   STORAGE STATS
   ========================================== */

/**
 * Useful for debugging.
 *
 * @returns {object}
 */
export function getStorageStats() {

    return {
        favorites:
            getFavorites().length,

        history:
            getHistory().length,

        progressions:
            getProgressions().length,

        theme:
            getTheme(),

        dailyChord:
            getDailyChord()
    };
}
