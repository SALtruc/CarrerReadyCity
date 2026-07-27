import { memo, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { GameButton, GameShell, RESOURCE_ROOT, Topbar } from '../components/GameUI';
import { places } from '../data';
import { optimizedAsset } from '../lib';
import { useGame } from '../store';

const StaticArtwork = memo(function StaticArtwork({path,alt}:{path:string;alt:string}){
  return <img src={optimizedAsset(RESOURCE_ROOT+path)} decoding="async" alt={alt}/>;
});

export default function QuizPage(){
  const {slug}=useParams(); const navigate=useNavigate(); const place=places.find(item=>item.slug===slug);
  const answers=useGame(s=>s.answers); const previous=answers[slug||'']||[]; const saveAnswer=useGame(s=>s.answer); const [selected,setSelected]=useState<string[]>(previous);
  const reduceMotion=useReducedMotion();
  const fieldsetRefs=useRef<(HTMLFieldSetElement|null)[]>([]);
  const finishRef=useRef<HTMLDivElement>(null);
  if(!place)return <Navigate to="/city"/>;
  const toggle=(option:string)=>setSelected(current=>current.includes(option)?current.filter(value=>value!==option):[...current,option]);
  function answerQuestion(option:string,index:number){
    const answeredBefore=selected.some(value=>place!.questions[index].options.includes(value));
    const selectingNew=!selected.includes(option);
    toggle(option);
    if(answeredBefore||!selectingNew)return;
    const target=index+1<place!.questions.length?fieldsetRefs.current[index+1]:finishRef.current;
    window.setTimeout(()=>target?.scrollIntoView({behavior:reduceMotion?'auto':'smooth',block:'start'}),220);
  }
  return <GameShell><Topbar/><section className="quiz" style={{'--place':place.color,'--place-text':place.dark?'#fff':'#050505'} as React.CSSProperties}>
    <div className="place-heading">
      <div className="place-heading-top"><span className="place-icon"><StaticArtwork path={place.icon} alt=""/></span><h1>{place.name}</h1></div>
      <p>{place.tagline}</p>
    </div>
    <div className="quiz-guide-art"><StaticArtwork path={place.bubbleChat} alt={`Hi there! Welcome to ${place.name}. Select everything that feels true to you. You can choose more than one, or none at all.`}/></div>
    <div className="question-sheet"><div className="color-bar">{places.map(item=><i key={item.slug} style={{background:item.color}}/>)}</div>
      <div className="quiz-status" aria-live="polite"><strong>{selected.length}</strong><span>answers feel like you</span><div>{place.questions.map((_,index)=><i className={selected.some(option=>place.questions[index].options.includes(option))?'active':''} key={index}/>)}</div></div>
      {place.questions.map((question,index)=><fieldset key={question.title} ref={element=>{fieldsetRefs.current[index]=element}}><legend><span>Question {index+1} of 3</span>{question.title}</legend><div className="options">{question.options.map(option=><button type="button" key={option} aria-pressed={selected.includes(option)} onClick={()=>answerQuestion(option,index)}>{option}</button>)}</div></fieldset>)}
      <div className="quiz-finish" ref={finishRef}><p>{selected.length===0?'It is okay if none of these feel right.':'Nice! You can change these anytime.'}</p><GameButton onClick={()=>{saveAnswer(place.slug,selected,place.code);navigate('/city')}}>{previous.length?'Update & return':'Done'}</GameButton></div>
    </div>
  </section></GameShell>;
}
