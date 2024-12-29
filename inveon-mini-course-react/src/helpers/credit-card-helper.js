export const isValidCardNumber = (cardNumber) => {
    let sum = 0;
    let isEven = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i], 10);

        if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
};

export const isValidExpirationDate = (expiration) => {
    if (!expiration || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiration)) return false;

    // Split MM/YY into parts
    const [month, year] = expiration.split("/").map((val) => parseInt(val, 10));

    if (month < 1 || month > 12 || !year) return false;

    // Convert the YY to a full year
    const fullYear = 2000 + year;

    // Get the current date
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
    const currentYear = now.getFullYear();

    // Check if the date is in the past
    return fullYear > currentYear || (fullYear === currentYear && month >= currentMonth);
};