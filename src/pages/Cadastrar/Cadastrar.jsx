import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import $ from 'jquery';
import 'jquery-mask-plugin';
import Swal from 'sweetalert2';
import baseURL from '../../../config';

import style from './Cadastrar.module.css';

export const listaCategorias = ['Bebidas', 'Mercearia', 'Padaria', 'Bazar', 'Frios'];

function Cadastrar() {
  function formatarData(data) {
    // Divide a string da data nos caracteres '/' e reverte a ordem
    const partes = data.split('/').reverse();

    // Formata a data no formato "yyyy-mm-dd"
    const dataFormatada = partes.join('-');

    return dataFormatada;
  }
  const inputRef = useRef(null);

  const [conteudo, setData] = useState({
    codigo: '',
    descricao: '',
    categoria: '',
    ativo: false,
    data: new Date().toLocaleDateString(),
  });

  const [message, setMessage] = useState("");

  const [campoCodigo, setCampoCodigo] = useState({
    valor: '',
    valido: false,
    erro: '',
  });

  const [campoDescricao, setCampoDescricao] = useState({
    valor: '',
    valido: false,
    erro: '',
  });

  //Receber dados dos campos do formulário
  const valueInput = (e) => {
    const { name, value, type, checked } = e.target;
    const convertedValue = type === "checkbox" ? checked : type === "number" ? Number(value) : value;
    setData({
      ...conteudo,
      [name]: convertedValue,
    })

    // Valide o campo "codigo"
    if (name === "codigo") {
      if (convertedValue == '') {
        setCampoCodigo({ valor: convertedValue, valido: false, erro: 'Campo obrigatório' });
      } else {
        setCampoCodigo({ valor: convertedValue, valido: true, erro: '' });
      }
    }

    // Valide o campo "descricao"
    if (name === "descricao") {
      if (convertedValue == '') {
        setCampoDescricao({ valor: convertedValue, valido: false, erro: 'Campo obrigatório' });
      } else {
        setCampoDescricao({ valor: convertedValue, valido: true, erro: '' });
      }
    }

  };

  //Executar a função quando o usuário clicar no botão formulário
  const addProduto = async (e) => {
    e.preventDefault();

    // Verifique se o campo "codigo" é válido
    if (!campoCodigo.valido) {
      setCampoCodigo({ ...campoCodigo, erro: 'Campo obrigatório' });
      return;
    }

    // Verifique se o campo "descricao" é válido
    if (!campoDescricao.valido) {
      setCampoDescricao({ ...campoDescricao, erro: 'Campo obrigatório' });
      return;
    }

    // Criar uma constante com os dados do cabeçalho
    const headers = {
      'headers': {
        'Content-Type': 'application/json'
      }
    };

    conteudo.data = formatarData(conteudo.data);
    //Fazer a requisição para o servidor utilizando Axios. Indicando o método da requisição, o endereço, enviar os dados do formulário e o cabeçalho
    await axios.post(`${baseURL}/products`, conteudo, headers)
      .then((response) => { // Acessa o then quando a API retornar o status 200

        //Atribuir a mensagem no state message
        setMessage(response.data.mensagem);
        Swal.fire({
          title: 'Produto Cadastrado!',
          text: response.data.mensagem,
          icon: 'success',
          confirmButtonText: 'Ok',
          confirmButtonColor: 'var(--color-bg-button-success)',
        });

        setData({
          codigo: '',
          descricao: '',
          categoria: '',
          ativo: false,
          data: new Date().toLocaleDateString(),
        });

      }).catch((err) => {// Acessa o then quando a API retornar erro
        if (err.response) {
          setMessage(err.response.data.mensagem);
          Swal.fire({
            title: 'Erro!',
            text: err.response.data.mensagem,
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: 'var(--color-bg-button-danger)',
          })
        } else {
          setMessage("Erro: Tente novamente mais tarde ou entre em contato com o nosso suporte.");
          Swal.fire({
            title: 'Erro!',
            text: 'Tente novamente mais tarde ou entre em contato com o nosso suporte.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: 'var(--color-bg-button-danger)',
          })
        }
      })
  }

  useEffect(() => {
    // Aplicar a máscara de data após o componente ser montado
    $('#data').mask('00/00/0000');
    inputRef.current.focus();
  }, []);

  return (
    <div className={style.container}>
      <h1>Cadastrar Produto</h1>
      <form onSubmit={addProduto} className={style.cadastrar}>
        <label htmlFor="codigo">Código:</label>
        <input id="codigo" type="number" name="codigo" ref={inputRef} placeholder="Digite o código" onChange={valueInput} value={conteudo.codigo} pattern="[0-9]*" />
        {campoCodigo.erro && <div className="error-msg">
          <i className="fa fa-times-circle"></i>
          {campoCodigo.erro}
        </div>}
        <label htmlFor="descricao">Descrição:</label>
        <input id="descricao" type="text" name="descricao" placeholder="Digite uma descrição" onChange={valueInput} value={conteudo.descricao}
          maxLength="50" />
        {campoDescricao.erro && <div className="error-msg">
          <i className="fa fa-times-circle"></i>
          {campoDescricao.erro}
        </div>}
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
            <input id="data" type="text" name="data" placeholder="__/__/____" className={style.data} onChange={valueInput} value={conteudo.data} />
          </div>
          <div className={style.coluna}>
            {/* <label htmlFor="ativo">Ativo:</label> */}
            <div className={style.checkbox_wrapper_8}>
              <input className={`${style.tgl} ${style.tgl_skewed}`} id="ativo" type="checkbox" name="ativo" onChange={valueInput} value={conteudo?.ativo} />
              <label className={style.tgl_btn} data-tg-off="DESATIVADO" data-tg-on="ATIVO" htmlFor="ativo"></label>
            </div>
            {/* <input id="ativo" type="checkbox" name="ativo" onChange={valueInput} value={conteudo?.ativo} /> */}
          </div>

        </div>
        <div className={style.buttonPai}>
          <button className={style.cadastrar} type='submit'>Cadastrar</button>
        </div>
      </form>
      {message ? <p className='msg'>{message}</p> : ""}

    </div >


  )
}

export default Cadastrar
