const fs = require('fs');
const parse = require('csv-parse/lib/sync')


class Tabla{
    constructor(){
        this.data = {};
        this.results = [];


        this.constuir_tabla();
    }


    constuir_tabla() {
        var data = fs.readFileSync('./Primeros_Siguientes_csv.csv');

        const records = parse(data, {
          columns: true,
          skip_empty_lines: true
        })
        
        // console.log(records);
        this.crear_tabla(records);
    }


    crear_tabla(result) {

        var temp_interno;
        var yname;
        var temp_interno = {};

        for(var iterable in result){
            var obj = result[iterable];
            yname = obj["NT"].replace(' ', '');
            delete obj.NT;
            temp_interno = {};
            for(var key in obj){
                if(obj[key] !== ''){
                    if(obj[key] == 'ε') {
                        temp_interno[key] = [];
                    } else {
                        // console.log(obj[key]);
                        var temporal = obj[key];
                        // console.log(temporal);
                        temp_interno[key] = obj[key].split(' ');

                        let t_index = temp_interno[key].indexOf('');
                        if(t_index > -1 ){
                            temp_interno[key].splice(t_index, 1);
                        }
                    }
                }
            }
            this.data[yname] = temp_interno
            // console.log(this.data);
        }

        // console.log(this.data);
    }

    buscar_produccion(nt, t) {
        if(nt in this.data){
            var interno = this.data[nt];
            if(t in interno) {
                return interno[t];
            }
        }

        console.log('No se encontro el Nt:' + nt + ' con el terminal: ' + t);
        return undefined;
    }

    obtener_produccion_de(nt){
        if(nt in this.data) {
            var interno = this.data[nt];
            // console.log(interno);
            return interno;
        }
        return undefined;
    }


}

module.exports.Tabla = Tabla;
