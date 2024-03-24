export const convertToFloat = (number: number) => {
    return (number).toFixed(2);
}

export const multiplyPercentToFloat = (percent: number, number: number) => {
    return (number * percent / 100).toFixed(2);
}