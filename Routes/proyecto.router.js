import express, { Router } from 'express';
import {  obtenerProyectos,
    obtenerProyecto,
    eliminarColaborador,
    editarProyecto,
    nuevoProyecto,
    agregarColaborador,
    eliminarProyecto,
    buscarColaborador
 
} from '../controllers/proyectoController.js';

import checkAuth from '../middlewares/checkAuth.js';


const router = express.Router();

router.route("/")
      .get(checkAuth,obtenerProyectos)
      .post(checkAuth,nuevoProyecto);

router.route('/:id')
      .get(checkAuth,obtenerProyecto)
      .put(checkAuth,editarProyecto)
      .delete(checkAuth,eliminarProyecto);

router.post('/colaboradores',checkAuth,buscarColaborador)
router.post('/colaboradores/:id',checkAuth,agregarColaborador)
router.post('/eliminar-colaborador/:id',checkAuth,eliminarColaborador);
export default router;
