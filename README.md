# InscripcionesIcoApi

API de inscripciones para el sistema de Ico, construida con Node.js, Express y Sequelize sobre MariaDB.

## Descripción

Esta API permite gestionar:
- Alumnos
- Administradores
- Materias
- Grupos
- Profesores
- Horarios
- Historial académico
- Asignaciones de grupo-materia
- Inscripciones

Además, soporta inicio de sesión para alumnos mediante `POST /alumnos/login`.

## Tecnologías

- Node.js
- Express
- Sequelize
- MariaDB
- dotenv
- bcrypt
- jsonwebtoken
- cors
- nodemon

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/Ignacio-RA/InscripcionesIcoApi.git
   cd InscripcionesIcoApi
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Crear un archivo `.env` en la raíz del proyecto con las variables de conexión a la base de datos:
   ```env
   BD_NOMBRE=nombre_base_de_datos
   BD_USUARIO=usuario
   BD_CLAVE=contraseña
   BD_DIALEC=mariadb
   BD_HOST=localhost
   BD_PORT=3306
   ```

4. Iniciar el servidor:
   ```bash
   npm run server
   ```

El servidor se ejecuta en `http://localhost:3800`.

## CORS

El proyecto habilita CORS solo para `http://localhost:4173`.

## Rutas principales

### Ruta base

- `GET /inicio`

### Administradores

- `POST /administrador` - Registrar administrador
- `GET /administrador` - Obtener todos los administradores

### Alumnos

- `GET /alumnos/inicio`
- `POST /alumnos` - Registrar alumno
- `GET /alumnos` - Obtener todos los alumnos
- `GET /alumnos/:id` - Obtener alumno por ID
- `PATCH /alumnos/:id` - Actualizar alumno por ID
- `DELETE /alumnos/:id` - Eliminar alumno por ID
- `POST /alumnos/login` - Iniciar sesión de alumno

### Materias

- `GET /materias/inicio`
- `POST /materias` - Registrar materia
- `GET /materias` - Obtener todas las materias
- `GET /materias/:id` - Obtener materia por ID
- `PATCH /materias/:id` - Actualizar materia por ID
- `DELETE /materias/:id` - Eliminar materia por ID

### Grupos

- `GET /grupos/inicio`
- `POST /grupos` - Registrar grupo
- `GET /grupos` - Obtener todos los grupos
- `GET /grupos/:id` - Obtener grupo por ID
- `PATCH /grupos/:id` - Actualizar grupo por ID
- `DELETE /grupos/:id` - Eliminar grupo por ID

### Profesores

- `GET /profesores/inicio`
- `POST /profesores` - Registrar profesor
- `GET /profesores` - Obtener todos los profesores
- `GET /profesores/:id` - Obtener profesor por ID
- `PATCH /profesores/:id` - Actualizar profesor por ID
- `DELETE /profesores/:id` - Eliminar profesor por ID

### Horarios

- `GET /horarios/inicio`
- `POST /horarios` - Registrar horario
- `GET /horarios` - Obtener todos los horarios
- `GET /horarios/:id` - Obtener horario por ID
- `PATCH /horarios/:id` - Actualizar horario por ID
- `DELETE /horarios/:id` - Eliminar horario por ID

### Historial académico

- `GET /historial-academico/inicio`
- `POST /historial-academico` - Registrar historial
- `GET /historial-academico` - Obtener todos los historiales
- `GET /historial-academico/:id` - Obtener historial por ID
- `PATCH /historial-academico/:id` - Actualizar historial por ID
- `DELETE /historial-academico/:id` - Eliminar historial por ID

### Grupo-Materia

- `GET /grupo-materia/inicio`
- `POST /grupo-materia` - Registrar asignación grupo-materia
- `GET /grupo-materia` - Obtener todas las asignaciones
- `GET /grupo-materia/:id` - Obtener asignación por ID
- `PATCH /grupo-materia/:id` - Actualizar asignación por ID
- `DELETE /grupo-materia/:id` - Eliminar asignación por ID

### Inscripciones

- `GET /inscripciones/inicio`
- `POST /inscripciones` - Registrar inscripción
- `GET /inscripciones` - Obtener todas las inscripciones
- `GET /inscripciones/:id` - Obtener inscripción por ID
- `PATCH /inscripciones/:id` - Actualizar inscripción por ID
- `DELETE /inscripciones/:id` - Eliminar inscripción por ID

## Notas

- El proyecto usa Sequelize para la conexión a MariaDB.
- Las tablas se sincronizan automáticamente al iniciar el servidor.
- Revisa los controladores y modelos para ajustar la lógica de negocio o los campos disponibles.
