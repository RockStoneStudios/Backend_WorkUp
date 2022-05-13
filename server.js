import app from './index.js';
import conectarDB from './config/db.js';

conectarDB();

const servidor = app.listen(process.env.PORT || 3001,()=>{
    console.log('Starting Port . . .');
});


// Socket.io

import {Server} from 'socket.io';

const io = new Server(servidor,{
    pingTimeout : 60000,
    cors : {
        origin : process.env.FRONTEND_URL
    }
});


io.on('connection',(socket)=> {
    console.log('Conection socket io')

    socket.on('abrir proyecto',(proyecto)=>{
      
        socket.join(proyecto);
      
});

     socket.on('nueva tarea', (tarea) => {
         const proyecto = tarea.proyecto;
        socket.to(proyecto).emit('tarea agregada',tarea);
     });

     socket.on('eliminar tarea',tarea =>{
         const proyecto = tarea.proyecto;
         socket.to(proyecto).emit('tarea eliminada',tarea)
     });
     socket.on('editar tarea',tarea=>{
          const proyecto = tarea.proyecto._id;
          socket.to(proyecto).emit("tarea actualizada",tarea);
     });
     socket.on('cambiar estado', (tarea)=>{
         const proyecto = tarea.proyecto._id;
         socket.to(proyecto).emit('nuevo estado',tarea);
     })
});

