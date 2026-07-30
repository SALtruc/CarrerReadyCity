import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brand, GameShell, RESOURCE_ROOT, Topbar } from '../components/GameUI';
import { asset } from '../lib';
import { useGame } from '../store';

export default function ProfilePage() {
  const navigate=useNavigate();
  const profile=useGame(s=>s.profile);
  const setProfile=useGame(s=>s.setProfile);
  const [error,setError]=useState('');
  const [showAccessInfo,setShowAccessInfo]=useState(false);
  function submit(event:FormEvent){event.preventDefault();if(!profile.year.trim()||!profile.program.trim()){setError('Please tell us your year and current program.');return}navigate('/guide')}
  return <GameShell><Topbar/><section className="panel form-panel"><Brand compact/>
    <div className="profile-coach-art" role="img" aria-label="Career City coach saying: Tell us more about yourself">
      <img src={asset(RESOURCE_ROOT+'Collect information screen/Frame.png')} alt=""/>
      <span aria-hidden="true">Tell us more about yourself</span>
    </div>
    <form onSubmit={submit} noValidate>
      <label><span>What year of study are you in?</span><input value={profile.year} onChange={e=>{setProfile({year:e.target.value});setError('')}} placeholder="e.g. Year 3"/></label>
      <label><span>What is your current program?</span><input value={profile.program} onChange={e=>{setProfile({program:e.target.value});setError('')}} placeholder="e.g. Digital Marketing"/></label>
      <label>
        <span>Access code <em>(Optional)</em><button type="button" className="info-btn" aria-label="What is an access code?" aria-expanded={showAccessInfo} onClick={()=>setShowAccessInfo(value=>!value)}>i</button></span>
        <input value={profile.accessCode} onChange={e=>setProfile({accessCode:e.target.value})} placeholder="e.g. CXVED"/>
        {showAccessInfo&&<p className="info-overlay" role="tooltip">This code is given by the Event/Workshop Coordinator you're attending with. It helps us track which event you joined.<br/>Not at an event? Leave this blank!</p>}
      </label>
      {error&&<p className="error" role="alert">{error}</p>}<button className="resource-button profile-next" type="submit"><img src={asset(RESOURCE_ROOT+'Next.png')} alt="Next"/></button>
    </form>
  </section></GameShell>;
}
