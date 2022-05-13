import jwt from 'jsonwebtoken';

const generarJWT = (payload)=>{
  return jwt.sign({payload},process.env.TOKEN_SECRET,{
      expiresIn : "30d"
  })
}

export default generarJWT;