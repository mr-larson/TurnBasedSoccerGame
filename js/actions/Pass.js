import { internalOrder, externalOrder } from '../constants.js';

export function handlePass(game, dice) {
    const { playerCurrent, indexplayer, zone, playerNumber } = game.ball.getCurrentPlayer();
    let message;
    const teamName = playerCurrent === 'internal' ? 'interne' : 'externe';

    if (dice > 5) { // Passe réussie
        let newPlayer;
        if (playerCurrent === 'internal') {
            newPlayer = getRandomTeammate(zone, internalOrder);
        } else {
            newPlayer = getRandomTeammate(zone, externalOrder);
        }
        message = `Numéro ${playerNumber} de l'équipe ${teamName} réussit la passe!`;
        game.ball.setPlayer(newPlayer);
        game.ball.updatePosition(newPlayer);
    } else { // Passe échouée
        let newPlayer = getNearestOpponentPlayer(game, playerCurrent, indexplayer, zone);
        const newPlayerNumber = document.getElementById(newPlayer).textContent;
        const newTeamName = playerCurrent === 'internal' ? 'externe' : 'interne';
        message = `Numéro ${playerNumber} de l'équipe ${teamName} échoue la passe! Numéro ${newPlayerNumber} de l'équipe ${newTeamName} récupère la balle.`;
        game.ball.setPlayer(newPlayer);
        game.ball.updatePosition(newPlayer);
    }

    document.getElementById('commentary').innerHTML = message;
}

export function getRandomTeammate(zone, order) {
    let newPlayer;

    if (zone === 'goalkeeperZone' || zone === 'defenseZone') {
        newPlayer = order.slice(4, 8)[Math.floor(Math.random() * 4)]; // Passe vers un milieu aléatoire
    } else if (zone === 'midfieldZone') {
        newPlayer = order.slice(8, 11)[Math.floor(Math.random() * 3)]; // Passe vers un attaquant aléatoire
    } else if (zone === 'attackZone') {
        // Correction : choisir uniquement un autre attaquant de l'équipe
        const availableForwards = order.slice(8, 11).filter(p => p !== document.getElementById('ball').dataset.player);
        if (availableForwards.length > 0) {
            newPlayer = availableForwards[Math.floor(Math.random() * availableForwards.length)];
        } else {
            newPlayer = document.getElementById('ball').dataset.player; // Si aucun autre attaquant, garder le même
        }
    }

    return newPlayer;
}


export function getNearestOpponentPlayer(game, playerCurrent, indexplayer, zone) {
    if (playerCurrent === 'internal') {
        switch (zone) {
            case 'goalkeeperZone':
                return getRandomPlayer(internalOrder.slice(1, 4)); // Défenseur aléatoire de la même équipe
            case 'defenseZone':
                return getRandomPlayer(externalOrder.slice(8, 11)); // Attaquant aléatoire
            case 'midfieldZone':
                return getRandomPlayer(externalOrder.slice(4, 8)); // Milieu aléatoire
            case 'attackZone':
                return getRandomPlayer(externalOrder.slice(1, 4)); // Défenseur aléatoire
        }
    } else {
        switch (zone) {
            case 'goalkeeperZone':
                return getRandomPlayer(externalOrder.slice(1, 4)); // Défenseur aléatoire de la même équipe
            case 'defenseZone':
                return getRandomPlayer(internalOrder.slice(8, 11)); // Attaquant aléatoire
            case 'midfieldZone':
                return getRandomPlayer(internalOrder.slice(4, 8)); // Milieu aléatoire
            case 'attackZone':
                return getRandomPlayer(internalOrder.slice(1, 4)); // Défenseur aléatoire
        }
    }
}

function getRandomPlayer(players) {
    return players[Math.floor(Math.random() * players.length)];
}
