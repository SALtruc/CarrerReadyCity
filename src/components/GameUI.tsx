import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
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
  return <header className="topbar">
    <button className="back-mark" aria-label="Go back" onClick={()=>history.back()}>Back</button>
    <img src={optimizedAsset(RESOURCE_ROOT+'avatar icon/'+avatars[avatar<0?0:avatar])} decoding="async" alt="Your avatar"/>
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
