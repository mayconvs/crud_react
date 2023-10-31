import style from "./Editar.module.css";
import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from "axios";
import { listaCategorias } from '../Cadastrar/Cadastrar';
import $ from 'jquery';
import 'jquery-mask-plugin';
import Swal from 'sweetalert2';
//import { formatarData } from '../Info/Info';


function Editar() {
    // Declarar uma variável para receber os dados
    const [conteudo, setConteudo] = useState({
        codigo: '',
        descricao: '',
        categoria: '',
        ativo: false,
        data: '',
    });

    const [message, setMessage] = useState("");

    //Receber o parametro enviado na URL
    const { codigo } = useParams();

    function formatarData(data) {
        const dataObj = new Date(data);
        
        const dia = String(dataObj.getUTCDate()).padStart(2, '0');
        const mes = String(dataObj.getUTCMonth() + 1).padStart(2, '0'); // O mês é baseado em zero
        const ano = dataObj.getUTCFullYear();
      
        return `${dia}/${mes}/${ano}`;
      }

    //Criar uma função para recuperar os dados da API
    const getProduct = async () => {
        if (codigo === undefined) {
            setMessage("Erro: Produto não encontrado!");
            return;
        }

        await axios.get("http://localhost:8080/products/" + codigo)
            .then((response) => {
                //Atribuir a mensagem no state message
                console.log(response.data.product);
                setConteudo(response.data.product);
                // Aplicar a máscara de data após o componente ser montado
                setConteudo(prevState => ({
                    ...prevState, // Mantenha os valores anteriores do estado
                    data: formatarData(response.data.product.data), // Atualize a variável 'data' com a nova data
                }));
            }).catch((err) => {
                if (err.response) {
                    setMessage(err.response.data.mensagem);
                } else {
                    setMessage("Erro: Tente novamente mais tarde ou entre em contato com o nosso suporte.");
                }
            });
    };

    useEffect(() => {
        $('#data').mask('00/00/0000');
        getProduct();
    }, [codigo]);

    //Receber dados dos campos do formulário
    const valueInput = (e, categoria) => {
        //setConteudo({...conteudo, [e.target.name]: e.target.value});

        const { name, value, type, checked } = e.target;

        if (name === "ativo" && type === "checkbox" && value == "true") {
            //alert("Checkbox Desativado");
            if (categoria) {
                Swal.fire({
                    title: 'Error!',
                    text: 'Você não pode alterar o status enquanto esse produto tiver uma categoria selecionada.',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: 'var(--color-bg-button-success)',
                })
                return;
            }
        } else if (name === "ativo" && type === "checkbox" && value == "false") {
            //alert("Checkbox Ativo");

        }

        let convertedValue = type === "checkbox" ? checked : type === "number" ? Number(value) : value;
        setConteudo({
            ...conteudo,
            [name]: convertedValue,
        });

    }


    const editProduct = async (e) => {
        e.preventDefault();

        const headers = {
            'headers': {
                'Content-Type': 'application/json'
            }
        };
        await axios.put("http://localhost:8080/products", conteudo, headers)
            .then((response) => {
                //Atribuir a mensagem no state message
                console.log(response.data.product);
                //setConteudo(response.data.product);
                //setMessage(response.data.mensagem);
                Swal.fire({
                    title: 'Produto Atualizado!',
                    text: response.data.mensagem,
                    icon: 'success',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: 'var(--color-bg-button-success)',
                });
            }).catch((err) => {
                if (err.response) {
                    //setMessage(err.response.data.mensagem);
                    Swal.fire({
                        title: 'Erro!',
                        text: err.response.data.mensagem,
                        icon: 'error',
                        confirmButtonText: 'Ok',
                        confirmButtonColor: 'var(--color-bg-button-danger)',
                    })
                } else {
                    //setMessage("Erro: Tente novamente mais tarde ou entre em contato com o nosso suporte.");
                    Swal.fire({
                        title: 'Erro!',
                        text: 'Tente novamente mais tarde ou entre em contato com o nosso suporte.',
                        icon: 'error',
                        confirmButtonText: 'Ok',
                        confirmButtonColor: 'var(--color-bg-button-danger)',
                    })
                }
            });
    };


    useEffect(() => {
        $('#data').mask('00/00/0000');
    }, []);

    

    return (
        <div className={style.container}>
            <h1>Editar Produto</h1>
            <Link title="Visualizar Produto" to={`/products/${conteudo.codigo}`} className={style.icon_preview}><span className="material-icons preview">preview</span></Link>
            <form onSubmit={editProduct} className={style.editar}>
                <input type="hidden" name="codigo" value={conteudo.codigo} />
                <label htmlFor="descricao">Descrição:</label>
                <input id="descricao" type="text" name="descricao" onChange={valueInput} value={conteudo.descricao} />
                <label htmlFor="categoria">Categoria:</label>
                <select id="categoria" type="text" name="categoria" placeholder="Digite o código" onChange={valueInput} value={conteudo.categoria}>
                    <option value="">Nenhuma</option>
                    {listaCategorias.map((categoria) => (
                        <option key={categoria} value={categoria}>{categoria}</option>
                    ))}
                </select>
                <div className={style.linha}>
                    <div className={style.coluna}>
                        <label htmlFor="data">Data:</label>
                        <input id="data" type="text" name="data" placeholder="__/__/____" onChange={valueInput} defaultValue={conteudo.data} />
                    </div>
                    <div className={style.coluna}>
                        <div className={style.checkbox_wrapper_8}>
                            <input className={`${style.tgl} ${style.tgl_skewed}`} id="ativo" type="checkbox" name="ativo" onChange={(e) => valueInput(e, conteudo.categoria)} checked={conteudo.ativo ? true : false} value={conteudo.ativo} />
                            <label className={style.tgl_btn} data-tg-off="DESATIVADO" data-tg-on="ATIVO" htmlFor="ativo"></label>
                        </div>

                        {/* <label htmlFor="ativo">Ativo:</label>
                        <input id="ativo" type="checkbox" name="ativo" onChange={(e) => valueInput(e, conteudo.categoria)} checked={conteudo.ativo ? true : false} value={conteudo.ativo} /> */}
                    </div>

                </div>
                <div className={style.buttonPai}>
                    <button className={style.editar} type='submit'>Atualizar</button>
                </div>
                {message ? <p className='msg'>{message}</p> : ""}
            </form>
        </div >
    );
}

export default Editar;
