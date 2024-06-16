export function updateScore(game) {
    document.getElementById('scoreInternal').textContent = game.scoreInternal;
    document.getElementById('scoreExternal').textContent = game.scoreExternal;
    const scoreElements = [document.getElementById('scoreInternal'), document.getElementById('scoreExternal')];
    scoreElements.forEach(element => {
        element.classList.add('score-changed');
        setTimeout(() => {
            element.classList.remove('score-changed');
        }, 6000);
    });
}
