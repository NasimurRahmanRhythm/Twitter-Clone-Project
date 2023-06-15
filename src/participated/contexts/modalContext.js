import {createContext, useCallback, useState} from 'react'
import { Modal } from '../components/modal/Modal';
import { LoadingBar } from '../components/loading-bar/LoadingBar';
import { useLoading } from '../hooks/useLoading';
export const modalContext=createContext()
export function ModalProvider({children}){
 const [modal,setModal] = useState();
 const {loading,start,complete} = useLoading()
 const open = (view)=>setModal(view)
 const close = async ()=>{
   await complete()
   setModal(undefined)
 }
 return <modalContext.Provider value={{open,close,startLoading:start,completeLoading:complete}}>
     <>
      {children}
      {
        modal && 
       <Modal>
        <LoadingBar loading={loading}/>
        {modal}
       </Modal>
      }
     </>
 </modalContext.Provider> 
}
