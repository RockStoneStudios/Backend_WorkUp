import express from "express";
import dotenv from 'dotenv';
import UsuarioRoutes from './Routes/user.router.js';
import ProyectoRoutes from './Routes/proyecto.router.js';
import TareaRouter from './Routes/tarea.router.js';
import cors from 'cors';
//Settings
dotenv.config();


//Configurar cors 
const whiteList = [process.env.FRONTEND_URL];
const corsOptions = {
    
    origin : function(origin,callback){
        if(whiteList.includes(origin)){
           callback(null,true)
        }else{
           callback(new Error("Error de Cors"))
        }
    }
}


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.use('/api/usuarios',UsuarioRoutes);
app.use('/api/proyectos',ProyectoRoutes);
app.use('/api/tareas',TareaRouter);

export default app;
