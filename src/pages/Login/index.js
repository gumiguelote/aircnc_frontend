import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function Login() {
   const [email, setEmail] = useState('');
   const navigate = useNavigate();

   async function handleSubmit(event) {
     event.preventDefault();
     const response = await api.post('/sessions', { email });
 
     const { _id } = response.data;
 
     localStorage.setItem('user', _id);

     navigate('/dashboard');
   }

   return (
      <>
      <p className="text-xl leading-8 mb-8">Ofereça <strong className="text-red-500">spots</strong> para
      programadores e encontre<strong className="text-red-500"> talentos </strong>
         para sua empresa</p>
      <form onSubmit={handleSubmit} className="flex flex-col">
         <label 
         htmlFor="email" 
         className="text-gray-700 font-bold mb-2 after:content-['*'] after:text-red-500">Email</label>
         <input
            id="email"
            type="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            placeholder="Digite seu melhor email"
            className="mb-5 border border-gray-300 rounded-sm h-11 px-4 text-base"
         />
         <button className="border-0 rounded-sm h-11 w-full px-5 text-base font-bold bg-red-500 text-white cursor-pointer hover:bg-red-600 transition-colors" type="submit">Entrar</button>
      </form>
      </>
   )
}