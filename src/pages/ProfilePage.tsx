import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brand, GameButton, GameShell, Mascot, Topbar } from '../components/GameUI';
import { useGame } from '../store';

export default function ProfilePage() {
  const navigate=useNavigate();
  const profile=useGame(s=>s.profile);
  const setProfile=useGame(s=>s.setProfile);
  const [error,setError]=useState('');
  function submit(event:FormEvent){event.preventDefault();if(!profile.year.trim()||!profile.program.trim()){setError('Please tell us your year and current program.');return}navigate('/guide')}
  return <GameShell><Topbar/><section className="panel form-panel"><Brand compact/>
    <div className="guide-row"><Mascot/><div className="speech small">Tell us more about yourself</div></div>
    <form onSubmit={submit} noValidate>
      <label><span>What year of study are you in?</span><input value={profile.year} onChange={e=>setProfile({year:e.target.value})} placeholder="e.g. Year 3"/></label>
      <label><span>What is your current program?</span><input value={profile.program} onChange={e=>setProfile({program:e.target.value})} placeholder="e.g. Digital Marketing"/></label>
      <label><span>Access code <em>(Optional)</em></span><input value={profile.accessCode} onChange={e=>setProfile({accessCode:e.target.value})} placeholder="e.g. CXVED"/></label>
      {error&&<p className="error" role="alert">{error}</p>}<GameButton type="submit">Next</GameButton>
    </form>
  </section></GameShell>;
}
