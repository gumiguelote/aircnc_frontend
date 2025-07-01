import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import camera from '../../assets/camera.svg';
import api from '../../services/api';

export default function New() {
   const [company, setCompany] = useState('');
   const [techs, setTechs] = useState('');
   const [price, setPrice] = useState('');
   const [thumbnail, setThumbnail] = useState(null);
   const navigate = useNavigate();

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

         navigate('/dashboard');
      }
   }

   return (
      <form onSubmit={handleSubmit} className="flex flex-col">
         <label className="text-gray-700 font-bold mb-2 after:content-['*'] after:text-red-500">Imagem do Spot</label>
         <label
            id="thumbnail"
            style={{ backgroundImage: `url(${preview})` }}
            className={`cursor-pointer border-2 border-dashed border-gray-300 rounded-sm h-40 bg-gray-50 bg-center bg-cover flex items-center justify-center mb-5 ${thumbnail ? 'border-solid border-gray-400' : ''}`}>
            <input
               type="file"
               className="hidden"
               onChange={event => setThumbnail(event.target.files[0])} />
            <img
               src={camera}
               alt="Imagem de seleção de imagem da empresa"
               className={thumbnail ? 'hidden' : 'w-6 h-6 opacity-50'} />
         </label>
         <label
            htmlFor="company"
            className="text-gray-700 font-bold mb-2 after:content-['*'] after:text-red-500">Empresa</label>
         <input
            id="company"
            placeholder="Digite o nome de sua empresa"
            value={company}
            required
            onChange={event => setCompany(event.target.value)}
            type="text"
            className="mb-5 border border-gray-300 rounded-sm h-11 px-4 text-base" />
         <label
            htmlFor="techs"
            className="text-gray-700 font-bold mb-2 after:content-['*'] after:text-red-500">TECNOLOGIAS<span className="font-normal text-gray-500 text-xs ml-1">(separadas por virgula)</span></label>
         <input
            id="techs"
            placeholder="Quais tecnologias usam?"
            value={techs}
            required
            onChange={event => setTechs(event.target.value)}
            type="text"
            className="mb-5 border border-gray-300 rounded-sm h-11 px-4 text-base" />
         <label
            htmlFor="price"
            className="text-gray-700 font-bold mb-2 after:content-['*'] after:text-red-500">VALOR DA DIÁRIA<span className="font-normal text-gray-500 text-xs ml-1">(Em branco para GRATUITO)</span></label>
         <input
            id="price"
            placeholder="Valor cobrado por dia"
            value={price}
            onChange={event => setPrice(event.target.value)}
            type="text"
            className="mb-5 border border-gray-300 rounded-sm h-11 px-4 text-base" />
         <label className={`font-normal text-red-500 text-xs mb-2 ${!thumbnailIsAlerted ? 'hidden' : ''}`}>* Por favor, insira a imagem do spot</label>
         <button type="submit" className="border-0 rounded-sm h-11 w-full px-5 text-base font-bold bg-red-500 text-white cursor-pointer hover:bg-red-600 transition-colors">Cadastrar</button>
      </form>
   )
}