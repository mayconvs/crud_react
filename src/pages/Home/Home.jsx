import axios from 'axios';
import { useState, useEffect } from 'react';
import { formatarData } from '../Info/Info';
import style from './Home.module.css';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import MenuAcoes from '../../components/MenuAcoes';
import baseURL from '../../../config';


const Home = () => {

    // Declarar a variável para receber os registros retornado da API
    const [data, setData] = useState([]);

    // Declarar a variável para receber um número da página
    const [page, setPage] = useState("");

    // Declarar a variável para receber o número da última página
    const [lastPage, setLastPage] = useState("");

    const [message, setMessage] = useState("");
    const [sortBy, setSortBy] = useState({ column: 'codigo', order: 'asc' });
    const [selectAll, setSelectAll] = useState(false);
    const [selected, setSelected] = useState({});
    const [updatedSelected, setUpdatedSelected] = useState({});
    const [ativarTodos, setAtivarTodos] = useState([]);
    

    const handleSort = (column) => {

        if (sortBy.column === column) {
            setSortBy({ column, order: sortBy.order === 'asc' ? 'desc' : 'asc' });
        } else {
            setSortBy({ column, order: 'asc' });
        }
    }

    // Criar função com requisição para API recuperar os produtos
    const getUsers = async (page) => {
        setSelectAll(false);
        setSelected(false);

        if (page === undefined) {
            page = 1;
        }
        setPage(page);
        //const url = "http://localhost:8080/products?page=" + page;
        const url = `${baseURL}/products?page=${page}&sortColumn=${sortBy.column}&sortOrder=${sortBy.order}`;
        console.log(url)
        await axios.get(url)
            .then((response) => { // Acessa o then quando a API retornar status 200
                // Atribuir os registros no state data
                //console.log(response.data.products)
                setData(response.data.products);
                setAtivarTodos(response.data.products);
                console.log(response.data.products);

                // Atribuir a última página
                setLastPage(response.data.pagination.lastPage);

            }).catch((err) => { // Acessa o catch quando a API retornar error
                if (err.response) {
                    setMessage(err.response.data.mensagem);
                } else {
                    setMessage("Erro: Tente mais tarde!");
                }

            });
    }

    // useEffect é usado para lidar com efeitos colaterais em um componente. Por exemplo, atualizar o estado do componente, fazer chamadas a APIs, manipular eventos, entre outros.
    useEffect(() => {
        // Chamar a função com requisição para a API
        getUsers();
    }, [sortBy]);


    const deleteUser = async (product) => {
        if (product.ativo) {
            {
                Swal.fire({
                    title: 'Error!',
                    text: 'Não é possível realizar a exclusão deste produto porque ele está ativo.',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: 'var(--color-bg-button-success)',
                })
            }
            return;
        }

        Swal.fire({
            title: 'Tem certeza que deseja apagar?',
            showDenyButton: true,
            confirmButtonText: 'Sim',
            denyButtonText: `Não`,
            confirmButtonColor: 'var(--color-bg-button-success)',
            denyButtonColor: 'var(--color-bg-button-danger)',
            //cancelButtonColor: 'var(--color-gray)',
        }).then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`${baseURL}/product/${product.codigo}`)
                    console.log(response.data.mensagem)
                    //setMessage(response.data.mensagem);
                    getUsers(page);
                    Swal.fire('Produto Deletado!', '', 'success');
                } catch (error) {
                    Swal.fire('Erro!', 'Ocorreu um erro tentar deletar o registro', 'error');
                    console.error("Erro ao buscar os dados: " + error);
                }

                //Swal.fire(response, '', 'success');
            } else if (result.isDenied) {
                //Swal.fire('Produto Não Deletado!', '', 'error')
            }
        });

    }


    // Manipulador de evento para o checkbox "check_all"
    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        const updatedSelected = {};
        console.log(!selectAll);
        // Se o "check_all" estiver marcado, selecione todos os itens na tabela, caso contrário, desmarque todos
        if (!selectAll) {
            // Percorre os dados e define todos os itens como selecionados
            data.forEach((product) => {
                updatedSelected[product.codigo] = [!selectAll, product.ativo];
                document.getElementById(`check_${product.codigo}`).checked = !selectAll;
            });
        } else {
            data.forEach((product) => {
                updatedSelected[product.codigo] = [!selectAll, product.ativo];
                document.getElementById(`check_${product.codigo}`).checked = !selectAll;
            });
        }

        console.log("aaaaa: ");
        console.log(updatedSelected);
        setSelected(updatedSelected);
        setUpdatedSelected(updatedSelected);

    };

    // Manipulador de evento para selecionar ou desselecionar um item individual
    const handleSelect = (checked, codigo, ativo) => {
        const updatedSelected = { ...selected };
        //updatedSelected[codigo] = !selected[codigo];
        updatedSelected[codigo] = [checked, ativo];

        setSelected(updatedSelected);
        setUpdatedSelected(updatedSelected);

        console.log(updatedSelected)

    };


    return (

        <div className={style.container}>
            <h1>Listar Produtos</h1>
            <MenuAcoes updatedSelected={updatedSelected} getUsers={getUsers} ativarTodos={ativarTodos} />
            {data && (
                <table style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th><div className={style.checkbox_wrapper_65}>
                                <label htmlFor={`check_all`}>
                                    <input type="checkbox" id={`check_all`} checked={selectAll} onChange={handleSelectAll} />
                                    <span className={style.cbx}>
                                        <svg width="12px" height="11px" viewBox="0 0 12 11">
                                            <polyline points="1 6.29411765 4.5 10 11 1"></polyline>
                                        </svg>
                                    </span>
                                </label>
                            </div></th>
                            <th onClick={() => handleSort('codigo')}>Código</th>
                            <th onClick={() => handleSort('descricao')}>Descrição</th>
                            <th onClick={() => handleSort('categoria')}>Categoria</th>
                            <th onClick={() => handleSort('ativo')}>Ativo</th>
                            <th onClick={() => handleSort('data')}>Data</th>
                            <th></th>
                            <th></th>
                            <th></th>

                        </tr>
                    </thead>
                    <tbody>
                        {data.map((product) => (
                            <tr key={product.codigo}>
                                <td><div className={style.checkbox_wrapper_65}>
                                    <label htmlFor={`check_${product.codigo}`}>
                                        <input type="checkbox" id={`check_${product.codigo}`} onChange={(e) => handleSelect(e.target.checked, product.codigo, product.ativo)} />
                                        {/* <input type="checkbox" id={`check_${product.codigo}`} checked={selected[product.codigo] || false} onChange={() => handleSelect(product.codigo, product.ativo)}/> */}
                                        <span className={style.cbx}>
                                            <svg width="12px" height="11px" viewBox="0 0 12 11">
                                                <polyline points="1 6.29411765 4.5 10 11 1"></polyline>
                                            </svg>
                                        </span>
                                    </label>
                                </div></td>
                                <td>{product.codigo}</td>
                                <td className={style.tb_desc}>{product.descricao}</td>
                                <td className={style.tb_cat}>{product.categoria}</td>
                                <td>{product.ativo ? 'Sim' : 'Não'}</td>
                                <td>{formatarData(product.data)}</td>
                                <td><Link title="Visualizar Produto" className={style.preview} to={`/products/${product.codigo}`}><span className="material-icons preview">preview</span></Link></td>
                                <td><Link title="Editar Produto" className={style.editar} to={`/products/editar/${product.codigo}`}><span className="material-icons edit">edit</span></Link></td>
                                <td><button title="Deletar Produto" onClick={() => deleteUser(product)} className={style.delete}><span className="material-icons">delete</span></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {message ? <p>{message}</p> : ""}
            <div className={style.botoes}>
                {page !== 1 ? <button type="button" onClick={() => getUsers(1)} className={style.pagination}>Primeira</button> : <button type="button" disabled className={style.pagination}>Primeira</button>}
                {" "}
                {page !== 1 ? <button type="button" onClick={() => getUsers(page - 1)} className={style.pagination}>{page - 1}</button> : ""}
                {" "}
                <button type="button" disabled className={style.pagination}>{page}</button>
                {" "}
                {page + 1 <= lastPage ? <button type="button" onClick={() => getUsers(page + 1)} className={style.pagination}>{page + 1}</button> : ""}
                {" "}
                {page !== lastPage ? <button type="button" onClick={() => getUsers(lastPage)} className={style.pagination}>Última</button> : <button type="button" disabled className={style.pagination}>Última</button>}
            </div>
        </div>
    );
};

export default Home;