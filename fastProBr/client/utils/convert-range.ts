export const convertRange = (data: {
    value: number;
    currentRange: [number, number];
    targetRange: [number, number];
    forceInteger: boolean;
}) => {
    const convertedValue =
        ((data.value - data.currentRange[0]) * (data.targetRange[1] - data.targetRange[0])) /
            (data.currentRange[1] - data.currentRange[0]) +
        data.targetRange[0];

    return data.forceInteger ? Math.round(convertedValue) : convertedValue;
};
