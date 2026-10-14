const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.main-nav');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('open', !open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
  }));
}

const lightbox = document.querySelector('.lightbox');
if (lightbox) {
  const lightboxImage = lightbox.querySelector('img');
  const lightboxCaption = lightbox.querySelector('p');
  document.querySelectorAll('.gallery-item').forEach(item => item.addEventListener('click', () => {
    lightboxImage.src = item.dataset.image;
    lightboxImage.alt = item.querySelector('img').alt;
    lightboxCaption.textContent = item.dataset.caption;
    lightbox.showModal();
  }));
  lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) lightbox.close();
  });
}

const cookieBanner = document.getElementById('cookie-banner');
const cookieChoice = localStorage.getItem('malagorden-cookie-choice');

function enableAnalytics() {
  window.gtag?.('consent', 'update', { analytics_storage: 'granted' });
  const analyticsScript = document.createElement('script');
  analyticsScript.async = true;
  analyticsScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-K83YF4FW00';
  document.head.appendChild(analyticsScript);
  window.gtag?.('js', new Date());
  window.gtag?.('config', 'G-K83YF4FW00');
}

if (cookieChoice === 'accepted') {
  enableAnalytics();
} else if (!cookieChoice && cookieBanner) {
  cookieBanner.hidden = false;
}

document.getElementById('cookie-accept')?.addEventListener('click', () => {
  localStorage.setItem('malagorden-cookie-choice', 'accepted');
  enableAnalytics();
  cookieBanner.hidden = true;
});

document.getElementById('cookie-decline')?.addEventListener('click', () => {
  localStorage.setItem('malagorden-cookie-choice', 'declined');
  cookieBanner.hidden = true;
});
