export const internalOrder = [
    'internalGoalkeeper', 'internalDefender1', 'internalDefender2', 'internalDefender3',
    'internalMidfielder1', 'internalMidfielder2', 'internalMidfielder3', 'internalMidfielder4',
    'internalForward1', 'internalForward2', 'internalForward3'
];

export const externalOrder = [
    'externalGoalkeeper', 'externalDefender1', 'externalDefender2', 'externalDefender3',
    'externalMidfielder1', 'externalMidfielder2', 'externalMidfielder3', 'externalMidfielder4',
    'externalForward1', 'externalForward2', 'externalForward3'
];

export const opponentOrder = {
    internal: externalOrder,
    external: internalOrder
};
