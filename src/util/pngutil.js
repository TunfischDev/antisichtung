// Funktion zum Generieren von zufälligen Pixelwerten
import {PNG} from "pngjs";
import * as fs from "fs";

function generateRandomPixel() {
    const pixelValue = Math.floor(Math.random() * 256);
    return [pixelValue, pixelValue, pixelValue, 255]; // RGBA-Format (rot, grün, blau, alpha)
}

// Funktion zum Erstellen und Speichern des PNG
export function generateAndSaveRandomPNG(width, height, outputPath) {
    const png = new PNG({ width, height });

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (width * y + x) << 2;
            const pixel = generateRandomPixel();

            // Setze die Pixelwerte im PNG
            png.data[idx] = pixel[0];
            png.data[idx + 1] = pixel[1];
            png.data[idx + 2] = pixel[2];
            png.data[idx + 3] = pixel[3];
        }
    }

    // Schreibe das PNG in eine Datei
    png.pack().pipe(fs.createWriteStream(outputPath));
}