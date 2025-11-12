// Слайдер
class Slider {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.nav-dot');
        this.slider = document.getElementById('slider');
        this.slideInterval = null;
        this.init();
    }

    init() {
        this.startSlideInterval();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Остановка прокрутки при наведении
        const sliderContainer = document.querySelector('.slider-container');
        sliderContainer.addEventListener('mouseenter', () => {
            this.stopSlideInterval();
        });

        sliderContainer.addEventListener('mouseleave', () => {
            this.startSlideInterval();
        });
    }

    showSlide(n) {
        this.currentSlide = (n + this.slides.length) % this.slides.length;
        this.slider.style.transform = `translateX(-${this.currentSlide * 100}%)`;

        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }

    nextSlide() {
        this.showSlide(this.currentSlide + 1);
    }

    prevSlide() {
        this.showSlide(this.currentSlide - 1);
    }

    goToSlide(n) {
        this.showSlide(n);
        this.resetSlideInterval();
    }

    startSlideInterval() {
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, 4000);
    }

    stopSlideInterval() {
        clearInterval(this.slideInterval);
    }

    resetSlideInterval() {
        this.stopSlideInterval();
        this.startSlideInterval();
    }
}

// Инициализация слайдера
const slider = new Slider();