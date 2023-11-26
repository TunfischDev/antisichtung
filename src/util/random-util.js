import {FIRST_NAMES, LAST_NAME} from "./names.js";
import * as fs from "fs";
import {STREETS} from "./streets.js";

export function generateRandomEmail(vorname, nachname, domain) {
  // Zufällige Auswahl, ob das Schema vorname.nachname@domain verwendet wird
  const useFullName = Math.random() < 0.5;

  if (useFullName) {
    // Schema vorname.nachname@domain
    return `${vorname.toLowerCase()}${getDot()}${nachname.toLowerCase()}@${domain}`;
  } else {
    // Zufällige Anzahl von Anfangsbuchstaben für Vor- und Nachname
    const vornameAbbr = vorname
      .slice(0, Math.floor(Math.random() * vorname.length) + 1)
      .toLowerCase();
    const nachnameAbbr = nachname
      .slice(0, Math.floor(Math.random() * nachname.length) + 1)
      .toLowerCase();

    // Zufällige Zahlen und Buchstaben
    const randomPartLength = Math.floor(Math.random() * 5) + 1; // Maximale Länge von 5 Zeichen
    const randomPart = [...Array(randomPartLength)]
      .map(() => Math.random().toString(36)[2])
      .join("");

    // Zufällige Position für randomPart (VornameAbbr.randomPart.NachnameAbbr@domain)
    const randomPosition = Math.random() < 0.5;

    // Schema abgekürzter Vorname und Nachname + zufälliger Teil + @domain
    return randomPosition
      ? `${vornameAbbr}${getDot()}${randomPart}${getDot()}${nachnameAbbr}@${domain}`
      : `${vornameAbbr}${getDot()}${nachnameAbbr}${getDot()}${randomPart}@${domain}`;
  }
}

/**
 * @return {string}
 */
function getDot() {
  let dot = "";
  const r = Math.random();
  if (r > 0.5) {
    dot = ".";
  }
  return dot;
}

/**
 * @return {{first: string, last: string}}
 */
export function generateRandomName() {
  const firstName = sample(FIRST_NAMES);
  const lastName = sample(LAST_NAME);
  return {
    first: firstName,
    last: lastName,
  };
}

/**
 * @param {Array<T>} array
 * @return {T}
 */
export function sample(array) {
  if (array.length === 0) {
    return undefined;
  }
  const idx = Math.floor(Math.random() * array.length);
  return array[idx];
}

const emailProviderList = [
  { name: "Gmail", domain: "gmail.com" },
  { name: "Yahoo Mail", domain: "yahoo.com" },
  { name: "Outlook", domain: "outlook.com" },
  { name: "Apple Mail", domain: "icloud.com" },
  { name: "AOL Mail", domain: "aol.com" },
  { name: "ProtonMail", domain: "protonmail.com" },
  { name: "Zoho Mail", domain: "zoho.com" },
  { name: "Mail.com", domain: "mail.com" },
  { name: "GMX Mail", domain: "gmx.com" },
  { name: "Yandex.Mail", domain: "yandex.com" },
  { name: "Tutanota", domain: "tutanota.com" },
  { name: "FastMail", domain: "fastmail.com" },
  { name: "Hotmail", domain: "hotmail.com" },
  { name: "BlueMail", domain: "bluemail.me" },
  { name: "Mail.ru", domain: "mail.ru" },
];

/**
 * @type {string[]}
 */
const DOMAINS = emailProviderList.map((e) => e.domain);

/**
 * @type {string | undefined}
 */
export function getRandomDomain() {
  return sample(DOMAINS);
}

/**
 * @returns {string}
 */
export function getRandomAddress() {
    return sample(STREETS) + ' ' + (Math.random() * 100).toFixed(0)
}

export function getRandomFileName(directoryPath) {
  // Lies alle Dateien im Verzeichnis
  const files = fs.readdirSync(directoryPath);

  // Überprüfe, ob es Dateien im Verzeichnis gibt
  if (files.length === 0) {
    console.error('Das Verzeichnis ist leer.');
    return null;
  }

  // Wähle eine zufällige Datei aus
  const randomIndex = Math.floor(Math.random() * files.length);
  // Gib den Namen der zufälligen Datei zurück
  return files[randomIndex];
}