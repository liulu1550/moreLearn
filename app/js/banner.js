let currentSlide = 0;

function showSlide(index) {
    const slider = document.getElementById('slider');
    const slides = document.getElementsByClassName('slide');
    const dots = document.getElementsByClassName('dot');

    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }

    slider.style.transform = 'translateX(' + (-currentSlide * 100) + '%)';

    // Update active dot
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove('active');
    }
    dots[currentSlide].classList.add('active');
}

function toggleControls(show) {
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');

    prevButton.style.display = show ? 'block' : 'none';
    nextButton.style.display = show ? 'block' : 'none';
}

function createDots() {
    const slider = document.getElementById('slider');
    const slides = document.getElementsByClassName('slide');
    const dotsContainer = document.getElementById('dots-container');

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.addEventListener('click', () => showSlide(i));
        dotsContainer.appendChild(dot);
    }


    dotsContainer.children[0].classList.add('active');
}

window.addEventListener('resize', showSlide.bind(null, currentSlide));
document.getElementById('prev').addEventListener('click', () => showSlide(currentSlide - 1));
document.getElementById('next').addEventListener('click', () => showSlide(currentSlide + 1));
document.getElementById('slider-container').addEventListener('mouseenter', () => toggleControls(true));
document.getElementById('slider-container').addEventListener('mouseleave', () => toggleControls(false));

createDots();
showSlide(currentSlide);