import {DataTypes} from 'sequelize'
import bcrypt from 'bcrypt'
import db from '../config/db.js'

const Administrador= db.define('administrador',{
    id_admin: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
    nombre:{
        type:DataTypes.STRING,
        allowNull:false
    },
    correo:{
        type:DataTypes.STRING,
        allowNull:false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    fecha_registro:{
        type:DataTypes.DATE,
        allowNull:false,
        defaultValue: DataTypes.NOW
    },
},{
    tableName: 'administrador',
    freezeTableName:true,
    timestamps: false,
    hooks:{
        beforeCreate:async function(administrador){
            const rep=await bcrypt.genSalt(10)
            administrador.password=await bcrypt.hash(administrador.password,rep)
        }
    }
})

Administrador.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

export default Administrador