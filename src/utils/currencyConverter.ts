import { default as bigDecimal } from 'js-big-decimal';

/**
 * @description - this function will take in the conversion
 * data and return the output of the conversion
 * @param originalAmount {string} - currency requested to be converted
 * @param conversionRate {string} - current rate of 1 of from to this field
 * @return {string} this is the converted currency as a string
 */
const convertCurrency = (
    originalAmount: string,
    conversionRate: string,
): string => {
    const fromAmount = new bigDecimal(originalAmount);
    const toAmount = new bigDecimal(conversionRate);
    const calculatedAmount = fromAmount.multiply(toAmount);
    return calculatedAmount.getValue();
};

export { convertCurrency };
