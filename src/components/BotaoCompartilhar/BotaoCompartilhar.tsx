import { useState } from 'react';
import { compartilharLink } from '../../utils/compartilharLink';

interface BotaoCompartilharProps {
  titulo: string;
  url: string;
}

export function BotaoCompartilhar({ titulo, url }: BotaoCompartilharProps) {
  const [aviso, setAviso] = useState('');
  const [falha, setFalha] = useState('');
  const [ocupado, setOcupado] = useState(false);

  async function handleCompartilhar() {
    if (ocupado) {
      return;
    }

    setOcupado(true);
    setAviso('');
    setFalha('');

    const resultado = await compartilharLink({
      title: titulo,
      text: `Veja ${titulo} no Portal de Locais Acessíveis.`,
      url,
    });

    if (resultado === 'copiado') {
      setAviso('Link copiado!');
    } else if (resultado === 'erro') {
      setFalha(
        'Não foi possível compartilhar. Copie o endereço na barra do navegador.',
      );
    }

    setOcupado(false);
  }

  return (
    <div>
      <button 
        type="button" 
        className="mt-4 rounded-md bg-cor-erro px-4 py-2 text-base font-semibold text-cor-fundo-principal transition-colors hover:bg-cor-apoio focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cor-apoio focus-visible:ring-offset-2"
        onClick={handleCompartilhar}>
        Compartilhar
      </button>
      <p role="status">
        {aviso && (
          <>
            <span aria-hidden="true">✓ </span>
            {aviso}
          </>
        )}
      </p>
      {falha && (
        <p role="alert">
          <span aria-hidden="true">✕ </span>
          {falha}
        </p>
      )}
    </div>
  );
}