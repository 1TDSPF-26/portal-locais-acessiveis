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
      <button type="button" onClick={handleCompartilhar}>
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