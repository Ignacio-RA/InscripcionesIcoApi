import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Alumno = db.define('alumno', {
    id_alumno: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nmo_cuenta: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ap_paterno: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ap_materno: {
        type: DataTypes.STRING,
        allowNull: true
    },
    correo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    generacion: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    semestre: {
        type: DataTypes.ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10'),
        allowNull: false
    },
    turno: {
        type: DataTypes.ENUM('M', 'V'),
        allowNull: false
    },
    f_nacimiento: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    edo_pago: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue : false

    }
}, {
    tableName: 'alumno',
    freezeTableName: true,
    timestamps: false
});

export default Alumno;