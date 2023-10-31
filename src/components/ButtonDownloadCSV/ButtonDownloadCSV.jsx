import { useCallback } from 'react';
import style from './ButtonDownloadCSV.module.css'
import axios from 'axios';

const ButtonDownloadCSV = () => {
  /* const conteudo =''; */

  function getFormattedCurrentDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Mês começa em zero
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `[${day}-${month}-${year}]-${hours}-${minutes}-${seconds}`;
  }

  const handleBaixarCSV = useCallback(async () => {
    //const lista = axios.get('/produtos/csv');
    try {
      const produtos = await axios.get(`http://localhost:8080/download_product_csv`);
      const lista = produtos.data.products;
      console.log(lista)

      let csvData = '"codigo","descricao","categoria","ativo","data"\n'; // Cabeçalho CSV
      csvData += lista.map(({ codigo, descricao, categoria, ativo, data }) => `"${codigo}","${descricao}","${categoria}","${ativo}","${data}"`).join('\n');
      //const csvData = lista.map(({ codigo, descricao, categoria, ativo, data }) => `"${codigo}","${descricao}","${categoria}","${ativo}","${data}"`).join('\n');
      /* 
            32,Island Oasis - Cappucino Mix
      
            "codigo","descricao","categoria","ativo","data"
            "26","Beef - Bresaola","","false","2022-10-21T13:40:30.000Z" */
      // Cria um blob com os dados CSV
      const blob = new Blob([csvData], { type: 'text/csv' });

      // Cria um objeto URL para o blob
      const url = window.URL.createObjectURL(blob);

      // Cria um link para download
      const aElement = document.createElement('a');
      aElement.href = url;
      aElement.download = `${getFormattedCurrentDate()}-Lista_de_Produtos.csv`;

      // Simula um clique para iniciar o download
      aElement.click();

      // Limpa o objeto URL
      window.URL.revokeObjectURL(url);

      /* const aelement = document.createElement('a');
      aelement.parentElement = document.body;
      aelement.hidden = - true;
      aelement.src = download;
      aelement.click(); */
    } catch (error) {
      console.error("Erro ao buscar os dados: " + error);
    }

  }, []);

  return (
    <button className={style.downloadCSV} onClick={handleBaixarCSV}>Baixar .CSV</button>
  )
}

export default ButtonDownloadCSV