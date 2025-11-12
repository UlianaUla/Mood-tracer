// Модуль для анимаций
class Animations {
    static createConfetti() {
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
                confetti.style.animationDelay = Math.random() * 0.5 + 's';
                document.body.appendChild(confetti);

                setTimeout(() => confetti.remove(), 3000);
            }, i * 100);
        }
    }

    static showHappyMessage() {
        const messages = [
            "Отлично! 🎉",
            "Супер! ✨",
            "Замечательно! 🌟",
            "Превосходно! 💫",
            "Восхитительно! 🌈",
            "У вас отличный день! 😊",
            "Так держать! 👍"
        ];
        const message = messages[Math.floor(Math.random() * messages.length)];

        const messageEl = document.createElement('div');
        messageEl.className = 'happy-message';
        messageEl.textContent = message;
        document.body.appendChild(messageEl);

        setTimeout(() => messageEl.remove(), 2500);
    }

    static danceEmojis() {
        document.querySelectorAll('.mood-emoji').forEach(emoji => {
            emoji.classList.add('dance');
            setTimeout(() => emoji.classList.remove('dance'), 2000);
        });
    }

    static bounceStats() {
        document.querySelectorAll('.stat-card').forEach(card => {
            card.classList.add('bounce');
            setTimeout(() => card.classList.remove('bounce'), 1000);
        });
    }

    static showConfirmation(button) {
        const originalText = button.textContent;
        const originalBackground = button.style.background;

        button.textContent = '✓ Сохранено!';
        button.style.background = 'linear-gradient(135deg, #66bb6a, #26c6da)';

        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = originalBackground;
        }, 2000);
    }
}