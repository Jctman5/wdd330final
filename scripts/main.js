/**
 * ==========================================
 * GuitarKit Main Application
 * main.js
 * ==========================================
 */

import {
    searchChord,
    searchSong,
    getDailyChord,
    getScaleData,
    showLoader,
    hideLoader,
    searchMusic
} from "./api.js";

import {
    getFavorites,
    addFavorite,
    getHistory,
    addHistory,
    saveProgression
} from "./storage.js";

import {
    renderChordResults,
    renderSongResults,
    renderFavorites,
    renderHistory,
    renderScaleResults,
    renderDailyChord,
    renderProgression
} from "./renderer.js";

import {
    initializeTuner
} from "./tuner.js";

/* ==========================================
   DOM REFERENCES
   ========================================== */

const chordForm =
    document.querySelector("#chordSearchForm");

const chordInput =
    document.querySelector("#chordInput");

const chordResults =
    document.querySelector("#chordResults");

const loader =
    document.querySelector("#searchLoader");

const songForm =
    document.querySelector("#songSearchForm");

const songInput =
    document.querySelector("#songInput");

const songResults =
    document.querySelector("#songResults");

const favoritesContainer =
    document.querySelector(
        "#favoritesContainer"
    );

const historyContainer =
    document.querySelector(
        "#historyContainer"
    );

const dailyChordCard =
    document.querySelector(
        "#dailyChordCard"
    );

const dailyChallengeBtn =
    document.querySelector(
        "#dailyChallengeBtn"
    );

const progressionInput =
    document.querySelector(
        "#progressionInput"
    );

const addProgressionChordBtn =
    document.querySelector(
        "#addProgressionChordBtn"
    );

const saveProgressionBtn =
    document.querySelector(
        "#saveProgressionBtn"
    );

const progressionDisplay =
    document.querySelector(
        "#progressionDisplay"
    );

const keySelect =
    document.querySelector(
        "#keySelect"
    );

const scaleSelect =
    document.querySelector(
        "#scaleSelect"
    );

const generateScaleBtn =
    document.querySelector(
        "#generateScaleBtn"
    );

const scaleResults =
    document.querySelector(
        "#scaleResults"
    );

/* ==========================================
   APP STATE
   ========================================== */

let currentProgression = [];

/* ==========================================
   INITIALIZATION
   ========================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);

function initializeApp() {

    initializeTuner();

    renderFavorites(
        getFavorites(),
        favoritesContainer
    );

    renderHistory(
        getHistory(),
        historyContainer
    );

    loadDailyChallenge();

    registerEvents();
}

/* ==========================================
   EVENT REGISTRATION
   ========================================== */

function registerEvents() {

    chordForm.addEventListener(
        "submit",
        handleChordSearch
    );

    songForm.addEventListener(
        "submit",
        handleSongSearch
    );

    dailyChallengeBtn.addEventListener(
        "click",
        loadDailyChallenge
    );

    addProgressionChordBtn.addEventListener(
        "click",
        addChordToProgression
    );

    saveProgressionBtn.addEventListener(
        "click",
        saveCurrentProgression
    );

    generateScaleBtn.addEventListener(
        "click",
        generateScale
    );

    chordInput.addEventListener(
        "keypress",
        event => {

            if (
                event.key === "Enter"
            ) {
                handleChordSearch(
                    event
                );
            }
        }
    );

    document.addEventListener(
        "click",
        handleFavoriteClick
    );
}

/* ==========================================
   CHORD SEARCH
   ========================================== */

async function handleChordSearch(
    event
) {
    event.preventDefault();

    const query =
        chordInput.value.trim();

    if (!query) {
        return;
    }

    showLoader(loader);

    try {

        const results =
            await searchChord(
                query
            );

        renderChordResults(
            Array.isArray(results)
                ? results
                : [results],
            chordResults
        );

        addHistory(query);

        renderHistory(
            getHistory(),
            historyContainer
        );

    } catch (error) {

        console.error(
            error
        );

        chordResults.innerHTML =
            "<p>Error loading chord data.</p>";

    } finally {

        hideLoader(loader);
    }
}

/* ==========================================
   SONG SEARCH
   ========================================== */

async function handleSongSearch(event){

    event.preventDefault();


    const input =
        songInput.value.split("-");


    const artist =
        input[0].trim();


    const title =
        input[1].trim();



    try {


        const lyrics =
            await searchSong(
                artist,
                title
            );


        const music =
            await searchMusic(
                artist,
                title
            );


        renderSongResults(
            [
                {
                    title,
                    artist,
                    lyrics:
                    lyrics.lyrics ||
                    "No lyrics found.",
                    album:
                    music.results[0]
                    ?.collectionName ||
                    "Unknown",
                    image:
                    music.results[0]
                    ?.artworkUrl100
                }
            ],
            songResults
        );


    }
    catch(error){

        console.error(error);

    }

}

/* ==========================================
   FAVORITES
   ========================================== */

function handleFavoriteClick(
    event
) {

    const button =
        event.target.closest(
            ".favorite-btn"
        );

    if (!button) {
        return;
    }

    const chordName =
        button.dataset.id;

    addFavorite({
        id: chordName,
        name: chordName,
        type: "Chord"
    });

    renderFavorites(
        getFavorites(),
        favoritesContainer
    );
}

/* ==========================================
   DAILY CHALLENGE
   ========================================== */

function loadDailyChallenge() {

    const chord =
        getDailyChord();

    renderDailyChord(
        chord,
        dailyChordCard
    );
}

/* ==========================================
   PROGRESSION BUILDER
   ========================================== */

function addChordToProgression() {

    const chord =
        progressionInput.value.trim();

    if (!chord) {
        return;
    }

    currentProgression.push(
        chord
    );

    renderProgression(
        currentProgression,
        progressionDisplay
    );

    progressionInput.value = "";
}

function saveCurrentProgression() {

    if (
        !currentProgression.length
    ) {
        return;
    }

    saveProgression(
        currentProgression
    );

    alert(
        "Progression saved."
    );
}

/* ==========================================
   SCALE EXPLORER
   ========================================== */

function generateScale() {

    const key =
        keySelect.value;

    const scaleType =
        scaleSelect.value;

    const chords =
        getScaleData(
            key,
            scaleType
        );

    renderScaleResults(
        chords,
        scaleResults
    );
}

/* ==========================================
   DEBUG UTILITIES
   ========================================== */

window.GuitarKit = {

    showFavorites() {
        console.table(
            getFavorites()
        );
    },

    showHistory() {
        console.table(
            getHistory()
        );
    }
};

