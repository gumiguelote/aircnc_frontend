import React, { useState, useMemo, useEffect } from 'react';
import camera from '../../assets/camera.svg';
import api from '../../services/api';

import './styles.css';

export default function New({ history }) {
   const [company, setCompany] = useState('');
   const [techs, setTechs] = useState('');
   const [price, setPrice] = useState('');
   const [thumbnail, setThumbnail] = useState(null);

   const [thumbnailIsAlerted, setThumbnailIsAlerted] = useState(true);

   const preview = useMemo(() => {
      return thumbnail
         ? URL.createObjectURL(thumbnail)
         : null
   }, [thumbnail]);

   useEffect(() => {
      setThumbnailIsAlerted(thumbnail ? false : true);
   }, [thumbnail])

   async function handleSubmit(event) {
      event.preventDefault();
      if (!thumbnailIsAlerted) {
         const data = new FormData();
         const user_id = localStorage.getItem('user');

         data.append('thumbnail', thumbnail)
         data.append('company', company)
         data.append('techs', techs)
         data.append('price', price)

         await api.post('/spots', data, {
            headers: { user_id }
         });

         history.push('/dashboard');
      }
   }

   return (
      <form onSubmit={handleSubmit}>
         <label data-required-symbol="*">Imagem do Spot</label>
         <label
            id="thumbnail"
            style={{ backgroundImage: `url(${preview})` }}
            className={thumbnail ? 'has-thumbnail' : ''}>
            <input
               type="file"
               onChange={event => setThumbnail(event.target.files[0])} />
            <img
               src={camera}
               alt="Imagem de seleção de imagem da empresa" />
         </label>
         <label
            htmlFor="company"
            data-required-symbol="*">Empresa</label>
         <input
            id="company"
            placeholder="Digite o nome de sua empresa"
            value={company}
            required
            onChange={event => setCompany(event.target.value)}
            type="text" />
         <label
            htmlFor="techs"
            data-required-symbol="*">TECNOLOGIAS<span>(separadas por virgula)</span></label>
         <input
            id="techs"
            placeholder="Quais tecnologias usam?"
            value={techs}
            required
            onChange={event => setTechs(event.target.value)}
            type="text" />
         <label
            htmlFor="price"
            data-required-symbol="*">VALOR DA DIÁRIA<span>(Em branco para GRATUITO)</span></label>
         <input
            id="price"
            placeholder="Valor cobrado por dia"
            value={price}
            onChange={event => setPrice(event.target.value)}
            type="text" />
         <label hidden={!thumbnailIsAlerted} className="alert">* Por favor, insira a imagem do spot</label>
         <button type="submit" className="btn">Cadastrar</button>
      </form>
   )
}