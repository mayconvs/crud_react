import axios from 'axios';
import { useState, useEffect } from 'react';
import { formatarData } from '../Info/Info';
import style from './SearchPage.module.css';
import { Link, useParams } from 'react-router-dom';
import { servDelete } from '../../services/servDelete';
import Swal from 'sweetalert2';
import MenuAcoes from '../../components/MenuAcoes';

const SearchPage = () => {
    const [data, setData] = useState([]);
    let { descricao } = useParams();
    console.log(descricao)

    //const router = useRouter();
    //const [id] = useState(router.query.codigo);
    //const [codigo, setCodigo] = useState(id);
    const [message, setMessage] = useState("");
    // Declarar a variável para receber um número da página
    const [page, setPage] = useState("");

    // Declarar a variável para receber o número da última página
    const [lastPage, setLastPage] = useState("");

    const [sortBy, setSortBy] = useState({ column: 'codigo', order: 'asc' });

    const [selectAll, setSelectAll] = useState(false);
    const [selected, setSelected] = useState({});
    const [updatedSelected, setUpdatedSelected] = useState({});
    const handleSort = (column) => {

        if (sortBy.column === column) {
            setSortBy({ column, order: sortBy.order === 'asc' ? 'desc' : 'asc' });
        } else {
            setSortBy({ column, order: 'asc' });
        }
    }

    //console.log(codigo);
    const getProducts = async (page) => {
        if (page === undefined) {
            page = 1;
        }

        if (descricao === undefined || descricao == "undefined") {
            descricao = '';
        }
        setPage(page);
        console.log(`http://localhost:8080/search?page=${page}&descricao=${descricao}&sortColumn=${sortBy.column}&sortOrder=${sortBy.order}`)
        await axios.get(`http://localhost:8080/search?page=${page}&descricao=${descricao}&sortColumn=${sortBy.column}&sortOrder=${sortBy.order}`)
            .then((response) => {
                //Atribuir a mensagem no state message
                setData(response.data.products)
                // Atribuir a última página
                setLastPage(response.data.pagination.lastPage);
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
        getProducts();
    }, [descricao, sortBy]);

    console.log(data)

    const deleteUser = async (product) => {
        if (product.ativo) {
            Swal.fire({
                title: 'Error!',
                text: 'Não é possível realizar a exclusão deste produto porque ele está ativo.',
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#270',
            })
            return;
        }
        Swal.fire({
            title: 'Tem certeza que deseja apagar?',
            showDenyButton: true,
            confirmButtonText: 'Sim',
            denyButtonText: `Não`,
            confirmButtonColor: '#270',
            denyButtonColor: '#D8000C',
            //cancelButtonColor: 'var(--color-gray)',
        }).then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                const response = await servDelete(`http://localhost:8080/products/${product.codigo}`);
                setMessage(response);
                getProducts(page);
                Swal.fire('Produto Deletado!', '', 'success');
            } else if (result.isDenied) {
                //Swal.fire('Produto Não Deletado!', '', 'error')
            }
        });

    }

    // Manipulador de evento para o checkbox "check_all"
    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        const updatedSelected = {};

        // Se o "check_all" estiver marcado, selecione todos os itens na tabela, caso contrário, desmarque todos
        if (!selectAll) {
            // Percorre os dados e define todos os itens como selecionados
            data.forEach((product) => {
                updatedSelected[product.codigo] = true;
            });
        }

        console.log(updatedSelected);
        setSelected(updatedSelected);
        
    };

    // Manipulador de evento para selecionar ou desselecionar um item individual
    const handleSelect = (checked, codigo, ativo) => {
        const updatedSelected = { ...selected};
        //updatedSelected[codigo] = !selected[codigo];
        updatedSelected[codigo] = [checked, ativo];
        
        setSelected(updatedSelected);
        setUpdatedSelected(updatedSelected);

        console.log(updatedSelected)
 
    };

    return (
        <div className={style.container}>
            <h1>Resultados disponíveis</h1>
            <MenuAcoes updatedSelected={updatedSelected} getUsers={getProducts}/>
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
                                    <input type="checkbox" id={`check_${product.codigo}`} onChange={(e) => handleSelect(e.target.checked, product.codigo, product.ativo)}/>
                                        {/* <input type="checkbox" id={`check_${product.codigo}`} /> */}
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
                {page !== 1 ? <button type="button" onClick={() => getProducts(1)} className={style.pagination}>Primeira</button> : <button type="button" disabled className={style.pagination}>Primeira</button>}
                {" "}
                {page !== 1 ? <button type="button" onClick={() => getProducts(page - 1)} className={style.pagination}>{page - 1}</button> : ""}
                {" "}
                <button type="button" disabled className={style.pagination}>{page}</button>
                {" "}
                {page + 1 <= lastPage ? <button type="button" onClick={() => getProducts(page + 1)} className={style.pagination}>{page + 1}</button> : ""}
                {" "}
                {page !== lastPage ? <button type="button" onClick={() => getProducts(lastPage)} className={style.pagination}>Última</button> : <button type="button" disabled className={style.pagination}>Última</button>}
            </div>
        </div>
    );
};

export default SearchPage;