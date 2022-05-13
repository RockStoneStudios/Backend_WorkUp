import mongoose from 'mongoose';
const {Schema,model} = mongoose;


const tareaSchema = new Schema({
    nombre: {
        type :String,
        trim : true,
        required :true
    },
    descripcion : {
        type : String,
        trim : true,
        required :true 
    },
    estado :{
        type : Boolean,
        default : true
    },
    fechaEntrega : {
        type :Date,
        required : true,
        default : Date.now()
    },
    prioridad : {
        type : String,
        required : true,
        enum : ['Baja', 'Media' , 'Alta']
    },
    proyecto : {
        type : Schema.Types.ObjectId,
        ref : 'Proyecto'
    },
    completado : {
        type : Schema.Types.ObjectId,
        ref : 'Usuario'
    }
},{
    timestamps : true
});



export default model('Tarea',tareaSchema);