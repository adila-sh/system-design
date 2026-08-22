import * as React from "react";

const MOBILE_BREAKPOINT = 768;
const CONSULTA = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

function assinar(aoMudar: () => void) {
  const mql = window.matchMedia(CONSULTA);
  mql.addEventListener("change", aoMudar);
  return () => mql.removeEventListener("change", aoMudar);
}

const ler = () => window.innerWidth < MOBILE_BREAKPOINT;

/** No servidor não há viewport; o desktop é o palpite mais seguro. */
const lerNoServidor = () => false;

/**
 * `matchMedia` é estado externo, e é para isso que `useSyncExternalStore`
 * existe. A versão anterior guardava o resultado em `useState` e chamava
 * `setIsMobile` de dentro do efeito, o que dispara um segundo render logo após
 * a montagem — e o oxlint reclamava disso com razão.
 *
 * Além de tirar o render em cascata, isto corrige o primeiro render: antes o
 * estado inicial era `undefined` e o retorno era `!!undefined`, ou seja, TODA
 * montagem afirmava "não é mobile" e só corrigia no efeito seguinte. Num
 * aparelho estreito, a primeira pintura vinha com o layout errado.
 */
export function useIsMobile() {
  return React.useSyncExternalStore(assinar, ler, lerNoServidor);
}
