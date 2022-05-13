import mongoose from "mongoose";
import bcryp from 'bcrypt';
const {model,Schema} = mongoose;

const usuarioSchema = new Schema({
    nombre :{
        type : String,
        required : true,
        trim :true
    },
    password : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type: String,
        required : true,
        trim : true,
         unique : true
    },
    token : {
        type : String
    },
    confirmado : {
        type : Boolean,
        default : false
    }

},{
    timestamps : true
});

usuarioSchema.pre('save',async function(next){
    if(!this.isModified("password")){
        next();
    }
    const salt = await bcryp.genSalt(10);
    this.password = await bcryp.hash(this.password,salt);
});

usuarioSchema.methods.comprobarPassword = async function(passwordForm){
    return await bcryp.compare(passwordForm,this.password)
}

export default model("Usuario",usuarioSchema);