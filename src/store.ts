import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Profile = { avatar: number; year: string; program: string; accessCode: string; sid: string };
type GameState = {
  profile: Profile; visited: string[]; scores: Record<string, number>; answers: Record<string, string[]>;
  setAvatar: (avatar:number)=>void; setProfile:(profile:Partial<Profile>)=>void;
  answer:(place:string, values:string[], scoreKey:string)=>void; reset:()=>void;
};
const initial = { profile:{avatar:-1,year:'',program:'',accessCode:'',sid:''}, visited:[], scores:{R:0,I:0,A:0,S:0,E:0,C:0}, answers:{} };
export const useGame = create<GameState>()(persist((set)=>({
  ...initial,
  setAvatar:(avatar)=>set(s=>({profile:{...s.profile,avatar}})),
  setProfile:(profile)=>set(s=>({profile:{...s.profile,...profile}})),
  answer:(place,values,scoreKey)=>set(s=>{
    const previousCount=s.answers[place]?.length||0;
    return {
      answers:{...s.answers,[place]:values},
      visited:s.visited.includes(place)?s.visited:[...s.visited,place],
      scores:{...s.scores,[scoreKey]:Math.max(0,(s.scores[scoreKey]||0)-previousCount+values.length)}
    };
  }),
  reset:()=>set(initial)
}),{name:'career-city-progress'}));
