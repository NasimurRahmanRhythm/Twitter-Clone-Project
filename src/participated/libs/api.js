export const Api = {
   get:({url,options})=>fetch(url,{...options,method:'GET'}), 
   post:({url,body,options})=>fetch(url,{...options,method:'POST',body:body}), 
   delete:({url,options})=>fetch(url,{...options,method:'DELETE'}), 
   put:({url,body,options})=>fetch(url,body,{...options,method:'PUT',body:body}), 
   patch:({url,body,options})=>fetch(url,body,{...options,method:'PATCH',body:body}), 
}
