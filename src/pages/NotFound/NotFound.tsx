import { Link } from "react-router-dom";


export default function NotFound(){
    return(

        <div>
            
            <h2>Erro - 404</h2>
            <h3>Página não encontrada</h3>

            <p>O endereço que você tentou acessar não existe.</p>

            <Link to="/">
            Voltar para página inicial.
            </Link>


        </div>

    );
}