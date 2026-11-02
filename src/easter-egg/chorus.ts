// Like a flower in a hurricane.
//
// Shown only to whoever finds it: tap the © in the footer five times (one per petal of the logo),
// or type "hurricane" anywhere on the page. Finding it unlocks the hurricane theme and the player.

export const CHORUS = [
  "Only love never hesitates",
  "Only trust has a price to pay",
  "Like a flower in a hurricane",
  "We see the sun rise into another day",
] as const;

/** Taps on the © needed, and how quickly they must come. */
export const SECRET_TAPS = 5;
export const SECRET_TAP_WINDOW_MS = 3000;

/** The word that unlocks it from the keyboard. */
export const SECRET_WORD = "hurricane";

/** Where the song goes if the site owner adds one (public/audio/hurricane.mp3). */
export const SONG_PATH = "/audio/hurricane.mp3";
