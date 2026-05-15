import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Grupo = db.define('grupo', {
    id_grupo: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre_grupo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    turno: {
        type: DataTypes.ENUM('M', 'V'),
        allowNull: false
    },
    semestre: {
        type: DataTypes.ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10'),
        allowNull: false
    }
}, {
    tableName: 'grupo',
    freezeTableName: true,
    timestamps: false
});

export default Grupo;