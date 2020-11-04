const Nodo = require('./nodo').Nodo;
const stack = require('./stack').stack;
const Tabla = require('./Tabla').Tabla;

class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.ctoken = -1;
        this.tabla = new Tabla();
        this.pila = new stack();
        this.raiz = new Nodo('S')

    }

    parse() {
        this.pila.Push('$');
        this.pila.Push(this.raiz);
        this.pila.Push('S');

        var ntemp = null;
        var temp = null;


        var token = this.next_token();
        
        do{
            temp = this.pila.Peek();
            if(this.is_terminal(temp) || temp == '$') {
                if(temp == token) {
                    this.pila.Pop();
                    
                    if(this.match_terminal(token, ntemp)){

                        ntemp.valor = this.tokens[this.ctoken].lexema;

                        if(ntemp !== null || ntemp != undefined) {
                            console.log('nodo_temporal: ' + ntemp.etiqueta + ' Token: ' + token);
                            

                        } else {
                            console.log('Ntemp es nulo');
                        }
                        


                    }


                    token = this.next_token();
                } else {
                    var desc = 'Se esperaba el token: ' + temp + ' Y se recibio el token: ' + token;
                    desc += ' Lexema: '+ this.tokens[this.ctoken].lexema +' En la linea: ' + this.tokens[this.ctoken].linea;
                    let token_ = { token: token };
                    let temp_ = { temp: temp };
                    console.log(desc);
                    // this.panic_mode(token_, temp_);
                    break;
                }
            } else {
                var p = this.tabla.buscar_produccion(temp, token);
                if(p != undefined) {
                    this.pila.Pop();
                    ntemp = this.pila.Pop();

                    // Esto es si la produccion deriva en epsilon
                    if(p.length == 0) { 
                        // ntemp = null;
                        continue;
                    }

                    this.create_nodes(p, ntemp);
                    this.push_productions(p, ntemp, ntemp.hijos.length - 1);


                } else {
                    var desc = 'Se esperaba algunos de los siguientes tokens de abajo ';
                    desc += ' Y se leyo: ' + this.tokens[this.ctoken].lexema

                    desc += ' \n En la linea: ' + this.tokens[this.ctoken].linea;
                    console.log(desc);
                    console.log(this.tabla.obtener_produccion_de(temp));
                    let token_ = { token: token };
                    let temp_ = { temp: temp };
                    // this.panic_mode(token_, temp_);
                    break;
                }
            }

        }while(temp != '$');

    }

    create_nodes(p, ntemp) {
        for(var i = 0; i < p.length; i++) {
            if(!this.is_terminal(p[i])) {
                ntemp.hijos.push(new Nodo(p[i]))
            }
        }
    }

    push_productions(p, ntemp, ntemp_count) {
        for(var i = p.length - 1; i >= 0; i--) {
            if(this.is_terminal(p[i])) {
                this.pila.Push(p[i]);
            } else {
                if( ntemp_count == -1 ){
                    continue;
                }

                this.pila.Push(ntemp.hijos[ntemp_count]);
                this.pila.Push(p[i]);
                ntemp_count--;            
            }
        }
    }




    panic_mode(token_, temp_){

        while((token_.token != 'tk_;' || token_.token != 'tk_{') && token_.token != '$') {
            console.log('token consumido' + token_.token);
            token_.token = this.next_token();
        }


        while((temp_.temp != 'tk_;' || temp_.temp != 'tk_}') && this.pila.Peek() != '$') {
            temp_.temp = this.pila.Pop();
            console.log('Token desapilsado: ' + temp_.temp.toString());
        }

        token_.token = this.next_token();

    }


    next_token() {
        this.ctoken++;

        var retorno = '';

        if(this.ctoken <= this.tokens.length - 1) {
            retorno = this.tokens[this.ctoken].token;

            while(retorno == 'tk_comentario_m' || retorno == 'tk_comentario_s'){
                this.ctoken++;
                retorno = this.tokens[this.ctoken].token;
            }
        }

        return retorno;
    }

    match_terminal(tk, ntemp) {
        //token es el token actual
        //temp es el no terminal actual
        var not_match = ['tk_{', 'tk_}', 'tk_.', 'tk_,', 'tk_(', 'tk_)', 'tk_;'];
        if(!not_match.includes(tk)) {
            return true;
        } else {
            if(ntemp == null)
                return false;

            if (ntemp.etiqueta == 'F' && (tk == 'tk_(' || tk == 'tk_)')) {
                return true;
            }

        }

        return false;
        
    }


    is_terminal(temporal){
        return temporal.includes('tk_');
    }

}


module.exports.Parser = Parser;