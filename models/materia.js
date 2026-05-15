import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Materia = db.define('materia', {
    id_materia: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    cve_materia: {
        type: DataTypes.INTEGER, 
        allowNull: false,
        unique : true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    semestre: {
        type: DataTypes.ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10'),
        allowNull: false
    },
    creditos: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tipo: {
        type: DataTypes.ENUM('Obligatoria', 'Optativa'), 
        allowNull: false
    },
    laboratorio: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue : false
    }
}, {
    tableName: 'materia',
    freezeTableName: true,
    timestamps: false
});

export default Materia;