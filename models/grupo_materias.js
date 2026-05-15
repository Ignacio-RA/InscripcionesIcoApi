import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Grupo_Materia = db.define('grupo_materia', {
    id_gpo_materia: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_grupo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_materia: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_horario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_profesor: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'grupo_materia',
    freezeTableName: true,
    timestamps: false
});
export default Grupo_Materia;
