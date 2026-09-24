import { Link } from "react-router-dom";


export default function NotFound(){
    return(

        <div>
            
            <h1>Erro - 404</h1>
            <h2>Página não encontrada</h2>

            <p>O endereço que você tentou acessar não existe.</p>

            <Link to="/">
            Voltar para página inicial.
            </Link>


        </div>

    );
}