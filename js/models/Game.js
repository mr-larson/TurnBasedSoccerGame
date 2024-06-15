import { Ball } from './Ball.js';
import { Team } from './Team.js';
import { internalOrder, externalOrder } from './constants.js';

export class Game {
    constructor() {
        this.totalActions = 0;
        this.scoreInternal = 0;
        this.scoreExternal = 0;
        this.playerScoredLast = 'internal';
        this.zones = this.createZones();
        this.internalTeam = new Team('internal', internalOrder);
        this.externalTeam = new Team('external', externalOrder);
        this.ball = new Ball('internalMidfielder1');
        this.initGame();

        document.getElementById('passButton').addEventListener('click', () => this.actionFootball('pass'));
        document.getElementById('shootButton').addEventListener('click', () => this.actionFootball('shoot'));
    }

    createZones() {
        return {
            goalkeeperZone: ['internalGoalkeeper', 'externalGoalkeeper'],
            defenseZone: ['internalDefender1', 'internalDefender2', 'internalDefender3', 'externalDefender1', 'externalDefender2', 'externalDefender3'],
            midfieldZone: ['internalMidfielder1', 'internalMidfielder2', 'internalMidfielder3', 'internalMidfielder4', 'externalMidfielder1', 'externalMidfielder2', 'externalMidfielder3', 'externalMidfielder4'],
            attackZone: ['internalForward1', 'internalForward2', 'internalForward3', 'externalForward1', 'externalForward2', 'externalForward3']
        };
    }

    rollDice() {
        return Math.floor(Math.random() * 10) + 1;
    }

    updateScore() {
        document.getElementById('scoreInternal').textContent = this.scoreInternal;
        document.getElementById('scoreExternal').textContent = this.scoreExternal;
        const scoreElements = [document.getElementById('scoreInternal'), document.getElementById('scoreExternal')];
        scoreElements.forEach(element => {
            element.classList.add('score-changed');
            setTimeout(() => {
                element.classList.remove('score-changed');
            }, 6000);
        });
    }

    updateActionButtonColors() {
        const currentTeam = this.ball.getCurrentPlayer().playerCurrent;
        const buttons = document.querySelectorAll('#passButton, #shootButton');
        buttons.forEach(button => {
            if (currentTeam === 'internal') {
                button.style.backgroundColor = 'blue';
            } else {
                button.style.backgroundColor = 'red';
            }
        });
    }

    animateActionButtons() {
        const buttons = document.querySelectorAll('#passButton, #shootButton');
        buttons.forEach(button => {
            button.classList.add('score-changed');
            setTimeout(() => {
                button.classList.remove('score-changed');
            }, 1500); // Duration of the animation
        });
    }

    initGame() {
        this.internalTeam.setPositions();
        this.externalTeam.setPositions();
        this.ball.setPosition(50, 50);
        let message;
        if (this.totalActions === 0) {
            this.ball.setPlayer('internalMidfielder1');
            message = 'Le match commence! <br>' + this.scoreInternal + ' - ' + this.scoreExternal;
        } else {
            this.ball.setPlayer(this.playerScoredLast === 'internal' ? 'externalMidfielder1' : 'internalMidfielder1');
            message = 'Le match continue! <br> ' + this.scoreInternal + ' - ' + this.scoreExternal;
        }
        document.getElementById('commentary').innerHTML = message;
        this.updateScore();
        document.getElementById('currentTour').textContent = this.totalActions.toString().padStart(2, '0');
        this.updateActionButtonColors();  // Update button colors at the start of the game
    }

    actionFootball(actionType) {
        const dice = this.rollDice();
        this.totalActions++;
        document.getElementById('currentTour').textContent = this.totalActions.toString().padStart(2, '0');

        if (this.totalActions >= 31) {
            let message;
            if (this.scoreInternal === this.scoreExternal) {
                message = `Match nul! Score: Interne ${this.scoreInternal} - Externe ${this.scoreExternal}`;
            } else {
                const winner = this.scoreInternal > this.scoreExternal ? 'Interne' : 'Externe';
                message = `Le match est terminé! L'équipe ${winner} a gagné! Score: Interne ${this.scoreInternal} - Externe ${this.scoreExternal}`;
            }
            document.getElementById('commentary').innerHTML = message;
            alert(message);
            return;
        }

        if (actionType === 'pass') {
            this.handlePass(dice);
        } else if (actionType === 'shoot') {
            this.handleShoot(dice);
        }
        this.updateActionButtonColors(); // Update button colors after each action
    }

    handlePass(dice) {
        const { playerCurrent, indexplayer, zone, playerNumber } = this.ball.getCurrentPlayer();
        let message;

        if (dice > 5) { // Passe réussie
            let newPlayer;
            if (playerCurrent === 'internal') {
                newPlayer = this.getRandomTeammate(zone, internalOrder);
            } else {
                newPlayer = this.getRandomTeammate(zone, externalOrder);
            }
            message = `Quelle belle passe de ${playerNumber}! <br> Le dé montre un ${dice}.`;
            this.ball.setPlayer(newPlayer);
            this.ball.updatePosition(newPlayer);
        } else { // Passe échouée
            let newPlayer = this.getNearestOpponentPlayer(playerCurrent, indexplayer, zone);
            const newPlayerNumber = document.getElementById(newPlayer).textContent;
            message = `Oh non, la passe de ${playerNumber} échoue! <br> Le dé montre un ${dice}. ${newPlayerNumber} récupère la balle.`;
            this.ball.setPlayer(newPlayer);
            this.ball.updatePosition(newPlayer);
        }

        document.getElementById('commentary').innerHTML = message;
    }

    getRandomTeammate(zone, order) {
        let newPlayer;

        if (zone === 'goalkeeperZone' || zone === 'defenseZone') {
            newPlayer = order.slice(4, 8)[Math.floor(Math.random() * 4)]; // Passer vers un milieu aléatoire
        } else if (zone === 'midfieldZone') {
            newPlayer = order.slice(8, 11)[Math.floor(Math.random() * 3)]; // Passer vers un attaquant aléatoire
        } else if (zone === 'attackZone') {
            newPlayer = order.slice(8, 11).filter(p => this.zones.attackZone.includes(p) && p !== this.ball.player)[Math.floor(Math.random() * 2)]; // Passer vers un autre attaquant aléatoire
        }
        return newPlayer;
    }

    handleShoot(dice) {
        const { playerCurrent, playerNumber } = this.ball.getCurrentPlayer();
        const success = this.getShootSuccess(this.ball.player);
        let message;

        if (dice > success) {
            message = `Incroyable tir de ${playerNumber}! <br> Le dé montre un ${dice}.`;
            this.animateBallToGoal(playerCurrent);
        } else {
            message = `Dommage, le tir de ${playerNumber} n'est pas assez bon. <br> Le dé montre un ${dice}.`;
            this.ball.setPlayer(playerCurrent === 'internal' ? 'externalGoalkeeper' : 'internalGoalkeeper');
            this.ball.updatePosition(this.ball.player);
        }

        document.getElementById('commentary').innerHTML = message;
    }

    getShootSuccess(player) {
        if (player.includes('Forward')) {
            return 5;
        } else if (player.includes('Midfielder')) {
            return 7;
        } else if (player.includes('Defender')) {
            return 9;
        } else {
            return 10;
        }
    }

    animateBallToGoal(playerCurrent) {
        const ballElement = document.getElementById('ball');
        ballElement.style.transition = 'left 0.5s ease, top 0.5s ease';
        if (playerCurrent === 'internal') {
            ballElement.style.left = '100%'; // Position near the right goal
            ballElement.style.top = '50%';
        } else {
            ballElement.style.left = '-2%'; // Position near the left goal
            ballElement.style.top = '50%';
        }
        setTimeout(() => {
            this.updateScoreAfterShoot(playerCurrent);
        }, 1000);
    }

    updateScoreAfterShoot(playerCurrent) {
        if (playerCurrent === 'internal') {
            this.scoreInternal++;
            this.playerScoredLast = 'internal';
        } else {
            this.scoreExternal++;
            this.playerScoredLast = 'external';
        }
        this.updateScore();
        this.animateActionButtons(); // Animate action buttons when a goal is scored
        setTimeout(() => this.initGame(), 2000);
    }

    getNearestOpponentPlayer(playerCurrent, indexplayer, zone) {
        if (playerCurrent === 'internal') {
            switch (zone) {
                case 'goalkeeperZone':
                    return this.getRandomPlayer(internalOrder.slice(1, 4)); // Défenseur aléatoire de la même équipe
                case 'defenseZone':
                    return this.getRandomPlayer(externalOrder.slice(8, 11)); // Attaquant aléatoire
                case 'midfieldZone':
                    return this.getRandomPlayer(externalOrder.slice(4, 8)); // Milieu aléatoire
                case 'attackZone':
                    return this.getRandomPlayer(externalOrder.slice(1, 4)); // Défenseur aléatoire
            }
        } else {
            switch (zone) {
                case 'goalkeeperZone':
                    return this.getRandomPlayer(externalOrder.slice(1, 4)); // Défenseur aléatoire de la même équipe
                case 'defenseZone':
                    return this.getRandomPlayer(internalOrder.slice(8, 11)); // Attaquant aléatoire
                case 'midfieldZone':
                    return this.getRandomPlayer(internalOrder.slice(4, 8)); // Milieu aléatoire
                case 'attackZone':
                    return this.getRandomPlayer(internalOrder.slice(1, 4)); // Défenseur aléatoire
            }
        }
    }

    getRandomPlayer(players) {
        return players[Math.floor(Math.random() * players.length)];
    }
}
