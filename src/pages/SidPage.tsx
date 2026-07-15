import { FormEvent, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { avatars, GameShell, RESOURCE_ROOT } from '../components/GameUI';
import { asset, optimizedAsset, preloadAssets } from '../lib';
import { useGame } from '../store';

export default function SidPage(){
  const navigate=useNavigate();
  const sid=useGame(state=>state.profile.sid??'');
  const setProfile=useGame(state=>state.setProfile);
  const [error,setError]=useState('');
  const [verified,setVerified]=useState(false);
  useEffect(()=>preloadAssets(avatars.flatMap(avatar=>[
    optimizedAsset(RESOURCE_ROOT+'avatar icon/'+avatar),
    optimizedAsset(RESOURCE_ROOT+'avatar icon/'+avatar.replace('.png','-1.png')),
  ])),[]);
  useEffect(()=>{
    if(!verified)return;
    const id=window.setTimeout(()=>navigate('/avatar'),650);
    return()=>window.clearTimeout(id);
  },[navigate,verified]);

  function submit(event:FormEvent){
    event.preventDefault();
    const normalized=sid.trim().toUpperCase();
    if(!/^S?\d{7,9}$/.test(normalized)){
      setError('Enter a valid student ID, for example S1234567.');
      setVerified(false);
      return;
    }
    setProfile({sid:normalized.startsWith('S')?normalized:`S${normalized}`});
    setError('');
    setVerified(true);
  }

  return <GameShell cyan><header className="topbar sid-topbar"><button className="back-mark" aria-label="Go back" onClick={()=>navigate('/')}>Back</button></header><section className="sid-page">
    <form className="sid-card" onSubmit={submit} noValidate>
      <img className="sid-frame-art" src={asset(RESOURCE_ROOT+'Collect SID Screen/Frame 488.png')} alt=""/>
      <div className="visually-hidden"><p>This is exclusively for</p><h1>RMIT Students</h1></div>
      <label className="visually-hidden" htmlFor="student-id">Enter your Student ID</label>
      <input id="student-id" name="student-id" inputMode="text" autoCapitalize="characters" autoComplete="off" value={sid} onChange={event=>{setProfile({sid:event.target.value});setVerified(false);setError('')}} aria-describedby={error?'sid-error':undefined} aria-invalid={Boolean(error)} placeholder="e.g. S1234567"/>
      {error&&<p id="sid-error" className="sid-error" role="alert">{error}</p>}
      {verified&&<motion.p className="sid-success" role="status" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}}>Student ID verified!</motion.p>}
      <motion.button className="resource-button sid-verify" type="submit" aria-label="Verify SID" disabled={verified} whileHover={verified?undefined:{y:-3,scale:1.015}} whileTap={verified?undefined:{scale:.97}}><img src={asset(RESOURCE_ROOT+'Collect SID Screen/Frame 480.png')} alt=""/></motion.button>
    </form>
    <div className="sid-guide"><img src={asset(RESOURCE_ROOT+'Collect SID Screen/Frame 489.png')} alt="Career City guide asking you to enter your student ID"/></div>
  </section></GameShell>;
}
