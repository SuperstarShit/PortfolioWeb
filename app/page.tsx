"use client";
import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import Link from 'next/link';

// --- Sample data (replace with your real projects/blogs/resume entries) ---
const PROJECTS = [
  {
    id: 'p1',
    title: 'Contest Website',
    tags: ['JavaScript' , 'HTML' , 'CSS'],
    skills: ['React', 'Node'],
    desc: 'Fetches live contest data from Codeforces and displays ongoing/upcoming contests with filters and countdowns.',
    liveUrl: "https://superstarshit.github.io/contestweb/",
    codeUrl: "https://github.com/SuperstarShit/contestweb",

  },
  {
    id: 'p2',
    title: 'CRUD Note-taking App',
    tags: ['Web' , 'HTML' , 'CSS'],
    skills: ['JavaScript'],
    desc: 'Simple note app storing notes in browser localStorage — create, edit, delete, and search notes.',
    liveUrl: "https://superstarshit.github.io/CrudNotetaking/",
    codeUrl: "https://github.com/SuperstarShit/CrudNotetaking",

  },
  {
    id: 'p3',
    title: 'Prediction Game',
    tags: ['Web', 'Game'],
    skills: ['JavaScript', 'Probability Theory'],
    desc: 'A browser game where the computer learns how you play. Using simple probability theory, it predicts your next number and adjusts its strategy every ball, a lightweight take on how AI models ‘learn’ from human behavior.',
    liveUrl: "https://superstarshit.github.io/predictionGame/",
    codeUrl: "https://github.com/SuperstarShit/predictionGame",

  },
  // keep your previous placeholder projects too, if you like
  { id: 'p4', title: 'Dimensional Arithmetic Thesis', tags: ['Research', 'Math'], skills: ['Math', 'Proofs', 'D3'], desc: 'A unified view of number, structure, and space.' },
   {
    id: 'p7',
    title: 'Room Isolator — Phone-use Detector',
    tags: ['Hardware', 'Embedded'],
    skills: ['Embedded', 'Sensors', 'Analog Electronics'],
    desc: 'A small room isolator that alerts (beeps) when it detects phone usage inside a room. It is breadboard-friendly.',
    components: [
      'Breadboard, hookup wire',
      'Condenser microphone (audio detection)',
      'Infrared LEDs / photodiodes (IR activity detection)',
      '5mm LEDs (status), buzzer (B20)',
      '555 timer (alert / debounce)', 'LM317 / 7805 (regulation)',
      'Assorted resistors, capacitors, transistors (for amplification/filtering)',
      '9V battery + clip, push buttons, trimpots'
    ],
    notes: 'Detection strategy uses a small audio-sensing front-end (condenser mic + amplifier + envelope detector) to catch human voice/phone call audio patterns, optional IR/photodiode channel to detect device activity, and a simple comparator → 555/buzzer alert. Prototype emphasizes privacy-aware local audio processing (no recording or storing) and adjustable sensitivity via trimpot.'
  },
  { id: 'p6', title: 'Algorithm Visualizer', tags: ['Web', 'ML'], skills: ['Algorithms', 'D3', 'Python'], desc: 'Visual animations for algorithms & complexity.' },
];

const SKILLS = [
  'React', 'Node', 'C++', 'Math', 'PCB', 'Algorithms', 'D3', 'Three.js', 'Proofs', 'Embedded', 'Python'
];

const BLOGS = [
  {
    id: 'b1',
    slug: 'toward-a-dimensional-theory-of-arithmetic',
    title: 'Toward a Dimensional Theory of Arithmetic',
    date: '2025-05-26',
    excerpt: 'A short essay introducing the geometric intuition behind arithmetic.',
  },
  {
    id: 'b2',
    slug: 'the-nature-of-time-energy-and-light',
    title: 'The Nature of Time, Energy, and Light',
    date: '2025-11-06',
    excerpt: 'Exploring how time emerges from energy exchange , light as the messenger of change, and entropy as the arrow of time.',
  },
];


const TIMELINE = [
  { year: 2021, title: 'Started programming', desc: 'Began learning JavaScript and basic HTML and CSS.' },
  { year: 2022, title: '', desc: 'Learned C++ and introduced myself to Data Structures in C++, Explored probability theory' },
  { year: 2023, title: '', desc: 'Explored graph theory along with learning about relativity by Einstein and Algorithms in C++.' },
  { year: 2024, title: '', desc: 'Got my hands on hardware and made Electromagnetic (Radio Frequency) detector.' },
];

// --- Utility: build graph nodes and links ---
// --- Utility: build graph nodes and links ---
// Robust: collect skill set from both the SKILLS array and project.skills
function buildGraph(projects: any, skills: any) 
{
  const nodes: any[] = [];
  const links: any[] = [];


  // add project nodes
  projects.forEach(p => nodes.push({ id: p.id, type: 'project', label: p.title, meta: p }));

  // build a set of skill names from supplied skills array + all project skills
  const skillSet = new Set();
  (skills || []).forEach(s => skillSet.add(s));
  projects.forEach(p => {
    if (Array.isArray(p.skills)) {
      p.skills.forEach(s => skillSet.add(s));
    }
  });

  // add skill nodes from the union set
  Array.from(skillSet).forEach(s => nodes.push({ id: `skill:${s}`, type: 'skill', label: s }));

  // links (only create links for skills that exist in nodes)
  projects.forEach(p => {
    (p.skills || []).forEach(s => {
      links.push({ source: p.id, target: `skill:${s}` });
    });
  });

  return { nodes, links };
}


export default function PortfolioApp() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [highlightSkill, setHighlightSkill] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const svgRefDesktop = useRef(null);
  const svgRefMobile = useRef(null);
const simulationRef = useRef(null);

  const data = useMemo(() => buildGraph(PROJECTS, SKILLS), []);

  // d3 force simulation
  // render / simulation effect (handles both desktop & mobile svgs, and window resize)
useEffect(() => {
  // helper to render a graph into a given svg element
  function renderInto(svgEl, isMobile, namespace) {
    if (!svgEl) return null;

    const width = svgEl.parentElement?.clientWidth || 900;
    const height = isMobile ? 300 : 420;

    // clear previous
    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('width', '100%')
      .style('height', `${height}px`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    // groups
    const linkGroup = svg.append('g').attr('stroke', 'rgba(0,0,0,0.12)');
    const nodeGroup = svg.append('g');

    // tune forces
    const linkDistance = isMobile ? 40 : 60;
    const chargeStrength = isMobile ? -60 : -120;
    const linkStrength = 0.6;

    // create simulation
    const simulation = d3.forceSimulation(data.nodes.map(d => Object.assign({}, d))) // clone nodes so multiple sims may not conflict
      .force('link', d3.forceLink(data.links).id(d => d.id).distance(linkDistance).strength(linkStrength))
      .force('charge', d3.forceManyBody().strength(chargeStrength))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // create link & node DOM
    const link = linkGroup.selectAll('line')
      .data(data.links)
      .join('line')
      .attr('stroke-width', 1.2);

    const node = nodeGroup.selectAll('g')
      .data(simulation.nodes())
      .join('g')
      .call(d3.drag()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x; d.fy = d.y;
        })
        .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          // keep nodes pinned if user dragged intentionally? we release to allow settling
          d.fx = null; d.fy = null;
        })
      );

    node.append('circle')
      .attr('r', d => d.type === 'project' ? (isMobile ? 6 : 10) : (isMobile ? 5 : 7))
      .attr('fill', d => d.type === 'project' ? '#0ea5a4' : '#7c3aed')
      .attr('opacity', 0.95)
      .style('cursor', isMobile ? 'default' : 'pointer')
      .on('mouseover', (e, d) => { if (!isMobile && d.type === 'skill') setHighlightSkill(d.label); })
      .on('mouseout', () => { if (!isMobile) setHighlightSkill(null); })
      .on('click', (e, d) => { if (!isMobile && d.type === 'project') setSelectedProject(d.meta); });

    // labels (only visible on desktop)
    node.append('text')
      .text(d => isMobile ? '' : d.label)
      .attr('font-size', 10)
      .attr('x', 12)
      .attr('y', 4)
      .style('pointer-events', 'none');

    // on tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // small alpha to settle
    simulation.alpha(0.8).restart();

    // return a cleanup function for this svg's simulation + dom
    return {
      stop: () => {
        simulation.stop();
        svg.selectAll('*').remove();
      },
      svgSelection: svg,
    };
  }

  // store per-surface results so we can cleanup individually
  const results = {};

  // render desktop if present
  const desktopEl = svgRefDesktop?.current;
  if (desktopEl) {
    results.desktop = renderInto(desktopEl, false, 'desktop');
  }

  // render mobile if present
  const mobileEl = svgRefMobile?.current;
  if (mobileEl) {
    results.mobile = renderInto(mobileEl, true, 'mobile');
  }

  // store into simulationRef for potential external usage
  simulationRef.current = results;

  // re-render on window resize (debounced)
  let resizeTimer = null;
  function handleResize() {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // re-render both svgs (stop + recreate)
      if (simulationRef.current) {
        if (simulationRef.current.desktop?.stop) simulationRef.current.desktop.stop();
        if (simulationRef.current.mobile?.stop) simulationRef.current.mobile.stop();
      }
      // re-run by calling effect body via manual rerender: we simply call renderInto again
      // (we can't re-run the hook itself; instead, call renderInto directly)
      const newDesktop = svgRefDesktop?.current ? renderInto(svgRefDesktop.current, false, 'desktop') : null;
      const newMobile = svgRefMobile?.current ? renderInto(svgRefMobile.current, true, 'mobile') : null;
      simulationRef.current = { desktop: newDesktop, mobile: newMobile };
    }, 150);
  }
  window.addEventListener('resize', handleResize);

  // cleanup
  return () => {
    window.removeEventListener('resize', handleResize);
    if (resizeTimer) clearTimeout(resizeTimer);
    if (simulationRef.current) {
      if (simulationRef.current.desktop?.stop) simulationRef.current.desktop.stop();
      if (simulationRef.current.mobile?.stop) simulationRef.current.mobile.stop();
    }
    simulationRef.current = null;
  };
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [data]); // re-run only when data changes (projects/skills)


  // highlight logic for graph
  // update visuals when highlightSkill changes (applies to both desktop & mobile)
useEffect(() => {
  function applyHighlight(svgEl) {
    if (!svgEl) return;
    const svg = d3.select(svgEl);
    if (svg.empty()) return;

    svg.selectAll('g').selectAll('circle')
      .attr('opacity', d => {
        if (!highlightSkill) return 0.95;
        if (d.type === 'skill') return d.label === highlightSkill ? 1 : 0.2;
        const p = PROJECTS.find(pj => pj.id === d.id);
        if (!p) return 0.2;
        return p.skills.includes(highlightSkill) ? 1 : 0.12;
      });

    svg.selectAll('g').selectAll('text')
      .attr('opacity', d => {
        if (!highlightSkill) return 1;
        if (d.type === 'skill') return d.label === highlightSkill ? 1 : 0.25;
        const p = PROJECTS.find(pj => pj.id === d.id);
        if (!p) return 0.25;
        return p.skills.includes(highlightSkill) ? 1 : 0.2;
      });

    svg.selectAll('line').attr('opacity', d => {
      if (!highlightSkill) return 0.8;
      return (d.target.id === `skill:${highlightSkill}` || d.source.id === `skill:${highlightSkill}`) ? 1 : 0.08;
    });
  }

  applyHighlight(svgRefDesktop.current);
  applyHighlight(svgRefMobile.current);
}, [highlightSkill]);


  const filtered = PROJECTS.filter(p => (filter === 'All' || p.tags.includes(filter)) && (p.title.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase())));

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert('Message sent — stub');
    setFormName('');
    setFormEmail('');
    setFormMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="max-w-5xl mx-auto p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Ali Abbas</h1>
          <p className="text-sm text-gray-600">Turning mathematical logic into tangible creation , from algorithms to hardware.</p>
        </div>
        <nav className="flex gap-4">
          <a href="#projects" className="text-sm hover:underline">Projects</a>
          <a href="#playground" className="text-sm hover:underline">Playground</a>
          <a href="#blog" className="text-sm hover:underline">Blog</a>
          <a href="#contact" className="text-sm hover:underline">Contact</a>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto p-6 grid gap-10">
        {/* HERO */}
        <section className="relative grid md:grid-cols-2 gap-6 items-center bg-white md:bg-transparent p-6 md:p-8 rounded-2xl shadow overflow-hidden">
  {/* Mobile-only background graph (subtle, blurred wallpaper) */}
  <div className="absolute inset-0 block md:hidden">
    <svg
      ref={svgRefMobile}
      className="w-full h-full opacity-25 blur-sm"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    />
    {/* soft overlay so text stays readable */}
    <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-white/95 pointer-events-none" />
  </div>

  {/* Content column */}
  <div className="relative z-10">
    <h2 className="text-3xl md:text-4xl font-bold leading-tight">Ali Abbas — Mathematics & CS</h2>
    <p className="mt-4 text-gray-700">I like to learn about software and prototypes that connect formal mathematics with physical design, from algorithms and visualizers to basic experimental hardware systems.</p>

    <div className="mt-6 flex gap-3">
      <a href="#projects" className="px-4 py-2 rounded-lg bg-teal-500 text-white">See Projects</a>
      <a href="#contact" className="px-4 py-2 rounded-lg border border-gray-200">Contact</a>
    </div>

    <div className="mt-6 text-sm text-gray-500">
      {/* <strong>Stack:</strong> Next.js, React, Tailwind CSS, C++ */}
    </div>
  </div>

  {/* Desktop-only interactive graph */}
  <div className="hidden md:block p-4 relative z-10">
    <div className="bg-gray-100 rounded-lg p-4">
      <h4 className="text-sm font-semibold">Interactive Graph — Projects & Skills</h4>
      <p className="text-xs text-gray-500 mb-2">Hover a skill node to highlight related projects. Click a project node to preview.</p>

      <svg
        ref={svgRefDesktop}
        className="w-full h-64 rounded"
        preserveAspectRatio="xMidYMid meet"
      />

      {selectedProject && (
        <div className="mt-3 bg-white p-3 rounded shadow">
          <h5 className="font-semibold">{selectedProject.title}</h5>
          <p className="text-sm text-gray-600">{selectedProject.desc}</p>
          <div className="mt-2 text-xs text-gray-500">Tags: {selectedProject.tags.join(', ')}</div>
        </div>
      )}
    </div>

    <div className="mt-3 flex flex-wrap gap-2">
      {SKILLS.map(s => (
        <button
          key={s}
          onMouseEnter={() => setHighlightSkill(s)}
          onMouseLeave={() => setHighlightSkill(null)}
          onClick={() => setHighlightSkill(s)}
          className="text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
        >
          {s}
        </button>
      ))}
      <button onClick={() => { setHighlightSkill(null); setSelectedProject(null); }} className="text-xs px-2 py-1 rounded bg-white border">Reset</button>
    </div>
  </div>
</section>


        {/* ABOUT + TIMELINE */}
        <section id="about" className="bg-white p-6 rounded-2xl shadow grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold">About</h3>
            <p className="mt-2 text-gray-700">I'm a class 12th student of La Martiniere College, Lucknow passionate about mathematics and computer science. I build full-stack apps, design hardware prototypes with basic electronics, and write about foundational math.</p>

            <div className="mt-4">
              <h4 className="text-sm font-medium">Experience (visual)</h4>
              <div className="mt-3 space-y-3">
                <div className="overflow-x-auto">
                  <div className="flex gap-4 items-end h-36">
                    {TIMELINE.map(t => (
                      <div key={t.year} className="w-48 bg-slate-50 p-3 rounded shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-xs text-white">{t.year}</div>
                        <div className="font-semibold">{t.title}</div>
                        <div className="text-sm text-gray-600 mt-1">{t.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="p-3 bg-gray-50 rounded">
            <h4 className="text-sm font-semibold">Stats</h4>
            <ul className="mt-2 text-sm text-gray-600 space-y-1">
              <li>Languages: C++, JavaScript (React/Node)</li>
              <li>Areas of Interest: Algorithms, Embedded Systems and Math</li>
              
            </ul>
          </aside>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="bg-white p-6 rounded-2xl shadow">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h3 className="text-xl font-semibold">Projects</h3>
            <div className="flex gap-2 items-center flex-wrap">
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..." className="px-3 py-2 rounded border" />
              <select value={filter} onChange={e => setFilter(e.target.value)} className="px-3 py-2 rounded border">
                <option>All</option>
                <option>Web</option>
                <option>Hardware</option>
                <option>Research</option>
              </select>
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-3 gap-4">
            {filtered.map(p => (
              <div key={p.id} className="bg-gray-50 p-4 rounded shadow hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="font-semibold">{p.title}</h4>
                  <div className="text-xs text-gray-500">{p.tags.join(', ')}</div>
                </div>
                <p className="mt-2 text-sm text-gray-600">{p.desc}</p>
                <div className="mt-3 flex gap-2 flex-wrap">
                  {p.skills.map(s => <span key={s} className="text-xs px-2 py-1 bg-white border rounded">{s}</span>)}
                </div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => window.open(p.liveUrl, "_blank")}
 className="text-sm px-3 py-1 rounded bg-teal-600 text-white hover:bg-teal-700">Preview</button>
                  
                  <a
  href={p.codeUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="text-sm px-3 py-1 rounded border hover:bg-gray-100"
>
  Code
</a>

                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PLAYGROUND */}
        <section id="playground" className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-xl font-semibold">Math & Computing Playground</h3>
          <p className="mt-2 text-sm text-gray-600">Small interactive demos to demonstrate the Dimensional Arithmetic idea and algorithm animations.</p>

          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-medium">Dimensional Arithmetic Visualizer</h4>
              <p className="text-xs text-gray-500">Morph two numbers into geometric shapes using sliders.</p>
              <SimpleArithmeticVisualizer />
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-medium">Algorithm stepper</h4>
              <p className="text-xs text-gray-500">A tiny example: bubble sort visualizer (array length 8)</p>
              <SimpleSorter />
            </div>
          </div>
        </section>

        {/* BLOG */}
        <section id="blog" className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-xl font-semibold">Blog</h3>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            {BLOGS.map(b => (
              <article key={b.id} className="bg-gray-50 p-4 rounded hover:shadow-md transition-shadow">
                <div className="text-xs text-gray-400">{b.date}</div>
                <h4 className="font-semibold">{b.title}</h4>
                <p className="text-sm text-gray-600 mt-2">{b.excerpt}</p>
               <Link href={`/blog/${b.slug}`} className="mt-3 inline-block text-sm text-teal-600 hover:text-teal-700">Read →</Link>

              </article>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="bg-white p-6 rounded-2xl shadow grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold">Contact</h3>
            

            <div className="mt-4 space-y-3">
              <input 
                placeholder="Your name" 
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3 py-2 border rounded" 
              />
              <input 
                placeholder="Email" 
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded" 
              />
              <textarea 
                placeholder="Message" 
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
                className="w-full px-3 py-2 border rounded" 
                rows={4}
              ></textarea>
              <div className="flex gap-3 items-center flex-wrap">
                <button 
                  onClick={handleFormSubmit}
                  className="px-4 py-2 rounded bg-teal-600 text-white hover:bg-teal-700"
                >
                  Send
                </button>
                {/* <div className="text-sm text-gray-500">Or scan the QR</div> */}
                {/* <div className="w-20 h-20 bg-white border rounded flex items-center justify-center text-xs text-gray-400">QR</div> */}
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded">
            {/* <h4 className="font-semibold">Downloads & Links</h4>
            <ul className="mt-2 text-sm text-gray-600 space-y-2">
              <li><a href="#" className="text-teal-600 hover:text-teal-700">Download CV (PDF) --- Not abailable right now</a></li>
              <li><a href="#" className="text-teal-600 hover:text-teal-700">GitHub</a></li>
              <li><a href="#" className="text-teal-600 hover:text-teal-700">Research repo</a></li> */}
            {/* </ul> */}

            <div className="mt-4">
              <h5 className="text-sm font-medium">Quick contacts</h5>
              <div className="text-xs text-gray-500 mt-2">Email: aliabbas07950@gmail.com</div>
              <div className="text-xs text-gray-500">Phone : +91 6393728342</div>
            </div>
          </div>
        </section>

        <footer className="text-center text-sm p-4 text-gray-500">© {new Date().getFullYear()} Ali Abbas</footer>
      </main>
    </div>
  );
}

// ------------------- Small interactive components -------------------
function SimpleArithmeticVisualizer() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  
  return (
    <div className="mt-3">
      <div className="flex gap-4 items-end">
        <div className="w-1/3 bg-white p-3 rounded shadow">
          <div className="text-xs text-gray-500">A = {a}</div>
          <div className="bg-gradient-to-b from-teal-300 to-teal-600 rounded" style={{ height: `${a * 8 + 30}px` }}></div>
        </div>
        <div className="w-1/3 bg-white p-3 rounded shadow">
          <div className="text-xs text-gray-500">B = {b}</div>
          <div className="bg-gradient-to-b from-purple-300 to-purple-600 rounded" style={{ height: `${b * 8 + 30}px` }}></div>
        </div>
        <div className="w-1/3 bg-white p-3 rounded shadow">
          <div className="text-xs text-gray-500">A ⨁ B (combined)</div>
          <div className="bg-gradient-to-b from-indigo-300 to-indigo-600 rounded" style={{ height: `${(a+b) * 6 + 30}px` }}></div>
        </div>
      </div>
      <div className="mt-3 flex gap-3 items-center">
        <label className="text-xs">A</label>
        <input type="range" min={1} max={10} value={a} onChange={e => setA(Number(e.target.value))} className="flex-1" />
        <label className="text-xs">B</label>
        <input type="range" min={1} max={10} value={b} onChange={e => setB(Number(e.target.value))} className="flex-1" />
      </div>
    </div>
  );
}

function SimpleSorter() {
  const [arr, setArr] = useState<number[]>([]);
  const [i, setI] = useState(0);
  const [j, setJ] = useState(0);

  // initialize the array only on client after mount
  useEffect(() => {
    setArr(Array.from({ length: 8 }).map(() => Math.floor(Math.random() * 90) + 10));
  }, []);

  function step() {
    setArr(prev => {
      const a = [...prev];
      if (i < a.length) {
        if (j < a.length - i - 1) {
          if (a[j] > a[j + 1]) {
            const t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
          }
          setJ(j + 1);
        } else {
          setJ(0);
          setI(i + 1);
        }
      }
      return a;
    });
  }

  return (
    <div className="mt-3">
      <div className="flex gap-2 items-end h-24">
        {arr.map((v, idx) => (
          <div
            key={idx}
            className={`flex-1 text-xs p-1 rounded ${idx === j || idx === j+1 ? 'bg-yellow-200' : 'bg-white'} border`}
          >
            <div className="text-center">{v}</div>
            <div style={{ height: `${v}px` }} className="mt-2 bg-teal-300 rounded-b"></div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={step} className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700">Step</button>
        <button onClick={() => { setArr(Array.from({ length: 8 }).map(() => Math.floor(Math.random() * 90) + 10)); setI(0); setJ(0); }} className="px-3 py-1 rounded border hover:bg-gray-100">Reset</button>
      </div>
    </div>
  );
}








