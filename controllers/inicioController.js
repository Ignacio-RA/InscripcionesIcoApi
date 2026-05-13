const inicio=(req,res)=>{
    res.json({
        msg: "Hola",
        status:"200", 
        descripcion: "Bienvenido Api De Inscrpciones de ICO"
    })
}

export {inicio}