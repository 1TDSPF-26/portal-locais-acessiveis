import type { Local } from "../types/Locais.ts"

export async function ListagemLocais(){
    const query = `
    [bbox:30.618338,-96.323712,30.591028,-96.330826]
    [out:json]
    [timeout:90]
    ;
    way(30.626917110746, -96.348809105664, 30.634468750236, -96.339893442898);
    out geom;
    `;
    const result = await fetch(
    "https://overpass-api.de/api/interpreter",
    {
        method: "POST",
        body: "data=" + encodeURIComponent(query),
    }
    ).then((data) => data.json());

    const listaElementos = result.elements

    let locais: Local[] = []

    for(let elemento of listaElementos){
        let local: Local = {
            id : elemento.id,
            nome : elemento.tags?.name,
            descricao: 'Descricao teste',
            categoria : elemento.type,
            endereco: {
                rua: 'Rua teste',
                numero: '11',
                cidade: 'guarulhos',
                estado: 'sp',
            },
            coordenadas : {
                latitude: elemento.geometry[0].lat,
                longitude: elemento.geometry[0].lon,
            },
            acessibilidade: {
                status: 'acessivel',
                descricao: 'Descricao teste',
            },
        }
        locais.push(local)
    }

    return locais
}


 
