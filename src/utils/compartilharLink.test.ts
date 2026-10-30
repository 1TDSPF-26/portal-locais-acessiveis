import { describe, expect, it } from 'vitest';
import { montarUrlDoLocal } from './compartilharLink';

describe('montarUrlDoLocal', () => {
  it('monta a URL de /locais/:id com a origem informada', () => {
    expect(montarUrlDoLocal(42, 'https://portal.exemplo.com')).toBe(
      'https://portal.exemplo.com/locais/42',
    );
  });

  it('trata id numérico e id textual do mesmo jeito', () => {
    expect(montarUrlDoLocal('42', 'https://portal.exemplo.com')).toBe(
      montarUrlDoLocal(42, 'https://portal.exemplo.com'),
    );
  });

  it('codifica caracteres especiais do id', () => {
    expect(montarUrlDoLocal('a b/c', 'https://portal.exemplo.com')).toBe(
      'https://portal.exemplo.com/locais/a%20b%2Fc',
    );
  });

  it('usa a origem atual quando nenhuma é informada', () => {
    expect(montarUrlDoLocal(7)).toBe(`${window.location.origin}/locais/7`);
  });
});