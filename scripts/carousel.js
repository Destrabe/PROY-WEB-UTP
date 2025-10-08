document.addEventListener('DOMContentLoaded', function() {
    const totalSlides = 6;
    let currentSlide = 1;

    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');

    function updateSlide(direction) {
        if (direction === 'next') {
            currentSlide = currentSlide >= totalSlides ? 1 : currentSlide + 1;
        } else {
            currentSlide = currentSlide <= 1 ? totalSlides : currentSlide - 1;
        }
        document.getElementById(`slide${currentSlide}`).checked = true;
    }

    prevButton.addEventListener('click', () => updateSlide('prev'));
    nextButton.addEventListener('click', () => updateSlide('next'));

    // Update labels to handle proper slide transitions
    function updateNavigationLabels() {
        prevButton.setAttribute('for', `slide${currentSlide <= 1 ? totalSlides : currentSlide - 1}`);
        nextButton.setAttribute('for', `slide${currentSlide >= totalSlides ? 1 : currentSlide + 1}`);
    }

    // Initialize labels
    updateNavigationLabels();

    // Listen to radio button changes to update navigation
    document.querySelectorAll('input[name="carousel"]').forEach(radio => {
        radio.addEventListener('change', function() {
            currentSlide = parseInt(this.id.replace('slide', ''));
            updateNavigationLabels();
        });
    });
});