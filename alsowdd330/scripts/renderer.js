/**
 * ==========================================
 * GuitarKit Renderer Module
 * renderer.js
 * ==========================================
 *
 * Responsible for:
 * - Chord Cards
 * - Song Cards
 * - SVG Fretboards
 * - Favorites
 * - Search History
 * - Scale Results
 */

/* ==========================================
   DOM HELPERS
   ========================================== */

/**
 * Clear container content.
 *
 * @param {HTMLElement} container
 */
export function clearContainer(container) {
    container.innerHTML = "";
}

/**
 * Create element helper.
 *
 * @param {string} tag
 * @param {string} className
 * @returns {HTMLElement}
 */
export function createElement(
    tag,
    className = ""
) {
    const element =
        document.createElement(tag);

    if (className) {
        element.className = className;
    }

    return element;
}

/* ==========================================
   SVG FRETBOARD
   ========================================== */

/**
 * Creates a simple SVG chord diagram.
 *
 * Expected JSON:
 *
 * {
 *   frets:[0,1,2,2,0,0]
 * }
 *
 * @param {Array} frets
 * @returns {string}
 */
export function createChordDiagram(
    frets = []
) {
    const stringSpacing = 25;
    const fretSpacing = 25;

    let circles = "";

    frets.forEach(
        (fret, index) => {
            if (fret > 0) {
                circles += `
                    <circle
                        cx="${
                            20 +
                            index *
                            stringSpacing
                        }"
                        cy="${
                            20 +
                            fret *
                            fretSpacing
                        }"
                        r="8"
                        fill="#E94560"
                    />
                `;
            }
        }
    );

    return `
        <svg
            width="180"
            height="160"
            viewBox="0 0 180 160"
            aria-label="Chord Diagram"
        >

            <!-- Strings -->
            <line x1="20" y1="20" x2="20" y2="140" stroke="white"/>
            <line x1="45" y1="20" x2="45" y2="140" stroke="white"/>
            <line x1="70" y1="20" x2="70" y2="140" stroke="white"/>
            <line x1="95" y1="20" x2="95" y2="140" stroke="white"/>
            <line x1="120" y1="20" x2="120" y2="140" stroke="white"/>
            <line x1="145" y1="20" x2="145" y2="140" stroke="white"/>

            <!-- Frets -->
            <line x1="20" y1="20" x2="145" y2="20" stroke="white"/>
            <line x1="20" y1="45" x2="145" y2="45" stroke="white"/>
            <line x1="20" y1="70" x2="145" y2="70" stroke="white"/>
            <line x1="20" y1="95" x2="145" y2="95" stroke="white"/>
            <line x1="20" y1="120" x2="145" y2="120" stroke="white"/>

            ${circles}

        </svg>
    `;
}

/* ==========================================
   CHORD CARD
   ========================================== */

/**
 * Create chord card.
 *
 * @param {object} chord
 * @returns {HTMLElement}
 */
export function createChordCard(
    chord
) {
    const card =
        createElement(
            "article",
            "chord-card"
        );

    const chordName =
        chord.chord ||
        chord.name ||
        "Unknown";

    const diagram =
        createChordDiagram(
            chord.frets || []
        );

    card.innerHTML = `
        <h3 class="chord-name">
            ${chordName}
        </h3>

        ${diagram}

        <p>
            Type:
            ${chord.type || "N/A"}
        </p>

        <p>
            Key:
            ${chord.key || "N/A"}
        </p>

        <button
            class="favorite-btn"
            data-id="${chordName}"
        >
            ★
        </button>
    `;

    return card;
}

/* ==========================================
   CHORD RESULTS
   ========================================== */

/**
 * Render chord results.
 *
 * @param {Array} chords
 * @param {HTMLElement} container
 */
export function renderChordResults(
    chords,
    container
) {
    clearContainer(container);

    if (!chords.length) {
        container.innerHTML =
            "<p>No chords found.</p>";
        return;
    }

    chords.forEach(chord => {
        const card =
            createChordCard(chord);

        container.appendChild(card);
    });
}

/* ==========================================
   SONG CARD
   ========================================== */

/**
 * Create song card.
 *
 * @param {object} song
 * @returns {HTMLElement}
 */
export function createSongCard(
    song
) {
    const card =
        createElement(
            "article",
            "song-card"
        );

    card.innerHTML = `
        <h3>
            ${song.title || "Song"}
        </h3>

        <p>
            ${song.artist || ""}
        </p>

        <pre>
${song.lyrics || "Lyrics unavailable"}
        </pre>
    `;

    return card;
}

/* ==========================================
   SONG RESULTS
   ========================================== */

/**
 * Render songs.
 *
 * @param {Array} songs
 * @param {HTMLElement} container
 */
export function renderSongResults(
    songs,
    container
) {
    clearContainer(container);

    songs.forEach(song => {
        container.appendChild(
            createSongCard(song)
        );
    });
}

/* ==========================================
   FAVORITES
   ========================================== */

/**
 * Render favorites list.
 *
 * @param {Array} favorites
 * @param {HTMLElement} container
 */
export function renderFavorites(
    favorites,
    container
) {
    clearContainer(container);

    if (!favorites.length) {
        container.innerHTML =
            "<p>No favorites saved.</p>";
        return;
    }

    favorites.forEach(item => {

        const card =
            createElement(
                "div",
                "chord-card"
            );

        card.innerHTML = `
            <h3>
                ${item.name}
            </h3>

            <p>
                ${item.type || ""}
            </p>
        `;

        container.appendChild(card);
    });
}

/* ==========================================
   SEARCH HISTORY
   ========================================== */

/**
 * Render history.
 *
 * @param {Array} history
 * @param {HTMLElement} container
 */
export function renderHistory(
    history,
    container
) {
    clearContainer(container);

    if (!history.length) {
        container.innerHTML =
            "<p>No search history.</p>";
        return;
    }

    const ul =
        createElement("ul");

    history.forEach(term => {

        const li =
            createElement("li");

        li.textContent = term;

        ul.appendChild(li);
    });

    container.appendChild(ul);
}

/* ==========================================
   SCALE RESULTS
   ========================================== */

/**
 * Render scale data.
 *
 * @param {Array} chords
 * @param {HTMLElement} container
 */
export function renderScaleResults(
    chords,
    container
) {
    clearContainer(container);

    const heading =
        createElement("h3");

    heading.textContent =
        "Scale Chords";

    container.appendChild(
        heading
    );

    const list =
        createElement("ul");

    chords.forEach(chord => {

        const item =
            createElement("li");

        item.textContent =
            chord;

        list.appendChild(item);
    });

    container.appendChild(list);
}

/* ==========================================
   DAILY CHORD
   ========================================== */

/**
 * Render daily challenge.
 *
 * @param {object} chord
 * @param {HTMLElement} container
 */
export function renderDailyChord(
    chord,
    container
) {
    container.innerHTML = `
        <h3>
            Today's Chord
        </h3>

        <p>
            ${chord.chord}
        </p>
    `;
}

/* ==========================================
   PROGRESSION DISPLAY
   ========================================== */

/**
 * Render progression builder.
 *
 * @param {Array} progression
 * @param {HTMLElement} container
 */
export function renderProgression(
    progression,
    container
) {
    clearContainer(container);

    progression.forEach(chord => {

        const item =
            createElement(
                "div",
                "progression-item"
            );

        item.textContent =
            chord;

        container.appendChild(item);
    });
}
