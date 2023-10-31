import { useEffect, useState } from 'react';
import axios from 'axios';
import baseURL from '../../../config';

import style from './Info.module.css';

import { Link, useParams } from 'react-router-dom';
//import { useRouter } from 'next/router';

export function formatarData(dataOriginal) { //dataOriginal: 2023-10-19T00:00:00.000Z
    const dataObjeto = new Date(dataOriginal);
    const dia = dataObjeto.getUTCDate();
    const mes = dataObjeto.getUTCMonth() + 1;
    const ano = dataObjeto.getUTCFullYear();
    return `${dia}/${mes}/${ano}`;
}



function Info() {
    const { codigo } = useParams();
    const [data, setData] = useState([]);
    //const router = useRouter();
    //const [id] = useState(router.query.codigo);
    //const [codigo, setCodigo] = useState(id);
    const [message, setMessage] = useState("");



    //console.log(codigo);
    const getUser = async () => {
        if (codigo == undefined) {
            setMessage("Erro: Produto não encontrado!");
            return;
        }

        await axios.get(`${baseURL}/products/${codigo}`)
            .then((response) => {
                //Atribuir a mensagem no state message
                setData(response.data.product);
                setMessage(response.data.mensagem);
            }).catch((err) => {
                if (err.response) {
                    setMessage(err.response.data.mensagem);
                } else {
                    setMessage("Erro: Tente novamente mais tarde ou entre em contato com o nosso suporte.");
                }
            })

    }


    useEffect(() => {
        getUser();
    }, [codigo]);

    console.log(data)
    return (
        <div className={style.container}>
            <h1>Detalhes</h1>
            <div className={style.infos}>
                <p><strong>Código: </strong>{data.codigo}</p>
                <p><strong>Descrição: </strong>{data.descricao}</p>
                <p><strong>Categoria: </strong>{data.categoria}</p>
                <p><strong>Ativo: </strong>{data.ativo ? "Sim" : "Não"}</p>
                <p><strong>Data: </strong>{formatarData(data.data)}</p>
                <Link to={`/products/editar/${data.codigo}`}>Editar</Link>
            </div>
            
            {message ? <p>{message}</p> : ""}
        </div >
    )
}

export default Info
