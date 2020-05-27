nombre_mod = ""; //Global variable where we save the name of a contact that we going to modify
var contactos = '{{ contacts|tojson }}'; //here we get the contacts of the app.py file
contactos = JSON.parse(contactos); //convert the String (contacts) to an object
var ban = '{{ ban|tojson }}'; //get the flag of the app.py file, remember, this variable is for the correct redirect of divs

function bloques(bloque){  //funcion para mostrar y ocultar componentes html dinamicamente
  var arr = ['div_agregar', 'div_modificar', 'div_eliminar', 'div_buscar', 'div_consultar'];
  for (var i = 0; i < arr.length; i++) {

    if (arr[i] == bloque) {
      mostrar(bloque)
      if (arr[i] == 'div_consultar') {
        consultar('tableID');
      }
    }else {    ocultar(arr[i])  }
  }
}
function modificar(){ //this is just a confirmation of the modify part
  if(confirm("Desea modificar ese campo de "+nombre_mod)){
  	   return true;
  	}
  	else{
  	   return false;
  	}
}

function buscar(id_tabla, id_buscador){    //This is a seeker of contacts in real time, in the html file there is a event listener that is redirected to this function
  consultar(id_tabla);
  var tabla = document.getElementById(id_tabla);
  var buscador = document.getElementById(id_buscador).value.toLowerCase();
  for (var i = 1; i < tabla.rows.length; i++) {
    valor = tabla.rows[i].cells[1];
    //console.log(typeof valor);
    valor = valor.innerHTML;
    valor = String(valor).toLowerCase();

    if (valor.includes(buscador, 0)) {
      tabla.rows[i].style.display = '';
    }else {
      tabla.rows[i].style.display = 'none';
    }
  }
}

function consultar(tabla){     //this function is to show the contacts depending on the table that is in the parameters
  clear_Space(tabla);
  document.getElementById(tabla).insertRow(-1).innerHTML = "<th>ID</th><th>Nombre</th><th>Telefono</th><th>Email</th>";
  contactos = '{{ contacts|tojson }}';
  contactos = JSON.parse(contactos);
  for (var i = 0; i < contactos.length; i++) {
    document.getElementById(tabla).insertRow(-1).innerHTML = '<td>'+contactos[i][0]+'</td><td>'+contactos[i][1]+'</td><td>'+contactos[i][2]+'</td><td>'+contactos[i][3]+'</td>';
  }
}


function clear_Space(espacio){ //function to clean a component, either tables, divs,..
    document.getElementById(espacio).innerHTML = "";
}

result_mod = function(event){        //This function is activated with the click event listener on the modify table
  if (event.target.tagName == "TD"){  // if the click position is on a cell..
    var fila = event.target.parentNode;  //get the selected row
    tablita = document.getElementById('tabla_mod'); //get the table
    var indice = fila.children[0].innerHTML; //get the id of the contact
    borrar_filas(tablita, indice); // delete the rows that we dont need
    document.getElementById('idee').value = indice; //set the id to the form in the html file
    nombre_mod = fila.children[1].innerHTML;  //get the name of the contact
    if (document.getElementById('radio_tel').checked) { //set the values selected on the html file to later modify them
      document.getElementById('tel_mod').value = fila.children[2].innerHTML;
      document.getElementById('email_mod').value = fila.children[3].innerHTML;
      fila.children[2].style.backgroundColor = "yellow"; //change the color of the selected cell
    }else if (document.getElementById('radio_mail').checked) {
      document.getElementById('email_mod').value = fila.children[3].innerHTML;
      document.getElementById('tel_mod').value = fila.children[2].innerHTML;
      fila.children[3].style.backgroundColor = "yellow";
    }

  }
};

function borrar_filas(tablita, indice){ //this function is not relevant to the functionality of the page, it's more like validation...
  for (var i = 1; i < tablita.rows.length; i++) { //... in the case of selecting another cell in the same time, without this function...
    console.log("valor "+tablita.rows[i].cells[0].innerHTML+ " indice" + indice); //...the cell would also have changed its color, so...
    if (indice == tablita.rows[i].cells[0].innerHTML) {//...I couldn't change the color to white, I was forced to delete them
      console.log("iguales");
    }else{ console.log("diferentes"); tablita.deleteRow(i); i = i-1; }
  }

}

resultados = function(event){ //this function is like the previous one, but this is other table and here we send the id directly to the app.py file
  if (event.target.tagName == "TD"){
    var fila = event.target.parentNode;
    fila.style.backgroundColor = "yellow";
    var indice = fila.children[0].innerHTML;
     var opcion = confirm("Eliminar el registro ?"+indice+" " + fila.children[1].innerHTML +" "+fila.children[2].innerHTML+" "+fila.children[3].innerHTML);
    if (opcion == true) {
      console.log("el indice tabla es "+String(fila.rowIndex));
      location.href='/delete/'+indice; //send the selected id to a function on the app.py file
      document.getElementById('tabla_elim').deleteRow(fila.rowIndex);

    }else {
      fila.style.backgroundColor = "white";
    }

  }
};
function ocultar(espacio){ //hide the components like tables and divs
  document.getElementById(espacio).style.display = 'none';
}
function mostrar(espacio){ //show the components like tables and divs
  document.getElementById(espacio).style.display = '';

  if (espacio == "div_eliminar") {
    var tabla = document.getElementById('tabla_elim');
    if (tabla != null) {
      tabla.addEventListener("click", resultados); //here is where the previous function called 'resultados' is activated
    }
  }else if (espacio == "div_modificar") {
    var tabla_m = document.getElementById('tabla_mod');
    if (tabla_m != null) {
      tabla_m.addEventListener("click", result_mod); //here is where the previous function called 'result_mode' is activated
    }
  }
}

function telmail(op){ //this function is to hide and show the email and phone inputs depending the radio button is selected
  if (op == 'telefono') {
    ocultar('email_mod');
    mostrar('tel_mod');
    document.getElementById('tipo').value = "tel";
  }else if (op == 'email') {
    ocultar('tel_mod');
    mostrar('email_mod');
    document.getElementById('tipo').value = "mail";
  }
}
if (ban == '1') { //here is where the divs are shown depending the flag, the same flag in the app.py file
  bloques('div_eliminar');
}else if (ban == '2') {
  bloques("div_modificar");
}else if (ban == '0') {
  bloques("div_consultar");
}else if (ban == '3') {
  bloques("div_agregar");
}
