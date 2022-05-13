import Usuario from "../Models/Usuario.js"
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import {emailRegistro, emailRecuperarPassword} from '../helpers/email.js'

const registrar = async(req,res) =>{
    console.log("oeeeeeeeeeeeee");
    const {email} = req.body;
    const userRepeat = await Usuario.findOne({email});
    
    if(userRepeat){
        const error = new Error('Un Usuario ya esta registrado con este Email');
       
       return res.status(400).json({message :error.message});
     }
       try{

           const usuario = new Usuario(req.body);
            usuario.token = generarId();
           
          await usuario.save();
          //Enviar el email de confirmacion
          console.log(usuario);
          emailRegistro({
              email : usuario.email,
              nombre : usuario.nombre,
              token : usuario.token

          })
          return res.status(201).json({message : "Usuario Creado con Exito, Revisa tu email para confirmar cuenta"});
        } catch(error){
       console.log(error);
   }
}


const login = async(req,res)=>{
     //Comprobar si el usuario existe
     const {email,password} = req.body;
     const usuario = await Usuario.findOne({email});
      if(!usuario) {
          const error = new Error("El Usuario no Existe");
           return res.status(404).json({message : error.message});
      }

      //Comprobar si el usuario esta confirmado
       if(!usuario.confirmado){
           const error = new Error("El usuario no esta confirmado");
          return  res.status(403).json({message : error.message});

       }
         
       if(! await usuario.comprobarPassword(password)){
           const error = new Error("Password Invalido");
           return  res.status(401).json({message : error.message})
       }else {
           
           res.json({
               _id : usuario._id,
               nombre : usuario.nombre,
               email : usuario.email,
               token : generarJWT(usuario._id)
           })
           
       }
}

const confirmar = async (req,res)=>{
      const {token} = req.params;
      const usuarioConfirmar = await Usuario.findOne({token});
       if(!usuarioConfirmar){
            const error = new Error("Token no valido");
           return res.status(403).json({message : error.message});
       }
       try{
            usuarioConfirmar.confirmado = true;
            usuarioConfirmar.token = "";
            await usuarioConfirmar.save();
            res.status(200).json({message : "Usuario Confirmado"})
       }catch(error){
           console.log(error);
       }

     
}

const olvidePassword = async (req,res)=>{
       const {email} = req.body;
       const usuario = await Usuario.findOne({email});
       if(!usuario) {
           const error = new Error('Usuario no existe');
         return res.status(404).json({message : error.message});
       }

        try{
             usuario.token = generarId();
           await usuario.save();
            emailRecuperarPassword({
                email : usuario.email,
                nombre : usuario.nombre,
                token : usuario.token
            })
           res.json({message : "Hemos enviado un email con las indicaciones"})
        }catch(error){
            console.log(error);
        }
}


const comprobarToken = async(req,res)=>{
    const {token} = req.params;
     
    const tokenValido = await Usuario.findOne({token});
     if(!tokenValido){
         const error = new Error('token invalido');
         res.status(403).json({message : error.message});

     }
      res.status(200).json({message : "Token Valido"});
}

const nuevoPassword = async(req,res)=>{
       const {token} = req.params;
       const {password} = req.body;
       const usuario = await Usuario.findOne({token});

       if(!usuario){
           const error = new Error('Token no valido');
          return res.status(403).json({message : error.message});
       }
      try{
        usuario.password = password;
        usuario.token = "";
        await usuario.save();
      return  res.status(200).json({message : "Password Modificado Correctamente"});

      }catch(error){
          console.log(error);
      }
}


const perfil = async (req,res)=>{
   const {usuario} = req;
   res.json(usuario);
}

export {
     registrar,
     login,
     confirmar,
     olvidePassword,
     comprobarToken,
     nuevoPassword,
     perfil
    }