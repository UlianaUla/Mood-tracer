// Главный модуль приложения - Трекер настроения
class MoodTracker {
    constructor() {
        this.entries = this.loadEntries();
        this.selectedMood = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        document.querySelectorAll('.mood-option').forEach(option => {
            option.addEventListener('click', () => {
                this.selectMood(option);
            });
        });

        document.getElementById('saveMood').addEventListener('click', () => {
            this.saveMood();
        });
    }

    selectMood(option) {
        document.querySelectorAll('.mood-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        option.classList.add('selected');
        this.selectedMood = {
            value: parseInt(option.dataset.mood),
            emoji: option.dataset.emoji,
            label: option.querySelector('.mood-label').textContent
        };

        // Показываем/скрываем секцию для фото
        const photoSection = document.getElementById('photoSection');
        if (this.selectedMood.value >= 4) {
            photoSection.classList.add('show');
        } else {
            photoSection.classList.remove('show');
            photoUpload.clearPhotos();
        }
    }

    saveMood() {
        if (!this.selectedMood) {
            alert('Пожалуйста, выберите ваше настроение');
            return;
        }

        const note = document.getElementById('moodNote').value.trim();
        const entry = {
            id: Date.now(),
            mood: this.selectedMood.value,
            emoji: this.selectedMood.emoji,
            label: this.selectedMood.label,
            note: note,
            photos: photoUpload.getSelectedPhotos(),
            date: new Date().toISOString(),
            timestamp: new Date()
        };

        this.entries.unshift(entry);
        this.saveEntries();
        this.render();
        this.resetForm();

        // Забавные анимации для хорошего настроения
        if (this.selectedMood.value >= 4) {
            Animations.createConfetti();
            Animations.showHappyMessage();
            Animations.danceEmojis();
            setTimeout(Animations.bounceStats, 500);
        }

        Animations.showConfirmation(document.getElementById('saveMood'));
    }

    resetForm() {
        this.selectedMood = null;
        document.querySelectorAll('.mood-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        document.getElementById('moodNote').value = '';
        document.getElementById('photoSection').classList.remove('show');
        photoUpload.clearPhotos();
    }

    deleteEntry(id) {
        if (confirm('Удалить эту запись?')) {
            this.entries = this.entries.filter(entry => entry.id !== id);
            this.saveEntries();
            this.render();
        }
    }

    loadEntries() {
        const saved = localStorage.getItem('moodTrackerEntries');
        return saved ? JSON.parse(saved).map(entry => ({
            ...entry,
            timestamp: new Date(entry.timestamp)
        })) : [];
    }

    saveEntries() {
        localStorage.setItem('moodTrackerEntries', JSON.stringify(this.entries));
    }

    calculateStats() {
        if (this.entries.length === 0) {
            return { total: 0, average: 0, streak: 0 };
        }

        const total = this.entries.length;
        const average = (this.entries.reduce((sum, entry) => sum + entry.mood, 0) / total).toFixed(1);

        let streak = 1;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 1; i < this.entries.length; i++) {
            const currentDate = new Date(this.entries[i].timestamp);
            currentDate.setHours(0, 0, 0, 0);

            const prevDate = new Date(this.entries[i - 1].timestamp);
            prevDate.setHours(0, 0, 0, 0);

            const diffTime = currentDate - prevDate;
            const diffDays = diffTime / (1000 * 60 * 60 * 24);

            if (diffDays === 1) streak++;
            else break;
        }

        return { total, average, streak };
    }

    render() {
        this.renderStats();
        this.renderChart();
        this.renderHistory();
    }

    renderStats() {
        const stats = this.calculateStats();
        document.getElementById('totalEntries').textContent = stats.total;
        document.getElementById('avgMood').textContent = stats.average;
        document.getElementById('currentStreak').textContent = stats.streak;
    }

    renderChart() {
        const ctx = document.getElementById('moodChart').getContext('2d');
        const recentEntries = this.entries.slice(0, 7).reverse();

        const dates = recentEntries.map(entry => {
            const date = new Date(entry.timestamp);
            return date.toLocaleDateString('ru-RU', {
                month: 'short',
                day: 'numeric'
            });
        });

        const moods = recentEntries.map(entry => entry.mood);

        if (window.moodChartInstance) {
            window.moodChartInstance.destroy();
        }

        window.moodChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Настроение',
                    data: moods,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 1,
                        max: 5,
                        ticks: {
                            stepSize: 1,
                            callback: function (value) {
                                const moodLabels = ['', 'Ужасно', 'Плохо', 'Нормально', 'Хорошо', 'Отлично'];
                                return moodLabels[value];
                            }
                        }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    renderHistory() {
        const historyContainer = document.getElementById('moodHistory');

        if (this.entries.length === 0) {
            historyContainer.innerHTML = '<div class="empty-state">Пока нет записей. Добавьте ваше первое настроение!</div>';
            return;
        }

        historyContainer.innerHTML = this.entries.map(entry => `
            <div class="mood-entry">
                <div class="entry-emoji">${entry.emoji}</div>
                <div class="entry-details">
                    <div class="entry-mood">${entry.label}</div>
                    ${entry.note ? `<div class="entry-note">${entry.note}</div>` : ''}
                    ${entry.photos && entry.photos.length > 0 ? `
                        <div style="margin-top: 10px;">
                            <small style="color: #42a5f5;"><i class="fas fa-camera"></i> ${entry.photos.length} фото</small>
                        </div>
                    ` : ''}
                    <div class="entry-date">${new Date(entry.timestamp).toLocaleString('ru-RU')}</div>
                </div>
                <button class="delete-btn" onclick="moodTracker.deleteEntry(${entry.id})">Удалить</button>
            </div>
        `).join('');
    }
}

// Инициализация приложения
const moodTracker = new MoodTracker();