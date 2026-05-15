import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Profesor = db.define('profesor', {
    id_profesor: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
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
        allowNull: false
    }
}, {
    tableName: 'profesor',
    freezeTableName: true,
    timestamps: false
});

export default Profesor;