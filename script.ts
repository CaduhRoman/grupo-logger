// WhatsApp comercial (DDI + DDD + número, só dígitos).
const WHATSAPP_NUMBER = '5515996496820';
const WHATSAPP_MESSAGE = 'Oi! Quero vender mais. Podemos conversar?';

function linkToWhatsapp(link: HTMLAnchorElement, message: string) {
  link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  link.target = '_blank';
  link.rel = 'noopener';
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* Título: o cursor apaga a frase e digita a próxima */

// "prospectar mais" é a mais longa; o tamanho do título é calculado para ela caber.
const PHRASES = [
  'vender mais', 'prospectar mais', 'faturar mais', 'atender mais', 'crescer mais',
  'lucrar mais', 'fechar mais', 'fidelizar mais', 'aparecer mais', 'divulgar mais',
];
const HOLD_MS = 5000;

const typedEl = document.querySelector<HTMLElement>('[data-typed]');
const caretEl = document.querySelector<HTMLElement>('[data-caret]');
const titleEl = document.querySelector<HTMLElement>('#hero-title .sr-only');

function shuffle<T>(list: T[]) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Ordem sorteada a cada visita; ao fim da rodada, embaralha de novo sem repetir a última frase.
let order = shuffle(PHRASES);
let phraseIndex = 0;
let typingTimer: number | undefined;

function showPhrase(phrase: string) {
  if (typedEl) typedEl.textContent = phrase;
  if (titleEl) titleEl.textContent = `Bora ${phrase}?`;
}

function nextPhrase() {
  phraseIndex += 1;
  if (phraseIndex >= order.length) {
    const last = order[order.length - 1];
    order = shuffle(PHRASES);
    if (order[0] === last) order.push(order.shift()!);
    phraseIndex = 0;
  }
  return order[phraseIndex];
}

showPhrase(order[0]);

function setTyping(active: boolean) {
  caretEl?.classList.toggle('is-typing', active);
}

function erase(then: () => void) {
  if (!typedEl) return;
  setTyping(true);
  const step = () => {
    const text = typedEl.textContent ?? '';
    if (!text.length) return then();
    typedEl.textContent = text.slice(0, -1);
    typingTimer = window.setTimeout(step, 38);
  };
  step();
}

function type(phrase: string, then: () => void) {
  if (!typedEl) return;
  let length = 0;
  const step = () => {
    length += 1;
    typedEl.textContent = phrase.slice(0, length);
    if (length >= phrase.length) {
      setTyping(false);
      return then();
    }
    typingTimer = window.setTimeout(step, 62 + Math.random() * 50);
  };
  typingTimer = window.setTimeout(step, 260);
}

function cycle() {
  typingTimer = window.setTimeout(() => {
    const phrase = nextPhrase();
    erase(() => type(phrase, () => {
      showPhrase(phrase);
      cycle();
    }));
  }, HOLD_MS);
}

function stopTyping() {
  window.clearTimeout(typingTimer);
  setTyping(false);
  showPhrase(order[phraseIndex]);
}

/* Relógio da tela de bloqueio */

const timeEl = document.querySelector<HTMLElement>('[data-lock-time]');
const dateEl = document.querySelector<HTMLElement>('[data-lock-date]');
const statusTimeEl = document.querySelector<HTMLElement>('[data-status-time]');
const dateFormat = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

function updateClock() {
  const now = new Date();
  const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
  if (timeEl) timeEl.textContent = time;
  if (statusTimeEl) statusTimeEl.textContent = time;
  if (dateEl) dateEl.textContent = dateFormat.format(now);
}

updateClock();
setInterval(updateClock, 15_000);

/* Notificações */

type Notice = { kind: 'bank' | 'chat'; title: string; text: string };

const PAYERS = [
  'Mariana Souza', 'João Pedro Lima', 'Camila Ferreira', 'Rafael Oliveira', 'Beatriz Santos', 'Lucas Almeida',
  'Juliana Rocha', 'Thiago Martins', 'Patrícia Gomes', 'Felipe Carvalho', 'Larissa Ribeiro', 'André Barbosa',
];

const REQUESTS: Array<[string, string]> = [
  ['Ana', '50 camisetas com a logo da empresa.'],
  ['Carla', 'o bolo de aniversário do dia 14, umas 40 pessoas.'],
  ['Marcos', 'instalar ar-condicionado em 3 salas.'],
  ['Renata', 'o buffet do casamento, 120 convidados.'],
  ['Diego', 'reformar o banheiro do apartamento.'],
  ['Fernanda', '200 marmitas por semana para a minha equipe.'],
  ['Paulo', 'as fotos dos produtos da loja.'],
  ['Bruna', 'a mudança no sábado de manhã.'],
  ['Gustavo', 'a manutenção da frota, são 6 vans.'],
  ['Letícia', 'os uniformes da clínica.'],
];

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];

function randomAmount() {
  const reais = Math.round(40 + Math.random() ** 2 * 4800);
  const cents = pick([0, 0, 0, 50, 90, Math.floor(Math.random() * 100)]);
  return money.format(reais + cents / 100);
}

let lastPayer = '';
let lastRequest = -1;

function bankNotice(): Notice {
  let payer = pick(PAYERS);
  while (payer === lastPayer) payer = pick(PAYERS);
  lastPayer = payer;
  return { kind: 'bank', title: `Pix recebido · ${randomAmount()}`, text: `Você recebeu um Pix de ${payer}.` };
}

function chatNotice(): Notice {
  let index = Math.floor(Math.random() * REQUESTS.length);
  if (index === lastRequest) index = (index + 1) % REQUESTS.length;
  lastRequest = index;
  const [name, item] = REQUESTS[index];
  return { kind: 'chat', title: 'Novo pedido de orçamento', text: `${name}: Oi! Quero um orçamento para ${item}` };
}

const ICONS = {
  bank: '<svg viewBox="0 0 38 38" fill="#000"><path d="M19 8.5 8.5 14v1.8h21V14L19 8.5Z"/><rect x="10.6" y="17.4" width="2.6" height="8.2" rx=".5"/><rect x="15.8" y="17.4" width="2.6" height="8.2" rx=".5"/><rect x="20.9" y="17.4" width="2.6" height="8.2" rx=".5"/><rect x="26" y="17.4" width="2.6" height="8.2" rx=".5"/><rect x="8.5" y="27" width="21" height="2.6" rx=".6"/></svg>',
  chat: '<svg viewBox="0 0 38 38"><path fill="none" stroke="#fff" stroke-width="2.2" d="M19 7.6a11.2 11.2 0 0 0-9.7 16.8l-1.6 5.9 6-1.6A11.2 11.2 0 1 0 19 7.6Z"/><path fill="#fff" d="M24.6 21.4c-.3-.15-1.8-.9-2.1-1-.28-.1-.48-.15-.68.15l-.95 1.2c-.18.2-.35.22-.65.07a8.3 8.3 0 0 1-4.1-3.6c-.3-.53.31-.5.88-1.64.1-.2.05-.37-.03-.52l-.95-2.27c-.25-.6-.5-.5-.68-.51h-.58c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5s1.07 2.9 1.22 3.1c.15.2 2.1 3.2 5.1 4.5 1.9.82 2.64.9 3.6.75.58-.09 1.8-.73 2.04-1.44.25-.7.25-1.32.18-1.44-.08-.13-.28-.2-.58-.35Z"/></svg>',
};

function createCard(notice: Notice) {
  const li = document.createElement('li');
  li.className = 'notification';

  const icon = document.createElement('span');
  icon.className = `notification__icon notification__icon--${notice.kind}`;
  icon.innerHTML = ICONS[notice.kind];

  const body = document.createElement('div');
  body.className = 'notification__body';
  const head = document.createElement('div');
  head.className = 'notification__head';
  const title = document.createElement('span');
  title.className = 'notification__title';
  title.textContent = notice.title;
  const time = document.createElement('span');
  time.className = 'notification__time';
  time.textContent = 'agora';
  const text = document.createElement('p');
  text.className = 'notification__text';
  text.textContent = notice.text;

  head.append(title, time);
  body.append(head, text);
  li.append(icon, body);
  return li;
}

const list = document.querySelector<HTMLOListElement>('[data-notifications]');
const MAX_VISIBLE = 4;

let nextKind: Notice['kind'] = 'bank';
let noticeTimer: number | undefined;
// Com o celular desbloqueado a tela de bloqueio some, então as notificações param.
let phoneUnlocked = false;

function nextNotice() {
  const notice = nextKind === 'bank' ? bankNotice() : chatNotice();
  nextKind = nextKind === 'bank' ? 'chat' : 'bank';
  return notice;
}

function restack() {
  if (!list) return;
  const cards = Array.from(list.querySelectorAll<HTMLLIElement>('.notification:not([data-state="leave"])'));
  cards.forEach((card, index) => {
    card.style.setProperty('--i', String(index));
    if (index >= MAX_VISIBLE) {
      card.dataset.state = 'leave';
      const remove = () => card.remove();
      card.addEventListener('transitionend', remove, { once: true });
      window.setTimeout(remove, 800);
    }
  });
}

function deliver() {
  if (!list) return;
  const card = createCard(nextNotice());
  card.dataset.state = 'enter';
  list.prepend(card);
  restack();
  // Dois frames garantem que o estado inicial foi pintado antes da transição.
  requestAnimationFrame(() => requestAnimationFrame(() => delete card.dataset.state));
}

function schedule(delay = 2000 + Math.random() * 2000) {
  window.clearTimeout(noticeTimer);
  noticeTimer = window.setTimeout(() => {
    deliver();
    schedule();
  }, delay);
}

/* Ciclo de vida: movimento reduzido e aba oculta */

function stopAll() {
  window.clearTimeout(noticeTimer);
  stopTyping();
}

function showStatic() {
  if (!list) return;
  list.replaceChildren();
  for (let i = 0; i < 3; i += 1) list.append(createCard(nextNotice()));
  restack();
}

function start() {
  stopAll();
  if (reducedMotion.matches) {
    showStatic();
    return;
  }
  if (document.hidden) return;
  if (!phoneUnlocked) schedule(list?.childElementCount ? undefined : 900);
  cycle();
}

document.addEventListener('visibilitychange', () => {
  if (reducedMotion.matches) return;
  if (document.hidden) stopAll();
  else start();
});

reducedMotion.addEventListener('change', () => {
  list?.replaceChildren();
  start();
});

start();

/* Falar com vendas: a hero troca o texto e o celular abre a solução escolhida */

type Need = 'site' | 'auto' | 'gestao';
type Mode = 'intro' | 'sales';

// Ordem dos cards no seletor de apps, igual à ordem das opções.
const NEEDS: Need[] = ['site', 'auto', 'gestao'];

const NEED_INFO: Record<Need, { tone: 'light' | 'dark'; message: string; label: string }> = {
  site: {
    tone: 'dark',
    message: 'Oi! Preciso de um site para aumentar minhas vendas. Podemos conversar?',
    label: 'iPhone com o site de uma loja aberto, mostrando produtos e serviços',
  },
  auto: {
    tone: 'light',
    message: 'Oi! Preciso automatizar um processo da minha empresa. Podemos conversar?',
    label: 'iPhone com um app de automação executando sozinho as etapas de um pedido',
  },
  gestao: {
    tone: 'dark',
    message: 'Oi! Preciso de um software para gerenciar minha empresa melhor. Podemos conversar?',
    label: 'iPhone com um painel de gestão mostrando faturamento e pedidos do dia',
  },
};

const IOS_EASE = 'cubic-bezier(.32, .72, 0, 1)';
const SWITCH_MS = 1300;

const hero = document.querySelector<HTMLElement>('.hero');
const panels: Record<Mode, HTMLElement | null> = {
  intro: document.querySelector('[data-panel="intro"]'),
  sales: document.querySelector('[data-panel="sales"]'),
};
const salesLink = document.querySelector<HTMLAnchorElement>('[data-sales-link]');
const salesCta = document.querySelector<HTMLAnchorElement>('[data-sales-cta]');
const needButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-need]'));
const device = document.querySelector<HTMLElement>('.hero-device');
const deviceLabel = device?.getAttribute('aria-label') ?? '';
const narrow = window.matchMedia('(max-width: 960px)');

const screenEl = document.querySelector<HTMLElement>('[data-screen]');
const lockEl = document.querySelector<HTMLElement>('[data-lockscreen]');
const appsEl = document.querySelector<HTMLElement>('[data-apps]');
const appEls = new Map(NEEDS.map((need) => [need, document.querySelector<HTMLElement>(`[data-app="${need}"]`)]));

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

if (salesCta) linkToWhatsapp(salesCta, WHATSAPP_MESSAGE);

/* Modo da hero */

let panelExit: Animation | undefined;

function showPanel(mode: Mode) {
  (Object.keys(panels) as Mode[]).forEach((key) => {
    const panel = panels[key];
    if (panel) panel.hidden = key !== mode;
  });
}

function setMode(mode: Mode) {
  if (!hero || hero.dataset.mode === mode) return;
  hero.dataset.mode = mode;
  hero.classList.add('has-switched');
  salesLink?.setAttribute('aria-current', String(mode === 'sales'));

  panelExit?.cancel();
  const visible = Object.values(panels).find((panel) => panel && !panel.hidden);
  if (!visible || visible === panels[mode] || reducedMotion.matches) {
    showPanel(mode);
  } else {
    const exit = visible.animate(
      [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-.75rem)' }],
      { duration: 220, easing: 'ease-in', fill: 'forwards' },
    );
    panelExit = exit;
    exit.onfinish = () => {
      // Uma troca mais nova pode ter começado enquanto esta saía.
      if (panelExit !== exit) return;
      showPanel(hero.dataset.mode as Mode);
      exit.cancel();
    };
  }

  if (mode === 'intro') {
    needButtons.forEach((button) => button.setAttribute('aria-pressed', 'false'));
    if (salesCta) linkToWhatsapp(salesCta, WHATSAPP_MESSAGE);
    device?.setAttribute('aria-label', deviceLabel);
    showOnPhone(null);
  } else if (window.scrollY > 0) {
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  }
}

const syncMode = () => setMode(location.hash === '#vendas' ? 'sales' : 'intro');

salesLink?.addEventListener('click', (event) => {
  event.preventDefault();
  if (location.hash !== '#vendas') history.pushState(null, '', '#vendas');
  syncMode();
});
window.addEventListener('popstate', syncMode);
window.addEventListener('hashchange', syncMode);

function choose(need: Need) {
  needButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.need === need)));
  if (salesCta) linkToWhatsapp(salesCta, NEED_INFO[need].message);
  device?.setAttribute('aria-label', NEED_INFO[need].label);
  showOnPhone(need);
  // No celular as opções ficam acima do aparelho: rola só o necessário para a tela aparecer.
  if (narrow.matches) device?.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'nearest' });
}

needButtons.forEach((button) => {
  button.addEventListener('click', () => choose(button.dataset.need as Need));
});

/* Tela do iPhone: bloqueio, desbloqueio e seletor de apps */

// null = tela bloqueada. As trocas entram numa fila: cliques rápidos só valem pelo último.
let desiredApp: Need | null = null;
let shownApp: Need | null = null;
let phoneBusy = false;

function setCurrentApp(need: Need | null) {
  appEls.forEach((el, key) => el?.classList.toggle('is-current', key === need));
}

async function unlockPhone(need: Need) {
  if (!screenEl || !lockEl) return;
  const app = appEls.get(need);
  phoneUnlocked = true;
  window.clearTimeout(noticeTimer);
  setCurrentApp(need);
  screenEl.dataset.lock = 'opening';

  if (reducedMotion.matches) {
    screenEl.dataset.lock = 'open';
    screenEl.dataset.tone = NEED_INFO[need].tone;
    return;
  }

  // O cadeado abre, a tela de bloqueio sobe e o app cresce por baixo dela.
  await wait(420);
  app?.classList.add('is-revealing');
  const slide = lockEl.animate(
    [{ transform: 'translateY(0)' }, { transform: 'translateY(-100%)' }],
    { duration: 650, easing: IOS_EASE, fill: 'forwards' },
  );
  const rise = app?.animate(
    [{ transform: 'scale(.9)', opacity: 0 }, { transform: 'none', opacity: 1 }],
    { duration: 700, delay: 90, easing: IOS_EASE, fill: 'backwards' },
  );
  window.setTimeout(() => { screenEl.dataset.tone = NEED_INFO[need].tone; }, 260);
  await slide.finished;
  screenEl.dataset.lock = 'open';
  slide.cancel();
  await rise?.finished;
  window.setTimeout(() => app?.classList.remove('is-revealing'), 1400);
}

async function lockPhone() {
  if (!screenEl || !lockEl) return;
  const app = shownApp ? appEls.get(shownApp) : null;
  screenEl.dataset.tone = 'light';

  if (!reducedMotion.matches) {
    screenEl.dataset.lock = 'closing';
    const slide = lockEl.animate(
      [{ transform: 'translateY(-100%)' }, { transform: 'translateY(0)' }],
      { duration: 560, easing: IOS_EASE, fill: 'forwards' },
    );
    const sink = app?.animate(
      [{ transform: 'none', opacity: 1 }, { transform: 'scale(.92)', opacity: .4 }],
      { duration: 560, easing: IOS_EASE, fill: 'forwards' },
    );
    await slide.finished;
    slide.cancel();
    sink?.cancel();
  }

  delete screenEl.dataset.lock;
  setCurrentApp(null);
  phoneUnlocked = false;
  if (!reducedMotion.matches && !document.hidden) schedule(700);
}

// Seletor de apps do iOS: o app encolhe virando card, o carrossel desliza até o próximo e ele volta a ocupar a tela.
async function switchApp(from: Need, to: Need) {
  if (!screenEl || !appsEl) return;
  if (reducedMotion.matches) {
    setCurrentApp(to);
    screenEl.dataset.tone = NEED_INFO[to].tone;
    return;
  }

  const scale = .64;
  const width = screenEl.clientWidth;
  const step = width * scale + width * .045;
  const fromIndex = NEEDS.indexOf(from);
  const toIndex = NEEDS.indexOf(to);
  const card = (index: number, center: number, spread = 1) =>
    `translateX(${(index - center) * step * spread}px) scale(${scale})`;
  const full = 'translateX(0px) scale(1)';

  appsEl.classList.add('is-switching');
  screenEl.dataset.tone = 'light';

  const animations = NEEDS.flatMap((need, index) => {
    const el = appEls.get(need);
    if (!el) return [];
    el.style.zIndex = need === to ? '2' : need === from ? '1' : '0';
    el.querySelector('.app__label')?.animate(
      [{ opacity: 0 }, { opacity: 1, offset: .3 }, { opacity: 1, offset: .66 }, { opacity: 0, offset: .8 }, { opacity: 0 }],
      { duration: SWITCH_MS },
    );
    // Os vizinhos entram pelas bordas enquanto o app atual encolhe, e saem quando o próximo cresce.
    return el.animate([
      { transform: index === fromIndex ? full : card(index, fromIndex, 1.7), easing: IOS_EASE },
      { transform: card(index, fromIndex), offset: .3, easing: 'cubic-bezier(.45, 0, .25, 1)' },
      { transform: card(index, toIndex), offset: .66, easing: IOS_EASE },
      { transform: index === toIndex ? full : card(index, toIndex, 1.7) },
    ], { duration: SWITCH_MS });
  });

  window.setTimeout(() => { screenEl.dataset.tone = NEED_INFO[to].tone; }, SWITCH_MS * .8);
  await Promise.all(animations.map((animation) => animation.finished));
  setCurrentApp(to);
  appsEl.classList.remove('is-switching');
  appEls.forEach((el) => el?.style.removeProperty('z-index'));
}

async function showOnPhone(target: Need | null) {
  desiredApp = target;
  if (phoneBusy) return;
  phoneBusy = true;
  try {
    while (desiredApp !== shownApp) {
      const next = desiredApp;
      if (next === null) await lockPhone();
      else if (shownApp === null) await unlockPhone(next);
      else await switchApp(shownApp, next);
      shownApp = next;
      syncAutomation();
    }
  } finally {
    phoneBusy = false;
  }
}

/* App de automação: as etapas rodam em loop enquanto ele está na tela */

const autoSteps = Array.from(document.querySelectorAll<HTMLElement>('[data-auto-steps] .step'));
const autoDone = document.querySelector<HTMLElement>('[data-auto-done]');
const autoCountEl = document.querySelector<HTMLElement>('[data-auto-count]');
const counter = new Intl.NumberFormat('pt-BR');
let autoTimer: number | undefined;
let autoStep = -1;
let autoCount = 1284;

function paintAutomation() {
  autoSteps.forEach((step, index) => {
    step.classList.toggle('is-done', index < autoStep);
    step.classList.toggle('is-running', index === autoStep);
  });
  autoDone?.classList.toggle('is-shown', autoStep === autoSteps.length);
}

function runAutomation() {
  autoStep = autoStep >= autoSteps.length ? -1 : autoStep + 1;
  if (autoStep === autoSteps.length) {
    autoCount += 1;
    if (autoCountEl) autoCountEl.textContent = counter.format(autoCount);
  }
  paintAutomation();
  const delay = autoStep === autoSteps.length ? 2200 : autoStep === -1 ? 700 : 850;
  autoTimer = window.setTimeout(runAutomation, delay);
}

function syncAutomation() {
  window.clearTimeout(autoTimer);
  if (reducedMotion.matches) {
    autoStep = autoSteps.length;
    paintAutomation();
    return;
  }
  if (shownApp === 'auto' && !document.hidden) autoTimer = window.setTimeout(runAutomation, 600);
}

document.addEventListener('visibilitychange', syncAutomation);
reducedMotion.addEventListener('change', syncAutomation);

syncAutomation();
syncMode();
