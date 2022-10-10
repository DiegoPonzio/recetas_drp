const express = require('express');
const { conforms, result } = require('lodash');
const lodash = require('lodash')
const mysql = require('mysql2');
const { PORT } = require('./config');


const app = express();

let con = mysql.createConnection({
    host: 'containers-us-west-93.railway.app',
    user: 'root',
    database: 'railway',
    password: 'dxttLUbPaEbvOe1PNDzw',
    port: '5469'
});

con.connect(err =>{
    if(err){
       console.log(err);
    }else{
        console.log('Se conecto <3');
    } 
});

app.set('views', './views');
app.set("view engine", "pug");
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res)=>{
    res.render('inicio',{
        title : 'Home' 
    });
});

app.get('/Recetario', (req, res)=>{
    const querry = 'select * from Receta'

    con.query(querry, (err, result)=>{
        if(err){
            console.log(err);
            res.render('plantilla',{
                title : 'Recetario',
                recetas: err
            });
        } else {
            res.render('plantilla',{
                title : 'Recetario',
                recetas: result
            });
        }    
    })

});

app.get('/Crear-Receta', (req, res) =>{
    res.render('crearReceta', {
        title: 'Crear Receta'
    })
});

app.post('/Subir-Receta', (req, res) =>{
    let {nom_rec} = req.body;
    let {desc_rec} = req.body;
    let {url_rec} = req.body;
    const querry = `insert into Receta (rec_nom,rec_desc, rec_img)values ("${nom_rec}", "${desc_rec}", "${url_rec}")`
    con.query(querry, (err, result) =>{
        if(err){
            res.render('negado',{
                title: 'Negado',
                desc: result,
                tipo: 'Crear'
            })
        } else {
            res.render('aceptado',{
                title: 'Aceptado',
                desc: result,
                tipo: 'Crear'
            })
        }
    })
});


app.get('/Eliminar-Receta', (req, res) =>{
    let {id_rec}  = req.query;
    const query = `DELETE FROM Receta WHERE rec_id = ${id_rec}`;
    con.query(query, (err, result) =>{
        if(err){
            res.render('negado',{
                title: 'Negado',
                desc: result,
                tipo: 'Eliminar'
            })
        } else {
            res.render('aceptado',{
                title: 'Aceptado',
                desc: result,
                tipo: 'Eliminar'
            })
        }
    })
})

app.get('/Editar-Receta', (req, res) =>{
    let {id_rec} = req.query;
    const query = `select * from Receta where rec_id=${id_rec}`
    con.query(query, (err, result)=>{
        if(err){
            res.render('negado', {
                title: 'Negado',
                tipo: 'Valor no encontrado 😿'
            })
        } else {
            if(result.length > 0){
                result.map(rec =>{
                    res.render('editarReceta',{
                        title: 'Editar',
                        id_rec: rec.rec_id,
                        nom_rec: rec.rec_nom,
                        desc_rec: rec.rec_desc,
                        url_rec: rec.rec_img
                    })
                })
            } else{
                res.render('negado', {
                    title: 'Negado',
                    tipo: 'Valor no encontrado 😿'
                })
            }
        }
    })

})

app.post('/Editar-Receta', (req, res) =>{
    let {nom_rec} = req.body;
    let {desc_rec} = req.body;
    let {url_rec} = req.body;
    let {id_rec}  = req.body;
    const query = `update Receta set rec_nom='${nom_rec}', rec_desc='${desc_rec}', rec_img= '${url_rec}' where rec_id=${id_rec}`;
    con.query(query, (err, result) =>{
        if(err){
            res.render('negado',{
                title: 'Negado',
                desc: result,
                tipo: 'Editar'
            })
        } else{
            res.render('aceptado',{
                title: 'Aceptado',
                desc: result,
                tipo: 'Editar'
            })
        }
    })
});

app.listen(PORT, ()=>{
    console.log(`corriendo en el puerto ${PORT}`);
})