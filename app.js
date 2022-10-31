/*
Personal Allowance 	Up to £12,570 	0%
Basic rate 	£12,571 to £50,270 	20%
Higher rate 	£50,271 to £150,000 	40%
Additional rate 	over £150,000 	45%
 */
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

const defaultPersAllowance = 12570;
const basicRateBand = 50270;
const higherRateBand = 150000;
const basePercent = 0.2.toFixed(2);
const higherPercent = 0.4.toFixed(2);
const additionalPercent = 0.45.toFixed(2);
const persAllowanceTaperStart = 100000;
const persAllowanceTaperEnd = persAllowanceTaperStart + (defaultPersAllowance * 2);


function calAdjustedPersAllowance(grossPay) {
    let adjustedPersonalAllowance = 0;

    if (grossPay <= persAllowanceTaperStart) {
        adjustedPersonalAllowance = defaultPersAllowance;
    } else if (grossPay > persAllowanceTaperStart && grossPay < persAllowanceTaperEnd) {
        adjustedPersonalAllowance = defaultPersAllowance - ((grossPay - persAllowanceTaperStart) / 2);
    } else if (grossPay >= persAllowanceTaperEnd) {
        adjustedPersonalAllowance = 0;
    }
    return adjustedPersonalAllowance;
}

function calculatePAYE(grossPay) {
    let payeLiability = 0, adjustedPersAllowance = calAdjustedPersAllowance(grossPay);

    if (grossPay < adjustedPersAllowance) {
        payeLiability = 0;
    } else if (grossPay < basicRateBand) {
        payeLiability = (grossPay - adjustedPersAllowance) * basePercent;
    } else if (grossPay <= higherRateBand) {
        payeLiability = ((basicRateBand - (adjustedPersAllowance)) * basePercent) +
            ((defaultPersAllowance - adjustedPersAllowance) * basePercent) +
            ((grossPay - basicRateBand) * higherPercent);
    } else {
        payeLiability = ((basicRateBand - (adjustedPersAllowance)) * basePercent) +
            ((defaultPersAllowance - adjustedPersAllowance) * basePercent) +
            ((higherRateBand - basicRateBand) * higherPercent) +
            (grossPay - higherRateBand) * additionalPercent;
    }
    return payeLiability;
}


// NI
function calculateNI(grossPay) {
    const lowerAnnualThreshold = 9564;
    const primaryAnnualThreshold = 50268;
    const primaryPercent = 0.12.toFixed(2);
    const upperPercent = 0.02.toFixed(2);
    let totalNILiability = 0;

    if (grossPay < lowerAnnualThreshold) {
        return totalNILiability;
    } else if (grossPay <= primaryAnnualThreshold) {
        totalNILiability = (grossPay - lowerAnnualThreshold) * primaryPercent
    } else if (grossPay > primaryAnnualThreshold) {
        totalNILiability = ((grossPay - primaryAnnualThreshold) * upperPercent) +
            ((primaryAnnualThreshold - lowerAnnualThreshold) * primaryPercent)
    }
    return totalNILiability;
}

readline.question(`How much do you earn per year?`, grossPay => {
    console.log(`Your personal allowance is:\t ${calAdjustedPersAllowance(grossPay)}.`)
    console.log(`Your PAYE liability is:\t ${calculatePAYE(grossPay)}.`)
    console.log(`Your National Insurance liability is:\t ${calculateNI(grossPay)}.`)
    readline.close();
});

