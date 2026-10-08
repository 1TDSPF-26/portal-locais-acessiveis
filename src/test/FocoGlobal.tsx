import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

describe('Verificação Automatizada de Foco Global', () => {
  it('Deve garantir automaticamente a deteção de foco por teclado na aplicação', async () => {
    const user = userEvent.setup();

    // Renderiza a aplicação completa dentro de um router simulado
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Simula o pressionar da tecla Tab do usuario
    await user.tab();
    
    // Verifica se o foco saiu da página e foi automaticamente direcionado para um elemento interativo válido
    expect(document.activeElement).not.toBe(document.body);
    expect(document.activeElement).toBeDefined();
  });
});