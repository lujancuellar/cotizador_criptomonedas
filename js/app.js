const criptomonedasSelect = document.querySelector("#criptomonedas");
const monedaSelect = document.querySelector("#moneda");

const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");



const objBusqueda = {
    moneda : "",
    criptomoneda : ""
}

const obtenerCriptomoneda = criptomoneda => new Promise( resolve => {
    resolve(criptomoneda);
})


document.addEventListener("DOMContentLoaded", () => {
    consultarCriptomoneda()

    formulario.addEventListener("submit", submitFormulario)

    criptomonedasSelect.addEventListener("change", leerValor)
    monedaSelect.addEventListener("change", leerValor)

})

function consultarCriptomoneda(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD';

    fetch(url)
      .then( respuesta => respuesta.json())
      .then( resultado => obtenerCriptomoneda(resultado.Data)
      )
      .then(criptomoneda => selectCriptomonedas(criptomoneda) )
}

function selectCriptomonedas(criptomoneda){
    criptomoneda.forEach( crypto => {
        
        const { FullName, Name } = crypto.CoinInfo;
        
        const option = document.createElement("option");
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    })
}


function leerValor(e){

   objBusqueda[e.target.name] = e.target.value;

   
 }

function submitFormulario(e){
   e.preventDefault()
   
   const { moneda, criptomoneda } = objBusqueda;

   if(moneda === ""|| criptomoneda === "") {
       mostrarAlerta("Campos obligatorios");
       return;
   }

  consultarAPI()
}

function mostrarAlerta(mensaje){
    const existeError = document.querySelector(".error");
    if(!existeError) {
        const divMensaje = document.createElement("div");
        divMensaje.textContent = mensaje;
        divMensaje.classList.add("error");
    
        formulario.appendChild(divMensaje)
    
        setTimeout(() => {
            divMensaje.textContent = "";
            divMensaje.classList.remove("error");
        }, 2000)
    }
   

}


function consultarAPI(){
    const { moneda, criptomoneda } = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`
    mostrarSpinner()
    fetch(url)
        .then ( respuesta => respuesta.json())
        .then ( cotizacion => {
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda])
        })

}

function mostrarCotizacionHTML(cotizacion){
    limpiarHTML()
    console.log(cotizacion);
    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR,LASTUPDATE, IMAGEURL} = cotizacion;
    const precio = document.createElement("p");
    precio.innerHTML = `Precio actual de <span>${PRICE}</span>`;
    

    const precioAlto = document.createElement("p");
    precioAlto.innerHTML = `Precio mas alto del dia: <span>${HIGHDAY}</span>`;

    const precioBajo = document.createElement("p");
    precioBajo.innerHTML = `Precio mas bajo del dia: <span>${LOWDAY}</span>`;
    
    const ultimasHoras = document.createElement("p");
    ultimasHoras.innerHTML = `Variacion ultimas 24 horas: <span>%${CHANGEPCT24HOUR}</span>`;

    const ultimasActualizacion = document.createElement("p");
    ultimasActualizacion.innerHTML = `Ultima actualizacion: <span>${LASTUPDATE}</span>`;

    resultado.appendChild(precio)
    resultado.appendChild(precioAlto)
    resultado.appendChild(precioBajo)
    resultado.appendChild(ultimasHoras)
    resultado.appendChild(ultimasActualizacion)




}


function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}

function mostrarSpinner(){
    limpiarHTML()

    const spinner = document.createElement("div")
    spinner.classList.add("spinner");
    
    spinner.innerHTML = `
    
     <div class="bounce1"></div>
      <div class="bounce2"></div>
       <div class="bounce3"></div>

    `

    resultado.appendChild(spinner)
}
