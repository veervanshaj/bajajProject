// Math utility functions

const getFibonacci = (n) => {
    const seq = [0, 1];
    for (let i = 2; i < n; i++) {
        seq.push(seq[i - 1] + seq[i - 2]);
    }
    return seq.slice(0, n);
};

const isPrime = (num) => {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const getHCF = (arr) => arr.reduce((a, b) => gcd(a, b));
const getLCM = (arr) => arr.reduce((a, b) => (a * b) / gcd(a, b));

module.exports = {
    getFibonacci,
    isPrime,
    getHCF,
    getLCM
};
