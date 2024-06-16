export function updateActionButtonColors(game) {
    const currentTeam = game.ball.getCurrentPlayer().playerCurrent;
    const buttons = document.querySelectorAll('#passButton, #shootButton');
    buttons.forEach(button => {
        if (currentTeam === 'internal') {
            button.style.backgroundColor = 'blue';
        } else {
            button.style.backgroundColor = 'red';
        }
    });
}
