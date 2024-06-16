import { Ball } from './Ball.js';
import { Team } from './Team.js';
import { internalOrder, externalOrder } from '../constants.js';
import { handlePass } from '../actions/Pass.js';
import { handleShoot } from '../actions/Shoot.js';
import { updateScore } from '../actions/updateScore.js';
import { animateDice } from '../actions/animateDice.js';
import { animateActionButtons } from '../actions/animateActionButtons.js';
import { updateActionButtonColors } from '../actions/updateActionButtonColors.js';

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
        const diceValue = Math.floor(Math.random() * 10) + 1;
        animateDice(diceValue);
        return diceValue;
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
        updateScore(this);
        document.getElementById('currentTour').textContent = this.totalActions.toString().padStart(2, '0');
        updateActionButtonColors(this);  // Update button colors at the start of the game
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
            handlePass(this, dice);
        } else if (actionType === 'shoot') {
            handleShoot(this, dice);
        }
        updateActionButtonColors(this); // Update button colors after each action
    }
}
