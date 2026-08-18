export type ArchiveItem = {
  slug: string
  title: string
  eyebrow: string
  year: number
  type: 'publicação' | 'evento' | 'distinção' | 'memória' | 'coleção'
  summary: string
  body: string[]
  tags: string[]
  sourceUrl: string
  sourceLabel: string
  featured?: boolean
}

export type ResearchLine = {
  number: string
  title: string
  shortTitle: string
  thesis: string
  questions: string[]
  tags: string[]
}

export type NetworkNode = {
  city: string
  country: string
  institution: string
  relation: string
  period: string
  axis: 'formação' | 'pesquisa' | 'circulação'
}

export type LibraryResource = {
  title: string
  family: string
  description: string
  access: string
  url: string
  tags: string[]
}

export const archive: ArchiveItem[] = [
  {
    slug: 'circulacao-modelos-juridicos-franceses',
    title: 'A circulação dos modelos jurídicos franceses entre o Império e a República',
    eyebrow: 'Seminário IREDIES · Sorbonne',
    year: 2026,
    type: 'evento',
    summary: 'Uma investigação sobre os itinerários intelectuais pelos quais a ciência francesa do direito internacional foi recebida, traduzida e transformada no Brasil.',
    body: [
      'O seminário desloca a pergunta clássica sobre “influência” para uma história concreta da circulação: quem transporta conceitos, em que instituições eles se instalam e o que muda quando atravessam o Atlântico.',
      'Apresentado no Institut de recherche en droit international et européen de la Sorbonne, o encontro articula o eixo histórico do Ius Gentium a uma rede contemporânea de pesquisa entre Florianópolis e Paris.'
    ],
    tags: ['história do direito internacional', 'circulação', 'França', 'Brasil'],
    sourceUrl: 'https://iredies.pantheonsorbonne.fr/evenements/la-circulation-modeles-juridiques-francais-dans-la-science-du-droit-international-bresil',
    sourceLabel: 'IREDIES · Université Paris 1',
    featured: true
  },
  {
    slug: 'oit-povos-indigenas-brasil',
    title: 'O impacto no Brasil da Convenção da OIT sobre povos indígenas e tribais',
    eyebrow: 'Seminário IREDIES · Sorbonne',
    year: 2026,
    type: 'evento',
    summary: 'Direito internacional, recepção normativa e experiência brasileira em uma conferência dedicada à Convenção n.º 169 da OIT.',
    body: [
      'A conferência examina o modo como uma norma internacional se torna argumento, instituição e prática no interior de uma ordem jurídica nacional.',
      'O tema revela uma das operações centrais do grupo: observar o direito internacional não como sistema abstrato, mas como linguagem que circula, encontra resistências e reorganiza categorias jurídicas.'
    ],
    tags: ['OIT', 'povos indígenas', 'recepção normativa', 'Brasil'],
    sourceUrl: 'https://iredies.pantheonsorbonne.fr/evenements/limpact-bresil-de-la-convention-de-loit-relative-aux-peuples-indigenes-et-tribaux',
    sourceLabel: 'IREDIES · Université Paris 1',
    featured: true
  },
  {
    slug: 'sarton-medal-2024',
    title: 'Sarton Medal · História da ciência jurídica em perspectiva internacional',
    eyebrow: 'Universiteit Gent',
    year: 2024,
    type: 'distinção',
    summary: 'Arno Dal Ri Júnior integra a relação de Sarton medallists da Universidade de Gante no ciclo 2024–2025.',
    body: [
      'A Sarton Chair reconhece pesquisadores por contribuições à história da ciência. A presença de um professor de teoria e história do direito internacional nesse circuito aproxima a historiografia jurídica de um debate intelectual mais amplo sobre a produção do conhecimento.',
      'No portal, a distinção é lida menos como ornamento biográfico e mais como índice da inserção internacional de uma agenda construída na UFSC.'
    ],
    tags: ['Sarton Medal', 'história da ciência', 'Bélgica', 'trajetória'],
    sourceUrl: 'https://sartonchair.ugent.be/en/sarton-medallists/past-medallists',
    sourceLabel: 'Sarton Chair · UGent',
    featured: true
  },
  {
    slug: 'revista-ius-gentium-2008',
    title: 'Revista Ius Gentium · Teoria e Comércio no Direito Internacional',
    eyebrow: 'Periódico do grupo',
    year: 2008,
    type: 'memória',
    summary: 'A primeira edição da revista acadêmica do grupo registra uma fase de intensa produção discente, eventos e debate sobre comércio internacional.',
    body: [
      'A revista é simultaneamente fonte e vestígio: permite ler os problemas jurídicos de seu tempo e reconstruir a cultura de pesquisa que os tornou publicáveis.',
      'Digitalizá-la e descrevê-la como acervo transforma uma publicação histórica em porta de entrada para novos percursos de investigação.'
    ],
    tags: ['revista', 'comércio internacional', 'memória institucional'],
    sourceUrl: 'https://www.iusgentium.ufsc.br/revista/artigo10.pdf',
    sourceLabel: 'Acervo Ius Gentium · UFSC'
  },
  {
    slug: 'grotius-direito-guerra-paz',
    title: 'Hugo Grotius · O direito da guerra e da paz',
    eyebrow: 'Clássicos do Direito Internacional',
    year: 2004,
    type: 'coleção',
    summary: 'Edição brasileira em dois volumes publicada pela Unijuí no âmbito da coleção de traduções coordenada pelo grupo.',
    body: [
      'Traduzir um clássico não é apenas transportar palavras. É reconstruir o vocabulário em que uma disciplina reconhece sua própria história.',
      'A coleção Clássicos do Direito Internacional tornou acessíveis em português obras estruturantes e consolidou a tradução como prática coletiva de pesquisa.'
    ],
    tags: ['Grotius', 'tradução', 'guerra e paz', 'clássicos'],
    sourceUrl: 'https://iusgentium.ufsc.br/siteantigo/publicacoes.htm',
    sourceLabel: 'Publicações históricas · Ius Gentium'
  },
  {
    slug: 'gentili-direito-da-guerra',
    title: 'Alberico Gentili · O direito da guerra',
    eyebrow: 'Clássicos do Direito Internacional',
    year: 2005,
    type: 'coleção',
    summary: 'Tradução brasileira de uma obra central para a formação histórica da disciplina internacionalista.',
    body: [
      'A obra de Gentili oferece uma via privilegiada para observar a autonomização do raciocínio jurídico sobre a guerra.',
      'Sua presença na coleção revela o compromisso do grupo com fontes primárias e com a longa duração da cultura jurídica internacional.'
    ],
    tags: ['Gentili', 'tradução', 'guerra', 'clássicos'],
    sourceUrl: 'https://iusgentium.ufsc.br/siteantigo/publicacoes.htm',
    sourceLabel: 'Publicações históricas · Ius Gentium'
  },
  {
    slug: 'santi-romano-ordenamento-juridico',
    title: 'Santi Romano · O ordenamento jurídico',
    eyebrow: 'Tradução e teoria institucional',
    year: 2008,
    type: 'publicação',
    summary: 'Tradução de Arno Dal Ri Júnior de um texto decisivo para pensar pluralismo, instituição e ordem jurídica.',
    body: [
      'A teoria institucional de Santi Romano permite deslocar a análise do direito para além da norma estatal isolada.',
      'No repertório do grupo, o livro conecta teoria geral, história conceitual e o problema da pluralidade de ordens no direito internacional.'
    ],
    tags: ['Santi Romano', 'institucionalismo', 'tradução', 'teoria do direito'],
    sourceUrl: 'https://iusgentium.ufsc.br/siteantigo/publicacoes.htm',
    sourceLabel: 'Publicações históricas · Ius Gentium'
  },
  {
    slug: 'kelsen-principios-direito-internacional',
    title: 'Hans Kelsen · Princípios de Direito Internacional',
    eyebrow: 'Clássicos do Direito Internacional',
    year: 2010,
    type: 'coleção',
    summary: 'Uma edição em língua portuguesa dedicada à arquitetura normativa da ordem jurídica internacional.',
    body: [
      'Kelsen obriga a teoria do direito a enfrentar a unidade do ordenamento e a relação entre ordens nacional e internacional.',
      'A edição integra uma política editorial de acesso: tornar textos estruturantes disponíveis para ensino, leitura coletiva e crítica.'
    ],
    tags: ['Kelsen', 'normativismo', 'ordem internacional', 'clássicos'],
    sourceUrl: 'https://iusgentium.ufsc.br/siteantigo/publicacoes.htm',
    sourceLabel: 'Publicações históricas · Ius Gentium'
  },
  {
    slug: 'historia-direito-internacional-comercio-moeda',
    title: 'História do Direito Internacional · Comércio, moeda, cidadania e nacionalidade',
    eyebrow: 'Livro · Arno Dal Ri Júnior',
    year: 2004,
    type: 'publicação',
    summary: 'Uma leitura histórica de categorias que organizam pertencimento, circulação e poder na ordem internacional.',
    body: [
      'Comércio e moeda não aparecem como capítulos laterais da história jurídica, mas como instituições que dão forma concreta às relações entre comunidades políticas.',
      'Cidadania e nacionalidade completam esse quadro ao revelar como o direito distribui mobilidade, proteção e pertencimento.'
    ],
    tags: ['história', 'comércio', 'moeda', 'cidadania'],
    sourceUrl: 'https://iusgentium.ufsc.br/siteantigo/publicacoes.htm',
    sourceLabel: 'Publicações históricas · Ius Gentium'
  },
  {
    slug: 'workshop-soberania-2009',
    title: 'Configurações da soberania na contemporaneidade',
    eyebrow: 'III Workshop de Direito Internacional',
    year: 2009,
    type: 'evento',
    summary: 'Um encontro sobre os percursos históricos e as transformações institucionais da soberania.',
    body: [
      'O workshop reuniu interpretações históricas, internacionais e regionais sobre a soberania, conceito cuja aparente estabilidade esconde usos profundamente distintos.',
      'Revisitar esse programa permite reconstruir as perguntas que animavam o grupo e confrontá-las com o presente.'
    ],
    tags: ['soberania', 'evento', 'integração regional', 'memória'],
    sourceUrl: 'https://iusgentium.ufsc.br/siteantigo/notanteriores.htm',
    sourceLabel: 'Notícias históricas · Ius Gentium'
  },
  {
    slug: 'onufsc-caxemira-2009',
    title: 'ON.UFSC · Simulação do Conselho de Segurança',
    eyebrow: 'Ensino, diplomacia e experiência',
    year: 2009,
    type: 'memória',
    summary: 'Uma simulação acadêmica sobre os conflitos na Caxemira transformou pesquisa prévia em prática de negociação multilateral.',
    body: [
      'A ON.UFSC combinou formação em direito internacional, política externa, argumentação e construção coletiva de decisões.',
      'O registro do evento preserva uma dimensão fundamental da história do grupo: a pesquisa como experiência compartilhada e pública.'
    ],
    tags: ['ONU', 'simulação', 'Caxemira', 'ensino'],
    sourceUrl: 'https://iusgentium.ufsc.br/siteantigo/onufsc2.htm',
    sourceLabel: 'Memória ON.UFSC'
  },
  {
    slug: 'grupo-pesquisa-ufsc-cnpq',
    title: 'Ius Gentium · Grupo de Pesquisa em Direito Internacional',
    eyebrow: 'UFSC · CNPq',
    year: 2026,
    type: 'memória',
    summary: 'O grupo investiga criticamente as dimensões políticas, econômicas e históricas do direito internacional público.',
    body: [
      'Vinculado à Universidade Federal de Santa Catarina e certificado institucionalmente, o Ius Gentium articula pesquisa, tradução, publicação e formação.',
      'Sua identidade deriva da combinação entre história do direito internacional, atenção às instituições e circulação internacional de pesquisadores e modelos jurídicos.'
    ],
    tags: ['UFSC', 'CNPq', 'grupo de pesquisa', 'direito internacional'],
    sourceUrl: 'https://ppgd.ufsc.br/grupos-de-pesquisa/',
    sourceLabel: 'PPGD · UFSC'
  }
]

export const researchLines: ResearchLine[] = [
  {
    number: '01',
    title: 'História do direito internacional',
    shortTitle: 'História',
    thesis: 'Investigar como doutrinas, instituições e vocabulários internacionais se formam, circulam e mudam no tempo.',
    questions: ['Como nasce uma categoria jurídica?', 'Quem produz a memória de uma disciplina?', 'O que a tradução transforma?'],
    tags: ['historiografia', 'fontes', 'conceitos']
  },
  {
    number: '02',
    title: 'Circulação de modelos jurídicos',
    shortTitle: 'Circulação',
    thesis: 'Seguir ideias em movimento entre Europa e América Latina, observando apropriações, resistências e reinvenções.',
    questions: ['Por quais redes os modelos viajam?', 'O que se perde e o que se cria?', 'Como a periferia transforma o centro?'],
    tags: ['transferências', 'Brasil', 'Europa']
  },
  {
    number: '03',
    title: 'Comércio, moeda e integração',
    shortTitle: 'Economia',
    thesis: 'Compreender as formas jurídicas da interdependência econômica e suas consequências para soberania e integração regional.',
    questions: ['Quem governa a circulação?', 'Como o mercado produz instituições?', 'Onde termina a soberania?'],
    tags: ['comércio', 'Mercosul', 'integração']
  },
  {
    number: '04',
    title: 'Jurisdições internacionais',
    shortTitle: 'Jurisdições',
    thesis: 'Analisar tribunais, procedimentos e atores que transformam conflitos internacionais em linguagem jurídica.',
    questions: ['Como se constrói autoridade?', 'Quem consegue chegar à jurisdição?', 'Como decisões circulam?'],
    tags: ['tribunais', 'procedimento', 'autoridade']
  },
  {
    number: '05',
    title: 'Direito internacional e Sul Global',
    shortTitle: 'Sul Global',
    thesis: 'Ler a ordem internacional a partir de experiências históricas e políticas que deslocam narrativas universalizantes.',
    questions: ['Quem foi excluído do universal?', 'Como se produz assimetria?', 'Quais arquivos mudam a narrativa?'],
    tags: ['crítica', 'colonialidade', 'América Latina']
  },
  {
    number: '06',
    title: 'Direito internacional do clima',
    shortTitle: 'Clima',
    thesis: 'Examinar como responsabilidade, cooperação e justiça são reformuladas diante da crise climática.',
    questions: ['Como repartir responsabilidade?', 'O que significa reparar?', 'Quais escalas devem decidir?'],
    tags: ['clima', 'responsabilidade', 'cooperação']
  }
]

export const network: NetworkNode[] = [
  { city: 'Florianópolis', country: 'Brasil', institution: 'Universidade Federal de Santa Catarina', relation: 'Sede do grupo e eixo de formação', period: 'presente', axis: 'formação' },
  { city: 'Paris', country: 'França', institution: 'Université Paris 1 Panthéon-Sorbonne · IREDIES', relation: 'Seminários e circulação de pesquisa', period: '2003–2026', axis: 'circulação' },
  { city: 'Gante', country: 'Bélgica', institution: 'Universiteit Gent', relation: 'História da ciência e cooperação acadêmica', period: '2019–2025', axis: 'pesquisa' },
  { city: 'Pádua', country: 'Itália', institution: 'Università degli Studi di Padova', relation: 'Formação e tradição internacionalista', period: '1999–presente', axis: 'formação' },
  { city: 'Milão', country: 'Itália', institution: 'Università Bocconi', relation: 'Formação doutoral e cooperação', period: '2003–presente', axis: 'formação' },
  { city: 'Macerata', country: 'Itália', institution: 'Università di Macerata', relation: 'Pesquisa e mobilidade acadêmica', period: '2024–2029', axis: 'pesquisa' }
]

export const library: LibraryResource[] = [
  { title: 'United Nations Treaty Collection', family: 'Tratados', description: 'Tratados depositados junto ao Secretário-Geral da ONU, com status, reservas e declarações.', access: 'Acesso aberto', url: 'https://treaties.un.org/', tags: ['tratados', 'ONU', 'fontes primárias'] },
  { title: 'International Court of Justice', family: 'Jurisprudência', description: 'Julgamentos, pareceres consultivos, ordens e documentação processual da CIJ e da PCIJ.', access: 'Acesso aberto', url: 'https://www.icj-cij.org/', tags: ['CIJ', 'jurisprudência', 'fontes primárias'] },
  { title: 'UN Audiovisual Library of International Law', family: 'Ensino', description: 'Aulas, arquivos históricos e biblioteca de pesquisa mantidos pela ONU.', access: 'Acesso aberto', url: 'https://legal.un.org/avl/', tags: ['vídeo', 'história', 'ensino'] },
  { title: 'Gallica · Bibliothèque nationale de France', family: 'Acervos históricos', description: 'Edições digitalizadas de Grotius, Vattel, Pufendorf, mapas e periódicos históricos.', access: 'Acesso aberto', url: 'https://gallica.bnf.fr/', tags: ['livros raros', 'França', 'fontes'] },
  { title: 'Peace Palace Library', family: 'Bibliotecas', description: 'Catálogo e guias especializados em direito internacional público e história da disciplina.', access: 'Catálogo aberto', url: 'https://peacepalacelibrary.nl/', tags: ['Haia', 'bibliografia', 'guias'] },
  { title: 'League of Nations Archives', family: 'Acervos históricos', description: 'Documentos e registros da Liga das Nações preservados pelo arquivo das Nações Unidas em Genebra.', access: 'Acesso aberto', url: 'https://archives.ungeneva.org/lontad', tags: ['Liga das Nações', 'arquivo', 'Genebra'] },
  { title: 'Max Planck Encyclopedia of Public International Law', family: 'Referência', description: 'Enciclopédia especializada sobre conceitos, instituições, decisões e história do direito internacional.', access: 'Acesso institucional', url: 'https://opil.ouplaw.com/home/MPIL', tags: ['enciclopédia', 'doutrina', 'conceitos'] },
  { title: 'HeinOnline', family: 'Bases de dados', description: 'Periódicos jurídicos, tratados, anuários e coleções históricas em fac-símile.', access: 'Via Portal CAPES', url: 'https://home.heinonline.org/', tags: ['periódicos', 'história', 'tratados'] },
  { title: 'Recueil des cours · Académie de La Haye', family: 'Doutrina', description: 'Cursos monográficos da Academia de Direito Internacional da Haia desde 1923.', access: 'Catálogo aberto', url: 'https://www.hagueacademy.nl/publications/', tags: ['doutrina', 'Haia', 'cursos'] },
  { title: 'WorldLII', family: 'Direito comparado', description: 'Rede de institutos de informação jurídica com legislação e jurisprudência de múltiplas jurisdições.', access: 'Acesso aberto', url: 'https://www.worldlii.org/', tags: ['legislação', 'comparado', 'jurisprudência'] },
  { title: 'SciELO', family: 'Periódicos', description: 'Produção científica latino-americana em acesso aberto, incluindo periódicos jurídicos.', access: 'Acesso aberto', url: 'https://scielo.org/', tags: ['América Latina', 'artigos', 'acesso aberto'] },
  { title: 'Portal de Periódicos CAPES', family: 'Bases de dados', description: 'Acesso institucional brasileiro a periódicos, livros e bases acadêmicas internacionais.', access: 'Acesso institucional', url: 'https://www.periodicos.capes.gov.br/', tags: ['CAPES', 'bases', 'pesquisa'] }
]

export const groupEmail = 'grupoiusgentium@gmail.com'
