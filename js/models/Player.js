export class Player {
    constructor(id, position) {
        this.id = id;
        this.position = position;
    }

    setPosition(left, top) {
        const playerElement = document.getElementById(this.id);
        playerElement.style.left = `${left}%`;
        playerElement.style.top = `${top}%`;
    }
}
