import  {table } from "./util.ts"

function CrearConsultaSql(items:table[]):string{
     let consulta:string = "INSERT INTO products (code, name, price, stock) VALUES"

    for (let i = 0; i < items.length; i++) {
        
        if (i === 0) {
            consulta+="\n (" +items[i].toString() + ") \n" ;
            
        }else{
            consulta += "," + "(" +items[i] + ")\n";

        }
    }

     return consulta ;

}

export function helper(lista:Array<{code:string,name:string,price:number,stock:number}>){

    const items:  table[]=[]

    for (let i = 0; i < lista.length; i++) {
        const item = lista[i];
        const code = item.code;
        const name = item.name;
        const price = item.price;
        const stock = item.stock;
        items.push([code, name, price, stock]);
        
    }

    console.log(items);

    const query:string = CrearConsultaSql(items) +";";

    return query;
  
   
    
   
    
}

