import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn, optimizedAsset } from '../lib';
import { useGame } from '../store';

export const RESOURCE_ROOT = 'Career City Resources/';
export const avatars = ['1.png','2.png','3.png','5.png','6.png','7.png','8.png','Component 3.png'];

export function GameShell({children,cyan=false}: {children:ReactNode;cyan?:boolean}) {
  const reduceMotion = useReducedMotion();
  return <main className={cn('app-shell',cyan&&'cyan')}>
    <div className="ambient" aria-hidden="true">
      {!reduceMotion&&[0,1,2,3,4].map(i=><i key={i} style={{'--i':i} as React.CSSProperties}/>) }
    </div>
    <motion.div className="game-frame" initial={reduceMotion?false:{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.4,ease:'easeOut'}}>
      {children}
    </motion.div>
  </main>;
}

export function Brand({compact=false}:{compact?:boolean}) {
  return <img className={cn('brand',compact&&'compact')} src={optimizedAsset(RESOURCE_ROOT+'logo.png')} decoding="async" alt="The Career City"/>;
}

export function Topbar() {
  const avatar = useGame(s=>s.profile.avatar);
  const reset = useGame(s=>s.reset);
  const navigate = useNavigate();
  const [showRestart,setShowRestart] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const avatarButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(()=>{
    const dialog=dialogRef.current;
    if(!dialog)return;
    if(showRestart&&!dialog.open){dialog.showModal();dialog.querySelector<HTMLButtonElement>('button')?.focus()}
    if(!showRestart&&dialog.open)dialog.close();
  },[showRestart]);
  const restart = () => {
    reset();
    setShowRestart(false);
    navigate('/',{replace:true});
  };
  return <header className="topbar">
    <button className="back-mark" aria-label="Go back" onClick={()=>history.back()}>Back</button>
    {avatar>=0?<motion.button ref={avatarButtonRef} className="avatar-action" type="button" aria-label="Retake game" title="Retake game" onClick={()=>setShowRestart(true)} whileHover={{rotate:4,scale:1.06}} whileTap={{scale:.92}}>
      <img src={optimizedAsset(RESOURCE_ROOT+'avatar icon/'+avatars[avatar])} decoding="async" alt=""/>
    </motion.button>:<img src={optimizedAsset(RESOURCE_ROOT+'avatar icon/'+avatars[0])} decoding="async" alt="Career City avatar"/>}
    <dialog ref={dialogRef} className="restart-modal" aria-labelledby="restart-title" onCancel={()=>setShowRestart(false)} onClose={()=>avatarButtonRef.current?.focus()} onMouseDown={event=>{if(event.target===event.currentTarget)setShowRestart(false)}}>
      <motion.div className="restart-dialog" initial={{opacity:0,scale:.94,y:12}} animate={showRestart?{opacity:1,scale:1,y:0}:{opacity:0}}>
        <img src={optimizedAsset(RESOURCE_ROOT+'avatar icon/'+avatars[avatar])} alt="Your avatar"/>
        <h2 id="restart-title">Retake the game?</h2>
        <p>Your current answers and city progress will be cleared.</p>
        <div><button type="button" onClick={()=>setShowRestart(false)}>Keep playing</button><button type="button" className="confirm-restart" onClick={restart}>Start again</button></div>
      </motion.div>
    </dialog>
  </header>;
}

export function Mascot() {
  return <img className="mascot" src={optimizedAsset(RESOURCE_ROOT+'Start screen/Frame 484.png')} decoding="async" fetchPriority="high" alt="Career City guide pointing upward"/>;
}

export function GameButton({children,onClick,type='button',disabled=false,className=''}:{children:ReactNode;onClick?:()=>void;type?:'button'|'submit';disabled?:boolean;className?:string}) {
  return <motion.button whileHover={disabled?undefined:{y:-2}} whileTap={disabled?undefined:{scale:.98}} transition={{duration:.15}} className={cn('cta',className)} type={type} onClick={onClick} disabled={disabled}>
    {children}<span aria-hidden="true">›</span>
  </motion.button>;
}
