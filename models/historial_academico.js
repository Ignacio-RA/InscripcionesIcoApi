import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Historial_Academico = db.define('historial_academico', {
    id_historial: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_alumno: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_materia: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    calificacion: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    periodo: {
        type: DataTypes.STRING,
        allowNull: false
    }
    },{
        tableName: 'historial_academico',
        freezeTableName: true,
        timestamps: false

    });
    export default Historial_Academico;
    