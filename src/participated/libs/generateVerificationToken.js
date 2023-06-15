
export function generateVerificationToken(length = 6){
   const alph = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
   let token = ""
   for(let i=0;i<length;i++){
      token+=alph[Math.floor(Math.random()*52)]
   }
  return token
}
