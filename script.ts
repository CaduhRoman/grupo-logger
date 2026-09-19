const menuToggle = document.querySelector<HTMLButtonElement>('.menu-toggle');
const nav = document.querySelector<HTMLElement>('.desktop-nav');

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  nav?.classList.toggle('is-open', !isOpen);
});

document.querySelectorAll<HTMLAnchorElement>('.desktop-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    nav?.classList.remove('is-open');
  });
});

document.querySelector<HTMLFormElement>('#contact-form')?.addEventListener('submit', (event: SubmitEvent) => {
  event.preventDefault();
  const status = document.querySelector<HTMLParagraphElement>('.form-status');
  if (status) status.textContent = 'Obrigado. Em breve entraremos em contato.';
  (event.currentTarget as HTMLFormElement).reset();
});
