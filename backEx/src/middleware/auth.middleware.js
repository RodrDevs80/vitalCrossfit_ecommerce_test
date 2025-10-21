import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';
import Administrador from '../models/administrador.js';
import dotenv from "dotenv";

dotenv.config();


// Enums para roles
export const ROLES_USUARIO = {
    BRONCE: 'bronce',
    PLATA: 'plata',
    ORO: 'oro'
};

export const ROLES_ADMINISTRADOR = {
    ADMIN: 'admin',
    FULL_ADMIN: 'fulladmin'
};

export const protect = async (req, res, next) => {
    let token;

    // Formato esperado: "Bearer ADSFGSERFGDFGHDF2346545674sdSDFGSDFG"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {

            // Obtener token del header
            token = req.headers.authorization.split(' ')[1];

            // Verificar el token
            //console.log("Token: ", token);
            //console.log("process: ", process.env.JWT_SECRET);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            //console.log("decoded", decoded);

            let userEntity = null;
            let userType = null;

            // Determinar si es usuario o administrador basado en el tipo en el token
            if (decoded.type === 'usuario') {
                userEntity = await Usuario.findByPk(decoded.id, {
                    attributes: { exclude: ['password'] }
                });
                userType = 'usuario';
            } else if (decoded.type === 'administrador') {
                userEntity = await Administrador.findByPk(decoded.id, {
                    attributes: { exclude: ['password'] }
                });
                userType = 'administrador';
            }

            if (!userEntity) {
                return res.status(401).json({
                    success: false,
                    message: `${userType} no encontrado`
                });
            }

            // Adjuntar la entidad y tipo al request
            req.user = userEntity;
            req.userType = userType;

            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token expirado'
                });
            }
            console.error(error);
            return res.status(401).json({
                success: false,
                message: 'No autorizado, token inválido'
            });
        }
    } else {
        return res.status(401).json({
            success: false,
            message: 'No autorizado, no hay token'
        });
    }
};

// Middleware para autorizar solo usuarios con roles específicos
export const authorizeUsuario = (...roles) => {
    return (req, res, next) => {
        if (!req.user || req.userType !== 'usuario') {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado. Se requiere ser usuario'
            });
        }

        if (!roles.includes(req.user.rol)) {
            return res.status(403).json({
                success: false,
                message: 'No tienes el nivel de usuario requerido para esta acción'
            });
        }

        next();
    };
};

// Middleware para autorizar solo administradores con roles específicos
export const authorizeAdministrador = (...roles) => {
    return (req, res, next) => {
        if (!req.user || req.userType !== 'administrador') {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado. Se requieren privilegios de administrador'
            });
        }

        if (!roles.includes(req.user.rol)) {
            return res.status(403).json({
                success: false,
                message: 'No tienes el nivel de administrador requerido para esta acción'
            });
        }

        next();
    };
};



export default {
    protect,
    authorizeUsuario,
    authorizeAdministrador,
    ROLES_USUARIO,
    ROLES_ADMINISTRADOR
};