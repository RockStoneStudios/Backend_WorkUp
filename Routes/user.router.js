import { Router } from "express";
import { registrar,
         login,
         confirmar,
         olvidePassword,
         comprobarToken ,
         nuevoPassword,
         perfil
        } from "../controllers/usuarioController.js";

 import checkAuth from "../middlewares/checkAuth.js";

const router = Router();

//Autenticacion ,Registro y Confirmacion de Usuario
router.post('/registrar',registrar);
router.get('/confirmar/:token',confirmar);
router.post('/login',login);
router.post('/olvide-password',olvidePassword);
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);


router.get('/perfil',checkAuth,perfil);

export default router;