import './App.css'
import 'material-icons/iconfont/material-icons.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

//components
import Navbar from './components/Navbar';

//pages
import Home from './pages/Home/Home';
import Cadastrar from './pages/Cadastrar/Cadastrar';
import Editar from './pages/Editar/Editar';
import Info from './pages/Info/Info';
import NotFound from './pages/NotFound';
import SearchPage from './pages/SearchPage/SearchPage';



function App() {

  return (
    <div>
      
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/cadastrar" element={<Cadastrar/>}></Route>
          <Route path="/products/:codigo" element={<Info/>} />
          <Route path="/products/editar/:codigo" element={<Editar/>} />
          <Route path="/search/:descricao?" element={<SearchPage/>} />
          {/*<Route path="/products/:codigo" element={<Product/>} /> */}
          <Route path="*" element={<NotFound/>} />
        </Routes>
        </BrowserRouter>
      {/* message ? <p>{message}</p> : "" */}
      
    </div >
  )
}

export default App
