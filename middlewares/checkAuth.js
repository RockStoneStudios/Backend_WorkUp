import jwt from "jsonwebtoken";
import Usuario from "../Models/Usuario.js";
const checkAuth= async(req,res,next)=>{
    let token;
     if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
         try{
              token = req.headers.authorization.split(' ')[1];
              const decoded = jwt.verify(token,process.env.TOKEN_SECRET);
               req.usuario = await Usuario.findById(decoded.payload).select('-password -confirmado -token -createdAt -updatedAt -__v');
               
               return next();
            }catch(error){
                return res.status(403).json({message:'Hubo un error'})
            }
     }

     if(!token){
         const error = new Error("Token no valido");
         return res.status(401).json({message : error.message})
     }
     next();
}

export default checkAuth;