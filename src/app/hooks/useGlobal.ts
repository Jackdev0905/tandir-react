import { createContext, useContext } from "react";
import { Member } from "../../lib/types/member";

interface GlobalInteface {
  authMember: Member | null;
  setAuthMember: (member: Member | null) => void;
  orderBuilder:Date;
  setOrderBuilder:(input:Date) => void
}

export const GlobalContext = createContext<GlobalInteface | undefined>(undefined);


export const useGlobal =()=>{
    const context = useContext(GlobalContext)
    if(context === undefined) throw new Error("useGlobals within providers")

    
    return context
}