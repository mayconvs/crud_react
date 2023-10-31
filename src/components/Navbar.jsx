import style from "./Navbar.module.css";

import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className={style.menu}>
        {/*<NavLink to="/" className={({isActive}) => (isActive ? "esta-ativo" : "nao-ativo")}>Home</NavLink>*/}
        <NavLink to="/">Listar Produtos</NavLink>
        <NavLink to="/cadastrar">Cadastrar</NavLink>
    </nav>
  )
}

export default Navbar;