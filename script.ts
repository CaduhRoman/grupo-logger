import { mountHeroShowcase } from './hero-showcase';

mountHeroShowcase('#hero-showcase-root');

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

const solutionSelect = document.querySelector<HTMLSelectElement>('#contact-solution');

document.querySelectorAll<HTMLAnchorElement>('[data-solution]').forEach((link) => {
  link.addEventListener('click', () => {
    const solution = link.dataset.solution;
    if (solution && solutionSelect) solutionSelect.value = solution;
  });
});

document.querySelector<HTMLFormElement>('#contact-form')?.addEventListener('submit', async (event: SubmitEvent) => {
  event.preventDefault();
  const form = event.currentTarget as HTMLFormElement;
  const status = document.querySelector<HTMLParagraphElement>('.form-status');
  const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const formData = new FormData(form);
  const body = new URLSearchParams();

  formData.forEach((value, key) => body.append(key, String(value)));

  if (status) status.textContent = 'Enviando mensagem...';
  if (submitButton) submitButton.disabled = true;

  try {
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!response.ok) throw new Error(`Falha no envio: ${response.status}`);

    if (status) status.textContent = 'Mensagem enviada. Em breve entraremos em contato.';
    form.reset();
  } catch {
    if (status) status.textContent = 'Não foi possível enviar agora. Tente novamente ou fale conosco por e-mail.';
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
});
