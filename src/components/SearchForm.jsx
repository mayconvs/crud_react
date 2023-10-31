
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import style from "./SearchForm.module.css";

const SearchForm = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState()


  const handleSubmit = (e) => {
    e.preventDefault();

    navigate("/search/" + query)
  }

  return (
    <form onSubmit={handleSubmit} className={style.form_search}>
      <div title="Buscar pela Descrição" className={style.column}>
        <div className={style.in_but}>
          <input id="query" type="text" onChange={(e) => setQuery(e.target.value)} placeholder="Buscar..." />
          <button type="submit" className={style.search}><span className="material-icons">search</span></button>
        </div>
      </div>
    </form>
  )
}

export default SearchForm