export function shuffle(array) {
    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {
        const rand = crypto.getRandomValues(new Uint32Array(1))[0];
        const j = Math.floor(rand / (2**32) * (i + 1));

        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}
