const fs = require('fs');
const path = require('path');
const beautify = require('js-beautify').js

class Traductor{
    constructor(raiz) {
        this.raiz = {...raiz};
        this.buffer = [];
        this.tab = 0;
        this.interface_flag = false;
    }

    traducir(){
        this.traducir_(this.raiz);

        try {
            // console.log();
            fs.writeFileSync(path.resolve('Recursos/traduccion.py'),beautify(this.printList(), { indent_size: 2, space_in_empty_paren: true }), function(err){
                if(err) return console.log(err);
            } );
        } catch (error) {
            console.log(error);
        }
    }

    printList() {
        let temp = '';
        for(let i = 0; i < this.buffer.length; i++){
            console.log(this.buffer[i]);
            temp += this.buffer[i];
        }

        return temp;
    }

    traducir_(raiz){
        if(raiz === undefined) return;

        switch (raiz.etiqueta.toLowerCase()){
            case 's':
                this.traducir_(raiz.hijos[0]);
                break;
            case 'ini':
                this.traducir_(raiz.hijos[0]);
                break;
            case 'inir':
                this.traducir_(raiz.hijos[0]);
                break;
            case 'clase':
                this.clase_handler(raiz);
                break;
        }

    }

    clase_handler(raiz){
        if(raiz === undefined) return;

        switch (raiz.etiqueta.toLowerCase()) {
            case 'clase':
                for(let i = 0; i < raiz.hijos.length; i++){
                    this.clase_handler(raiz.hijos[i]);
                }
                this.tab = 0;
                break;
            case 't_class':
                if(raiz.nombre == 'tk_interface') {
                    // llamar al manejador de interfaces.
                    this.interface_flag = true;
                } else  {
                    //clase normal
                    this.interface_flag = false;
                }
                this.writeText('class ' + raiz.valor + ':\n');
                this.tab++;
                break;
            case 'l_cuerpo_clase':
                this.llamar_nodos(raiz, this.clase_handler);
                break;
            case 'l_cuerpo_clase_r':
                this.llamar_nodos(raiz, this.clase_handler);
                break;
            case 'cuerpo_clase':
                //ahora si llamo a el controlador del cuerpo
                this.llamar_nodos(raiz, this.clase_handler);
                break;
            case 'declaracion':
                //declaracion handler
                console.log('Detectando una declaracion');
                this.declaracion_handler(raiz);
                break;
            case 'metodo':
                // metodo handler
                console.log('Detectando un metodo');
                this.metodo_handler(raiz);
                break;
        }
    }

    declaracion_handler(raiz){
        if(raiz === undefined) return;


    }

    metodo_handler(raiz){
        if(raiz === undefined) return;

        switch (raiz.etiqueta.toLowerCase()){
            case 'st':
                if(raiz.valor != '') {
                    this.writeText('@staticmethod\n');
                }
                break;
            case 'name':
                this.writeText('def ' + raiz.valor);
                break;
            case 'parametros':
                if(raiz.hijos.length > 0){
                    this.writeText('(');
                    this.parametros_handler(raiz);
                    this.writeText('):\n');
                } else {
                    this.writeText('():\n');
                }
                break;
            case 'op_metodo':
                if(raiz.hijos.length > 0 ){
                    // aqui estan las instrucciones.
                } else {
                    if(this.interface_flag) {

                    }
                }
                break;
        }
    }

    parametros_handler(raiz){
        if(raiz === undefined) return;

        switch (raiz.etiqueta.toLowerCase()){
            case 'parametros':
                this.parametros_handler(raiz.hijos[0]);
                this.writeText(' , ');
                this.parametros_handler(raiz.hijos[1]);
                break;
            case 'parametro':
                this.writeText(raiz.valor);
                break;
            case 'parametrosr':
                this.parametros_handler(raiz.hijos[0]);
                break;
        }
    }

    llamar_nodos(raiz, funcion) {
        if(raiz === undefined) return;

        for(let i = 0; i < raiz.hijos.length; i++ ){
            funcion(raiz.hijos[i]);
        }
    }

    writeText(text){
        let tabs = '';
        for(let i = 0; i < this.tab; i++){
            tabs += '\t';
        }

        this.buffer.push(tabs);
        this.buffer.push(text);
    }

}

module.exports.Traductor = Traductor;