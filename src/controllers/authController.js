const pool = require('../config/db');
const bcrypt= require('bcryptjs');

const jwt= require('jsonwebtoken');

const registrar= async(req, res)=>{
    const {email, password}= req.body;
    try{
        const userExists= await pool.query('SELECT * from usuarios where email=$1', [email]);
        if(userExists.rows.length>0){
            res.status(400).json({mensaje: 'El usuario ya existe'});
        }
        
        const salt= await bcrypt.genSalt(10);
        const passwordHash= await bcrypt.hash(password, salt);
        const newUser= await pool.query(
            'insert into usuarios (email, password) values ($1, $2)',
            [email, passwordHash]
        );
        res.status(201).json({mensaje: 'Usuario creado con exito', usuario: newUser.rows[0]});

    }catch(error){
        console.log(error);
        res.status(500).json({mensaje: `Error: ${error}`});
    }
}



const login= async(req, res)=>{
    const {email, password}= req.body;
    try{
        const result= await pool.query('SELECT * from usuarios where email=$1', [email]);
        if(result.rows.length===0){
            return res.status(404).json({mensaje: 'Email invalido'});
        }
        const usuario= result.rows[0];

        const isMatch= await bcrypt.compare(password, usuario.password);
        if(!isMatch){
            return res.status(400).json({mensaje:'Contraseña incorrecta'});
        }
        const payload={
            id:usuario.id,
            rol: usuario.rol,
            email: usuario.email
        };
        const token= jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );
        res.json({
            mensaje: 'Bienvenido',
            token: token
        });
    }catch(error){
        console.log(error);
        res.status(500).json({mensaje: `Error: ${error}`});
    }
}
module.exports= {registrar, login}