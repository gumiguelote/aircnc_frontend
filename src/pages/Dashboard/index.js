import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import socketio from 'socket.io-client';

export default function Dashboard() {
   const [spots, setSpots] = useState([]);
   const [requests, setRequests] = useState([]);
   
   const user_id = localStorage.getItem('user');
   const socket = useMemo(() =>socketio('http://localhost:3333', {
      query: { user_id },
   }), [user_id]);

   useEffect(() => {
      socket.on('booking_request', data => {
         setRequests([...requests, data]);
      })
   }, [requests, socket])

   useEffect(() => {
      async function loadSpots() {
         const user_id = localStorage.getItem('user');
         const response = await api.get('/dashboard', {
            headers: { user_id }
         })
         setSpots(response.data);
      }
      loadSpots();
   }, [])

   async function handleAccept(id){
      await api.post(`/bookings/${id}/approvals`);
      setRequests(requests.filter(request => request._id !== id));
   }

   async function handleReject(id){
      await api.post(`/bookings/${id}/rejections`);
      setRequests(requests.filter(request => request._id !== id));
   }

   return (
      <>
         <ul className="list-none">
            {requests.map(request => (
               <li key={request._id} className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 rounded">
                  <p className="text-sm text-gray-700 mb-3">
                     <strong className="text-gray-900">{request.user.email} </strong>
                     está solicitando uma reserva em <strong className="text-gray-900">{request.spot.company} </strong>
                     para a data <strong className="text-gray-900">{request.date}</strong>
                  </p>
                  <div className="flex gap-2">
                     <button onClick={() => handleAccept(request._id)} className="px-4 py-2 bg-green-500 text-white text-xs font-bold rounded hover:bg-green-600 transition-colors">ACEITAR</button>
                     <button onClick={() => handleReject(request._id)} className="px-4 py-2 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600 transition-colors">REJEITAR</button>
                  </div>
               </li>
            ))}
         </ul>
         <ul className="list-none grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {spots.map(spot => (
               <li key={spot._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <header 
                     style={{ backgroundImage: `url(${spot.thumbnail_url})` }}
                     className="h-32 bg-cover bg-center bg-gray-200">
                  </header>
                  <div className="p-4">
                     <strong className="block text-lg text-gray-900 mb-1">{spot.company}</strong>
                     <span className="text-gray-600 text-sm">{spot.price ? `R$ ${spot.price} /dia` : `Gratuito`}</span>
                  </div>
               </li>
            ))}
         </ul>

         <Link to="/new">
            <button className="border-0 rounded-sm h-11 w-full px-5 text-base font-bold bg-red-500 text-white cursor-pointer hover:bg-red-600 transition-colors">Cadastrar novo spot</button>
         </Link>
      </>
   )
}