const Router = require('express');
const router = Router.Router();
const path = require('path');

const interprete = require('../Analizador/interprete');
const tree = require('../Analizador/arbol');
const traduccion = require('../Analizador/traduccion');


var parserOutput = null;




router.post('/analizar', function(req, res, next) {
    let bufferOne = req.body;
    let data = bufferOne.toString('utf8');
    
    let out = interprete.analizar(data);

    parserOutput = out.payload;

    let response = {}

    if(out.status == 200) {
        response = {
            status: 200, 
            message: 'Entrada analizada con exito.'
        }
    } else if(out.status == 500){
        response = {
            status: 500, 
            message: 'Se enontraron errores durante el analisis',
        }
    } else {
        console.log(out.status);

        response = {
            status: 503, 
            message: 'Se encontraron errores criticos. El analizador fue incapaz de recuperarse'
        }
    }    

    res.send(response);
    // next();
});

router.get('/tokens', function(req, res, next){
    if (parserOutput != null) {        
        res.json(parserOutput.ttokens);
    } else {
        res.json({message: 'sin tabla de tokens', status:500});
    }
    
    next();
});

router.get('/errores', function(req, res, next){
    if(parserOutput != null) {
        res.json(parserOutput.terrores);
    } else {
        res.json({message: 'sin tabla de errores', status:500});
    }

    // next();
});

router.get('/grafo', function(req, res, next){
    if(parserOutput.arbol != undefined) {
        arbol = new tree.arbol(parserOutput.arbol);
        arbol.graficar();
        res.sendFile(path.resolve('Recursos/arbol.pdf'));
    } else {
        res.json({status: 500, message: 'No se puede graficar'});
    }

    // next();
});

router.get('/traduccion', function(req, res, next){
    if(parserOutput.arbol != undefined) {
        t = new traduccion.traductor(parserOutput.arbol);
        t.traducir();
        res.sendFile(path.resolve('Recursos/traduccionJs.js'));
    } else {
        res.json({status: 500, message: 'Imposible traducir'});
    }

    // next();
});

module.exports.router = router;