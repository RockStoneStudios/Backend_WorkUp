
import Proyecto from "../Models/Proyecto.js"
import Tarea from "../Models/Tareas.js";
import Usuario from "../Models/Usuario.js";

const obtenerProyectos = async (req,res)=>{
    const proyectos = await Proyecto.find({'$or'
       :[
           {colaboradores : {$in : req.usuario}},
           {creador: {$in : req.usuario}}
       ]
      }).select('-tareas');
    res.status(200).json(proyectos);
}


const nuevoProyecto = async(req,res)=>{
    const proyecto = new Proyecto(req.body);
    proyecto.creador = req.usuario._id;

    try{
         const proyectoAlmacenado = await proyecto.save();
         res.status(200).json(proyectoAlmacenado);
    }catch(error){
        console.log(error);
    }
} 

const obtenerProyecto = async (req,res)=>{
     
        const proyecto = await Proyecto.findById(req.params.id)
        .populate({path : 'tareas',populate : {path : 'completado',select : 'nombre'}})
        .populate('colaboradores',"nombre email")

        if(!proyecto){
          const error = new Error('No hay Proyectos !');
          return  res.status(404).json({message : error.message});
        }
        if(proyecto.creador.toString() !== req.usuario._id.toString() && !proyecto.colaboradores.some(colaborador => colaborador._id.toString()=== req.usuario._id.toString())){

           return  res.status(401).json({message : "Accion no valida"});  
        }
        
      
         res.status(200).json(proyecto);
     
     }


const editarProyecto = async(req,res)=>{
    const {id} = req.params;
    const proyecto = await Proyecto.findById(id);
    if(!proyecto){
        const error = new Error("No encontrado");
        res.status(404).json({message : error.message});
    }
     if(proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("Accion no valida");
        res.status(403).json({message : error.message});
     }
      try{
        const proyectoModificado = await Proyecto.findByIdAndUpdate(id,req.body,{new : true});
        res.status(201).json(proyectoModificado);
      }catch(error){
          console.log(error);
      }
}

const eliminarProyecto = async(req,res)=>{
   const {id} = req.params;
   const proyecto = await Proyecto.findById(id);
   if(!proyecto){
    const error = new Error("No encontrado");
    res.status(404).json({message : error.message});
   }

   if(proyecto.creador.toString()!== req.usuario._id.toString()){
    const error = new Error("Accion no valida");
    res.status(403).json({message : error.message});
   }
   try {
       await proyecto.deleteOne();
        res.status(201).json({message : "Proyecto Eliminado "});
   }catch(error){
       console.log(error);
   }
}

const buscarColaborador = async (req,res)=>{
     const {email} = req.body;
     const usuario = await Usuario.findOne({email}).select('-password -createdAt -confirmado -token -updatedAt -__v ');
    
     if(!usuario) {
         const error = new Error('Usuario no encontrado');
         return res.status(404).json({message : error.message})
     }
     res.status(200).json(usuario);


}

const agregarColaborador = async(req,res)=>{
    const proyecto = await Proyecto.findById(req.params.id);
     
    console.log("esteeeeeeeeeeeee",proyecto);

     if(!proyecto) {
         const error = new Error('Proyecto no Encontrado');
         return res.status(404).json({message : error.message});
     }

     if(proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Accion no valida');
        return res.status(404).json({message : error.message});
     }

     const {email} = req.body;
     const usuario = await Usuario.findOne({email}).select(
         "-confirmado -createdAt -password -token -updatedAt"
     );

     if(!usuario) {
         const error = new Error("Usuario no encontrado");
         return res.status(404).json({message : error.message});
     }

     if(proyecto.creador.toString() === usuario._id.toString()){
        const error = new Error("El creador del proyecto no puede ser Colaborador");
        return res.status(404).json({message : error.message});
     }
     


     if(proyecto.colaboradores.includes(usuario._id)) {
        const error = new Error("El Usuario ya pertenece a este Proyecto");
        return res.status(404).json({message : error.message});
     }

    proyecto.colaboradores.push(usuario._id);
    await proyecto.save();
    return  res.status(200).json({message : 'Colaborador Agregado Correctamente'});   
}


const eliminarColaborador = async (req,res)=>{
    const proyecto = await Proyecto.findById(req.params.id);
     
    

     if(!proyecto) {
         const error = new Error('Proyecto no Encontrado');
         return res.status(404).json({message : error.message});
     }

     if(proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('Accion no valida');
        return res.status(404).json({message : error.message});
     }


    proyecto.colaboradores.pull(req.body.id);
    await proyecto.save();
    return  res.status(200).json({message : 'Colaborador Eliminado Correctamente'});   
}






export {
    obtenerProyectos,
    obtenerProyecto,
    eliminarColaborador,
    editarProyecto,
    nuevoProyecto,
    agregarColaborador,
    eliminarProyecto,
    buscarColaborador

  
    
}