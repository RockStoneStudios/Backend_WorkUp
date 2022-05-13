import nodemailer from 'nodemailer';

export const  emailRegistro = async(datos)=>{
    console.log(datos);
  const {email,nombre,token} = datos;
   
   console.log(email,nombre,token);
  
  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
  //Informacion del email
  const info = await transport.sendMail({
       from :'"WORK_UP - Administrador de Proyectos" <cuentas@work_up.com>',
       to : email,
       subject : "WORK_UP - Comprueba tu Cuenta",
       text : "Comprueba tu cuenta en WORK_UP",
       html : `<p> Hola : ${nombre} Comprueba tu cuenta en WORK_UP</p>
       <p>Tu cuenta ya esta casi lista solo debes comprobarla en el siguiente enlace :
       
       <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar tu cuenta </a>
       
       <p> Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
       
       
       `,
           
  })
}



export const  emailRecuperarPassword = async(datos)=>{
  console.log(datos);
const {email,nombre,token} = datos;


var transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

//Informacion del email
const info = await transport.sendMail({
     from :'"WORK_UP - Administrador de Proyectos" <cuentas@work_up.com>',
     to : email,
     subject : "WORK_UP - Reestablece tu Password",
     text : "Comprueba tu cuenta en WORK_UP",
     html : `<p> Hola : ${nombre} has solicitado resstablecer tu password</p>
     <p>Sigue el siguiente enlace para generar un nuevo password :
     
     <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password </a>
     
     <p> Si tu no Solicitaste este Email, puedes ignorar el mensaje</p>
     
     
     `,
         
})
}
