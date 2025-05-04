import { getNearestOpponentPlayer } from './Pass.js';
import { internalOrder, externalOrder } from '../constants.js';

export function handleDribble(game, dice) {
    const { playerCurrent, indexplayer, zone, playerNumber } = game.ball.getCurrentPlayer();
    const teamName = playerCurrent === 'internal' ? 'interne' : 'externe';

    const opponentTeam = playerCurrent === 'internal' ? game.externalTeam : game.internalTeam;
    const opponentNearby = opponentTeam.isPlayerNearby(game.ball.player);

    let successChance = dice;
    if (opponentNearby) {
        successChance -= 3; // Réduction de la probabilité en présence d'un adversaire
    }

    let message;
    if (successChance > 5) {
        const nextZone = getNextZone(zone, playerCurrent);
        const availablePlayers = game.zones[nextZone].filter(p => p !== game.ball.player);
        const newPlayer = availablePlayers.length > 0 ? availablePlayers[Math.floor(Math.random() * availablePlayers.length)] : game.ball.player;

        if (!document.getElementById(newPlayer)) {
            console.error(`Joueur introuvable après dribble: ${newPlayer}`);
            return;
        }

        // Mise à jour du joueur et du ballon
        movePlayerAndBall(game, newPlayer, nextZone);

        message = `Numéro ${playerNumber} de l'équipe ${teamName} réussit son dribble et avance en ${nextZone}!`;
    } else {
        const newOpponent = getNearestOpponentPlayer(game, playerCurrent, indexplayer, zone);
        if (!document.getElementById(newOpponent)) {
            console.error(`Joueur adverse introuvable après interception: ${newOpponent}`);
            return;
        }

        game.ball.setPlayer(newOpponent);
        game.ball.updatePosition(newOpponent);
        message = `Numéro ${playerNumber} de l'équipe ${teamName} rate son dribble! ${document.getElementById(newOpponent).textContent} intercepte la balle.`;
    }

    document.getElementById('commentary').innerHTML = message;
}

// ✅ Déplace le joueur et le ballon en même temps
function movePlayerAndBall(game, playerId, newZone) {
    const playerElement = document.getElementById(playerId);
    const ballElement = document.getElementById('ball');

    if (!playerElement || !ballElement) {
        console.error(`Impossible de déplacer le joueur ou le ballon: ${playerId}`);
        return;
    }

    const newPosition = getZonePosition(game, playerId, newZone);

    // Animation fluide pour le joueur et le ballon
    playerElement.style.transition = ballElement.style.transition = 'left 0.5s ease, top 0.5s ease';

    playerElement.style.left = `${newPosition.left}%`;
    playerElement.style.top = `${newPosition.top}%`;

    ballElement.style.left = `${newPosition.left + 1}%`; // Ajustement léger du ballon
    ballElement.style.top = `${newPosition.top + 1}%`;

    // Mise à jour des données du ballon
    game.ball.setPlayer(playerId);
}

// ✅ Récupère la nouvelle position d’un joueur après un dribble
function getZonePosition(game, playerId, zone) {
    if (!game.zones[zone]) {
        console.error(`Zone invalide: ${zone}`);
        return { left: 50, top: 50 }; // Valeur par défaut
    }

    const playerElement = document.getElementById(playerId);
    if (!playerElement) {
        console.error(`Impossible de récupérer la position du joueur: ${playerId}`);
        return { left: 50, top: 50 };
    }

    return {
        left: adjustLeftPosition(zone),
        top: parseFloat(playerElement.style.top) || 50
    };
}

// ✅ Détermine la prochaine zone du joueur après un dribble
function getNextZone(currentZone, team) {
    const zoneOrder = {
        internal: ["zoneA_defense", "zoneA_midfield", "zoneA_attack", "zoneB_defense"],
        external: ["zoneB_defense", "zoneB_midfield", "zoneB_attack", "zoneA_defense"]
    };

    const currentIndex = zoneOrder[team].indexOf(currentZone);
    return currentIndex !== -1 && currentIndex < zoneOrder[team].length - 1
        ? zoneOrder[team][currentIndex + 1]
        : currentZone;
}

// ✅ Ajuste la position horizontale du joueur selon sa nouvelle zone
function adjustLeftPosition(zone) {
    const zoneOffsets = {
        zoneA_defense: 10,
        zoneA_midfield: 35,
        zoneA_attack: 60,
        zoneB_defense: 85,
        zoneB_midfield: 65,
        zoneB_attack: 40
    };

    return zoneOffsets[zone] || 50; // Par défaut centré
}

// ✅ Animation de dribble
function animateDribble() {
    const ballElement = document.getElementById('ball');
    ballElement.classList.add('dribbling');
    setTimeout(() => {
        ballElement.classList.remove('dribbling');
    }, 500);
}
