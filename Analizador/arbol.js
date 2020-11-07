const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

class Arbol{
    constructor(raiz){
        this.raiz = raiz;
    }

    graficar(){
        if(this.raiz === undefined){
            return; 
        }

        var stringBuffer = "";

        stringBuffer += 'digraph G{\n graph[overlap = true, fontsize= 0.5];\n';
        stringBuffer += 'node[shape=ellipse, fontname=Helvetica, fixedsize=true, width=3.5, height=0.9];\n';
        stringBuffer += 'edge[color = black];\n';
        stringBuffer += this.generarDot(this.raiz);
        stringBuffer += '\n}'

        try {
            // let dotPath = path.resolve('Recursos/arbol.dot');
            // let outPath = path.resolve('Recursos') + '/arbol.png';

            let dotPath = 'arbol.dot';
            let outPath = 'arbol.png';

            fs.writeFile(dotPath, stringBuffer, { flag: 'w'}, function(err){
                if(err) return console.log(err);
            })

            exec('dot -Tpng ' + dotPath + ' -o ' + outPath, (error, stdout, stderr) => {
                if(error){
                    console.log('error: ' + error);
                    return;
                }

            });

        } catch (error) {
            console.log(error);
        }

    }


    generarDot(raiz){
        if(raiz == undefined){
            return;
        }

        let stringBuffer = '';
        try {
            
            stringBuffer += 'nodo' + raiz.hash;
            stringBuffer += '[label="Etiqueta: ' + raiz.etiqueta;
            if(raiz.valor !== '' && raiz.valor !== undefined){
                stringBuffer += ' \\nValor: ' + this.remove_quotes(raiz.valor.toString());
            }

            stringBuffer += '"];\n';

            for(var i = 0; i < raiz.hijos.length; i++){
                let temporal = raiz.hijos[i];
                if(temporal !== undefined){
                    stringBuffer += 'nodo' + temporal.hash + '[label="Etiqueta: ';
                    stringBuffer += temporal.etiqueta;
                    if(temporal.valor !== '' && temporal.valor !== undefined){
                        stringBuffer += ' \\nValor: ' + this.remove_quotes(temporal.valor.toString());
                    }

                    stringBuffer += '"];\n';

                    stringBuffer += 'nodo' + raiz.hash;
                    stringBuffer += '->';
                    stringBuffer += 'nodo' + temporal.hash + '\n';

                    stringBuffer += this.generarDot(temporal);

                }
            }

        } catch (error) {
            console.log(error);
        }

        return stringBuffer;
    }


    remove_quotes(text) {
        while(text.includes('"')) {
            text = text.replace('"', '');
        }

        return text;
    }

}

module.exports.Arbol = Arbol;