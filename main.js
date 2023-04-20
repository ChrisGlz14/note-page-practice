//Añadir nueva nota y nueva popup 
const addBox = document.querySelector(".add-box");
const popupBox = document.querySelector(".popup-box");
const popupTitle = document.querySelector("header p");
const titleTag = popupBox.querySelector("input");
const descriptionTag = popupBox.querySelector("textarea")
const closeIcon = popupBox.querySelector("header i");//Definimos la constante closeIcon a la x dentro del elemento popupBox 
let addBtn = popupBox.querySelector("button");

const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "octubre", "Noviembre", "Diciembre"]
 // Creamos un array de meses


 //tomamos los datos del local storage si existen y lo convertimos a parse
 //
    const notesJSON = localStorage.getItem("notes"); //obtiene el valor almacenado para la clave "notes"
    const notes = notesJSON ? JSON.parse(notesJSON) : []; //Si notesJSON es nulo, entonces notes se inicializa con un array vacío []
//asegurando que notes siempre tenga un valor definido, incluso si no hay ningún valor almacenado en el almacenamiento local con la clave "notes"
    let isUpdate = false, updateId;

    addBox.addEventListener("click", () => {
        popupTitle.innerText = "Añadir Nueva Nota";
        addBtn.innerText = "Añadir Nota";
        popupBox.classList.add("show");
        document.querySelector("body").style.overflow = "hidden";
        if(window.innerWidth > 660) titleTag.focus();
    });

closeIcon.addEventListener("click", () => { //Al elemento popup le removemos la clase show
    isUpdate = false;
    titleTag.value = "";
    descriptionTag.value = "";
    addBtn.innerText= "Añade Nota"
    popupTitle.innerText= "Añade nueva Nota"
    popupBox.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";

});
showNotes()
function showNotes() {
    if (!notes) return;
    document.querySelectorAll(".note").forEach(note =>note.remove());
    notes.forEach((note, id) => {
        let filterDesc = note.description.replaceAll("\n", '<br/>');
        let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="fa-solid fa-ellipsis"></i>
                                <ul class="menu">
                                <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="fa-solid fa-pen"></i>Editar</li>
                                <li onclick="deleteNote(${id})"><i class="fa-solid fa-trash"></i>Borrar</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
            addBox.insertAdjacentHTML("afterend", liTag);
    });
}
showNotes();

function showMenu(elem) {
    elem.parentElement.classList.add("show");
    document.addEventListener("click", e => {
        //Elimino el show de la clase settings del menu al hacer click en cualquier parte del documento.
        if(e.target.tagName != "I" || e.target != elem) {
            elem.parentElement.classList.remove("show")
        }
    })
}

function updateNote (noteId, title, filterDesc){
    let description = filterDesc.replaceAll('</br>', '\r\n');
    updateId = noteId;
    isUpdate = true;
    addBox.click();
    titleTag.value = title;
    descriptionTag.value = description;
    addBtn.innerText= "Edita esta Nota";
    popupTitle.innerText= "Edita esta Nota";
}

function deleteNote(noteId) {
    let confirmDel = confirm("Estas Seguro de que queres eliminar esta nota?");
    if (!confirmDel) return;
    notes.splice(noteId, 1);//elimina el elemento seleccionado del array 
    localStorage.setItem("notes", JSON.stringify(notes));//Guarda las ediciones de notas en el localStorage
    showNotes();
}

addBtn.addEventListener("click", e => { 
    e.preventDefault();
    let noteTitle = titleTag.value;
    let noteDescription = descriptionTag.value;

    if (noteTitle || noteDescription) { //Obtenemos la fecha para incluirla en las notas
        let dateObj = new Date();
        month = months[dateObj.getMonth()],
        day = dateObj.getDay(),
        year = dateObj.getFullYear(); 

        let noteInfo = { //Creamos el objeto note info que contiene informacion de la nota
            title: noteTitle, description: noteDescription,
            date: `${month} ${day}, ${year}`
        }
        if (!isUpdate) {
            notes.push(noteInfo);
        } else {
            isUpdate = false;
            notes[updateId] = noteInfo; // Actualiza una nota especificamente.
        }
        localStorage.setItem("notes", JSON.stringify(notes))//Guardamos las notas en local storage  
        closeIcon.click();
        showNotes();     
    }
});