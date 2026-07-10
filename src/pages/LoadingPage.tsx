import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameShell, Mascot, Topbar } from '../components/GameUI';

export default function LoadingPage(){const navigate=useNavigate();useEffect(()=>{const id=setTimeout(()=>navigate('/city',{replace:true}),1600);return()=>clearTimeout(id)},[navigate]);return <GameShell><Topbar/><section className="loading"><div className="speech small">Hi there! I'm your tour guide today.<br/>Let's explore Career City together!</div><Mascot/><div className="loader"><i/><i/><i/></div><p>Loading… Please wait</p></section></GameShell>}
