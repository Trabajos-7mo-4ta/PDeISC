import { useState } from "react";
import "../App.css"


export default function Contador() {
  let [cont,setCont]= useState(0);

  const sumar=()=>{
    setCont(cont+1);
  };

  const resta=()=>{
    setCont(cont-1);
  };
    return (<div className="Contenedor">       
        <h3>contador = {cont}</h3>
        <button onClick={sumar}>sumar</button>
        <button onClick={resta}>restar</button>
        </div>
    );
}