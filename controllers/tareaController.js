import { json } from 'express';
import Proyecto from '../Models/Proyecto.js';
import Tarea from '../Models/Tareas.js';
import mongoose from 'mongoose';


const agregarTarea = async (req,res)=>{
   const {proyecto} = req.body;
   const proyectoExiste = await Proyecto.findById(proyecto);
     
    if(!proyectoExiste){
        const error = new Error('El Proyecto no existe');
       return  res.status(404).json({message : error.message});
    }

    if(proyectoExiste.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('No tiene los permisos');
       return res.status(403).json({message : error.message});
    }
    try{
        const tareaAlmacenada = await Tarea.create(req.body);
        //Almacenar el Id en el proyecto
        proyectoExiste.tareas.push(tareaAlmacenada._id);
        await proyectoExiste.save();
       return res.status(200).json(tareaAlmacenada)
    }catch(error){
        console.log(error);
    }
}

const obtenerTarea = async (req,res)=>{
       const {id} =req.params;
      const validarId =  mongoose.isValidObjectId(id);
       if(!validarId){
           res.status(300).json({message : "Error de Id"});
       }
      const tarea = await Tarea.findById(id).populate("proyecto");
       if(!tarea){
           const error = new Error ('No se encontro tarea');
          return res.status(404).json({message : error.message});
       }

        if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
            const error = new Error ('No tienes los permisos');
          return  res.status(403).json({message : error.message});
        }

        res.status(200).json(tarea);
    
}

const actualizarTarea = async (req,res)=>{
  
      const {id} = req.params;
      const validarId =  mongoose.isValidObjectId(id);
       if(!validarId) return res.status(300).json({message : "Error de id"});

        const tarea = await Tarea.findById(id).populate('proyecto');
         if(!tarea) {
             const error = new Error('No se encontro tarea');
            return res.status(404).json({message : error.message});
         }
          if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
            const error = new Error('No tiene permisos');
          return  res.status(403).json({message : error.message});
          }
   
            tarea.nombre = req.body.nombre || tarea.nombre;
            tarea.descripcion = req.body.descripcion || tarea.descripcion;
            tarea.prioridad = req.body.prioridad || tarea.prioridad;
            tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;
            try{

                const tareaModificada = await tarea.save(req.body);
               return res.status(200).json(tareaModificada)
            }catch(error){
                console.log(error);
            }

    
}

const eliminarTarea = async (req,res)=>{
    console.log(".."+req.params.id);
     const {id} = req.params;
  
     const validarId =  mongoose.isValidObjectId(id);
     if(!validarId) return res.status(300).json({message : "Error de Id"});

     const tarea = await Tarea.findById(id).populate('proyecto');

        if(!tarea){
            const error = new Error('No se encontro tarea');
           return  res.status(404).json({message : error.message});
        }

     if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
         const error = new Error('no tienes permisos');
        return res.status(403).json({message : error.message});
     }
       try {
           const proyecto = await Proyecto.findById(tarea.proyecto);
           proyecto.tareas.pull(tarea._id);
   
            await Promise.allSettled([await proyecto.save(), await tarea.deleteOne()])

          return res.status(201).json({message : " Tarea Eliminada con Exito"});
       }catch(error){
           console.log(error);
       }


}

const cambiarEstado = async (req,res)=>{
    const {id} = req.params;
     const tarea = await Tarea.findById(id)
                                       .populate('proyecto');
                                      
     if(!tarea) {
         const error = new Error("Tarea no encontrada");
         return res.status(404).json({message: error.message});
     }
     if(tarea.proyecto.creador.toString() !== req.usuario._id.toString() && !tarea.proyecto.colaboradores.some(
         (colaborador) => colaborador._id.toString() === req.usuario._id.toString()
     )){
       const error = new Error("Accion no valida");
       return res.status(403).json({msg : error.message})
     }
     tarea.estado = !tarea.estado;
     tarea.completado = req.usuario._id;
     await tarea.save();
     const tareaAlmacenada = await Tarea.findById(id).populate('proyecto')
                             .populate('completado');

     return res.status(200).json(tareaAlmacenada);
}


export {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado
}