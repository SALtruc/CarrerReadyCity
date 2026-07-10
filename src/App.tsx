import { AnimatePresence } from 'motion/react';
import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AvatarPage from './pages/AvatarPage';
import CityPage from './pages/CityPage';
import GuidePage from './pages/GuidePage';
import LoadingPage from './pages/LoadingPage';
import ProfilePage from './pages/ProfilePage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import StartPage from './pages/StartPage';

function ScrollToTop(){
  const {pathname}=useLocation();
  useEffect(()=>{
    window.scrollTo({top:0,left:0,behavior:'auto'});
  },[pathname]);
  return null;
}

export default function App(){return <><ScrollToTop/><AnimatePresence mode="wait"><Routes>
  <Route path="/" element={<StartPage/>}/>
  <Route path="/avatar" element={<AvatarPage/>}/>
  <Route path="/profile" element={<ProfilePage/>}/>
  <Route path="/guide" element={<GuidePage/>}/>
  <Route path="/loading" element={<LoadingPage/>}/>
  <Route path="/city" element={<CityPage/>}/>
  <Route path="/place/:slug" element={<QuizPage/>}/>
  <Route path="/results" element={<ResultsPage/>}/>
  <Route path="*" element={<Navigate to="/"/>}/>
</Routes></AnimatePresence></>}
