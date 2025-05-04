import { Player } from './Player.js';

export class Team {
    constructor(name, order, zones) {
        this.name = name;
        this.zones = zones; // ✅ Stockage des zones
        this.players = order.map((id, index) => new Player(id, this.getInitialPosition(index)));
    }

    getInitialPosition(index) {
        const positionsInternal = [
            { left: 2, top: 50 }, { left: 15, top: 25 }, { left: 15, top: 50 }, { left: 15, top: 75 },
            { left: 42, top: 15 }, { left: 42, top: 40 }, { left: 42, top: 60 }, { left: 42, top: 85 },
            { left: 70, top: 20 }, { left: 70, top: 50 }, { left: 70, top: 80 }
        ];

        const positionsExternal = [
            { left: 95, top: 50 }, { left: 84, top: 25 }, { left: 84, top: 50 }, { left: 84, top: 75 },
            { left: 57, top: 15 }, { left: 57, top: 40 }, { left: 57, top: 60 }, { left: 57, top: 85 },
            { left: 28, top: 20 }, { left: 28, top: 50 }, { left: 28, top: 80 }
        ];

        return this.name === 'internal' ? positionsInternal[index] : positionsExternal[index];
    }

    setPositions() {
        this.players.forEach(player => {
            console.log(`Placement de ${player.id} à ${player.position.left}, ${player.position.top}`);
            player.setPosition(player.position.left, player.position.top);
        });
    }

    isPlayerNearby(playerId) {
        const playerZone = Object.entries(this.zones).find(([_, players]) => players.includes(playerId));

        if (playerZone) {
            const opponentsInZone = playerZone[1].filter(p =>
                p.startsWith(this.name === 'internal' ? 'external' : 'internal')
            );
            return opponentsInZone.length > 0; // ✅ Si un adversaire est proche, retourne `true`
        }
        return false;
    }
}
