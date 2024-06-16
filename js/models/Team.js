import { Player } from './Player.js';

export class Team {
    constructor(name, order) {
        this.name = name;
        this.players = order.map((id, index) => new Player(id, this.getInitialPosition(index)));
    }

    getInitialPosition(index) {
        const positionsInternal = [
            { left: 2, top: 50 }, //goalkeeper internal 1
            { left: 15, top: 25 }, //defenders internal 2
            { left: 15, top: 50 }, //defenders internal 3
            { left: 15, top: 75 }, //defenders internal 4
            { left: 42, top: 15 }, //midfielders internal 5
            { left: 42, top: 40 }, //midfielders internal 6
            { left: 42, top: 60 }, //midfielders internal 7
            { left: 42, top: 85 }, //midfielders internal 8
            { left: 70, top: 20 }, //forwards internal 9
            { left: 70, top: 50 }, //forwards internal 10
            { left: 70, top: 80 }, //forwards internal 11
        ];

        const positionsExternal = [
            { left: 95, top: 50 }, //goalkeeper external 1
            { left: 84, top: 25 }, //defenders external 2
            { left: 84, top: 50 }, //defenders external 3
            { left: 84, top: 75 }, //defenders external 4
            { left: 57, top: 15 }, //midfielders external 5
            { left: 57, top: 40 }, //midfielders external 6
            { left: 57, top: 60 }, //midfielders external 7
            { left: 57, top: 85 }, //midfielders external 8
            { left: 28, top: 20 }, //forwards external 9
            { left: 28, top: 50 }, //forwards external 10
            { left: 28, top: 80 }, //forwards external 11
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
