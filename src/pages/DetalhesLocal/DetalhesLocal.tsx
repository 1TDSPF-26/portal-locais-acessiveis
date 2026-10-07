import { useParams } from "react-router-dom";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export function DetalhesLocal() {
  useDocumentTitle("Detalhes");
  const { id } = useParams();

  return (
    <section className="stack">
      <h1>Detalhes do local</h1>
      <p>ID recebido pela URL: {id}</p>
    </section>
  );
}

export default DetalhesLocal;
