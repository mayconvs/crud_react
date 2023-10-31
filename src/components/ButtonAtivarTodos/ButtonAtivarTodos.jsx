import style from './ButtonAtivarTodos.module.css'


const ButtonAtivarTodos = ({handleAtivarTodos}) => {
  
  return (
    <button title="Ativar Todos os Produtos" className={style.buttonAtivarTodos} onClick={handleAtivarTodos}>Ativar todos</button>
  )
}

export default ButtonAtivarTodos