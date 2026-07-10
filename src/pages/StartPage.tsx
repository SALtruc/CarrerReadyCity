import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Brand, GameShell, Mascot } from '../components/GameUI';

export default function StartPage() {
  const navigate=useNavigate();
  return <GameShell cyan><section className="start">
    <Brand/>
    <div className="speech">Are you ready to find <strong>where you belong?</strong></div>
    <Mascot/>
    <motion.button className="start-button" onClick={()=>navigate('/avatar')} whileHover={{rotate:-3,scale:1.04}} whileTap={{scale:.96}}>START</motion.button>
  </section></GameShell>;
}
