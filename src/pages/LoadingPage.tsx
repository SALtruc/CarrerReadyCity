import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameShell, RESOURCE_ROOT, Topbar } from '../components/GameUI';
import { asset } from '../lib';

export default function LoadingPage(){const navigate=useNavigate();useEffect(()=>{const id=setTimeout(()=>navigate('/city',{replace:true}),1600);return()=>clearTimeout(id)},[navigate]);return <GameShell><Topbar/><section className="loading"><img className="loading-coach-art" src={asset(RESOURCE_ROOT+'Loading screen/Loading.png')} alt="Career City coach saying: Hi there! I'm your tour guide today. Let's explore Career City together!"/><div className="loader"><i/><i/><i/></div><p>Loading… Please wait</p></section></GameShell>}
