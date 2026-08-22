import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { PixelBlast } from "./pixel-blast";

type GlOptions = {
  shaderResults?: boolean[];
  createProgram?: boolean;
  link?: boolean;
  createBuffer?: boolean;
};

function criarWebGl({
  shaderResults = [true, true],
  createProgram = true,
  link = true,
  createBuffer = true,
}: GlOptions = {}) {
  const vertex = {} as WebGLShader;
  const fragment = {} as WebGLShader;
  const program = {} as WebGLProgram;
  const buffer = {} as WebGLBuffer;
  const shaders = [vertex, fragment];
  const resultados = [...shaderResults];

  const gl = {
    VERTEX_SHADER: 0x8b31,
    FRAGMENT_SHADER: 0x8b30,
    COMPILE_STATUS: 0x8b81,
    LINK_STATUS: 0x8b82,
    ARRAY_BUFFER: 0x8892,
    STATIC_DRAW: 0x88e4,
    FLOAT: 0x1406,
    TRIANGLES: 0x0004,
    createShader: vi.fn(() => shaders.shift() ?? null),
    shaderSource: vi.fn(),
    compileShader: vi.fn(),
    getShaderParameter: vi.fn(() => resultados.shift() ?? true),
    deleteShader: vi.fn(),
    createProgram: vi.fn(() => (createProgram ? program : null)),
    attachShader: vi.fn(),
    linkProgram: vi.fn(),
    getProgramParameter: vi.fn(() => link),
    useProgram: vi.fn(),
    deleteProgram: vi.fn(),
    createBuffer: vi.fn(() => (createBuffer ? buffer : null)),
    bindBuffer: vi.fn(),
    bufferData: vi.fn(),
    deleteBuffer: vi.fn(),
    getAttribLocation: vi.fn(() => 0),
    enableVertexAttribArray: vi.fn(),
    vertexAttribPointer: vi.fn(),
    getUniformLocation: vi.fn((_program, name: string) => ({ name })),
    viewport: vi.fn(),
    uniform1f: vi.fn(),
    uniform2f: vi.fn(),
    uniform3f: vi.fn(),
    uniform3fv: vi.fn(),
    drawArrays: vi.fn(),
  };

  return {
    gl: gl as unknown as WebGLRenderingContext,
    calls: gl,
    vertex,
    fragment,
    program,
    buffer,
  };
}

function instalarAmbienteWebGl(
  contextos: ReturnType<typeof criarWebGl>[],
  { reduceMotion = false, context2d = true } = {},
) {
  const webgl = [...contextos];
  const ctx2d = {
    fillStyle: "",
    fillRect: vi.fn(),
    getImageData: vi.fn(() => ({
      data: new Uint8ClampedArray([79, 70, 229, 255]),
    })),
  };
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(((
    tipo: string,
  ) => {
    if (tipo === "webgl") return webgl.shift()?.gl ?? null;
    if (tipo === "2d") {
      return context2d ? (ctx2d as unknown as CanvasRenderingContext2D) : null;
    }
    return null;
  }) as never);

  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      matches: reduceMotion,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );

  const frames: FrameRequestCallback[] = [];
  const requestFrame = vi.fn((callback: FrameRequestCallback) => {
    frames.push(callback);
    return frames.length;
  });
  const cancelFrame = vi.fn();
  vi.stubGlobal("requestAnimationFrame", requestFrame);
  vi.stubGlobal("cancelAnimationFrame", cancelFrame);
  vi.spyOn(performance, "now").mockReturnValue(1000);

  const resizeCallbacks: ResizeObserverCallback[] = [];
  const resizeObservers: Array<{
    observe: ReturnType<typeof vi.fn>;
    disconnect: ReturnType<typeof vi.fn>;
  }> = [];
  class ResizeObserverFake {
    observe = vi.fn();
    disconnect = vi.fn();

    constructor(callback: ResizeObserverCallback) {
      resizeCallbacks.push(callback);
      resizeObservers.push(this);
    }
  }
  vi.stubGlobal("ResizeObserver", ResizeObserverFake);

  const intersectionCallbacks: IntersectionObserverCallback[] = [];
  const intersectionObservers: Array<{
    observe: ReturnType<typeof vi.fn>;
    disconnect: ReturnType<typeof vi.fn>;
  }> = [];
  class IntersectionObserverFake {
    observe = vi.fn();
    disconnect = vi.fn();

    constructor(callback: IntersectionObserverCallback) {
      intersectionCallbacks.push(callback);
      intersectionObservers.push(this);
    }
  }
  vi.stubGlobal("IntersectionObserver", IntersectionObserverFake);

  const mutationCallbacks: MutationCallback[] = [];
  const mutationObservers: Array<{
    observe: ReturnType<typeof vi.fn>;
    disconnect: ReturnType<typeof vi.fn>;
  }> = [];
  class MutationObserverFake {
    observe = vi.fn();
    disconnect = vi.fn();

    constructor(callback: MutationCallback) {
      mutationCallbacks.push(callback);
      mutationObservers.push(this);
    }
  }
  vi.stubGlobal("MutationObserver", MutationObserverFake);

  return {
    ctx2d,
    frames,
    requestFrame,
    cancelFrame,
    resizeCallbacks,
    resizeObservers,
    intersectionCallbacks,
    intersectionObservers,
    mutationCallbacks,
    mutationObservers,
    executarFrame() {
      const callback = frames.shift();
      if (!callback) throw new Error("Nenhum frame pendente");
      callback(0);
    },
  };
}

function ultimoRipple(contexto: ReturnType<typeof criarWebGl>) {
  const valor = contexto.calls.uniform3fv.mock.calls.at(-1)?.[1];
  return Array.from(valor as Float32Array);
}

function ultimoUniforme1f(
  contexto: ReturnType<typeof criarWebGl>,
  nome: string,
) {
  return contexto.calls.uniform1f.mock.calls
    .filter((call) => call[0].name === nome)
    .at(-1)?.[1] as number;
}

afterEach(() => {
  document.documentElement.classList.remove("dark");
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("PixelBlast sem WebGL", () => {
  beforeEach(() => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  });

  test("é decorativo e cobre a tela por padrão", async () => {
    const tela = await render(<PixelBlast />);
    const fundo = tela.container.firstElementChild as HTMLElement;
    const canvas = fundo.querySelector("canvas");

    expect(fundo.getAttribute("aria-hidden")).toBe("true");
    expect(fundo.classList.contains("fixed")).toBe(true);
    expect(fundo.classList.contains("inset-0")).toBe(true);
    expect(canvas).not.toBeNull();
    await expect.poll(() => getComputedStyle(canvas!).display).toBe("none");
  });

  test("usa a superfície primary como fallback quando WebGL não existe", async () => {
    const tela = await render(<PixelBlast />);
    const fundo = tela.container.firstElementChild as HTMLElement;

    expect(fundo.classList.contains("bg-primary")).toBe(true);
    expect(getComputedStyle(fundo).backgroundColor).not.toBe(
      "rgba(0, 0, 0, 0)",
    );
  });

  test("aceita geometria local no lugar do posicionamento padrão", async () => {
    const tela = await render(
      <PixelBlast className="relative h-24 w-40 overflow-hidden" />,
    );
    const fundo = tela.container.firstElementChild as HTMLElement;

    expect(fundo.classList.contains("relative")).toBe(true);
    expect(fundo.classList.contains("fixed")).toBe(false);
    expect(getComputedStyle(fundo).position).toBe("relative");
  });
});

describe("PixelBlast com WebGL", () => {
  test("desenha frames e aceita ponteiro somente dentro do próprio canvas", async () => {
    const contexto = criarWebGl();
    const ambiente = instalarAmbienteWebGl([contexto]);
    const tela = await render(
      <PixelBlast className="relative h-24 w-40 overflow-hidden" />,
    );
    const canvas = tela.container.querySelector("canvas")!;
    vi.spyOn(canvas, "getBoundingClientRect").mockReturnValue(
      new DOMRect(0, 0, 100, 100),
    );

    ambiente.executarFrame();
    expect(contexto.calls.drawArrays).toHaveBeenCalledOnce();
    expect(ultimoRipple(contexto).every((valor) => valor === -1)).toBe(true);

    window.dispatchEvent(
      new PointerEvent("pointerdown", { clientX: 25, clientY: 25 }),
    );
    ambiente.executarFrame();
    expect(ultimoRipple(contexto).every((valor) => valor === -1)).toBe(true);

    canvas.dispatchEvent(
      new PointerEvent("pointerdown", { clientX: 25, clientY: 25 }),
    );
    ambiente.executarFrame();
    expect(ultimoRipple(contexto).slice(0, 3)).toEqual([0.25, 0.75, 0]);

    canvas.dispatchEvent(
      new PointerEvent("pointermove", { clientX: 75, clientY: 25 }),
    );
    ambiente.executarFrame();
    expect(contexto.calls.uniform2f).toHaveBeenLastCalledWith(
      { name: "uMouse" },
      0.535,
      0.535,
    );
    const presenca = ultimoUniforme1f(contexto, "uMouseOn");

    canvas.dispatchEvent(new PointerEvent("pointerleave"));
    ambiente.executarFrame();
    const aposSair = ultimoUniforme1f(contexto, "uMouseOn");
    expect(aposSair).toBeLessThan(presenca);
  });

  test("pausa fora da viewport e retoma sem abrir loops duplicados", async () => {
    const contexto = criarWebGl();
    const ambiente = instalarAmbienteWebGl([contexto]);
    await render(<PixelBlast />);
    const callback = ambiente.intersectionCallbacks[0];
    const observer = ambiente.intersectionObservers[0];
    const entrada = (isIntersecting: boolean) => [
      { isIntersecting } as IntersectionObserverEntry,
    ];

    callback(entrada(false), observer as never);
    expect(ambiente.cancelFrame).toHaveBeenCalledOnce();
    callback(entrada(false), observer as never);
    expect(ambiente.cancelFrame).toHaveBeenCalledOnce();

    const agendamentos = ambiente.requestFrame.mock.calls.length;
    callback(entrada(true), observer as never);
    expect(ambiente.requestFrame).toHaveBeenCalledTimes(agendamentos + 1);
    callback(entrada(true), observer as never);
    expect(ambiente.requestFrame).toHaveBeenCalledTimes(agendamentos + 1);
  });

  test("duas instâncias não compartilham ripples e descartam seus recursos", async () => {
    const primeiro = criarWebGl();
    const segundo = criarWebGl();
    const ambiente = instalarAmbienteWebGl([primeiro, segundo]);
    const tela = await render(
      <>
        <PixelBlast className="relative h-24 w-40" />
        <PixelBlast className="relative h-24 w-40" />
      </>,
    );
    const canvases = tela.container.querySelectorAll("canvas");
    vi.spyOn(canvases[0], "getBoundingClientRect").mockReturnValue(
      new DOMRect(0, 0, 100, 100),
    );

    canvases[0].dispatchEvent(
      new PointerEvent("pointerdown", { clientX: 50, clientY: 50 }),
    );
    ambiente.executarFrame();
    ambiente.executarFrame();

    expect(ultimoRipple(primeiro).slice(0, 3)).toEqual([0.5, 0.5, 0]);
    expect(ultimoRipple(segundo).every((valor) => valor === -1)).toBe(true);

    await tela.unmount();
    for (const contexto of [primeiro, segundo]) {
      expect(contexto.calls.deleteBuffer).toHaveBeenCalledWith(contexto.buffer);
      expect(contexto.calls.deleteProgram).toHaveBeenCalledWith(
        contexto.program,
      );
      expect(contexto.calls.deleteShader).toHaveBeenCalledTimes(2);
    }
    expect(
      ambiente.resizeObservers.every(
        (observer) => observer.disconnect.mock.calls.length === 1,
      ),
    ).toBe(true);
    expect(
      ambiente.intersectionObservers.every(
        (observer) => observer.disconnect.mock.calls.length === 1,
      ),
    ).toBe(true);
  });

  test("movimento reduzido desenha sob demanda sem abrir um loop", async () => {
    const contexto = criarWebGl();
    const ambiente = instalarAmbienteWebGl([contexto], {
      reduceMotion: true,
    });
    const tela = await render(<PixelBlast />);

    expect(contexto.calls.drawArrays).toHaveBeenCalledOnce();
    expect(ambiente.requestFrame).not.toHaveBeenCalled();
    expect(ambiente.intersectionObservers).toHaveLength(0);
    expect(contexto.calls.uniform1f).toHaveBeenCalledWith(
      { name: "uReduce" },
      1,
    );

    ambiente.resizeCallbacks[0]([], ambiente.resizeObservers[0] as never);
    document.documentElement.classList.add("dark");
    ambiente.mutationCallbacks[0]([], ambiente.mutationObservers[0] as never);
    expect(contexto.calls.drawArrays).toHaveBeenCalledTimes(3);
    expect(ambiente.ctx2d.getImageData).toHaveBeenCalledTimes(2);

    await tela.unmount();
    expect(ambiente.mutationObservers[0].disconnect).toHaveBeenCalledOnce();
  });

  test("usa a cor segura quando o contexto 2D não está disponível", async () => {
    const contexto = criarWebGl();
    instalarAmbienteWebGl([contexto], {
      reduceMotion: true,
      context2d: false,
    });

    await render(<PixelBlast />);

    expect(contexto.calls.uniform3f).toHaveBeenCalledWith(
      { name: "uColor" },
      0.31,
      0.27,
      0.9,
    );
  });

  test.each([
    {
      nome: "shader",
      options: { shaderResults: [true, false] },
      shaders: 2,
      programs: 0,
    },
    {
      nome: "programa",
      options: { createProgram: false },
      shaders: 2,
      programs: 0,
    },
    {
      nome: "link",
      options: { link: false },
      shaders: 2,
      programs: 1,
    },
    {
      nome: "buffer",
      options: { createBuffer: false },
      shaders: 2,
      programs: 1,
    },
  ])(
    "libera recursos já criados quando falha em $nome",
    async ({ options, shaders, programs }) => {
      const contexto = criarWebGl(options);
      instalarAmbienteWebGl([contexto]);
      const tela = await render(<PixelBlast />);
      const canvas = tela.container.querySelector("canvas")!;

      await expect.poll(() => getComputedStyle(canvas).display).toBe("none");
      expect(contexto.calls.deleteShader).toHaveBeenCalledTimes(shaders);
      expect(contexto.calls.deleteProgram).toHaveBeenCalledTimes(programs);
    },
  );
});
