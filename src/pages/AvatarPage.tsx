import { motion } from 'motion/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn, optimizedAsset, preloadAssets } from '../lib';
import { useGame } from '../store';
import { avatars, GameButton, GameShell, RESOURCE_ROOT, Topbar } from '../components/GameUI';

export default function AvatarPage() {
  const navigate=useNavigate();
  const selected=useGame(s=>s.profile.avatar);
  const setAvatar=useGame(s=>s.setAvatar);
  useEffect(()=>preloadAssets(avatars.flatMap(avatar=>[
    optimizedAsset(RESOURCE_ROOT+'avatar icon/'+avatar),
    optimizedAsset(RESOURCE_ROOT+'avatar icon/'+avatar.replace('.png','-1.png')),
  ])),[]);
  return <GameShell cyan><Topbar/><section className="panel narrow avatar-panel">
    <h1>But first, let's<br/>choose your <strong>avatar</strong></h1>
    <div className="avatar-grid">{avatars.map((avatar,index)=>{
      const image=selected===index?avatar.replace('.png','-1.png'):avatar;
      return <motion.button aria-label={`Choose avatar ${index+1}`} key={avatar} className={cn(selected===index&&'selected')} onClick={()=>setAvatar(index)} whileTap={{scale:.94}}><img className={`avatar-art avatar-art-${index}`} src={optimizedAsset(RESOURCE_ROOT+'avatar icon/'+image)} decoding="async" alt=""/></motion.button>;
    })}</div>
    {selected>=0&&<GameButton className="avatar-next" onClick={()=>navigate('/profile')}>Next</GameButton>}
  </section></GameShell>;
}
