import { motion } from 'motion/react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brand, GameButton, GameShell, RESOURCE_ROOT, Topbar } from '../components/GameUI';
import { careerIdeas, places } from '../data';
import { asset } from '../lib';
import { useGame } from '../store';

const hollandNames:Record<string,string>={R:'Realistic',I:'Investigative',A:'Artistic',S:'Social',E:'Enterprising',C:'Conventional'};
export default function ResultsPage(){
  const scores=useGame(s=>s.scores); const reset=useGame(s=>s.reset); const navigate=useNavigate();
  const ranked=useMemo(()=>Object.entries(scores).sort((a,b)=>b[1]-a[1]),[scores]); const max=Math.max(1,...Object.values(scores));
  const colorFor=(code:string)=>places.find(item=>item.code===code)?.color;
  return <GameShell><Topbar/><section className="results"><Brand/>
    <div className="code-card"><div className="code">{ranked.slice(0,3).map(([key])=><span key={key} style={{color:colorFor(key)}}>{key}</span>)}</div><h1>Your Holland Code</h1><p>{ranked.slice(0,3).map(([key])=>hollandNames[key]).join(' · ')}</p></div>
    <div className="score-card">{Object.entries(hollandNames).map(([key,name])=><div className="score" key={key}><strong>{name}</strong><span><i style={{transform:`scaleX(${scores[key]/max})`,background:colorFor(key)}}/></span></div>)}</div>
    <h2>Where do you fit best?</h2>{ranked.slice(0,3).map(([key],index)=>{const place=places.find(item=>item.code===key)!;return <motion.details className="result-place" key={key} style={{'--place':place.color,'--place-text':place.dark?'#fff':'#050505'} as React.CSSProperties} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:index*.08}} open={index===0}><summary><span className="place-icon"><img src={asset(RESOURCE_ROOT+place.icon)} alt=""/></span><div><small>#{index+1} match</small><h3>{place.name}</h3><p>{place.description}</p></div><b aria-hidden="true">＋</b></summary><div className="career-ideas"><span>Career ideas to explore</span>{careerIdeas[key].map(career=><em key={career}>{career}</em>)}</div></motion.details>})}
    <GameButton className="secondary" onClick={()=>navigate('/city')}>Explore again</GameButton><button className="reset" onClick={()=>{reset();navigate('/')}}>Reset my journey</button>
  </section></GameShell>;
}
