import { FormEvent, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { avatars, GameShell, RESOURCE_ROOT, Topbar } from '../components/GameUI';
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

  function normalizeSid(raw:string){
    const digits=raw.replace(/[^0-9]/g,'').slice(0,7);
    return digits?`S${digits}`:'';
  }

  function submit(event:FormEvent){
    event.preventDefault();
    const normalized=sid.trim().toUpperCase();
    if(!/^S?\d{7}$/.test(normalized)){
      setError('Enter your 7-digit student ID, for example S1234567.');
      setVerified(false);
      return;
    }
    setProfile({sid:normalized.startsWith('S')?normalized:`S${normalized}`});
    setError('');
    setVerified(true);
  }

  return <GameShell cyan><Topbar/><section className="sid-page">
    <form className="sid-card" onSubmit={submit} noValidate>
      <div className="sid-frame">
        <img className="sid-frame-art" src={optimizedAsset(RESOURCE_ROOT+'Collect SID Screen/sid-frame-extended.png')} alt=""/>
        <div className="visually-hidden"><p>This is exclusively for</p><h1>RMIT Students</h1></div>
        <label className="visually-hidden" htmlFor="student-id">Enter your Student ID</label>
        <input id="student-id" name="student-id" inputMode="numeric" autoComplete="off" maxLength={8} pattern="S?[0-9]{7}" value={sid} onChange={event=>{setProfile({sid:normalizeSid(event.target.value)});setVerified(false);setError('')}} aria-describedby={error?'sid-error':undefined} aria-invalid={Boolean(error)} placeholder="e.g. S1234567"/>
        <motion.button className="resource-button sid-verify" type="submit" aria-label="Verify SID" disabled={verified} whileHover={verified?undefined:{y:-3,scale:1.015}} whileTap={verified?undefined:{scale:.97}}><img src={asset(RESOURCE_ROOT+'Collect SID Screen/Frame 480.png')} alt=""/></motion.button>
      </div>
      {error&&<motion.p id="sid-error" className="sid-error" role="alert" initial={{opacity:0,y:-14}} animate={{opacity:1,y:0}}>{error}</motion.p>}
      {verified&&<motion.p className="sid-success" role="status" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}}>Student ID verified!</motion.p>}
    </form>
    <div className="sid-guide" role="img" aria-label="Career City guide asking you to enter your student ID">
      <img className="sid-guide-coach" src={optimizedAsset(RESOURCE_ROOT+'Collect SID Screen/sid-coach.png')} alt=""/>
      <span className="sid-guide-bubble" aria-hidden="true">Please enter your SID to verify!</span>
      <img className="sid-guide-stars" src={optimizedAsset(RESOURCE_ROOT+'Collect SID Screen/sid-stars.png')} alt=""/>
    </div>
  </section></GameShell>;
}
