//Pasta destinada a guardar funções auxiliares

// run no "test:run":"vitest run" executa apenas uma vez(CI).
// ja o "test": "vitest" executa com o modo Watch.


import { describe, it, expect } from 'vitest';

function somar(a: number, b: number): number {
  return a + b;
}

describe('Configuração Inicial do Vitest', () => {
  
  it('deve somar dois números corretamente', () => {
    const resultado = somar(4, 3);

    expect(resultado).toBe(7); 


    console.log('resultado: ',resultado);

  });
  
});