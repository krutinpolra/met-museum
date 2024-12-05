// store.js
import { atom } from 'jotai';

// Create a "favouritesAtom" with an empty array as the default value
export const favouritesAtom = atom([]);

// Atom to store search history (default value is an empty array)
export const searchHistoryAtom = atom([]);

