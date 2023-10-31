import style from './MenuAcoes.module.css';
import SearchForm from './SearchForm';
import ButtonDeleteTodos from './ButtonDeleteTodos/ButtonDeleteTodos';
import ButtonAtivarTodos from './ButtonAtivarTodos/ButtonAtivarTodos';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { servDelete } from '../services/servDelete';
import ButtonDownloadCSV from './ButtonDownloadCSV/ButtonDownloadCSV';
import axios from 'axios';

const MenuAcoes = ({ updatedSelected, getUsers, ativarTodos }) => {
    /* console.log(updatedSelected); */
    const [selectAll, setSelectAll] = useState(false);
    const [message, setMessage] = useState("");
    const [page, setPage] = useState("");

    const deleteAllUsers = async () => {

        /* console.log(updatedSelected); */

        //Convertendo objeto em array e mapeando os números do objeto no array
        const array = Object.entries(updatedSelected).map(([codigo, valor]) => ({
            codigo: Number(codigo),
            valor
        }));
        /* console.log(array); */


        // Tira todos os arrays que tiverem o valor false (ou seja, os que foram desmarcados)
        const arrayFiltrado = array.filter((element) => element.valor[0] == true);

        console.log(arrayFiltrado);
        const isCheckeds = arrayFiltrado.some((element) => element.valor[0] === true);
        if (isCheckeds) {
            // Verificar se existe produtos ativados nesse array
            const isAtivo = arrayFiltrado.some((element) => element.valor[1] === true);
            console.log(isAtivo)
            /* console.log("Existe Ativo na lista: " + isAtivo); */
            const jsonData = JSON.stringify(arrayFiltrado);
            //Se existir, perguntar se o usuário deseja excluir mesmo assim
            if (isAtivo) {
                Swal.fire({
                    title: 'Cuidado!',
                    text: "Há produtos ativados entre os selecionados. Deseja excluir mesmo assim?",
                    showDenyButton: true,
                    confirmButtonText: 'Sim',
                    denyButtonText: `Não`,
                    confirmButtonColor: 'var(--color-bg-button-success)',
                    denyButtonColor: 'var(--color-bg-button-danger)',
                    //cancelButtonColor: 'var(--color-gray)',
                }).then(async (result) => {

                    if (result.isConfirmed) {
                        const response = await servDelete(`http://localhost:8080/products/delete_multiple/${encodeURIComponent(jsonData)}`);
                        setMessage(response);

                        getUsers(1);
                        Swal.fire('Produto Deletado!', '', 'success');
                    } else if (result.isDenied) {
                        //Swal.fire('Produto Não Deletado!', '', 'error')
                    }
                });
            } else {
                //Se não existir, perguntar se o usuário deseja realmente excluir os produtos selecionados
                Swal.fire({
                    title: 'Você deseja realmente excluir todos os produtos selecionados?',
                    showDenyButton: true,
                    confirmButtonText: 'Sim',
                    denyButtonText: `Não`,
                    confirmButtonColor: 'var(--color-bg-button-success)',
                    denyButtonColor: 'var(--color-bg-button-danger)',
                    //cancelButtonColor: 'var(--color-gray)',
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        const response = await servDelete(`http://localhost:8080/products/delete_multiple/${encodeURIComponent(jsonData)}`);
                        setMessage(response);
                        getUsers(1);
                        //setLastPage(response.data.pagination.lastPage);
                        Swal.fire('Produto Deletado!', '', 'success');
                    } else if (result.isDenied) {
                        //Swal.fire('Produto Não Deletado!', '', 'error')
                    }
                });
            }

        }
    }

    const handleAtivarTodos = () => {
        console.log('oi');
        console.log(updatedSelected)


        //Convertendo objeto em array e mapeando os números do objeto no array
        const array = Object.entries(updatedSelected).map(([codigo, valor]) => ({
            codigo: Number(codigo),
            valor
        }));
        /* console.log(array); */


        // Tira todos os arrays que tiverem o valor false (ou seja, os que foram desmarcados)
        const arrayFiltrado = array.filter((element) => element.valor[1] == false);

        console.log(arrayFiltrado);
        const isCheckeds = arrayFiltrado.some((element) => element.valor[0] === true);
        if (isCheckeds) {
            // Verificar se existe produtos ativados nesse array
            const isAtivo = arrayFiltrado.some((element) => element.valor[1] === false);
            console.log(isAtivo)
            /* console.log("Existe Ativo na lista: " + isAtivo); */
            const jsonData = JSON.stringify(arrayFiltrado);
            console.log(jsonData);
            //Se existir, perguntar se o usuário deseja excluir mesmo assim
            if (!isAtivo) {
                Swal.fire({
                    title: 'Opa!',
                    text: "Os produtos que você selecionou já estão ativos.",
                    confirmButtonText: 'Ok',
                    confirmButtonColor: 'var(--color-bg-button-success)',
                    icon: "info",
                });
            } else {
                //Se não existir, perguntar se o usuário deseja realmente excluir os produtos selecionados
                Swal.fire({
                    title: 'Você deseja ativar todos os produtos selecionados?',
                    showDenyButton: true,
                    confirmButtonText: 'Sim',
                    denyButtonText: `Não`,
                    confirmButtonColor: 'var(--color-bg-button-success)',
                    denyButtonColor: 'var(--color-bg-button-danger)',
                    //cancelButtonColor: 'var(--color-gray)',
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        const headers = {
                            'headers': {
                                'Content-Type': 'application/json'
                            }
                        };
                        try {
                            const response = await axios.put(`http://localhost:8080/products/active_all_page`, arrayFiltrado, headers);
                            setMessage(response);
                            getUsers(1);
                            //setLastPage(response.data.pagination.lastPage);
                            Swal.fire('Produto(s) Ativado(s)!', '', 'success');
                        } catch (error) {
                            console.error("Erro ao buscar os dados: " + error);
                            Swal.fire('Erro ao ativar produto(s)!', '', 'error');
                        }

                    } else if (result.isDenied) {
                        //Swal.fire('Produto Não Deletado!', '', 'error')
                    }
                });
            }

        }
    }

    return (
        <div className={style.container}>
            <div className={style.flex}>
                <ButtonDeleteTodos deleteAllUsers={deleteAllUsers} />
                <ButtonAtivarTodos handleAtivarTodos={handleAtivarTodos} />
                <ButtonDownloadCSV />
            </div>

            <SearchForm />
        </div>
    )
}

export default MenuAcoes