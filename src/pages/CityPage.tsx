import { motion } from 'motion/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brand, GameButton, GameShell, Mascot, RESOURCE_ROOT, Topbar } from '../components/GameUI';
import { places } from '../data';
import { optimizedAsset, preloadAssets } from '../lib';
import { useGame } from '../store';

export default function CityPage(){
  const visited=useGame(s=>s.visited); const navigate=useNavigate();
  useEffect(()=>preloadAssets(places.flatMap(place=>[
    optimizedAsset(RESOURCE_ROOT+place.icon),
    optimizedAsset(RESOURCE_ROOT+place.bubbleChat),
    optimizedAsset(RESOURCE_ROOT+'City map/'+place.asset.replace('.png',' done.png')),
  ])),[]);
  return <GameShell><Topbar/><section className="city"><Brand/>
    <div className="city-intro"><Mascot/><div><h1>Where would you like to go?</h1><p>Visit all <strong>6 places</strong> to complete your tour.</p><div className="stamps">{places.map(place=><span className={visited.includes(place.slug)?'done':''} key={place.slug}>{visited.includes(place.slug)?'✓':''}</span>)}</div><em>{visited.length} of 6 visited</em></div></div>
    {visited.length===6&&<motion.div className="tour-complete" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} role="status"><strong>City tour complete!</strong><span>Your career profile is ready.</span></motion.div>}
    <div className="road" aria-hidden="true"/>
    <div className="place-grid">{places.map((place,index)=><motion.button key={place.slug} onClick={()=>navigate('/place/'+place.slug)} className="place place-art" aria-label={`${visited.includes(place.slug)?'Revisit':'Visit'} ${place.name}`} style={{'--place':place.color,'--delay':`${index*.05}s`} as React.CSSProperties} whileHover={{y:-5}} whileTap={{scale:.98}}><img src={optimizedAsset(RESOURCE_ROOT+'City map/'+(visited.includes(place.slug)?place.asset.replace('.png',' done.png'):place.asset))} loading={index>1?'lazy':'eager'} decoding="async" alt=""/></motion.button>)}</div>
    {visited.length===6&&<GameButton className="results-fab" onClick={()=>navigate('/results')}>See my result</GameButton>}
  </section></GameShell>;
}
