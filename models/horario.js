import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Horario = db.define('horario', {
    id_horario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    lunes: { type: DataTypes.BOOLEAN, allowNull: false },
    martes: { type: DataTypes.BOOLEAN, allowNull: false },
    miercoles: { type: DataTypes.BOOLEAN, allowNull: false },
    jueves: { type: DataTypes.BOOLEAN, allowNull: false },
    viernes: { type: DataTypes.BOOLEAN, allowNull: false },
    sabado: { type: DataTypes.BOOLEAN, allowNull: false },
    hra_inicio: {
        type: DataTypes.TIME,
        allowNull: false
    },
    hra_fin: {
        type: DataTypes.TIME,
        allowNull: false
    },
    salon: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cupo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    modalidad: {
        type: DataTypes.ENUM ('Presencial','En linea'),
        allowNull: false
    }
}, {
    tableName: 'horario',
    freezeTableName: true,
    timestamps: false
});

export default Horario;