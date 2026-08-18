import { Hono } from 'hono'
import { secureHeaders } from 'hono/secure-headers'
import type { FC } from 'hono/jsx'
import { archive, groupEmail, library, network, researchLines, type ArchiveItem } from './content'

type Bindings = {
  ASSETS: Fetcher
}

type LayoutProps = {
  title: string
  description: string
  path: string
  origin: string
  children?: unknown
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    fontSrc: ["'self'", 'https://fonts.gstatic.com'],
    imgSrc: ["'self'", 'data:'],
    scriptSrc: ["'self'"],
    connectSrc: ["'self'"],
    frameAncestors: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'", 'mailto:']
  },
  referrerPolicy: 'strict-origin-when-cross-origin',
  xFrameOptions: 'DENY'
}))

app.use('*', async (c, next) => {
  await next()
  c.header('X-Ius-Gentium-Edition', 'Caderno-01')
  if (c.res.headers.get('Content-Type')?.includes('text/html')) {
    c.header('Cache-Control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400')
  }
})

const assetPaths = ['/site.css', '/site.js', '/logo-48.webp', '/logo-120.webp', '/logo-300.webp']

assetPaths.forEach((assetPath) => {
  app.on(['GET', 'HEAD'], assetPath, (c) => c.env.ASSETS.fetch(c.req.raw))
})

app.on('HEAD', '*', (c) => {
  const requestedPath = new URL(c.req.url).pathname
  const fixedPages = ['/', '/sobre', '/coordenador', '/pesquisa', '/arquivo', '/biblioteca', '/contato']
  const legacyPages = Object.keys(legacyRedirects)
  const dossierExists = requestedPath.startsWith('/arquivo/') && archive.some((item) => `/arquivo/${item.slug}` === requestedPath)
  const apiExists = ['/api/archive', '/api/highlight', '/api/network'].includes(requestedPath)
  const exists = fixedPages.includes(requestedPath) || legacyPages.includes(requestedPath) || dossierExists || apiExists
  return new Response(null, {
    status: exists ? 200 : 404,
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=300',
      'Content-Type': requestedPath.startsWith('/api/') ? 'application/json' : 'text/html; charset=UTF-8'
    }
  })
})

const navItems = [
  { href: '/sobre', label: 'O grupo' },
  { href: '/pesquisa', label: 'Pesquisa' },
  { href: '/arquivo', label: 'Arquivo vivo' },
  { href: '/biblioteca', label: 'Biblioteca' },
  { href: '/coordenador', label: 'Coordenação' }
]

const Layout: FC<LayoutProps> = ({ title, description, path, origin, children }) => {
  const canonical = `${origin}${path === '/' ? '' : path}`
  return (
    <html lang="pt-BR" data-theme="paper">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="theme-color" content="#0F1A24" />
        <meta name="color-scheme" content="light" />
        <link rel="canonical" href={canonical} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/site.css" />
        <link rel="icon" href="/logo-48.webp" type="image/webp" />
        <link rel="apple-touch-icon" href="/logo-120.webp" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:site_name" content="Ius Gentium · UFSC" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta name="twitter:card" content="summary" />
      </head>
      <body>
        <a class="skip-link" href="#conteudo">Ir para o conteúdo</a>
        <div class="reading-progress" aria-hidden="true"><span data-reading-progress></span></div>
        <header class="site-header" data-header>
          <a class="wordmark" href="/" aria-label="Ius Gentium — início">
            <img src="/logo-48.webp" width="42" height="42" alt="" />
            <span><b>Ius Gentium</b><small>UFSC · CNPq</small></span>
          </a>
          <nav class="desktop-nav" aria-label="Navegação principal">
            {navItems.map((item) => (
              <a href={item.href} aria-current={path === item.href ? 'page' : undefined}>{item.label}</a>
            ))}
          </nav>
          <div class="header-actions">
            <button class="search-trigger" type="button" data-open-search aria-label="Abrir busca">
              <span>Buscar</span><kbd>⌘ K</kbd>
            </button>
            <button class="menu-trigger" type="button" data-menu-trigger aria-expanded="false" aria-controls="mobile-menu">
              <span></span><span></span><span class="sr-only">Abrir menu</span>
            </button>
          </div>
          <nav class="mobile-nav" id="mobile-menu" data-mobile-menu aria-label="Navegação móvel">
            {navItems.map((item, index) => <a href={item.href}><span>0{index + 1}</span>{item.label}</a>)}
            <a href="/contato"><span>06</span>Contato</a>
          </nav>
        </header>
        <main id="conteudo">{children}</main>
        <footer class="site-footer">
          <div class="footer-mark">
            <img src="/logo-120.webp" width="88" height="88" alt="Emblema do Ius Gentium" />
            <div><span>Ius Gentium</span><p>Grupo de Pesquisa em Direito Internacional<br />Universidade Federal de Santa Catarina</p></div>
          </div>
          <div class="footer-index">
            <p class="micro-label">Índice</p>
            {navItems.map((item) => <a href={item.href}>{item.label}</a>)}
            <a href="/contato">Contato</a>
          </div>
          <div class="footer-contact">
            <p class="micro-label">Correspondência</p>
            <a href={`mailto:${groupEmail}`}>{groupEmail}</a>
            <p>Centro de Ciências Jurídicas<br />Campus Trindade · Florianópolis</p>
          </div>
          <div class="footer-bottom">
            <span>© <span data-year>2026</span> Ius Gentium</span>
            <span>Direito internacional em perspectiva histórica</span>
            <a href="https://ufsc.br/" target="_blank" rel="noopener noreferrer">UFSC ↗</a>
          </div>
        </footer>
        <SearchDialog />
        <script src="/site.js" type="module"></script>
      </body>
    </html>
  )
}

const SearchDialog = () => (
  <dialog class="search-dialog" data-search-dialog aria-labelledby="search-title">
    <div class="search-shell">
      <div class="search-topline">
        <span id="search-title">Arquivo Ius Gentium</span>
        <button type="button" data-close-search aria-label="Fechar busca">Esc</button>
      </div>
      <label class="search-field">
        <span class="sr-only">Buscar no arquivo</span>
        <span aria-hidden="true">⌕</span>
        <input type="search" data-global-search placeholder="Pesquise ideias, autores, lugares…" autocomplete="off" />
      </label>
      <div class="search-suggestions" data-search-suggestions>
        <p class="micro-label">Comece por</p>
        <button type="button" data-suggestion="circulação">circulação</button>
        <button type="button" data-suggestion="soberania">soberania</button>
        <button type="button" data-suggestion="tradução">tradução</button>
        <button type="button" data-suggestion="Sorbonne">Sorbonne</button>
      </div>
      <div class="search-results" data-global-results aria-live="polite"></div>
    </div>
  </dialog>
)

const PageIntro: FC<{ index: string; eyebrow: string; title: string; lead: string }> = ({ index, eyebrow, title, lead }) => (
  <section class="page-intro">
    <div class="page-number">{index}</div>
    <div class="page-intro-copy">
      <p class="micro-label">{eyebrow}</p>
      <h1>{title}</h1>
      <p class="page-lead">{lead}</p>
    </div>
    <div class="page-rule" aria-hidden="true"></div>
  </section>
)

const Arrow = () => <span class="arrow" aria-hidden="true">↗</span>

const ArchiveCard: FC<{ item: ArchiveItem; order?: number }> = ({ item, order }) => (
  <article class="archive-card reveal" data-type={item.type}>
    <div class="archive-meta">
      <span>{order ? String(order).padStart(2, '0') : item.year}</span>
      <span>{item.type}</span>
    </div>
    <div class="archive-copy">
      <p class="micro-label">{item.eyebrow}</p>
      <h3><a href={`/arquivo/${item.slug}`}>{item.title}</a></h3>
      <p>{item.summary}</p>
      <div class="tag-row">{item.tags.slice(0, 3).map((tag) => <span>{tag}</span>)}</div>
    </div>
    <a class="card-arrow" href={`/arquivo/${item.slug}`} aria-label={`Abrir ${item.title}`}>↗</a>
  </article>
)

app.get('/', (c) => {
  const origin = new URL(c.req.url).origin
  const featured = archive.filter((item) => item.featured)
  return c.html(
    <Layout
      title="Ius Gentium — Direito internacional em movimento"
      description="Portal vivo do Grupo de Pesquisa em Direito Internacional da UFSC: arquivo, pesquisa, história e circulação de ideias jurídicas."
      path="/"
      origin={origin}
    >
      <section class="hero">
        <div class="hero-plate" aria-hidden="true">
          <span class="plate-ring plate-ring-one"></span>
          <span class="plate-ring plate-ring-two"></span>
          <img src="/logo-300.webp" width="300" height="300" alt="" />
        </div>
        <div class="hero-copy">
          <p class="hero-kicker"><span>Caderno 01</span> Grupo de Pesquisa · UFSC</p>
          <h1><span>Ius</span> <em>Gentium</em></h1>
          <p class="hero-thesis">O direito atravessa fronteiras.<br /><i>As ideias também.</i></p>
          <div class="hero-actions">
            <a class="button button-dark" href="/arquivo">Entrar no arquivo <Arrow /></a>
            <a class="text-link" href="/sobre">Conhecer o grupo <span>→</span></a>
          </div>
        </div>
        <aside class="hero-note">
          <span class="note-index">I</span>
          <p>Investigando a história para compreender as novas fronteiras do direito internacional.</p>
          <div data-live-highlight>História · circulação · instituições</div>
        </aside>
        <div class="hero-scroll" aria-hidden="true"><span></span> Percorrer</div>
      </section>

      <div class="topic-ribbon" aria-label="Eixos do grupo">
        <div>
          <span>História do Direito Internacional</span><b>✦</b>
          <span>Circulação de Modelos Jurídicos</span><b>✦</b>
          <span>Integração Regional</span><b>✦</b>
          <span>Jurisdições Internacionais</span><b>✦</b>
          <span>História do Direito Internacional</span><b>✦</b>
        </div>
      </div>

      <section class="manifesto section-pad">
        <div class="section-index">
          <span>01</span><p>Manifesto</p>
        </div>
        <div class="manifesto-copy reveal">
          <p class="micro-label">Uma disciplina vista por dentro</p>
          <h2>Não estudamos apenas as normas. Investigamos os <em>mundos</em> que as tornam possíveis.</h2>
        </div>
        <div class="manifesto-notes reveal">
          <p>O Ius Gentium observa o direito internacional como uma cultura em movimento: feita de textos, traduções, instituições, viagens, disputas e escolhas editoriais.</p>
          <p>Da longa duração dos conceitos às urgências do clima, a pesquisa conecta história e presente para formular perguntas mais precisas sobre a ordem internacional.</p>
          <a class="text-link" href="/pesquisa">Ver linhas de pesquisa <span>→</span></a>
        </div>
      </section>

      <section class="atlas-section section-pad section-ink" id="rede">
        <div class="section-index section-index-light">
          <span>02</span><p>Cartografia</p>
        </div>
        <div class="atlas-heading">
          <p class="micro-label">Rede transatlântica</p>
          <h2>Ideias têm<br /><em>itinerários.</em></h2>
          <p>Toque em uma cidade para percorrer a rede de formação, pesquisa e circulação do grupo.</p>
        </div>
        <div class="atlas" data-atlas>
          <div class="atlas-orbit" aria-hidden="true"><span></span><span></span><span></span></div>
          <div class="atlas-nodes" role="list" aria-label="Cidades da rede acadêmica">
            {network.map((node, index) => (
              <button
                type="button"
                class={`atlas-node node-${index + 1}`}
                data-atlas-node
                data-city={node.city}
                data-country={node.country}
                data-institution={node.institution}
                data-relation={node.relation}
                data-period={node.period}
                aria-pressed={index === 0 ? 'true' : 'false'}
              >
                <i></i><span>{node.city}</span>
              </button>
            ))}
          </div>
          <div class="atlas-detail" data-atlas-detail aria-live="polite">
            <span>Brasil · presente</span>
            <h3>Florianópolis</h3>
            <p>Universidade Federal de Santa Catarina</p>
            <small>Sede do grupo e eixo de formação</small>
          </div>
        </div>
      </section>

      <section class="research-preview section-pad">
        <div class="section-index">
          <span>03</span><p>Investigações</p>
        </div>
        <div class="section-heading reveal">
          <div><p class="micro-label">Seis linhas, uma constelação</p><h2>Questões que<br /><em>movem a pesquisa</em></h2></div>
          <a class="round-link" href="/pesquisa" aria-label="Ver todas as linhas de pesquisa">Ver todas <span>↗</span></a>
        </div>
        <div class="research-stack">
          {researchLines.slice(0, 4).map((line) => (
            <a class="research-row reveal" href={`/pesquisa#linha-${line.number}`}>
              <span>{line.number}</span>
              <h3>{line.title}</h3>
              <p>{line.thesis}</p>
              <b>↗</b>
            </a>
          ))}
        </div>
      </section>

      <section class="archive-preview section-pad section-warm">
        <div class="section-index">
          <span>04</span><p>Arquivo vivo</p>
        </div>
        <div class="section-heading reveal">
          <div><p class="micro-label">Documentos em contexto</p><h2>O passado não está<br /><em>encerrado.</em></h2></div>
          <p class="section-aside">Publicações, eventos, traduções e vestígios institucionais transformados em percursos de leitura.</p>
        </div>
        <div class="featured-archive">
          {featured.map((item, index) => <ArchiveCard item={item} order={index + 1} />)}
        </div>
        <a class="button button-outline" href="/arquivo">Explorar todo o arquivo <span>→</span></a>
      </section>

      <section class="coordinator-preview section-pad">
        <div class="section-index">
          <span>05</span><p>Coordenação</p>
        </div>
        <div class="monogram-panel reveal" aria-hidden="true">
          <span>A</span><span>D</span><span>R</span>
          <img src="/logo-300.webp" width="220" height="220" alt="" />
        </div>
        <div class="coordinator-copy reveal">
          <p class="micro-label">Professor Titular · UFSC</p>
          <h2>Arno<br />Dal Ri <em>Júnior</em></h2>
          <p>Teoria e história do direito internacional, circulação de modelos jurídicos e formação de pesquisadores em uma trajetória construída entre Brasil, Itália, França e Bélgica.</p>
          <div class="coordinator-facts">
            <div><span>2024–25</span><p>Sarton medallist<br />Universiteit Gent</p></div>
            <div><span>2026</span><p>Seminários no IREDIES<br />Paris 1 Panthéon-Sorbonne</p></div>
          </div>
          <a class="text-link" href="/coordenador">Ler perfil intelectual <span>→</span></a>
        </div>
      </section>

      <section class="library-callout">
        <div><p class="micro-label">Biblioteca de campo</p><h2>Uma mesa de trabalho<br />aberta ao mundo.</h2></div>
        <p>Fontes primárias, jurisprudência, livros raros, arquivos e bases acadêmicas selecionados para pesquisa em direito internacional.</p>
        <a class="button button-light" href="/biblioteca">Abrir biblioteca <Arrow /></a>
      </section>
    </Layout>
  )
})

app.get('/sobre', (c) => {
  const origin = new URL(c.req.url).origin
  return c.html(
    <Layout title="O grupo — Ius Gentium" description="História, missão e método do Grupo de Pesquisa Ius Gentium da UFSC." path="/sobre" origin={origin}>
      <PageIntro index="01" eyebrow="O grupo" title="Uma história feita de circulação" lead="O Ius Gentium conecta história, teoria e experiência institucional para investigar como o direito internacional ganha forma — e como pode ser transformado." />
      <section class="prose-grid section-pad">
        <aside class="margin-note"><span>Desde</span><strong>UFSC<br />CNPq</strong><p>Pesquisa, tradução, publicação e formação.</p></aside>
        <article class="editorial-prose reveal">
          <p class="dropcap">Vinculado à Universidade Federal de Santa Catarina, o Ius Gentium constituiu ao longo de sua trajetória um espaço de leitura coletiva, formação de pesquisadores e produção editorial em direito internacional.</p>
          <p>Seu método começa por uma desconfiança produtiva: nenhuma categoria jurídica é natural, nenhum modelo viaja intacto, nenhuma instituição existe fora de sua história. Por isso, o grupo combina fontes, conceitos, biografias, traduções e arquivos.</p>
          <blockquote>“Investigar a história para compreender as novas fronteiras do direito internacional.”</blockquote>
          <p>Essa perspectiva torna possível aproximar problemas que frequentemente aparecem separados: soberania e moeda, guerra e tradução, jurisdição e circulação, integração regional e crise climática.</p>
        </article>
      </section>
      <section class="method-section section-pad section-warm">
        <div class="section-heading"><div><p class="micro-label">Método em três movimentos</p><h2>Encontrar.<br /><em>Contextualizar.</em><br />Fazer circular.</h2></div></div>
        <div class="method-grid">
          <article><span>01</span><h3>Encontrar</h3><p>Voltar às fontes, às edições, aos programas, às correspondências e aos vestígios que tornam uma hipótese demonstrável.</p></article>
          <article><span>02</span><h3>Contextualizar</h3><p>Reconstruir instituições, léxicos e conflitos para evitar que categorias do presente sejam projetadas sobre o passado.</p></article>
          <article><span>03</span><h3>Fazer circular</h3><p>Traduzir, editar, ensinar e publicar: a pesquisa se completa quando reencontra uma comunidade de leitores.</p></article>
        </div>
      </section>
      <section class="source-note section-pad">
        <p class="micro-label">Vínculo institucional</p>
        <h2>Grupo de Pesquisa em Direito Internacional · PPGD/UFSC</h2>
        <p>O cadastro institucional do Programa de Pós-Graduação em Direito registra o Ius Gentium entre seus grupos de pesquisa.</p>
        <a class="text-link" href="https://ppgd.ufsc.br/grupos-de-pesquisa/" target="_blank" rel="noopener noreferrer">Consultar fonte institucional <Arrow /></a>
      </section>
    </Layout>
  )
})

app.get('/pesquisa', (c) => {
  const origin = new URL(c.req.url).origin
  return c.html(
    <Layout title="Pesquisa — Ius Gentium" description="Linhas e perguntas de pesquisa do Ius Gentium em direito internacional." path="/pesquisa" origin={origin}>
      <PageIntro index="02" eyebrow="Pesquisa" title="Uma constelação de problemas" lead="As linhas não funcionam como compartimentos. Cada uma oferece um ponto de observação para acompanhar conceitos, instituições e conflitos em movimento." />
      <section class="lines-index section-pad">
        {researchLines.map((line) => (
          <article class="line-dossier reveal" id={`linha-${line.number}`}>
            <div class="line-number">{line.number}</div>
            <div class="line-title"><p class="micro-label">Eixo de pesquisa</p><h2>{line.title}</h2><div class="tag-row">{line.tags.map((tag) => <span>{tag}</span>)}</div></div>
            <div class="line-thesis"><p>{line.thesis}</p></div>
            <ol class="line-questions">{line.questions.map((question) => <li>{question}</li>)}</ol>
          </article>
        ))}
      </section>
      <section class="research-cta section-ink">
        <p class="micro-label">Do problema ao documento</p>
        <h2>Veja como essas perguntas aparecem em publicações, eventos e fontes do grupo.</h2>
        <a class="button button-light" href="/arquivo">Percorrer arquivo <Arrow /></a>
      </section>
    </Layout>
  )
})

app.get('/arquivo', (c) => {
  const origin = new URL(c.req.url).origin
  return c.html(
    <Layout title="Arquivo vivo — Ius Gentium" description="Arquivo pesquisável de publicações, eventos, traduções e memórias do Ius Gentium." path="/arquivo" origin={origin}>
      <PageIntro index="03" eyebrow="Arquivo vivo" title="Documentos que continuam a perguntar" lead="O arquivo não é depósito. É uma máquina de relações: aproxima tempos, temas e lugares para produzir novos percursos de pesquisa." />
      <section class="archive-controls" aria-label="Filtros do arquivo">
        <label><span class="sr-only">Buscar no arquivo</span><span>⌕</span><input type="search" placeholder="Filtrar por tema, lugar, título…" data-archive-query /></label>
        <div class="filter-pills" data-archive-filters>
          <button type="button" aria-pressed="true" data-filter="">Todos</button>
          <button type="button" aria-pressed="false" data-filter="publicação">Publicações</button>
          <button type="button" aria-pressed="false" data-filter="evento">Eventos</button>
          <button type="button" aria-pressed="false" data-filter="coleção">Coleção</button>
          <button type="button" aria-pressed="false" data-filter="memória">Memória</button>
        </div>
        <p><span data-archive-count>{archive.length}</span> registros</p>
      </section>
      <section class="archive-list section-pad" data-archive-results aria-live="polite">
        {archive.map((item, index) => <ArchiveCard item={item} order={index + 1} />)}
      </section>
    </Layout>
  )
})

app.get('/arquivo/:slug', (c) => {
  const item = archive.find((entry) => entry.slug === c.req.param('slug'))
  if (!item) return c.notFound()
  const origin = new URL(c.req.url).origin
  const related = archive.filter((entry) => entry.slug !== item.slug && entry.tags.some((tag) => item.tags.includes(tag))).slice(0, 2)
  return c.html(
    <Layout title={`${item.title} — Ius Gentium`} description={item.summary} path={`/arquivo/${item.slug}`} origin={origin}>
      <article class="dossier">
        <header class="dossier-header">
          <a class="back-link" href="/arquivo">← Voltar ao arquivo</a>
          <div class="dossier-code">IG / {item.year} / {item.type.slice(0, 3).toUpperCase()}</div>
          <p class="micro-label">{item.eyebrow}</p>
          <h1>{item.title}</h1>
          <p class="dossier-summary">{item.summary}</p>
          <div class="tag-row">{item.tags.map((tag) => <span>{tag}</span>)}</div>
        </header>
        <div class="dossier-body section-pad">
          <aside><span class="dossier-year">{item.year}</span><p>{item.type}</p></aside>
          <div class="editorial-prose">{item.body.map((paragraph, index) => <p class={index === 0 ? 'dropcap' : ''}>{paragraph}</p>)}</div>
          <div class="source-card">
            <p class="micro-label">Fonte primária</p>
            <h2>{item.sourceLabel}</h2>
            <p>Consulte o registro de origem para contexto documental e informações institucionais.</p>
            <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">Abrir fonte <Arrow /></a>
          </div>
        </div>
      </article>
      {related.length > 0 && <section class="related section-warm section-pad"><p class="micro-label">Continuar o percurso</p><div>{related.map((entry) => <ArchiveCard item={entry} />)}</div></section>}
    </Layout>
  )
})

app.get('/biblioteca', (c) => {
  const origin = new URL(c.req.url).origin
  const families = [...new Set(library.map((item) => item.family))]
  return c.html(
    <Layout title="Biblioteca de campo — Ius Gentium" description="Recursos acadêmicos selecionados para pesquisa em direito internacional." path="/biblioteca" origin={origin}>
      <PageIntro index="04" eyebrow="Biblioteca de campo" title="Onde a pesquisa começa" lead="Uma seleção navegável de fontes, arquivos, jurisprudência e instrumentos de descoberta — organizada para reduzir a distância entre uma pergunta e seu documento." />
      <section class="library-shell section-pad" data-library>
        <aside class="library-sidebar">
          <p class="micro-label">Coleções</p>
          <button type="button" aria-pressed="true" data-library-filter="">Todas</button>
          {families.map((family) => <button type="button" aria-pressed="false" data-library-filter={family}>{family}</button>)}
          <div class="library-count"><strong>{library.length}</strong><span>recursos<br />selecionados</span></div>
        </aside>
        <div class="library-main">
          <label class="library-search"><span>⌕</span><input type="search" data-library-query placeholder="Buscar fonte, tema ou instituição…" /><span class="sr-only">Buscar na biblioteca</span></label>
          <div class="library-grid" data-library-results>
            {library.map((resource, index) => (
              <article class="resource-card reveal" data-family={resource.family} data-search={`${resource.title} ${resource.description} ${resource.tags.join(' ')}`.toLowerCase()}>
                <div class="resource-top"><span>{String(index + 1).padStart(2, '0')}</span><span>{resource.access}</span></div>
                <p class="micro-label">{resource.family}</p>
                <h2>{resource.title}</h2>
                <p>{resource.description}</p>
                <div class="tag-row">{resource.tags.map((tag) => <span>{tag}</span>)}</div>
                <a href={resource.url} target="_blank" rel="noopener noreferrer" aria-label={`Abrir ${resource.title}`}><Arrow /></a>
              </article>
            ))}
          </div>
          <p class="empty-state" data-library-empty hidden>Nenhum recurso corresponde a esse percurso.</p>
        </div>
      </section>
    </Layout>
  )
})

app.get('/coordenador', (c) => {
  const origin = new URL(c.req.url).origin
  return c.html(
    <Layout title="Arno Dal Ri Júnior — Ius Gentium" description="Perfil intelectual do coordenador do Ius Gentium, professor titular da UFSC." path="/coordenador" origin={origin}>
      <section class="profile-hero">
        <div class="profile-monogram" aria-hidden="true"><span>ADR</span><img src="/logo-300.webp" alt="" /></div>
        <div class="profile-title"><p class="micro-label">Coordenação · Professor Titular da UFSC</p><h1>Arno<br />Dal Ri <em>Júnior</em></h1><p>Teoria e história do direito internacional</p></div>
        <div class="profile-caption"><span>Florianópolis</span><span>Paris</span><span>Gante</span><span>Milão</span></div>
      </section>
      <section class="profile-body section-pad">
        <aside class="profile-index"><p class="micro-label">Eixos</p><span>História</span><span>Circulação</span><span>Instituições</span><span>Tradução</span></aside>
        <article class="editorial-prose reveal">
          <p class="dropcap">Professor Titular de Teoria e História do Direito Internacional na Universidade Federal de Santa Catarina, Arno Dal Ri Júnior coordena uma agenda que acompanha a formação histórica das categorias jurídicas e a circulação transatlântica de modelos.</p>
          <p>Sua trajetória acadêmica conecta a UFSC a instituições europeias e se desdobra em pesquisa, orientação, tradução de clássicos e construção de projetos editoriais.</p>
          <p>Em 2024–2025, integrou a relação de Sarton medallists da Universiteit Gent. Em 2026, apresentou no IREDIES da Université Paris 1 Panthéon-Sorbonne seminários sobre circulação de modelos jurídicos franceses e sobre o impacto brasileiro da Convenção n.º 169 da OIT.</p>
        </article>
      </section>
      <section class="trajectory section-ink section-pad">
        <p class="micro-label">Trajetória documentada</p>
        <div class="trajectory-list">
          <article><span>2004</span><h2>História do Direito Internacional</h2><p>Comércio, moeda, cidadania e nacionalidade.</p></article>
          <article><span>2004–10</span><h2>Coleção de clássicos</h2><p>Grotius, Gentili, Kelsen e outros textos estruturantes em língua portuguesa.</p></article>
          <article><span>2024–25</span><h2>Sarton medallist</h2><p>Reconhecimento da Sarton Chair, Universiteit Gent.</p></article>
          <article><span>2026</span><h2>Seminários IREDIES</h2><p>Circulação de modelos e recepção do direito internacional no Brasil.</p></article>
        </div>
      </section>
      <section class="sources-grid section-pad">
        <div><p class="micro-label">Fontes verificáveis</p><h2>O perfil conduz aos documentos.</h2></div>
        <a href="https://sartonchair.ugent.be/en/sarton-medallists/past-medallists" target="_blank" rel="noopener noreferrer"><span>01</span><p>Sarton Chair · Past medallists</p><Arrow /></a>
        <a href="https://iredies.pantheonsorbonne.fr/evenements-passes" target="_blank" rel="noopener noreferrer"><span>02</span><p>IREDIES · Seminários e eventos</p><Arrow /></a>
        <a href="http://lattes.cnpq.br/2020985889273319" target="_blank" rel="noopener noreferrer"><span>03</span><p>Currículo Lattes</p><Arrow /></a>
      </section>
    </Layout>
  )
})

app.get('/contato', (c) => {
  const origin = new URL(c.req.url).origin
  return c.html(
    <Layout title="Contato — Ius Gentium" description="Contato institucional com o Grupo de Pesquisa Ius Gentium da UFSC." path="/contato" origin={origin}>
      <PageIntro index="05" eyebrow="Correspondência" title="Toda pesquisa começa com uma conversa" lead="Para informações institucionais, atividades e acesso a materiais do grupo, escreva por e-mail." />
      <section class="contact-sheet section-pad">
        <div class="contact-primary"><p class="micro-label">E-mail do grupo</p><a href={`mailto:${groupEmail}`}>{groupEmail}</a><p>Ao escrever, indique no assunto o tema da mensagem: pesquisa, acervo, atividade ou cooperação.</p></div>
        <div class="contact-place"><p class="micro-label">Sede acadêmica</p><h2>Centro de Ciências Jurídicas</h2><p>Universidade Federal de Santa Catarina<br />Campus Universitário Trindade<br />Florianópolis · Santa Catarina · Brasil</p><a href="https://ccj.ufsc.br/" target="_blank" rel="noopener noreferrer">Visitar CCJ/UFSC <Arrow /></a></div>
        <div class="contact-code" aria-hidden="true">SC<br />27°S<br />48°W</div>
      </section>
    </Layout>
  )
})

app.get('/api/archive', (c) => {
  const query = (c.req.query('q') || '').trim().toLocaleLowerCase('pt-BR')
  const type = (c.req.query('type') || '').trim().toLocaleLowerCase('pt-BR')
  const results = archive.filter((item) => {
    const haystack = [item.title, item.eyebrow, item.summary, item.type, item.year, ...item.tags].join(' ').toLocaleLowerCase('pt-BR')
    return (!query || haystack.includes(query)) && (!type || item.type === type)
  }).map(({ body: _body, ...item }) => item)
  c.header('Cache-Control', 'public, max-age=60, s-maxage=300')
  return c.json({ query, type, count: results.length, results })
})

app.get('/api/highlight', (c) => {
  const day = Math.floor(Date.now() / 86_400_000)
  const item = archive[day % archive.length]
  c.header('Cache-Control', 'public, max-age=300, s-maxage=3600')
  return c.json({ label: `${item.year} · ${item.type}`, title: item.title, href: `/arquivo/${item.slug}` })
})

app.get('/api/network', (c) => c.json({ count: network.length, nodes: network }))

const legacyRedirects: Record<string, string> = {
  '/index.html': '/',
  '/sobre.html': '/sobre',
  '/pessoas.html': '/coordenador',
  '/pesquisa.html': '/pesquisa',
  '/projetos.html': '/pesquisa',
  '/producao.html': '/arquivo',
  '/eventos.html': '/arquivo?type=evento',
  '/cooperacao.html': '/#rede',
  '/biblioteca.html': '/biblioteca',
  '/links.html': '/biblioteca',
  '/contato.html': '/contato',
  '/login.html': '/'
}

Object.entries(legacyRedirects).forEach(([from, to]) => app.get(from, (c) => c.redirect(to, 301)))

app.notFound((c) => {
  const origin = new URL(c.req.url).origin
  return c.html(
    <Layout title="Página não encontrada — Ius Gentium" description="O documento solicitado não foi encontrado." path={new URL(c.req.url).pathname} origin={origin}>
      <section class="not-found"><span>404</span><div><p class="micro-label">Fora do arquivo</p><h1>Este documento ainda não foi catalogado.</h1><a class="button button-dark" href="/arquivo">Voltar ao arquivo <span>→</span></a></div></section>
    </Layout>,
    404
  )
})

app.onError((error, c) => {
  console.error(error)
  return c.text('O portal encontrou um erro temporário.', 500)
})

export default app
