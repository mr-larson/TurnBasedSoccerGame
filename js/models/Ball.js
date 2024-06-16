export class Ball {
    constructor(player) {
        this.player = player;
    }

    setPosition(left, top) {
        const ballElement = document.getElementById('ball');
        ballElement.style.left = `${left}%`;
        ballElement.style.top = `${top}%`;
    }

    setPlayer(player) {
        this.player = player;
        document.getElementById('ball').dataset.player = player;
    }

    updatePosition(player) {
        const ballElement = document.getElementById('ball');
        const playerElement = document.getElementById(player);
        const fieldRect = document.getElementById('field').getBoundingClientRect();
        const playerRect = playerElement.getBoundingClientRect();
        ballElement.style.left = `${(playerRect.left - fieldRect.left + playerElement.offsetWidth / 2) * 100 / fieldRect.width}%`;
        ballElement.style.top = `${(playerRect.top - fieldRect.top + playerElement.offsetHeight / 2) * 100 / fieldRect.height}%`;
    }

    getCurrentPlayer() {
        const internalOrder = [
            'internalGoalkeeper', 'internalDefender1', 'internalDefender2', 'internalDefender3',
            'internalMidfielder1', 'internalMidfielder2', 'internalMidfielder3', 'internalMidfielder4',
            'internalForward1', 'internalForward2', 'internalForward3'
        ];
        const externalOrder = [
            'externalGoalkeeper', 'externalDefender1', 'externalDefender2', 'externalDefender3',
            'externalMidfielder1', 'externalMidfielder2', 'externalMidfielder3', 'externalMidfielder4',
            'externalForward1', 'externalForward2', 'externalForward3'
        ];
        const playerCurrent = internalOrder.includes(this.player) ? 'internal' : 'external';
        const indexplayer = (playerCurrent === 'internal' ? internalOrder : externalOrder).indexOf(this.player);
        const zone = this.getPlayerZone(this.player);
        const playerNumber = document.getElementById(this.player).textContent;
        return { playerCurrent, indexplayer, zone, playerNumber };
    }

    getPlayerZone(player) {
        if (['internalGoalkeeper', 'externalGoalkeeper'].includes(player)) return 'goalkeeperZone';
        if (['internalDefender1', 'internalDefender2', 'internalDefender3', 'externalDefender1', 'externalDefender2', 'externalDefender3'].includes(player)) return 'defenseZone';
        if (['internalMidfielder1', 'internalMidfielder2', 'internalMidfielder3', 'internalMidfielder4', 'externalMidfielder1', 'externalMidfielder2', 'externalMidfielder3', 'externalMidfielder4'].includes(player)) return 'midfieldZone';
        if (['internalForward1', 'internalForward2', 'internalForward3', 'externalForward1', 'externalForward2', 'externalForward3'].includes(player)) return 'attackZone';
    }
}
