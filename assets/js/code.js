let notes = [];
const addNote = document.querySelector(".add_note");
const info = document.querySelector(".info");

function openFilter() {
	const filterBtn = document.querySelector('.filter_btn_style');
	const filterBar = document.querySelector('.filter_styles');
	const filter = document.querySelector('.filter_span');
	const menuBody = document.querySelector('.menu_body');
	filterBtn.addEventListener("click", function() {
		filterBtn.classList.toggle('_active');
		filterBar.classList.toggle('_active');
		filter.classList.toggle('_active');
		menuBody.classList.toggle('_active');
		classList();
	});
};
openFilter();

const inpNote = document.querySelector('.inp-note');
function noteInput() {
	const form = document.querySelector('.form');
	const colors = document.querySelector('.colors');
	inpNote.addEventListener('focus', function() {
		form.classList.add('active');
		colors.classList.add('active');
	});
};
noteInput();

function classList() {
	const form = document.querySelector('.form');
	const colors = document.querySelector('.colors');
	form.classList.remove('active');
	colors.classList.remove('active');
};

const clickCol = [...document.querySelectorAll(".colors > div")];
clickCol.forEach(elm => {
	elm.addEventListener("click", addCard);
});

function addCard() {
	const inpCol = getComputedStyle(this);
	const cardCol = inpCol.backgroundColor;
	if(inpNote.value.length != 0) {
		let note = {
			id: Date.now(),
			name: inpNote.value,
			color: cardCol,
		}
		notes.push(note);
		classList();
		render(notes);
		information();
		addNote.innerHTML = "note added";
		info.setAttribute("infoAttribute", "note-added");	
		set_angularStorage();
	} else {
		classList();
	}
	inpNote.value = "";
};

function render(data) {
	const divCards = document.querySelector('.cards');
	const card = document.createElement('div');
	const name = document.createElement('p');
	const dateSpan = document.createElement('span');
	card.className = 'card';
	name.className = 'name';
	dateSpan.className = 'date';

	data.forEach(elm => {
		const cardCol = elm.color;
		card.style.backgroundColor = cardCol;
		divCards.appendChild(card);
		card.appendChild(name);
		card.appendChild(dateSpan);
		card.setAttribute('data-noteId', elm.id);
		name.innerHTML = elm.name;	
	});

	function cardDate() {
		const M = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		const d = new Date();
		const month = M[d.getMonth()];
		const day = d.getDate();
		const year = d.getFullYear();
		const fullDate = month + " " + day + ", " + year;
	   dateSpan.innerHTML = fullDate;
	}
	cardDate();
};

const deletedNote = [];
document.addEventListener('click', function(openChange) {
	const target = openChange.target.closest('div.card');
	const changeDiv = document.querySelector('.changeDiv');
	if(target) {
		const noteId = target.getAttribute('data-noteId');
		classList();
		function addChange() {
			const name = target.querySelector('.name');
			const cardChangeHtml = `
				<div class="card_change">
					<div class="card_name">${name.innerHTML}</div>
					<div class="div-del-btn" data-action="delete">
						<i class="fa fa-trash-o del-icon"></i>
					</div>
					<div class="close-change-btn" data-action="close">
						<i class="fa fa-times close-icon"></i>
					</div>
					<div class="color_change">
						<div class="col1"></div>
						<div class="col2"></div>
						<div class="col3"></div>
						<div class="col4"></div>
						<div class="col5"></div>
						<div class="col6"></div>
					</div>
				</div>`
			changeDiv.insertAdjacentHTML('beforeend', cardChangeHtml);
			changeDiv.classList.add('active');
		}
		addChange();

		const closeBtn = document.querySelector('.close-change-btn');
		closeBtn.addEventListener('click', function(e){
			const parentNode = e.target.closest('.card_change');
			parentNode.remove();
			changeDiv.classList.remove('active');
		});	
		const delBtn = document.querySelector('.div-del-btn');
		delBtn.addEventListener('click', function(e) {
	 	 	const parentNode = e.target.closest('.card_change');
			const noteIndex = notes.findIndex(note => note.id == noteId); 
	 	 	changeDiv.classList.remove('active');
		 	deletedNote.push(notes[noteIndex]);	
		 	notes.splice(noteIndex,1);
	 		parentNode.remove(); 
	 		target.remove();
 	 		information();
	 		addNote.innerHTML = "note deleted";
	 		info.setAttribute("infoAttribute", "note-deleted");
	 		set_angularStorage();
		});

		const clickCol = [...document.querySelectorAll('.color_change > div')]
		clickCol.forEach(elm => {
			elm.addEventListener('click', updateNote);
		})

		function updateNote() {
			const changeCol = getComputedStyle(this);
			const color = changeCol.backgroundColor;
			const i = notes.findIndex(note => note.id == noteId);
			target.style.backgroundColor = color;
			notes[i].color = color;
			set_angularStorage();
		}
	}	
});

const btnUndo = document.querySelector(".btn_undo");
const footer = document.querySelector(".footer");
let id;
let id2;
function information() {
	footer.classList.add('_active');
	info.classList.add('_active');
	addNote.classList.add('_active');
	btnUndo.classList.add('_active');
	id = setTimeout(function() {
		footer.classList.remove('_active');
		deletedNote.shift();
	}, 3500);
	id2 = setTimeout(function() {
		info.classList.remove('_active');
		addNote.classList.remove('_active');
		btnUndo.classList.remove('_active');
	}, 2000);
};

btnUndo.addEventListener('click', function() {
	if(info.getAttribute("infoAttribute") === "note-added") {
		add_undo();
	}
	if(info.getAttribute("infoAttribute") === "note-deleted") {
		del_undo();
	}
});

function del_undo() {
	notes.push(deletedNote[0]);
	render(notes);
	deletedNote.shift();
	set_angularStorage();
	clearTimeout(id);
	clearTimeout(id2);
	footer.classList.remove('_active');
	addNote.classList.remove('_active');
	btnUndo.classList.remove('_active');
	info.classList.remove('_active');
};

function add_undo() {
	const notesI = notes.pop();
	const noteId = notesI.id;
	const card = [...document.querySelectorAll('.card')];
	card.forEach(elm => {
		if(elm.getAttribute('data-noteId') == noteId) {
			elm.remove();
		}
	})
	set_angularStorage();
	clearTimeout(id);
	clearTimeout(id2);
	footer.classList.remove('_active');
	addNote.classList.remove('_active');
	btnUndo.classList.remove('_active');
	info.classList.remove('_active');
}

function set_angularStorage() {
	const strNote = JSON.stringify(notes)
	localStorage.setItem('angular', strNote);
}

function get_angularStorage() {
	if(localStorage.getItem('angular')) {
		const strNote = localStorage.getItem('angular');
		const storageNote = JSON.parse(strNote);
		storageNote.forEach(elm => {
			notes.push(elm);
			render(notes)
		})
	}
}
get_angularStorage();