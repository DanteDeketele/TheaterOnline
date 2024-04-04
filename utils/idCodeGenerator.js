// Function to generate hex code ID
const generateIdCode = (length = 8) => {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

const isIdCode = (idCode, length = 8) => {
    const idCodeRegex = /^[0-9A-Z]+$/;
    return idCodeRegex.test(idCode) && idCode.length === length;
};

module.exports = { generateIdCode, isIdCode };