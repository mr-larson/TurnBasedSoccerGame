import { Ball } from '../models/Ball.js';
import { Team } from '../models/Team.js';
import { internalOrder, externalOrder } from '../constants.js';
import { handlePass } from '../actions/Pass.js';
import { handleDribble } from "../actions/Dribble.js";
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
        this.zones = this.createZones(); // ✅ Définition des zones

        // ✅ Correction : passage des zones aux équipes
        this.internalTeam = new Team('internal', internalOrder, this.zones);
        this.externalTeam = new Team('external', externalOrder, this.zones);

        this.ball = new Ball('internalMidfielder1');
        this.initGame();

        document.getElementById('passButton').addEventListener('click', () => this.actionFootball('pass'));
        document.getElementById('dribbleButton').addEventListener('click', () => this.actionFootball('dribble'));
        document.getElementById('shootButton').addEventListener('click', () => this.actionFootball('shoot'));
    }

    createZones() {
        return {
            zoneA_defense: ['internalGoalkeeper', 'internalDefender1', 'internalDefender2', 'internalDefender3'],
            zoneA_midfield: ['internalMidfielder1', 'internalMidfielder2', 'internalMidfielder3', 'internalMidfielder4'],
            zoneA_attack: ['internalForward1', 'internalForward2', 'internalForward3'],

            zoneB_defense: ['externalGoalkeeper', 'externalDefender1', 'externalDefender2', 'externalDefender3'],
            zoneB_midfield: ['externalMidfielder1', 'externalMidfielder2', 'externalMidfielder3', 'externalMidfielder4'],
            zoneB_attack: ['externalForward1', 'externalForward2', 'externalForward3']
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
            message = `Le match commence! <br>${this.scoreInternal} - ${this.scoreExternal}`;
        } else {
            this.ball.setPlayer(this.playerScoredLast === 'internal' ? 'externalMidfielder1' : 'internalMidfielder1');
            message = `Le match continue! <br> ${this.scoreInternal} - ${this.scoreExternal}`;
        }

        document.getElementById('commentary').innerHTML = message;
        updateScore(this);
        document.getElementById('currentTour').textContent = this.totalActions.toString().padStart(2, '0');
        updateActionButtonColors(this);
    }

    actionFootball(actionType) {
        const dice = this.rollDice();
        this.totalActions++;
        document.getElementById('currentTour').textContent = this.totalActions.toString().padStart(2, '0');

        if (this.totalActions >= 31) {
            let message = this.scoreInternal === this.scoreExternal
                ? `Match nul! Score: Interne ${this.scoreInternal} - Externe ${this.scoreExternal}`
                : `Le match est terminé! L'équipe ${this.scoreInternal > this.scoreExternal ? 'Interne' : 'Externe'} a gagné! Score: Interne ${this.scoreInternal} - Externe ${this.scoreExternal}`;

            document.getElementById('commentary').innerHTML = message;
            alert(message);
            return;
        }

        switch (actionType) {
            case 'dribble':
                handleDribble(this, dice);
                break;
            case 'pass':
                handlePass(this, dice);
                break;
            case 'shoot':
                handleShoot(this, dice);
                break;
            default:
                console.warn(`Action inconnue : ${actionType}`);
        }

        updateActionButtonColors(this);
    }

    updateScore() {
        updateScore(this);
    }

    animateActionButtons() {
        animateActionButtons();
    }

    updateActionButtonColors() {
        updateActionButtonColors(this);
    }
}
