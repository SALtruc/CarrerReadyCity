import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { GameButton, GameShell, Mascot, RESOURCE_ROOT, Topbar } from '../components/GameUI';
import { places } from '../data';
import { asset } from '../lib';
import { useGame } from '../store';

export default function QuizPage(){
  const {slug}=useParams(); const navigate=useNavigate(); const place=places.find(item=>item.slug===slug);
  const answers=useGame(s=>s.answers); const previous=answers[slug||'']||[]; const saveAnswer=useGame(s=>s.answer); const [selected,setSelected]=useState<string[]>(previous);
  if(!place)return <Navigate to="/city"/>;
  const toggle=(option:string)=>setSelected(current=>current.includes(option)?current.filter(value=>value!==option):[...current,option]);
  return <GameShell><Topbar/><section className="quiz">
    <div className="place-heading" style={{'--place':place.color} as React.CSSProperties}><img src={asset(RESOURCE_ROOT+'City map/'+place.asset)} alt=""/><div><h1>{place.name}</h1><p>{place.tagline}</p></div></div>
    <div className="guide-row"><Mascot/><div className="speech small">Select everything that feels true to you. You can choose more than one, or none at all.</div></div>
    <div className="question-sheet"><div className="color-bar">{places.map(item=><i key={item.slug} style={{background:item.color}}/>)}</div>
      <div className="quiz-status" aria-live="polite"><strong>{selected.length}</strong><span>answers feel like you</span><div>{place.questions.map((_,index)=><i className={selected.some(option=>place.questions[index].options.includes(option))?'active':''} key={index}/>)}</div></div>
      {place.questions.map((question,index)=><fieldset key={question.title}><legend><span>Question {index+1} of 3</span>{question.title}</legend><div className="options">{question.options.map(option=><button type="button" key={option} aria-pressed={selected.includes(option)} onClick={()=>toggle(option)}>{selected.includes(option)&&<b>✓</b>}{option}</button>)}</div></fieldset>)}
      <div className="quiz-finish"><p>{selected.length===0?'It is okay if none of these feel right.':'Nice! You can change these anytime.'}</p><GameButton onClick={()=>{saveAnswer(place.slug,selected,place.code);navigate('/city')}}>{previous.length?'Update & return':'Done'}</GameButton></div>
    </div>
  </section></GameShell>;
}
