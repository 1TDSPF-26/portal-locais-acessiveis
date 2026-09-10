import { useParams } from "react-router-dom";

function DetalhesLocal() {
  const { id } = useParams();

  return (
    <main>
      <h1>Detalhes do local</h1>
      <p>ID recebido pela URL: {id}</p>
    </main>
  );
}

export default DetalhesLocal;