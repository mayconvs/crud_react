import style from './ButtonDeleteTodos.module.css'


const ButtonDeleteTodos = ({ deleteAllUsers }) => {
  
  return (
    <button title="Excluir Todos os Produtos Selecionados" className={style.buttonExcluir} onClick={deleteAllUsers}>Excluir todos</button>
  )
}

export default ButtonDeleteTodos