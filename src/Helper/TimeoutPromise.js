/**
 * Timeout promise, taken from https://italonascimento.github.io/applying-a-timeout-to-your-promises/.
 */
const timeoutPromise = function (promise, ms) {
    /* Creates a promise that times out after "ms" milliseconds */
    const timeoutPromise = new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            clearTimeout(timeoutId);
            reject(`Promise timed out after ${ms} milliseconds.`);
        }, ms);
    });

    /* Race between the timeout promise and the actual promise to execute */
    return Promise.race([
        promise,
        timeoutPromise
    ]);
}

module.exports = timeoutPromise;
