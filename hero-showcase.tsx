import { StrictMode, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react';

type ProductMode = 'app' | 'system' | 'site';

const MODES: ProductMode[] = ['app', 'system', 'site'];
const MODE_LABELS: Record<ProductMode, string> = {
  app: 'Aplicativo',
  system: 'Sistema',
  site: 'Site',
};

const interfaceCopy: Record<ProductMode, { eyebrow: string; title: string; subtitle: string }> = {
  app: { eyebrow: 'Resumo do dia', title: 'Olá, Marina.', subtitle: 'Sua operação em um só lugar.' },
  system: { eyebrow: 'Visão geral', title: 'Painel da empresa', subtitle: 'Informações para decidir e agir.' },
  site: { eyebrow: 'FEITO PARA VOCÊ', title: 'Impulsione sua marca.', subtitle: 'Uma presença digital que aproxima pessoas e oportunidades.' },
};

function StatusIcon({ kind }: { kind: 'home' | 'clients' | 'stock' | 'money' | 'invoice' }) {
  const paths = {
    home: <><path d="M3 10.5 10 4l7 6.5"/><path d="M5.5 9.5V17h9V9.5"/></>,
    clients: <><circle cx="7" cy="7" r="3"/><path d="M2.5 17c.7-3.2 2.2-5 4.5-5s3.8 1.8 4.5 5"/><path d="M13 5.5a2.5 2.5 0 0 1 0 5M13 12c2.5.2 3.8 1.8 4.5 5"/></>,
    stock: <><path d="m3 7 7-4 7 4-7 4Z"/><path d="m3 7 7 4 7-4v7l-7 4-7-4Z"/></>,
    money: <><rect x="2.5" y="4" width="15" height="12" rx="2"/><path d="M6 10h8M10 7v6"/></>,
    invoice: <><path d="M5 2.5h8l2 2V18l-2-1-2 1-2-1-2 1-2-1Z"/><path d="M8 8h4M8 11h4"/></>,
  };
  return <svg viewBox="0 0 20 20" aria-hidden="true">{paths[kind]}</svg>;
}

function ShowcaseNav({ mode }: { mode: ProductMode }) {
  const systemItems: Array<[string, Parameters<typeof StatusIcon>[0]['kind']]> = [
    ['Visão geral', 'home'], ['Clientes', 'clients'], ['Estoque', 'stock'], ['Financeiro', 'money'], ['Emitir NF', 'invoice'],
  ];
  const appItems = systemItems.slice(0, 4);

  if (mode === 'site') {
    return (
      <motion.nav className="demo-nav demo-nav--site" layout>
        <motion.strong layoutId="demo-brand">NOVA</motion.strong>
        <span>Serviços</span><span>Sobre</span><i aria-hidden="true"></i>
      </motion.nav>
    );
  }

  const items = mode === 'app' ? appItems : systemItems;
  return (
    <motion.nav className={`demo-nav demo-nav--${mode}`} layout>
      {mode === 'system' && <motion.strong layoutId="demo-brand">NOVA</motion.strong>}
      {items.map(([label, icon], index) => (
        <motion.div className={index === 0 ? 'is-active' : ''} layout key={label}>
          <StatusIcon kind={icon} />
          <span>{label}</span>
        </motion.div>
      ))}
    </motion.nav>
  );
}

function MetricCard({ index, mode }: { index: number; mode: ProductMode }) {
  const values = mode === 'system'
    ? [['Vendas hoje', 'R$ 8,4 mil'], ['Novos clientes', '24'], ['Pedidos', '68']]
    : [['Em andamento', '08'], ['Concluídos', '21'], ['Equipe', '12']];
  const [label, value] = values[index];
  return (
    <motion.div className={`demo-metric demo-metric--${index + 1}`} layout="position">
      <motion.span layout>{label}</motion.span>
      <motion.strong layout>{value}</motion.strong>
      <motion.i layout style={{ width: `${54 + index * 15}%` }} />
    </motion.div>
  );
}

function ProductShowcase() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(reduceMotion ? 1 : 0);
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 800px)').matches);
  const mode = MODES[index];
  const copy = interfaceCopy[mode];

  useEffect(() => {
    const media = window.matchMedia('(max-width: 800px)');
    const updateCompact = () => setCompact(media.matches);
    updateCompact();
    media.addEventListener('change', updateCompact);
    return () => media.removeEventListener('change', updateCompact);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const interval = window.setInterval(() => setIndex(current => (current + 1) % MODES.length), 4400);
    return () => window.clearInterval(interval);
  }, [reduceMotion]);

  const shellAnimation = useMemo(() => ({
    width: mode === 'app' ? (compact ? '68%' : '43%') : '100%',
    height: mode === 'app' ? (compact ? 396 : 430) : mode === 'system' ? 386 : 360,
    borderRadius: mode === 'app' ? 34 : mode === 'system' ? 14 : 5,
  }), [compact, mode]);

  return (
    <MotionConfig transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 92, damping: 19, mass: .85 }}>
      <div className="product-showcase">
        <div className="showcase-heading">
          <span>SOLUÇÕES QUE GANHAM FORMA</span>
        </div>
        <div className="showcase-stage">
          <motion.div
            className={`product-shell product-shell--${mode}`}
            animate={{ ...shellAnimation, opacity: 1, scale: 1, y: 0 }}
            initial={reduceMotion ? false : { opacity: 0, scale: .94, y: 18 }}
            layout
          >
            <motion.div className="device-top" layout>
              <div className="window-controls"><i/><i/><i/></div>
              <span>{mode === 'app' ? '9:41' : mode === 'system' ? 'Painel administrativo' : 'novastudio.com'}</span>
              <b>{mode === 'app' ? '●' : '•••'}</b>
            </motion.div>
            <div className="product-interface">
              <ShowcaseNav mode={mode} />
              <motion.main className="demo-main" layout>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div className="demo-copy" key={mode} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .35 }}>
                    <span>{copy.eyebrow}</span>
                    <h3>{copy.title}</h3>
                    <p>{copy.subtitle}</p>
                  </motion.div>
                </AnimatePresence>
                <motion.div className="demo-cards" layout>
                  {[0, 1, 2].map(cardIndex => <MetricCard index={cardIndex} mode={mode} key={cardIndex} />)}
                </motion.div>
                <AnimatePresence initial={false}>
                  {mode === 'system' && (
                    <motion.div className="demo-chart" initial={{ opacity: 0, scaleY: .5 }} animate={{ opacity: 1, scaleY: 1 }} exit={{ opacity: 0 }}>
                      {[32, 48, 39, 70, 57, 82, 69].map((height, bar) => <i style={{ height: `${height}%` }} key={bar}/>) }
                    </motion.div>
                  )}
                  {mode === 'site' && (
                    <motion.div className="site-art" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <i/><i/><i/><i/>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.main>
            </div>
          </motion.div>
        </div>
        <p className="showcase-caption">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={mode} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: .25 }}>
              {MODE_LABELS[mode]}
            </motion.span>
          </AnimatePresence>
          <small>Uma mesma capacidade, diferentes formas de mover seu negócio.</small>
        </p>
      </div>
    </MotionConfig>
  );
}

export function mountHeroShowcase(selector: string) {
  const container = document.querySelector(selector);
  if (!container) return;
  createRoot(container).render(<StrictMode><ProductShowcase /></StrictMode>);
}
