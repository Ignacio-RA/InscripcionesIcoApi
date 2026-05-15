import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Inscripcion = db.define('inscripcion', {
    id_inscripcion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_gpo_materia: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_alumno: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha_inscripcion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'inscripcion',
    freezeTableName: true,
    timestamps: false
});
export default Inscripcion;
