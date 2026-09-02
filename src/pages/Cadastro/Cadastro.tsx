function Cadastro() {
  return (
    <main>
      <header>
        <h1>Cadastro de Locais Acessíveis</h1>
        <p>
          Esta área foi desenvolvida para apresentar a proposta e a estrutura inicial do futuro cadastro de novos locais e serviços acessíveis na plataforma.
        </p>
      </header>
      <section>
        <h2>Informações para Futura Implementação</h2>
        <p>
          Quando a funcionalidade de cadastro estiver ativa, os usuários
          poderão enviar os seguintes dados sobre os locais:
        </p>
        <ul>
          <li><strong>Nome do local:</strong> Nome ou identificação principal do estabelecimento</li>
          <li><strong>Categoria:</strong> Tipo do local (ex: restaurante, parque, hospital, transporte)</li>
          <li><strong>Endereço ou localização:</strong> Logradouro completo, bairro ou ponto de referência</li>
          <li><strong>Descrição:</strong> Resumo informativo dos serviços oferecidos no local</li>
          <li><strong>Informações de acessibilidade:</strong> Detalhes de recursos como rampas, elevadores, piso tátil ou banheiros adaptados</li>
        </ul>
      </section>

      <aside>
        <h2>Status do Desenvolvimento</h2>
        <p>
          <strong>Aviso importante:</strong> Esta página é exclusivamente informativa nesta etapa. O formulário funcional de envio, validação de campos e persistência de dados serão implementados em entregas futuras do projeto. Nenhum dado é enviado ou salvo no momento.
        </p>
      </aside>
    </main>
  )
}

export default Cadastro
