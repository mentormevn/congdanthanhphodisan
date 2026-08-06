document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     1. SCROLL REVEAL (IntersectionObserver)
     ========================================================= */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.7
  });

  revealEls.forEach((el) => revealObserver.observe(el));

  /* =========================================================
     2. HERO PARALLAX ON SCROLL
     ========================================================= */
  const heroImg = document.querySelector('.hero__img');
  const hero = document.getElementById('hero');

  function updateParallax() {
    if (!hero || !heroImg) return;

    const rect = hero.getBoundingClientRect();

    if (rect.bottom < 0 || rect.top > window.innerHeight) return;

    const offset = window.scrollY * 0.25;
    heroImg.style.transform = `translateY(${offset}px) scale(1.08)`;
  }

  window.addEventListener('scroll', updateParallax, { passive: true });

/* =========================================================
   3. IDENTITY SLIDER (Đã tối ưu mượt mà)
   ========================================================= */
const track = document.getElementById('sliderTrack');
const arrow = document.getElementById('sliderArrow');
const dots = document.querySelectorAll('#sliderDots .dot');
const btn = document.getElementById('identityBtn');
const btnText = document.getElementById('identityBtnText');

const slideLabels = ['FRAME AVATAR', 'COVER FACEBOOK'];
const slideLinks = [btn?.dataset.linkFrame || '#', btn?.dataset.linkCover || '#'];

let currentIndex = 0;
const totalSlides = 2;
let isAnimating = false; // Chống spam click liên tục gây giật

function goToSlide(index) {
  if (isAnimating) return; // Nếu đang trượt thì bỏ qua click tiếp theo
  isAnimating = true;

  currentIndex = (index + totalSlides) % totalSlides;

  // 1. Dùng requestAnimationFrame để trượt mượt mà hơn
  requestAnimationFrame(() => {
    track.style.transform = `translateX(-${currentIndex * 50}%)`;
  });

  // 2. Cập nhật trạng thái các chấm Dots và Mũi tên
  dots.forEach((dot, i) => {
    dot.classList.toggle('dot--active', i === currentIndex);
  });
  arrow.classList.toggle('is-prev', currentIndex === totalSlides - 1);

  // 3. Fade out nút -> đổi chữ -> Fade in nút
  btn.classList.add('is-fading');
  
  setTimeout(() => {
    btnText.textContent = slideLabels[currentIndex];
    btn.href = slideLinks[currentIndex] || '#';
    btn.classList.remove('is-fading');
    isAnimating = false; // Mở lại cho phép click tiếp
  }, 200); // 200ms khớp với thời gian transition opacity trong CSS
}

arrow.addEventListener('click', () => {
  goToSlide(currentIndex + 1);
});

dots.forEach((dot) => {
  dot.addEventListener('click', () => {
    goToSlide(parseInt(dot.dataset.index, 10));
  });
});

  /* =========================================================
     4. SWIPE SUPPORT
     ========================================================= */

  const viewport = document.querySelector('.slider__viewport');

  let touchStartX = 0;
  let touchEndX = 0;

  viewport.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {

    const delta = touchEndX - touchStartX;
    const threshold = 40;

    if (delta > threshold) {
      goToSlide(currentIndex - 1);
    } else if (delta < -threshold) {
      goToSlide(currentIndex + 1);
    }

  }

});
