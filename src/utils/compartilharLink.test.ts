import { afterEach, describe, expect, it, vi } from 'vitest';
import { compartilharLink, montarUrlDoLocal } from './compartilharLink';

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

function simularNavegador(recursos: { share?: unknown; clipboard?: unknown }) {
  Object.defineProperty(navigator, 'share', {
    value: recursos.share,
    configurable: true,
    writable: true,
  });
  Object.defineProperty(navigator, 'clipboard', {
    value: recursos.clipboard,
    configurable: true,
    writable: true,
  });
}

afterEach(() => {
  simularNavegador({});
});

const dados = {
  title: 'Café Acessível',
  url: 'https://portal.exemplo.com/locais/42',
};

describe('compartilharLink', () => {
  it('usa a API nativa quando ela existe', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    const writeText = vi.fn();
    simularNavegador({ share, clipboard: { writeText } });

    await expect(compartilharLink(dados)).resolves.toBe('compartilhado');
    expect(share).toHaveBeenCalledWith(dados);
    expect(writeText).not.toHaveBeenCalled();
  });

  it('não copia nem acusa erro quando a pessoa cancela', async () => {
    const share = vi
      .fn()
      .mockRejectedValue(new DOMException('Cancelado', 'AbortError'));
    const writeText = vi.fn();
    simularNavegador({ share, clipboard: { writeText } });

    await expect(compartilharLink(dados)).resolves.toBe('cancelado');
    expect(writeText).not.toHaveBeenCalled();
  });

  it('copia o link quando não há API nativa', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    simularNavegador({ clipboard: { writeText } });

    await expect(compartilharLink(dados)).resolves.toBe('copiado');
    expect(writeText).toHaveBeenCalledWith(dados.url);
  });

  it('copia o link quando a API nativa falha por outro motivo', async () => {
    const share = vi
      .fn()
      .mockRejectedValue(new DOMException('Bloqueado', 'NotAllowedError'));
    const writeText = vi.fn().mockResolvedValue(undefined);
    simularNavegador({ share, clipboard: { writeText } });

    await expect(compartilharLink(dados)).resolves.toBe('copiado');
    expect(writeText).toHaveBeenCalledWith(dados.url);
  });

  it('retorna erro quando não há nenhum recurso disponível', async () => {
    simularNavegador({});

    await expect(compartilharLink(dados)).resolves.toBe('erro');
  });

  it('retorna erro quando a cópia é recusada', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('negado'));
    simularNavegador({ clipboard: { writeText } });

    await expect(compartilharLink(dados)).resolves.toBe('erro');
  });
});