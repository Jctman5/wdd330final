/**
 * ==========================================
 * GuitarKit API Module
 * api.js
 * ==========================================
 *
 * External APIs:
 *
 * 1. Guitar Chord API
 * 2. Lyrics.ovh API
 *
 * Includes JSON fallback.
 */


const LOCAL_CHORD_DATA =
    "./data/chords.json";


/**
 * Generic fetch helper
 */

async function requestJSON(url) {

    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            `Request failed: ${response.status}`
        );
    }


    return await response.json();
}



/**
 * ==========================================
 * CHORD API
 * ==========================================
 */


/*
 Primary API:
 Uberchord API
*/




export async function searchChord(chordName){

    try {

        const chords =
            await requestJSON(
                "./data/chords.json"
            );


        const results =
            chords.filter(chord =>
                chord.name
                .toLowerCase()
                .includes(
                    chordName.toLowerCase()
                )
            );


        if(results.length === 0){
            throw new Error(
                "Chord not found"
            );
        }


        return results;

    }
    catch(error){

        console.error(
            "Chord search failed:",
            error
        );

        return [];

    }

}



/**
 * Convert API data
 * into application format.
 */

function normalizeChordData(data){


    if(!Array.isArray(data)){

        data=[data];

    }


    return data.map(chord=>({

        id:
        chord.id ||
        crypto.randomUUID(),

        name:
        chord.chord ||
        chord.name,

        type:
        chord.type ||
        "unknown",

        difficulty:
        "intermediate",

        position:
        "open",

        frets:
        chord.frets ||
        [0,0,0,0,0,0],

        fingers:
        chord.fingers ||
        [],

        notes:
        chord.notes ||
        [],

        variation:
        "API Result",

        rating:
        4.5

    }));

}



/**
 * Local JSON fallback
 */

async function loadLocalChords(
    search
){

    const chords =
        await requestJSON(
            LOCAL_CHORD_DATA
        );


    return chords.filter(
        chord =>
        chord.name
        .toLowerCase()
        .includes(
            search.toLowerCase()
        )
    );

}



/**
 * ==========================================
 * SONG API
 * ==========================================
 */


/*
 Second API:
 Lyrics.ovh
*/


const SONG_API =
"https://api.lyrics.ovh/v1";


export async function searchSong(
    artist,
    title
){

    try{


        const url =
        `${SONG_API}/${artist}/${title}`;


        return await requestJSON(
            url
        );


    }
    catch(error){


        console.error(
            "Song API error",
            error
        );


        return {

            lyrics:
            "No lyrics found."

        };

    }

}



/**
 * ==========================================
 * DAILY CHORD
 * ==========================================
 */


export function getDailyChord(){


    const chords=[

        "C Major",
        "G Major",
        "A Minor",
        "D Minor"

    ];


    const index =
    Math.floor(
        Math.random()
        *
        chords.length
    );


    return {

        chord:
        chords[index]

    };

}



/**
 * ==========================================
 * SCALE EXPLORER
 * ==========================================
 */


export function getScaleData(
    key,
    scale
){


const scales={


C:[
"C",
"Dm",
"Em",
"F",
"G",
"Am"
],


G:[
"G",
"Am",
"Bm",
"C",
"D",
"Em"
],


D:[
"D",
"Em",
"F#m",
"G",
"A",
"Bm"
]


};


return scales[key] || [];


}



/**
 * Loading helpers
 */


export function showLoader(
element
){

element.classList.remove(
"hidden"
);

}



export function hideLoader(
element
){

element.classList.add(
"hidden"
);

}
const MUSIC_API =
"https://itunes.apple.com/search";


export async function searchMusic(
    artist,
    song
){

    const url =
    `${SONG_API}/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`;


    const response =
        await fetch(url);


    if(!response.ok){

        throw new Error(
            "Music API failed"
        );

    }


    return await response.json();

}
