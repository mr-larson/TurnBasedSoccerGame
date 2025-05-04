export function animateActionButtons() {
    const buttons = document.querySelectorAll('#passButton, #shootButton, #dribbleButton');
    buttons.forEach(button => {
        button.classList.add('score-changed');
        setTimeout(() => {
            button.classList.remove('score-changed');
        }, 1500); // Duration of the animation
    });
}
