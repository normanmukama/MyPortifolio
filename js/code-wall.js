/*
 * Code wall: a tiled set of terminal screens fixed behind the page, from the
 * Projects section down. Scroll position decides how much code has been typed,
 * so scrolling down writes it, scrolling up deletes it, and stopping stops it.
 * Each section brings its own set of files. The code is decorative: it is
 * written for this site and is not taken from any client project.
 */
(function () {
    'use strict';

    const SECTIONS = [
        {
            id: 'projects', label: 'PROJECTS',
            a: { file: 'app/Http/Controllers/ProjectController.php', code: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Project;
use Illuminate\\Http\\JsonResponse;

class ProjectController extends Controller
{
    // Only ship what is live and worth showing
    public function index(): JsonResponse
    {
        $projects = Project::query()
            ->with('technologies')
            ->where('is_live', true)
            ->latest('released_at')
            ->paginate(6);

        return response()->json($projects);
    }

    public function show(Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        return response()->json($project->load('links'));
    }
}` },
            b: { file: 'resources/js/ProjectCard.vue', code: `<script setup>
import { computed } from 'vue'

const props = defineProps({
  project: { type: Object, required: true }
})

// A card only shows tags when it has them
const hasTech = computed(() => props.project.tech.length > 0)
</script>

<template>
  <article class="proj-card">
    <h3>{{ project.title }}</h3>
    <p>{{ project.description }}</p>
    <footer v-if="hasTech">
      <span v-for="item in project.tech" :key="item">
        {{ item }}
      </span>
    </footer>
    <a :href="project.demoLink" target="_blank">live</a>
  </article>
</template>` },
            c: { file: 'zsh — build', code: `$ composer install --no-dev
Generating optimized autoload files
$ php artisan migrate --force
Migrating: create_projects_table
Migrated:  create_projects_table
$ php artisan test
Tests: all passing
$ npm run build
vite building for production...
✓ modules transformed
✓ built, ready to ship
$ ls projects/
emis  parliament-messaging  gix-agency
postkazi  wecare24  preacher-holdings` }
        },
        {
            id: 'experience', label: 'EXPERIENCE',
            a: { file: 'app/Http/Middleware/RequireRole.php', code: `<?php

namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Http\\Request;

class RequireRole
{
    // Roles come from the identity provider's token
    public function handle(Request $request, Closure $next, string $role)
    {
        $claims = $request->attributes->get('token_claims', []);
        $roles = $claims['realm_access']['roles'] ?? [];

        abort_unless(in_array($role, $roles, true), 403);

        return $next($request);
    }
}` },
            b: { file: 'app/Domain/Orders/OrderPlaced.php', code: `<?php

namespace App\\Domain\\Orders;

// Domain event: what happened, in the language of the business
final readonly class OrderPlaced
{
    public function __construct(
        public string $orderId,
        public string $customerId,
        public int $totalInCents,
    ) {}

    public function routingKey(): string
    {
        return 'orders.placed';
    }
}

// Other services react to this without knowing who sent it
$publisher->publish(new OrderPlaced($id, $customer, $total));` },
            c: { file: 'zsh — career', code: `$ cat ~/career.log
[role]  Software Developer @ SMSONE Company
        Kampala
        Laravel, Vue.js, PostgreSQL
        Keycloak, OpenSearch, microservices

[role]  Web Developer @ GIX Agency
        Client websites, responsive layouts

[role]  Software Developer @ OSP
        Wandegeya, Kampala
        School management, Postkazi job portal
        Vue.js, Tailwind CSS, WordPress
$ git shortlog --summary --all | wc -l` }
        },
        {
            id: 'skills', label: 'SKILLS',
            a: { file: 'src/stack.ts', code: `type Skill = { name: string; group: Group }

type Group =
  | 'languages' | 'backend' | 'frontend'
  | 'data' | 'messaging' | 'security' | 'ops'

const stack: Record<Group, string[]> = {
  languages: ['PHP', 'JavaScript', 'TypeScript', 'Java', 'SQL'],
  backend: ['Laravel', 'CodeIgniter', 'Spring Boot', 'REST APIs'],
  frontend: ['Vue.js 3', 'Tailwind CSS', 'Bootstrap', 'Alpine.js'],
  data: ['PostgreSQL', 'MySQL', 'Redis'],
  messaging: ['RabbitMQ', 'Kafka'],
  security: ['Keycloak', 'RBAC'],
  ops: ['OpenSearch', 'Kibana', 'Docker', 'Linux', 'CI/CD'],
}

export const skills: Skill[] = Object.entries(stack).flatMap(
  ([group, names]) =>
    names.map((name) => ({ name, group: group as Group }))
)` },
            b: { file: 'docker-compose.yml', code: `services:
  app:
    build: .
    depends_on: [postgres, redis, rabbitmq]
    ports: ["8000:8000"]

  postgres:
    image: postgres:16
    volumes: [pgdata:/var/lib/postgresql/data]

  redis:
    image: redis:7

  rabbitmq:
    image: rabbitmq:3-management

  keycloak:
    image: quay.io/keycloak/keycloak
    command: start-dev

  opensearch:
    image: opensearchproject/opensearch

volumes:
  pgdata:` },
            c: { file: 'zsh — toolchain', code: `$ docker compose up -d
✓ Container postgres    Started
✓ Container redis       Started
✓ Container rabbitmq    Started
✓ Container keycloak    Started
✓ Container opensearch  Started
✓ Container app         Started
$ docker compose ps --format "{{.Name}}"
app
keycloak
opensearch
postgres
rabbitmq
redis` }
        },
        {
            id: 'education', label: 'EDUCATION',
            a: { file: 'src/main/java/Education.java', code: `package dev.norman.profile;

import java.util.List;

public record Education(String title, String school, String period) {

    public static List<Education> all() {
        return List.of(
            new Education(
                "BSc Software Engineering",
                "Victoria University, Kampala",
                "2026 - Present"
            ),
            new Education(
                "Diploma in Software Engineering",
                "Sai Pali Institute of Technology, Entebbe",
                "2021 - 2024"
            )
        );
    }
}` },
            b: { file: 'database/education.sql', code: `-- Keep learning. Keep the schema normalised.
CREATE TABLE schools (
    id      BIGSERIAL PRIMARY KEY,
    name    TEXT NOT NULL,
    city    TEXT NOT NULL
);

CREATE TABLE qualifications (
    id          BIGSERIAL PRIMARY KEY,
    school_id   BIGINT REFERENCES schools (id),
    title       TEXT NOT NULL,
    started_on  INT  NOT NULL,
    finished_on INT
);

SELECT q.title, s.name
FROM qualifications q
JOIN schools s ON s.id = q.school_id
ORDER BY q.started_on DESC;` },
            c: { file: 'zsh — studies', code: `$ cat ~/education.txt
2026 - Present
  BSc Software Engineering
  Victoria University, Kampala

2021 - 2024
  Diploma in Software Engineering
  Sai Pali Institute of Technology, Entebbe
  Class I: CGPA 4.7
$ git checkout -b keep-learning
Switched to a new branch 'keep-learning'` }
        },
        {
            id: 'blog', label: 'BLOG',
            a: { file: 'posts/typescript-generics.ts', code: `// One function, every type. No copy and paste.
function first<T>(items: T[]): T | undefined {
  return items[0]
}

interface Repository<T extends { id: string }> {
  find(id: string): Promise<T | null>
  save(entity: T): Promise<T>
}

class MemoryRepository<T extends { id: string }>
  implements Repository<T> {
  private rows = new Map<string, T>()

  async find(id: string) {
    return this.rows.get(id) ?? null
  }

  async save(entity: T) {
    this.rows.set(entity.id, entity)
    return entity
  }
}` },
            b: { file: 'posts/clean-laravel.php', code: `<?php

// Never trust user input. Validate it at the door.
class StorePostRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:120'],
            'body' => ['required', 'string'],
        ];
    }
}

// Avoid the N+1: load what the view will need
$posts = Post::with('author')->latest()->paginate(10);

// Name things so the next reader needs no comment
$publishedThisYear = $posts->filter->isPublishedThisYear();` },
            c: { file: 'zsh — writing', code: `$ ls ~/blog/
secure-clean-laravel.md
what-makes-a-developer-senior.md
typescript-generics.draft.md
$ head -1 what-makes-a-developer-senior.md
# What Makes A Developer Senior?
$ wc -l secure-clean-laravel.md
$ git add . && git commit -m "publish"
[main] publish
$ open https://norman-dev.hashnode.dev` }
        },
        {
            id: 'contact', label: 'CONTACT',
            a: { file: 'src/contact.ts', code: `type Message = {
  name: string
  subject: string
  body: string
}

export async function sendMessage(message: Message) {
  const response = await fetch('/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  })

  if (!response.ok) {
    throw new Error('Message not sent, please try again')
  }

  return 'Thanks. I will get back to you soon.'
}` },
            b: { file: 'hello.sh', code: `#!/usr/bin/env bash
set -euo pipefail

# You scrolled this far, so let's talk
project="${'$'}{1:-your next idea}"

echo "Norman Hategyekamukama"
echo "Software Developer, Kampala"
echo "Ready to build: ${'$'}project"` },
            c: { file: 'zsh — hello', code: `$ ./hello.sh
Norman Hategyekamukama
Software Developer, Kampala
Ready to build: your next idea
$ echo "Press Send Message"
Press Send Message
$ exit
logout
[Process completed]` }
        }
    ];

    const COLORS = {
        text: '#c5d3e8', comment: '#5f7196', keyword: '#b79bff', string: '#39ff88',
        number: '#ffc66d', variable: '#00f0ff', prompt: '#39ff88', dim: '#5f7196'
    };

    const KEYWORDS = new Set(('abort_unless async await break case class const declare echo else export extends final ' +
        'for from function if implements import interface namespace new private public readonly record return set static ' +
        'throw try type use while CREATE TABLE SELECT FROM JOIN ON ORDER BY PRIMARY KEY REFERENCES NOT NULL DESC package').split(' '));

    const TOKEN = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`)|(\$[A-Za-z_]\w*)|(\b\d[\d.]*\b)|([A-Za-z_][\w]*)/g;

    // Splits one line into coloured runs. Runs always add up to the whole line.
    function highlight(line) {
        const prompt = line.match(/^\$ /);
        if (prompt) return [{ t: '$ ', c: COLORS.prompt }, { t: line.slice(2), c: COLORS.text }];
        if (/^\s*(\/\/|--|#(?!!)|\*)/.test(line)) return [{ t: line, c: COLORS.comment }];
        if (/^\s*✓/.test(line)) return [{ t: line, c: COLORS.string }];

        const runs = [];
        let last = 0;
        for (const m of line.matchAll(TOKEN)) {
            if (m.index > last) runs.push({ t: line.slice(last, m.index), c: COLORS.text });
            let color = COLORS.text;
            if (m[1]) color = COLORS.string;
            else if (m[2]) color = COLORS.variable;
            else if (m[3]) color = COLORS.number;
            else if (KEYWORDS.has(m[4])) color = COLORS.keyword;
            else if (/^[A-Z][a-z]/.test(m[4])) color = COLORS.variable;
            runs.push({ t: m[0], c: color });
            last = m.index + m[0].length;
        }
        if (last < line.length) runs.push({ t: line.slice(last), c: COLORS.text });
        return runs;
    }

    function compile(stream) {
        const lines = stream.code.split('\n');
        let total = 0;
        const compiled = lines.map((text) => {
            const start = total;
            total += text.length + 1; // the newline takes one keystroke too
            return { text, start, runs: highlight(text) };
        });
        return { file: stream.file, lines: compiled, total, gutter: stream.gutter !== false };
    }

    // A real hex dump of a phrase, so anyone who reads it finds the message
    function hexStream(phrase, rows) {
        const bytes = Array.from(new TextEncoder().encode(phrase));
        const lines = [];
        for (let row = 0; row < rows; row++) {
            const hex = [];
            let ascii = '';
            for (let col = 0; col < 8; col++) {
                const b = bytes[(row * 8 + col) % bytes.length];
                hex.push(b.toString(16).padStart(2, '0'));
                ascii += b >= 32 && b < 127 ? String.fromCharCode(b) : '.';
            }
            lines.push((row * 8).toString(16).padStart(6, '0') + '  ' + hex.join(' ') + '  ' + ascii);
        }
        return { file: 'xxd — memory', code: lines.join('\n'), gutter: false };
    }

    // Build output for the centre screen, stitched from the section's own files
    function logStream(section) {
        const files = [section.a.file, section.b.file];
        const steps = ['parse', 'lint', 'compile', 'bundle', 'test', 'cache'];
        const lines = [`$ watch --section ${section.id}`];
        for (let i = 0; i < 48; i++) {
            const seconds = String(i % 60).padStart(2, '0');
            const ms = String((i * 137 + section.id.length * 53) % 1000).padStart(3, '0');
            lines.push(`00:00:${seconds}.${ms}  ${steps[i % steps.length].padEnd(8)}${files[i % 2]}  ok`);
        }
        return { file: `watch — ${section.id}`, code: lines.join('\n'), gutter: false };
    }

    const scripts = SECTIONS.map((section) => ({
        id: section.id,
        label: section.label,
        a: compile(section.a),
        b: compile(section.b),
        c: compile({ ...section.c, gutter: false }),
        hex: compile(hexStream(`Norman Hategyekamukama // software developer // ${section.label.toLowerCase()} // `, 44)),
        log: compile(logStream(section))
    }));

    const wall = document.createElement('div');
    wall.id = 'code-wall';
    wall.setAttribute('aria-hidden', 'true');
    const canvas = document.createElement('canvas');
    wall.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    document.body.prepend(wall);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const BACKGROUND = '26, 26, 46';
    const STATUS_HEIGHT = 22;
    const TITLE_HEIGHT = 22;
    const REVEAL_DISTANCE = 160; // px of scrolling over which the wall fades in

    let W = 0, H = 0, dpr = 1;
    let panes = [];
    let fontSize = 12, lineHeight = 18, charW = 7.2;
    let segments = [];           // scroll range in which each section types
    let firstEl = null;
    let shown = 0;               // eased position: section index + progress
    let currentSection = -1;
    let velocity = 0, burst = 0; // both drive the glitch
    let stampText = '', stampLife = 0;
    let lastScroll = window.scrollY, lastTime = 0;
    let running = false;
    let blinkOn = true;
    let revealY = Infinity;
    let isVisible = false;

    function layout() {
        W = window.innerWidth;
        H = window.innerHeight;
        dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);

        fontSize = W < 640 ? 10 : W < 1024 ? 11 : 12;
        lineHeight = Math.round(fontSize * 1.5);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.font = `${fontSize}px "Space Mono", monospace`;
        charW = ctx.measureText('M').width;

        const gap = 8;
        const usable = H - STATUS_HEIGHT - gap;
        const pane = (stream, x, y, w, h, alpha, delay) => ({ stream, x, y, w, h, alpha, delay });

        if (W >= 1024) {
            const side = Math.round(W * 0.27);
            const middle = W - side * 2 - gap * 4;
            const topH = Math.round(usable * 0.62);
            const bottomH = usable - topH - gap * 2;
            const rightX = W - side - gap;
            panes = [
                pane('a', gap, gap, side, topH, 1, 0),
                pane('c', gap, gap * 2 + topH, side, bottomH, 1, 0.08),
                pane('log', gap * 2 + side, gap, middle, usable - gap, 0.55, 0.03),
                pane('b', rightX, gap, side, topH, 1, 0.05),
                pane('hex', rightX, gap * 2 + topH, side, bottomH, 0.85, 0.02)
            ];
        } else if (W >= 640) {
            const half = Math.round((W - gap * 3) / 2);
            const topH = Math.round(usable * 0.6);
            panes = [
                pane('a', gap, gap, half, topH, 1, 0),
                pane('c', gap, gap * 2 + topH, half, usable - topH - gap * 2, 1, 0.08),
                pane('b', gap * 2 + half, gap, half, usable - gap, 1, 0.05)
            ];
        } else {
            const topH = Math.round(usable * 0.6);
            panes = [
                pane('a', gap, gap, W - gap * 2, topH, 1, 0),
                pane('c', gap, gap * 2 + topH, W - gap * 2, usable - topH - gap * 2, 1, 0.08)
            ];
        }
        measure();
    }

    // Each section types from just before it arrives until the next one takes over
    function measure() {
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - H);
        const tops = SECTIONS.map(({ id }) => {
            const el = document.getElementById(id);
            return el ? el.getBoundingClientRect().top + window.scrollY : maxScroll;
        });
        firstEl = document.getElementById(SECTIONS[0].id);
        segments = tops.map((top, i) => {
            const start = Math.max(0, Math.min(top - H * 0.75, maxScroll - 1));
            const end = i + 1 < tops.length ? Math.min(tops[i + 1] - H * 0.75, maxScroll) : maxScroll;
            return { start, end: Math.max(end, start + 1) };
        });
    }

    function scrollTarget() {
        const y = window.scrollY;
        for (let i = segments.length - 1; i >= 0; i--) {
            if (y >= segments[i].start) {
                const { start, end } = segments[i];
                return i + Math.min(0.9999, (y - start) / (end - start));
            }
        }
        return 0;
    }

    function drawPane(pane, section, progress, isFlashing) {
        const stream = section[pane.stream];
        const { x, y, w, h } = pane;
        const typed = Math.floor(Math.min(1, Math.max(0, progress * 1.12 - pane.delay)) * stream.total);

        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.clip();

        ctx.fillStyle = 'rgba(6, 9, 22, 0.72)';
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.07)';
        ctx.fillRect(x, y, w, TITLE_HEIGHT);

        // Window controls, then the file being written
        ctx.globalAlpha = pane.alpha;
        ['#ff5f56', '#ffbd2e', '#27c93f'].forEach((color, i) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x + 12 + i * 12, y + TITLE_HEIGHT / 2, 3, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.fillStyle = isFlashing ? '#ffffff' : COLORS.dim;
        ctx.fillText(stream.file, x + 54, y + 15);

        // Find the line being typed, and keep it on screen like a real terminal
        let current = 0;
        while (current + 1 < stream.lines.length && stream.lines[current + 1].start <= typed) current++;
        const rows = Math.max(1, Math.floor((h - TITLE_HEIGHT - 12) / lineHeight));
        const first = Math.max(0, current - rows + 1);
        const gutter = stream.gutter ? charW * 4 : 0;
        const textX = x + 10 + gutter;

        let cursorX = textX, cursorY = 0;
        for (let i = first; i <= current; i++) {
            const line = stream.lines[i];
            const baseY = y + TITLE_HEIGHT + 6 + (i - first + 1) * lineHeight - 4;
            const age = current - i;
            const fade = Math.max(0.42, 1 - age * 0.035);

            if (stream.gutter) {
                ctx.globalAlpha = pane.alpha * 0.35;
                ctx.fillStyle = COLORS.comment;
                ctx.fillText(String(i + 1).padStart(3, ' '), x + 8, baseY);
            }

            ctx.globalAlpha = pane.alpha * fade;
            let remaining = typed - line.start;
            let column = 0;
            for (const run of line.runs) {
                if (remaining <= 0) break;
                const text = remaining < run.t.length ? run.t.slice(0, remaining) : run.t;
                ctx.fillStyle = run.c;
                ctx.fillText(text, textX + column * charW, baseY);
                column += text.length;
                remaining -= text.length;
            }
            if (i === current) {
                cursorX = textX + column * charW;
                cursorY = baseY;
            }
        }

        // Block cursor, solid while typing and blinking when idle
        if (running || blinkOn) {
            ctx.globalAlpha = pane.alpha;
            ctx.fillStyle = COLORS.variable;
            ctx.shadowColor = COLORS.variable;
            ctx.shadowBlur = 10;
            ctx.fillRect(cursorX + 1, (cursorY || y + TITLE_HEIGHT + 6 + lineHeight - 4) - fontSize + 2, charW - 1, fontSize);
            ctx.shadowBlur = 0;
        }

        ctx.restore();

        ctx.save();
        ctx.globalAlpha = pane.alpha;
        ctx.strokeStyle = isFlashing ? 'rgba(0, 240, 255, 0.95)' : 'rgba(0, 240, 255, 0.22)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
        ctx.restore();

        return typed;
    }

    function drawStatus(sectionIndex, section, typedTotal) {
        const y = H - STATUS_HEIGHT;
        ctx.fillStyle = 'rgba(0, 240, 255, 0.1)';
        ctx.fillRect(0, y, W, STATUS_HEIGHT);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.85)';
        ctx.fillRect(0, y, 96, STATUS_HEIGHT);
        ctx.fillStyle = '#06101f';
        ctx.fillText('NORMAN@DEV', 10, y + 15);

        const maxScroll = Math.max(1, document.documentElement.scrollHeight - H);
        const percent = Math.round((window.scrollY / maxScroll) * 100);
        const index = String(sectionIndex + 1).padStart(2, '0');
        ctx.fillStyle = COLORS.variable;
        const info = W < 640
            ? `${index}/${SECTIONS.length} ${section.label}`
            : `${index}/${SECTIONS.length} ${section.label}   chars ${String(typedTotal).padStart(5, '0')}   scroll ${percent}%`;
        ctx.fillText(info, 108, y + 15);
    }

    // Tears the finished frame into shifted slices, harder the faster the scroll
    function drawGlitch(amount) {
        const slices = Math.round(amount * 9);
        for (let i = 0; i < slices; i++) {
            const sliceY = Math.random() * H;
            const sliceH = 3 + Math.random() * 34;
            const shift = (Math.random() - 0.5) * (20 + amount * 150);
            ctx.drawImage(canvas, 0, sliceY * dpr, canvas.width, sliceH * dpr, shift, sliceY, W, sliceH);
        }
        if (amount > 0.35) {
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.globalAlpha = 0.16 * amount;
            ctx.drawImage(canvas, 3 * amount, 0, W, H);
            for (let i = 0; i < 3; i++) {
                ctx.fillStyle = i % 2 ? 'rgb(255, 0, 170)' : 'rgb(0, 240, 255)';
                ctx.fillRect(0, Math.random() * H, W, 1 + Math.random() * 3);
            }
            ctx.restore();
        }
    }

    function drawStamp() {
        if (stampLife <= 0.01) return;
        const size = Math.min(W * 0.11, 160);
        ctx.save();
        ctx.font = `700 ${size}px "Space Mono", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = stampLife * 0.5;
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = COLORS.variable;
        ctx.shadowColor = COLORS.variable;
        ctx.shadowBlur = 24;
        ctx.strokeText(stampText, W / 2 + (1 - stampLife) * 14, H / 2);
        ctx.restore();
    }

    function draw() {
        const sectionIndex = Math.min(SECTIONS.length - 1, Math.max(0, Math.floor(shown)));
        const section = scripts[sectionIndex];
        const progress = reducedMotion ? 1 : shown - sectionIndex;
        const isFlashing = burst > 0.35;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, H);
        ctx.font = `${fontSize}px "Space Mono", monospace`;

        let typedTotal = 0;
        for (const pane of panes) typedTotal += drawPane(pane, section, progress, isFlashing);

        drawStatus(sectionIndex, section, typedTotal);
        drawStamp();

        const amount = Math.min(1, Math.max(velocity, burst));
        if (!reducedMotion && amount > 0.08) drawGlitch(amount);

        // The wall rises with Projects, with a soft top edge over the landing page
        if (revealY > 0) {
            const gradient = ctx.createLinearGradient(0, revealY, 0, revealY + 110);
            gradient.addColorStop(0, `rgba(${BACKGROUND}, 1)`);
            gradient.addColorStop(1, `rgba(${BACKGROUND}, 0)`);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, revealY, W, 110);
        }
    }

    // Returns false on the untouched landing page. Projects can already peek in
    // at the bottom of a tall screen, so the wall also waits for the first scroll.
    function updateReveal() {
        revealY = firstEl ? Math.max(0, firstEl.getBoundingClientRect().top) : 0;
        isVisible = revealY < H && window.scrollY > 0;
        wall.style.visibility = isVisible ? 'visible' : 'hidden';
        wall.style.opacity = Math.min(1, window.scrollY / REVEAL_DISTANCE);
        wall.style.clipPath = revealY > 0 ? `inset(${revealY}px 0 0 0)` : 'none';
        return isVisible;
    }

    function setSection(index, announce) {
        if (index === currentSection) return;
        currentSection = index;
        if (!announce || reducedMotion) return;
        burst = 1;
        stampText = `${String(index + 1).padStart(2, '0')}_${SECTIONS[index].label}`;
        stampLife = 1;
    }

    function frame(time) {
        const dt = Math.min(64, time - lastTime || 16);
        lastTime = time;

        const visible = updateReveal();
        const target = scrollTarget();
        const y = window.scrollY;
        const speed = Math.abs(y - lastScroll) / dt; // px per ms
        lastScroll = y;

        if (reducedMotion) {
            shown = target;
        } else {
            shown += (target - shown) * (1 - Math.exp(-dt / 120));
            velocity += (Math.min(1, speed / 4) - velocity) * 0.25;
            burst *= Math.exp(-dt / 170);
            stampLife *= Math.exp(-dt / 320);
        }

        setSection(Math.min(SECTIONS.length - 1, Math.max(0, Math.floor(shown))), visible);
        if (visible) draw();

        const settled = Math.abs(target - shown) < 0.0002 && speed === 0 &&
            velocity < 0.01 && burst < 0.01 && stampLife < 0.01;
        if (settled) {
            velocity = burst = stampLife = 0;
            shown = target;
            running = false;
            if (visible) draw();
            return;
        }
        requestAnimationFrame(frame);
    }

    function wake() {
        if (running) return;
        running = true;
        lastTime = performance.now();
        requestAnimationFrame(frame);
    }

    // Start from wherever the browser restored the scroll to, without a burst
    function settleAtScroll() {
        measure();
        shown = scrollTarget();
        currentSection = Math.floor(shown);
        if (updateReveal()) draw();
    }

    let resizeTimer = 0;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => { layout(); settleAtScroll(); }, 120);
    });
    window.addEventListener('scroll', wake, { passive: true });
    window.addEventListener('load', settleAtScroll);

    // Late images and web fonts move the sections, so keep the ranges honest
    if ('ResizeObserver' in window) {
        new ResizeObserver(() => { measure(); wake(); }).observe(document.body);
    }

    setInterval(() => {
        blinkOn = !blinkOn;
        if (!running && !document.hidden && isVisible) draw();
    }, 530);

    layout();
    settleAtScroll();

    if (document.fonts && document.fonts.load) {
        document.fonts.load(`${fontSize}px "Space Mono"`).then(() => { layout(); settleAtScroll(); });
    }
})();
