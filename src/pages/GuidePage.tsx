import { useNavigate } from 'react-router-dom';
import { Brand, GameShell, RESOURCE_ROOT, Topbar } from '../components/GameUI';
import { asset } from '../lib';

export default function GuidePage(){const navigate=useNavigate();return <GameShell><Topbar/><section className="panel guide"><Brand/><img className="guidebook-art" src={asset(RESOURCE_ROOT+'Guidebook screen/Guidebook.png')} alt="Guide Book. Visit 6 places in the city, meet your tour guide, and get your career profile. This game is based on the Holland Occupational Themes (RIASEC), developed by psychologist Dr. John L. Holland."/><button className="resource-button start-exploring" type="button" onClick={()=>navigate('/loading')}><img src={asset(RESOURCE_ROOT+'Guidebook screen/Start explore.png')} alt="Start Exploring"/></button></section></GameShell>}
