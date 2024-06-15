import { Player } from './Player.js';

export class Team {
    constructor(name, order) {
        this.name = name;
        this.players = order.map((id, index) => new Player(id, this.getInitialPosition(index)));
    }

    getInitialPosition(index) {
        const positionsInternal = [
            { left: 2, top: 50 },
            { left: 15, top: 25 },
            { left: 15, top: 50 },
            { left: 15, top: 75 },
            { left: 42, top: 10 },
            { left: 42, top: 40 },
            { left: 42, top: 60 },
            { left: 42, top: 85 },
            { left: 70, top: 20 },
            { left: 70, top: 50 },
            { left: 70, top: 80 },
        ];

        const positionsExternal = [
            { left: 95, top: 50 },
            { left: 84, top: 25 },
            { left: 84, top: 50 },
            { left: 84, top: 75 },
            { left: 57, top: 10 },
            { left: 57, top: 40 },
            { left: 57, top: 60 },
            { left: 57, top: 85 },
            { left: 28, top: 20 },
            { left: 28, top: 50 },
            { left: 28, top: 80 },
        ];

        if (this.name === 'internal') {
            return positionsInternal[index];
        } else {
            return positionsExternal[index];
        }
    }

    setPositions() {
        this.players.forEach(player => {
            player.setPosition(player.position.left, player.position.top);
        });
    }
}
