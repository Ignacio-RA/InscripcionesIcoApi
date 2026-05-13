import express from "express"
import router from "./routes/inicio_router.js"

//Crear la aplicación
const app = express()

//accesos a los datos del formulario
app.use(express.urlencoded({extended:true}))
app.use(express.json());

//routing
app.use("/", router)

//definiendo el puerto
const port = 4800 
app.listen(port,()=> {
    console.log(`Esperando peticiones en el puerto ${port}`)
})
