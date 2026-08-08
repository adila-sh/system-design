"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Fundo "Pixel Blast": um campo de pixels em grid na cor **primary** do tema,
 * com padrão de ruído animado, brilho que segue o cursor e ondas (ripples) que
 * se propagam ao clicar. WebGL cru, sem dependências.
 *
 * Degradação: sem WebGL, o canvas some e o `<div bg-primary>` de fallback assume.
 */

const MAX_RIPPLES = 8;
const RIPPLE_LIFE = 2.6; // segundos até sumir

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;
varying vec2 vUv;

uniform vec2 uRes;
uniform float uTime;
uniform float uReduce;      // 1 = reduz movimento automático
uniform vec3 uColor;        // cor primary (sRGB 0..1)
uniform vec2 uMouse;        // cursor em uv [0,1]
uniform float uMouseOn;     // 0..1 presença do cursor
uniform float uShape;       // 0 = quadrado, 1 = círculo, 2 = losango
uniform vec3 uRipples[${MAX_RIPPLES}]; // (x, y, age); age < 0 = inativo

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

// Distância normalizada com morph contínuo entre os formatos
// (0 = quadrado, 1 = círculo, 2 = losango) — permite transição animada.
float shapeDist(vec2 f, float shape) {
  float sq = max(abs(f.x), abs(f.y));
  float ci = length(f);
  float di = abs(f.x) + abs(f.y);
  float d = mix(sq, ci, clamp(shape, 0.0, 1.0));
  d = mix(d, di, clamp(shape - 1.0, 0.0, 1.0));
  return d;
}

void main() {
  float aspect = uRes.x / uRes.y;

  // Grid de pixels.
  float px = 20.0;
  vec2 cells = max(floor(uRes / px), vec2(1.0));
  vec2 cellId = floor(vUv * cells);
  vec2 cp = ((cellId + 0.5) / cells) * vec2(aspect, 1.0); // centro, aspecto corrigido

  // Campo granular animado.
  float t = uTime * (1.0 - 0.85 * uReduce);
  float field = fbm(cp * 4.5 + vec2(t * 0.08, t * 0.05));
  field += 0.12 * sin(t * 0.7 + (cp.x + cp.y) * 7.0);

  // Brilho ao redor do cursor.
  float md = distance(cp, uMouse * vec2(aspect, 1.0));
  field += uMouseOn * exp(-md * md * 20.0) * 0.55;

  // Ondas de clique: anel que se expande a partir do ponto.
  for (int i = 0; i < ${MAX_RIPPLES}; i++) {
    vec3 r = uRipples[i];
    if (r.z < 0.0) continue;
    float d = distance(cp, r.xy * vec2(aspect, 1.0));
    float wavefront = r.z * 0.55;                 // raio cresce com a idade
    float ring = exp(-abs(d - wavefront) * 7.0);  // anel fino
    float decay = exp(-r.z * 1.4);                // some com o tempo
    field += ring * decay * 1.2;
  }

  // Tamanho da forma varia conforme o campo → pixels de tamanhos diferentes,
  // que crescem/encolhem com a animação. Campo baixo → pixel some (dithering).
  float size = 0.46 * smoothstep(0.26, 0.86, field);
  vec2 fpos = fract(vUv * cells) - 0.5;
  float pixel = 1.0 - smoothstep(size - 0.04, size + 0.02, shapeDist(fpos, uShape));

  float hi = smoothstep(0.72, 1.02, field);
  vec3 bg = uColor * 0.42;                 // fundo primary escurecido
  vec3 fg = uColor * (0.95 + 0.45 * hi);   // pixel primary brilhante
  vec3 col = mix(bg, fg, pixel);
  col += uColor * pixel * hi * 0.5;        // realce nos picos
  col = clamp(col, 0.0, 1.0);

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * Lê a cor `--primary` do tema e devolve RGB em 0..1. O token é `oklch(...)` e o
 * `getComputedStyle` não o converte para rgb — então usamos um canvas 2D, que
 * resolve qualquer cor CSS válida para pixels RGB reais.
 */
function readPrimary(): [number, number, number] {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--primary")
    .trim();
  const c = document.createElement("canvas");
  c.width = 1;
  c.height = 1;
  const ctx = c.getContext("2d");
  if (!ctx) return [0.31, 0.27, 0.9];
  ctx.fillStyle = "#000";
  ctx.fillStyle = raw || "#4f46e5"; // cor inválida → mantém o preto anterior
  ctx.fillRect(0, 0, 1, 1);
  const d = ctx.getImageData(0, 0, 1, 1).data;
  return [d[0] / 255, d[1] / 255, d[2] / 255];
}

/** Chave do tema atual — muda quando o usuário troca de tema (re-lê a cor). */
function themeKey() {
  const root = document.documentElement;
  return `${root.className}|${root.dataset.theme ?? ""}`;
}

export function PixelBlast({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
    if (!gl) {
      canvas.style.display = "none";
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (!vs || !fs || !program) {
      canvas.style.display = "none";
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      canvas.style.display = "none";
      return;
    }
    gl.useProgram(program);

    const cv = canvas;
    const glc = gl;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "uRes");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uReduce = gl.getUniformLocation(program, "uReduce");
    const uColor = gl.getUniformLocation(program, "uColor");
    const uMouse = gl.getUniformLocation(program, "uMouse");
    const uMouseOn = gl.getUniformLocation(program, "uMouseOn");
    const uShape = gl.getUniformLocation(program, "uShape");
    const uRipples = gl.getUniformLocation(program, "uRipples");

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const reduce = reduceMotion ? 1 : 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let drawStatic: (() => void) | undefined;

    function resize() {
      const w = Math.floor(cv.clientWidth * dpr);
      const h = Math.floor(cv.clientHeight * dpr);
      if (cv.width !== w || cv.height !== h) {
        cv.width = w;
        cv.height = h;
      }
      glc.viewport(0, 0, cv.width, cv.height);
      glc.uniform2f(uRes, cv.width, cv.height);
      drawStatic?.();
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Cursor suavizado.
    const target = { x: 0.5, y: 0.5, on: 0 };
    const smooth = { x: 0.5, y: 0.5, on: 0 };
    const onMove = (e: PointerEvent) => {
      const rect = cv.getBoundingClientRect();
      target.x = (e.clientX - rect.left) / rect.width;
      target.y = 1 - (e.clientY - rect.top) / rect.height;
      target.on = 1;
    };
    const onLeave = () => {
      target.on = 0;
    };

    // Pool de ripples (x, y em uv; start em segundos).
    const ripples = new Float32Array(MAX_RIPPLES * 3).fill(-1);
    const rippleStart = Array.from<number>({ length: MAX_RIPPLES }).fill(
      -Infinity,
    );
    let next = 0;
    // `start` desloca ao retomar após pausa (fora da viewport) para descontar o
    // tempo parado e evitar salto na animação.
    let start = performance.now();
    // Formato do pixel cicla (quadrado → círculo → losango) a cada 5 cliques,
    // com morph animado (shape avança suavemente rumo a shapeTarget).
    let clicks = 0;
    let shapeTarget = 0;
    let shape = 0;
    const onDown = (e: PointerEvent) => {
      const rect = cv.getBoundingClientRect();
      const idx = next;
      next = (next + 1) % MAX_RIPPLES;
      ripples[idx * 3] = (e.clientX - rect.left) / rect.width;
      ripples[idx * 3 + 1] = 1 - (e.clientY - rect.top) / rect.height;
      rippleStart[idx] = (performance.now() - start) / 1000;
      clicks += 1;
      shapeTarget = Math.floor(clicks / 5) % 3;
    };

    if (!reduceMotion) {
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerleave", onLeave);
      window.addEventListener("blur", onLeave);
      window.addEventListener("pointerdown", onDown);
    }

    let color = readPrimary();
    let lastTheme = themeKey();
    let raf = 0;

    function frame() {
      const now = (performance.now() - start) / 1000;

      // Re-lê a cor primary se o tema mudou.
      const key = themeKey();
      if (key !== lastTheme) {
        lastTheme = key;
        color = readPrimary();
      }

      smooth.x += (target.x - smooth.x) * 0.14;
      smooth.y += (target.y - smooth.y) * 0.14;
      smooth.on += (target.on - smooth.on) * 0.08;
      shape += (shapeTarget - shape) * 0.06; // morph animado entre formatos

      // Atualiza idades dos ripples.
      for (let i = 0; i < MAX_RIPPLES; i++) {
        const age = now - rippleStart[i];
        ripples[i * 3 + 2] = age >= 0 && age < RIPPLE_LIFE ? age : -1;
      }

      glc.uniform1f(uTime, now);
      glc.uniform1f(uReduce, reduce);
      glc.uniform3f(uColor, color[0], color[1], color[2]);
      glc.uniform2f(uMouse, smooth.x, smooth.y);
      glc.uniform1f(uMouseOn, smooth.on);
      glc.uniform1f(uShape, shape);
      glc.uniform3fv(uRipples, ripples);
      glc.drawArrays(glc.TRIANGLES, 0, 6);
      if (!reduceMotion) raf = requestAnimationFrame(frame);
    }
    let themeObserver: MutationObserver | undefined;
    if (reduceMotion) {
      drawStatic = frame;
      frame();
      themeObserver = new MutationObserver(frame);
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class", "data-theme"],
      });
    } else {
      raf = requestAnimationFrame(frame);
    }

    // Pausa o loop quando o canvas sai da viewport (economia de GPU/CPU) e
    // retoma ao voltar, descontando o tempo pausado para não saltar.
    let visible = true;
    let pausedAt = 0;
    const io = reduceMotion
      ? undefined
      : new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              if (!visible) {
                visible = true;
                start += performance.now() - pausedAt;
                raf = requestAnimationFrame(frame);
              }
            } else if (visible) {
              visible = false;
              pausedAt = performance.now();
              cancelAnimationFrame(raf);
            }
          },
          { threshold: 0 },
        );
    io?.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io?.disconnect();
      themeObserver?.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("pointerdown", onDown);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <div
      aria-hidden
      className={cn("bg-primary", className ?? "fixed inset-0 -z-10")}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full"
      />
    </div>
  );
}
