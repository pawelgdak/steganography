/**
 * Changes decimal number to bits
 * @return {Bit[]}
 * @param {Number} number
 */
module.exports.decToBits = number => {
    return number.toString(2).padStart(8, 0);
}

/**
 * Changes character to bits
 * @return {Bit[]}
 * @param {Char} character
 */
module.exports.charToBits = character => {
    let bits;

    let characterInASCII = character.charCodeAt(0);
    bits = this.decToBits(characterInASCII);

    return bits;    
}

/**
 * Changes string to chain of bits. Each character is presented 
 * as an ASCII binary number. Adds 8 extra zeros as a end-of-string mark.
 * @return {String} Chain of bits (encoded string)
 * @param {String} string
 */
module.exports.stringToChainOfBits = string => {
    let chain = "";

    for(let i = 0; i < string.length; i++) {

        chain += this.charToBits(string[i]);

    }

    chain += "00000000";

    return chain;
}

/**
 * Changes the chain of bits to string.
 * @return {String} Decoded string
 * @param {chain} chain Chain of bits
 */
module.exports.chainOfBitsToString = chain => {
    let string = "";

    for(let i = 0; i < chain.length; i += 8) {

        if((chain[i] + chain[i+1] + chain[i+2] + chain[i+3] + chain[i+4] + chain[i+5] + chain[i+6] + chain[i+7]).includes("undefined")) {
            break;
        }

        ascii = parseInt((chain[i] + chain[i+1] + chain[i+2] + chain[i+3] + chain[i+4] + chain[i+5] + chain[i+6] + chain[i+7]), 2);
        string += String.fromCharCode(ascii);

    }
    
    return string;
}

/**
 * Replaces string's character at given index.
 * @return {String}
 * @param {String} string String that contains character which is going to be replaced.
 * @param {Number} index Index of a character that is going to be replaced.
 * @param {String} replacement String that replaces the character.
 */
module.exports.replaceStringCharacter = (string, index, replacement) => {
    return string.substr(0, index) + replacement + string.substr(index + 1);
}