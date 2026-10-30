import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { compartilharLink } from '../../utils/compartilharLink';
import { BotaoCompartilhar } from './BotaoCompartilhar';

vi.mock('../../utils/compartilhar', () => ({
  compartilharLink: vi.fn(),
}));

const compartilharMock = vi.mocked(compartilharLink);

const props = {
  titulo: 'Café Acessível',
  url: 'https://portal.exemplo.com/locais/42',
};

describe('BotaoCompartilhar', () => {
  beforeEach(() => {
    compartilharMock.mockReset();
    compartilharMock.mockResolvedValue('compartilhado');
  });

  it('envia título e URL ao clicar', async () => {
    const user = userEvent.setup();
    render(<BotaoCompartilhar {...props} />);

    await user.click(screen.getByRole('button', { name: /compartilhar/i }));

    expect(compartilharMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: props.titulo, url: props.url }),
    );
  });

  it.each([
    { nome: 'Enter', tecla: '{Enter}' },
    { nome: 'Espaço', tecla: ' ' },
  ])('funciona pelo teclado com $nome', async ({ tecla }) => {
    const user = userEvent.setup();
    render(<BotaoCompartilhar {...props} />);

    await user.tab();
    expect(screen.getByRole('button', { name: /compartilhar/i })).toHaveFocus();

    await user.keyboard(tecla);

    expect(compartilharMock).toHaveBeenCalledTimes(1);
  });

  it('informa quando o link foi copiado', async () => {
    compartilharMock.mockResolvedValue('copiado');
    const user = userEvent.setup();
    render(<BotaoCompartilhar {...props} />);

    await user.click(screen.getByRole('button', { name: /compartilhar/i }));

    expect(await screen.findByText(/link copiado/i)).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(/link copiado/i);
  });

  it('mostra um alerta quando não consegue compartilhar nem copiar', async () => {
    compartilharMock.mockResolvedValue('erro');
    const user = userEvent.setup();
    render(<BotaoCompartilhar {...props} />);

    await user.click(screen.getByRole('button', { name: /compartilhar/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      /não foi possível compartilhar/i,
    );
  });

  it('não mostra mensagem quando a pessoa cancela', async () => {
    compartilharMock.mockResolvedValue('cancelado');
    const user = userEvent.setup();
    render(<BotaoCompartilhar {...props} />);

    await user.click(screen.getByRole('button', { name: /compartilhar/i }));

    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});