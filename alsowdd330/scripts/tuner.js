/**
 * ==========================================
 * GuitarKit Tuner Module
 * tuner.js
 * ==========================================
 *
 * Uses Web Audio API to generate
 * tuning reference tones.
 *
 * Features:
 * - Standard Tuning
 * - Drop D
 * - Open G
 * - DADGAD
 * - Tone playback
 * - Stop playback
 */

/* ==========================================
   AUDIO CONTEXT
   ========================================== */

let audioContext = null;
let oscillator = null;

/**
 * Initialize Audio Context
 */
function initializeAudio() {
    if (!audioContext) {
        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();
    }
}

/* ==========================================
   STANDARD TUNING
   ========================================== */

export const standardTuning = {
    E2: 82.41,
    A2: 110.0,
    D3: 146.83,
    G3: 196.0,
    B3: 246.94,
    E4: 329.63
};

/* ==========================================
   DROP D
   ========================================== */

export const dropDTuning = {
    D2: 73.42,
    A2: 110.0,
    D3: 146.83,
    G3: 196.0,
    B3: 246.94,
    E4: 329.63
};

/* ==========================================
   OPEN G
   ========================================== */

export const openGTuning = {
    D2: 73.42,
    G2: 98.0,
    D3: 146.83,
    G3: 196.0,
    B3: 246.94,
    D4: 293.66
};

/* ==========================================
   DADGAD
   ========================================== */

export const dadgadTuning = {
    D2: 73.42,
    A2: 110.0,
    D3: 146.83,
    G3: 196.0,
    A3: 220.0,
    D4: 293.66
};

/* ==========================================
   PLAY TONE
   ========================================== */

/**
 * Play a guitar tuning note.
 *
 * @param {number} frequency
 * @param {number} duration
 */
export function playTone(
    frequency,
    duration = 2
) {
    initializeAudio();

    stopTone();

    oscillator =
        audioContext.createOscillator();

    const gainNode =
        audioContext.createGain();

    oscillator.type = "sine";

    oscillator.frequency.value =
        frequency;

    oscillator.connect(gainNode);

    gainNode.connect(
        audioContext.destination
    );

    gainNode.gain.setValueAtTime(
        0.3,
        audioContext.currentTime
    );

    gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + duration
    );

    oscillator.start();

    oscillator.stop(
        audioContext.currentTime +
        duration
    );
}

/* ==========================================
   STOP TONE
   ========================================== */

/**
 * Stop currently playing tone.
 */
export function stopTone() {
    try {
        if (oscillator) {
            oscillator.stop();
            oscillator.disconnect();
            oscillator = null;
        }
    } catch (error) {
        console.warn(
            "Oscillator already stopped."
        );
    }
}

/* ==========================================
   PLAY STRING
   ========================================== */

/**
 * Play note from tuning object.
 *
 * Example:
 * playString("E2")
 *
 * @param {string} note
 * @param {object} tuning
 */
export function playString(
    note,
    tuning = standardTuning
) {
    const frequency =
        tuning[note];

    if (!frequency) {
        console.error(
            `Unknown note: ${note}`
        );

        return;
    }

    playTone(frequency);
}

/* ==========================================
   PLAY FULL TUNING
   ========================================== */

/**
 * Sequentially plays
 * all strings.
 *
 * @param {object} tuning
 */
export async function playTuning(
    tuning = standardTuning
) {
    const notes =
        Object.values(tuning);

    for (const frequency of notes) {

        playTone(
            frequency,
            0.8
        );

        await delay(1000);
    }
}

/* ==========================================
   DELAY HELPER
   ========================================== */

function delay(ms) {
    return new Promise(
        resolve =>
            setTimeout(resolve, ms)
    );
}

/* ==========================================
   GET TUNING BY NAME
   ========================================== */

/**
 * Returns tuning object.
 *
 * @param {string} tuningName
 * @returns {object}
 */
export function getTuning(
    tuningName
) {
    switch (
        tuningName.toLowerCase()
    ) {

        case "dropd":
            return dropDTuning;

        case "openg":
            return openGTuning;

        case "dadgad":
            return dadgadTuning;

        case "standard":
        default:
            return standardTuning;
    }
}

/* ==========================================
   ATTACH BUTTON EVENTS
   ========================================== */

/**
 * Automatically wire tuner buttons.
 *
 * Expects:
 * data-frequency="82.41"
 */
export function initializeTuner() {

    const buttons =
        document.querySelectorAll(
            ".tuner-btn"
        );

    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const frequency =
                    Number(
                        button.dataset.frequency
                    );

                playTone(
                    frequency
                );

                button.classList.add(
                    "active"
                );

                setTimeout(() => {
                    button.classList.remove(
                        "active"
                    );
                }, 500);
            }
        );
    });
}

/* ==========================================
   EXPORTS
   ========================================== */

export default {
    playTone,
    stopTone,
    playString,
    playTuning,
    getTuning,
    initializeTuner
};

