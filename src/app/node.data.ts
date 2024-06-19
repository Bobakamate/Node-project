 
export interface Node {
    id: number;
    name: string;
    children: Node[];  // une structure de donne pour faire reference au autre node 
    value: ValueData[],//celacorrespond a la ligne LIgne genere (tout les element de chaque ligne sont stocke ici)
    position: { x: number, y: number };
    isNodeSelected: boolean;
    description :String;
    initialPosition: { x: number, y: number };
    parameter : Parameter[]
    isGerereted:boolean;//c est sa qui determine si les line sont genere pour la prmier foie ou pas 
   
  }

  export interface ValueData{
    id:number;
    name : String; 
    quantitativeValue: String[]//["name de la valeur","perateur (+)","valeur","proba nim","proba max "]
  }
  export interface Parameter {
    id :number;
    parametreName: string;
    valeurs: string[][];
  }
  export interface Data {
    nodes:Node[],
    links:number[][]
  }


  //lorsque l utilisateru clique sur enregistre cela doit recupere les donne de lapage html dans le typescipt et enregistre tout les element dans cette structure de donne 