import jwt from "jsonwebtoken";
import { ROLES_ADMINISTRADOR, ROLES_USUARIO } from "../middleware/auth.middleware.js";
import Administrador from "../models/Administrador.js";
import Usuario from "../models/Usuario.js";
import bcrypt from "bcrypt";

const generateTokens = (user, type) => {
    //recordar los token deben ir sin comillas para pruebas
    const accessToken = jwt.sign(
        { id: user.id, rol: user.rol, type: type },
        process.env.JWT_SECRET,
        { expiresIn: "30m" }
    );
    const refreshToken = jwt.sign(
        { id: user.id, rol: user.rol, type: type },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    );
    return { accessToken, refreshToken };
};

export const register = async (req, res, next) => {
    const roles = [ROLES_ADMINISTRADOR.ADMIN, ROLES_ADMINISTRADOR.FULL_ADMIN, ROLES_USUARIO.BRONCE, ROLES_USUARIO.PLATA, ROLES_USUARIO.PLATA];
    let nuevoAdmin;
    let nuevoUsuario;
    try {
        const { nombre, apellido, email, contrasena, rol } = req.body;

        if (rol === ROLES_ADMINISTRADOR.ADMIN || rol === ROLES_ADMINISTRADOR.FULL_ADMIN) {
            nuevoAdmin = await Administrador.create({
                nombre,
                apellido,
                email,
                contrasena,
                rol
            })
        }

        if (rol === ROLES_USUARIO.BRONCE || rol === ROLES_USUARIO.PLATA || rol === ROLES_USUARIO.ORO) {
            nuevoUsuario = await Usuario.create({
                nombre,
                apellido,
                email,
                contrasena,
                rol
            });
        }

        if (!rol || !roles.includes(rol)) {
            return res.status(404).json({
                success: false,
                error: "Rol no definido en la base de datos",
                message: "Rol no valido"
            })
        }
        res.status(201).json({
            success: true,
            message: `${nuevoAdmin === undefined ? "Usuario" : "Administrador"} registrado exitosamente`,
            data: {
                id: nuevoUsuario ? nuevoUsuario.id : nuevoAdmin?.id,
                email: nuevoUsuario ? nuevoUsuario.email : nuevoAdmin?.email
            }
            /**
             * Otra forma de verificar. Mas moderna.
             * data:   {
                        id: nuevoUsuario?.id ?? nuevoAdmin?.id,
                        email: nuevoUsuario?.email ?? nuevoAdmin?.email
                        }
             */
        });
    } catch (error) {
        next(error)
    }

}
export const signin = async (req, res, next) => {
    try {
        let tokens;

        const { email, contrasena } = req.body;

        const usuario = await Usuario.scope('activos', 'withPassword').findOne({
            where: { email },
        });
        const administrador = await Administrador.scope('activos', 'withPassword').findOne({
            where: { email },
        })

        //console.log("usuario: ", usuario)
        //console.log("Admin: ", administrador)

        if (!usuario && !administrador) {
            return res
                .status(401)
                .json({ success: false, message: "Credenciales incorrectas" });
        }

        if (usuario) {
            const isMatch = await bcrypt.compare(contrasena, usuario.contrasena);
            if (!isMatch) {
                return res
                    .status(401)
                    .json({ success: false, message: "Credenciales incorrectas" });
            } else {
                tokens = generateTokens(usuario, 'usuario')
            }
        }

        if (administrador) {
            //console.log("Del body: ", contrasena);
            //console.log("de la DB: ", administrador.contrasena)

            const isMatch = await bcrypt.compare(contrasena, administrador.contrasena);
            if (!isMatch) {
                return res
                    .status(401)
                    .json({ success: false, message: "Credenciales incorrectas" });
            } else {
                tokens = generateTokens(administrador, 'administrador')
            }
        }

        res.json({
            success: true,
            message: "Inicio de sesión exitoso",
            data: tokens,
        });
    } catch (error) {
        next(error)
    }
}

export const refreshTokenAdmin = async (req, res, next) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "Token de refresco no proporcionado",
                });
        }
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const administrador = await Administrador.findByPk(decoded.id);

        if (!administrador) {
            return res
                .status(401)
                .json({ success: false, message: "Administrador no encontrado" });
        }

        const tokens = generateTokens(administrador, 'administrador');
        res.json({
            success: true,
            message: "Token refrescado exitosamente",
            data: tokens,
        });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res
                .status(401)
                .json({ success: false, message: "Token de refresco inválido" });
        }
        next(error)
    }
}
export const refreshTokenUser = async (req, res, next) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "Token de refresco no proporcionado",
                });
        }
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const usuario = await Usuario.findByPk(decoded.id);

        if (!usuario) {
            return res
                .status(401)
                .json({ success: false, message: "Usuario no encontrado" });
        }

        const tokens = generateTokens(usuario, 'usuario');
        res.json({
            success: true,
            message: "Token refrescado exitosamente",
            data: tokens,
        });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res
                .status(401)
                .json({ success: false, message: "Token de refresco inválido" });
        }
        next(error)
    }
}


