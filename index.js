import express from "express"
import router from "./routes/inicio_router.js"
import db from "./config/db.js"
//Crear la aplicación
const app = express()

//accesos a los datos del formulario
app.use(express.urlencoded({extended:true}))
app.use(express.json());

//Conexión a la base de datos
try {
  await db.authenticate();
  db.sync()
  console.log("Conexion exitosa a la base de datos");
} catch (error) {
  console.log(error);
}

//routing
app.use("/", router)

//definiendo el puerto
const port = 4800 
app.listen(port,()=> {
    console.log(`Esperando peticiones en el puerto ${port}`)
})
