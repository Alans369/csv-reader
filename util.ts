

export type table = [string, string, number,number];


/*let arrar:Array<{code:string,name:string,price:number,stock:number}>= [];

arrar.push(
    { code:'ABCD1234', name:'Product A', price: 19.99, stock: 100 },
    { code:'EFGH5678', name:'Product B', price: 29.99, stock: 200 },
    { code:'IJKL9012', name:'Product C', price: 39.99, stock: 300 },
    { code:'MNOP3456', name:'Product D', price: 49.99, stock: 400 }
);



const lista:  table[]=[
    ["code", "name", 1, 1 ]
]

for (let i = 0; i < arrar.length; i++) {
    const item = arrar[i];
    const code = item.code;
    const name = item.name;
    const price = item.price;
    const stock = item.stock;
    lista.push([code, name, price, stock]);

    
}

//console.log(lista);




const  InsertSql :{ consulta: string, item: table[]}={
    consulta: 'INSERT INTO products (code, name, price, stock) VALUES ',
    item: lista
};


let result:string="";



for (let i = 0; i < InsertSql.item.length; i++) {
    if (i === 0) {
        result ="\n (" +InsertSql.item[i].toString() + ") \n" ;
        
    }else{
        result += "," + "(" +InsertSql.item[i] + ")\n";

    }
    
    
}


InsertSql.consulta = InsertSql.consulta + result + ";";

console.log(InsertSql.consulta);*/






type  productos =  {
  name: string,
  description: string,
  minimumStock: 0,
  propertyId: 1,
  equipmentId: 1,
  categoryId: 0,
  modelId: 1,
  price: 10,
  priceA: 20,
  priceB: 30,
  priceC: 40,
  priceD: 50,
  code: "",
  number: string,
  supplierId: 1,
  branch: [
    {"id":1, "stock": 1}
  ],
  mainProducts: []
}

