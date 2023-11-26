import * as fs from "fs";

export class LineByLineReader {
    // Store lines until they are sent to subscriber
    cachedLines = []
    readLineCounter = 0;
    onNextLineCallback
    onEndCallback

    inputStream

    constructor(path) {
        this.inputStream = fs.createReadStream(path, {
            encoding: 'utf8',
            highWaterMark: 2 ** 18 // 64kb;
        });
        this.inputStream.pause();

        this.inputStream.on('data', (chunk) => {
            // Insert data into cache
            this.insertChunk(chunk.toString())

            // send all cachedLines which are fully assembled (all except last one)
            const lastLine = this.cachedLines.splice(this.cachedLines.length - 1, 1)[0];
            this.sendToSubscriber()
            this.cachedLines = [lastLine];
        });

        // send remaining cachedLines
        this.inputStream.on('end', () => {
            this.sendToSubscriber();
            if (this.onEndCallback) {
                this.onEndCallback()
            }
        })

    }

    /**
     * Set up a onNextLineCallback function for this reader.
     * Once set up, this is immutable.
     * @param callbackConsumer will be executed for each read line.
     */
    onNextLine(callbackConsumer) {
        if (this.onNextLineCallback) {
            throw new Error('Callback is already set for reader!')
        }
        this.onNextLineCallback = callbackConsumer;
        if (this.inputStream.isPaused()) {
            this.inputStream.resume();
        }
    }

    onEnd(callback) {
        this.onEndCallback = callback;
    }

    /**
     * Inserts new chunk of data and splits at line breaks into cachedLines
     * @param chunk
     * @private
     */
    insertChunk(chunk) {
        // split chunk at line breaks
        const parts = chunk.split('\n');
        if (this.cachedLines.length > 0) {
            let lastLine = this.cachedLines.splice(this.cachedLines.length - 1, 1)[0];
            lastLine += parts[0];
            parts.splice(0, 1);
            this.cachedLines.push(lastLine, ...parts);
        } else {
            this.cachedLines.push(...parts);
        }
    }

    sendToSubscriber() {
        this.cachedLines.forEach(line => {
            this.onNextLineCallback(line, this.readLineCounter)
            this.readLineCounter++;
        })
    }
}
