const fs = require('fs');
const { Token } = require('./Token');
const Parser = require('./parser').Parser;
const Scanner = require('./scanner').Scanner;
const Arbol = require('./arbol').Arbol;


function interprete(text){
    console.log(text);


    var s = new Scanner(text);
    s.scanner();
    s.tokens.push(new Token('$', '', -1, -1, '', ''));

    if(s.errores.length > 0) {
        console.log('Errores');
        // console.log(s.errores);
    } else {
        // console.log(s.tokens);
        console.log('tokens');
    }

    console.log('ahora se llama al analizador sintactico');
    var parser = new Parser(s.tokens);

    parser.parse();

    var arbol = new Arbol(parser.raiz);
    arbol.graficar();

    // console.log(s.tokens);


}


// var data = fs.readFileSync('../Entradas/test1.java');

var data_ = `
public class test{

	int numero = 5+6*(8/4) + (a*b /36) -50;


	public void imprimir() {
		for(int i = 0; i < 10+1; i++ ) {
			System.out.println("esto es una cadena");
		}
	}

	public int suma(int a, int b) {
		if (a == b && b >= c) {
			return "cadena";
		}
		return a + b;
	}
		
}`


// interprete(data.toString());

interprete(data_)