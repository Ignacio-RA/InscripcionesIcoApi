import Alumno from "./alumno.js";
import Administrador from "./administrador.js";
import Grupo from "./grupo.js";
import Horario from "./horario.js";
import Grupo_Materia from "./grupo_materias.js";
import Profesor from "./profesor.js";
import Materia from "./materia.js";
import Inscripcion from "./inscripcion.js";
import Historial_Academico from "./historial_academico.js";

// --- Relacion entre Alumno y Historial_Academico ---
// Un Alumno tiene muchas Historial_Academico 
Alumno.hasMany(Historial_Academico, {
    foreignKey: 'id_alumno',
    sourceKey: 'id_alumno'
});

// Un Historial_Academico tiene un Alumno
Historial_Academico.belongsTo(Alumno, {
    foreignKey: 'id_alumno',
    targetKey: 'id_alumno'
});


// --- Relacion entre Materia e Historial_Academico ---
// Una Materia tiene muchas Historial_Academico
Materia.hasMany(Historial_Academico, {
    foreignKey: 'id_materia',
    sourceKey: 'id_materia'
});

// Un Historial_Academico tiene una Materia
Historial_Academico.belongsTo(Materia, {
    foreignKey: 'id_materia',
    targetKey: 'id_materia'
});


// --- Relacion entre Alumno e Inscripcion ---
// Un Alumno tiene muchas Inscripcion
Alumno.hasMany(Inscripcion, {
    foreignKey: 'id_alumno',
    sourceKey: 'id_alumno'
});

// Una Inscripcion tiene un Alumno
Inscripcion.belongsTo(Alumno, {
    foreignKey: 'id_alumno',
    targetKey: 'id_alumno'
});


// --- Relacion entre Grupo_Materia e Inscripcion ---
// Un Grupo_Materia tiene muchas Inscripcion 
Grupo_Materia.hasMany(Inscripcion, {
    foreignKey: 'id_gpo_materia', // Ajustado a tu diagrama
    sourceKey: 'id_gpo_materia'
});

// Una Inscripcion pertenece a un Grupo_Materia
Inscripcion.belongsTo(Grupo_Materia, {
    foreignKey: 'id_gpo_materia',
    targetKey: 'id_gpo_materia'
});


// --- Relacion entre Grupo_Materia y Horarios ---
// Un Horario puede tener muchos Grupo_Materia 
Horario.hasMany(Grupo_Materia, {
    foreignKey: 'id_horario',
    sourceKey: 'id_horario'
});

// Grupo_Materia pertenece a un Horario
Grupo_Materia.belongsTo(Horario, {
    foreignKey: 'id_horario',
    targetKey: 'id_horario'
});


// --- Relacion entre Materia y Grupo_Materia ---
// Materia puede tener muchos Grupo_Materia 
Materia.hasMany(Grupo_Materia, {
    foreignKey: 'id_materia',
    sourceKey: 'id_materia'
});

// Grupo_Materia pertenece a una Materia
Grupo_Materia.belongsTo(Materia, {
    foreignKey: 'id_materia',
    targetKey: 'id_materia'
});


// --- Relacion entre Grupo y Grupo_Materia ---
// Grupo puede tener muchos Grupo_Materia 
Grupo.hasMany(Grupo_Materia, {
    foreignKey: 'id_grupo',
    sourceKey: 'id_grupo'
});

// Grupo_Materia pertenece a un Grupo
Grupo_Materia.belongsTo(Grupo, {
    foreignKey: 'id_grupo',
    targetKey: 'id_grupo'
});


// --- Relacion entre Profesor y Grupo_Materia ---
// Un Profesor tiene muchos Grupo_Materia
Profesor.hasMany(Grupo_Materia, {
    foreignKey: 'id_profesor',
    sourceKey: 'id_profesor'
});

// Un Grupo_Materia pertenece a un Profesor
Grupo_Materia.belongsTo(Profesor, {
    foreignKey: 'id_profesor',
    targetKey: 'id_profesor'
});

export {
    Alumno,
    Administrador,
    Grupo,
    Horario,
    Grupo_Materia,
    Profesor,
    Inscripcion,
    Materia,
    Historial_Academico
};