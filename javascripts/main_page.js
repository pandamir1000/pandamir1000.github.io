'use strict'

const TABLE_ID = "crossword_table"
const small_crossword = {'width': 11 ,
						'height' : 11,
						'black_locs' : [5,12,14,16,18,20,27,34,36,37,38,40,42,44,52,56,58,60,62,64,68,76,78,80,82,83,84,86,93,100,102,104,106,108,115],
						'vertical_definitions_locs' : {0: 1,  2: 2,  4: 3,  6: 4,  8: 5,  10: 6,  48: 10,  55: 12,  63: 13, 79: 16, 87: 17, 94: 19},
						'horizontal_definitions_locs' :  {0: 1,  6: 4,  22: 7,  28: 8,  45: 9,  53: 11,  66: 14,  69: 15,  88: 18,  94: 19,  110: 20,  116: 21}}

const big_crossword = {'width': 13 ,
						'height' : 13,
						'black_locs' : [7,14,16,18,20,22,24,31,40,41,42,44,46,48,50,52,61,66,68,70,72,73,74,76,84,92,94,95,96,98,100,102,107,116,118,120,122,124,126,127,128,137,144,146,148,150,152,154,161],
						'vertical_definitions_locs' : {0: 1,  2: 2, 4:3,6:4,8:5,10:6,12:7,54:11,65:13,86:16,97:17,108:19,129:20,140:23},
						'horizontal_definitions_locs' :  {0: 1, 8:5,26:8,32:9,53:10,62:12,78:14,85:15,104:18,108:19,130:21,138:22,156:24,162:25}}



let CURRENT_SELECTED_CELL = null;
let CURRENT_SELECTED_DEFINITION = null;
let DEFINITIONS_ALL_CELLS = {};

function create_html_table(height, width) {
  const tbl = document.createElement("table");
  const tblBody = document.createElement("tbody");

  for (let i = 0; i < height; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < width; j++) {
      const cell = document.createElement("td");
      const cell_div = document.createElement("div");
      cell.id = i*width+j
      cell.classList.add("cell");
      cell_div.classList.add("cell_div");
      cell_div.id = `cell_div-${i*width+j}`
      cell.appendChild(cell_div)
      row.appendChild(cell);
    }
    tblBody.appendChild(row);
  }
  tbl.appendChild(tblBody);
  tbl.id = TABLE_ID
  document.body.appendChild(tbl);	
}

function create_black_cells(ids) {
	for (let id of ids){
		const cell = document.getElementById(id);
		cell.style.backgroundColor = "black"
		let cell_div = document.getElementById(`cell_div-${id}`);
		cell_div.remove();
	}
}

function create_definition(cell_num, def_num){
	let cell_div = document.getElementById(`cell_div-${cell_num}`)
	let def = document.createElement("text");
	def.classList.add("definitions");
	def.textContent = def_num
	cell_div.appendChild(def)
}

function set_definition_cells(cell_num, def_num, direction, table_height, table_width, black_locs){
	let definition_cells = [];
	let max_cell = null;
	let jump = null;
	if(DEFINITIONS_ALL_CELLS[cell_num] == null) {DEFINITIONS_ALL_CELLS[cell_num] = []};
	
	if (direction == "horizontal") {
		jump = 1
		max_cell = (Math.floor(cell_num/table_width) + 1) * table_width;
	}
	else if (direction == "vertical") {
		jump = table_width;
		max_cell = table_width * table_height;
	}
	
	let curr_cell = parseInt(cell_num);
	while (curr_cell < max_cell && !(black_locs.includes(curr_cell))) {
		definition_cells.push(curr_cell);
		curr_cell += jump;
	}
	DEFINITIONS_ALL_CELLS[cell_num].push(definition_cells);
}

function add_definition_click_function(cell_num) {
	const cell_div = document.getElementById(`cell_div-${cell_num}`);
	cell_div.onclick = function() {select_def(cell_num)};
}

function create_all_definitions(verticals, horizontals, table_height, table_width, black_locs) {
	for (let [key, value] of Object.entries(horizontals)){
		create_definition(key, value)
		set_definition_cells(key, value, "horizontal", table_height, table_width, black_locs);
		add_definition_click_function(key);
	}
	for (let [key, value] of Object.entries(verticals)){
		set_definition_cells(key, value, "vertical", table_height, table_width, black_locs);
		if (Object.keys(horizontals).includes(key)) {
			continue;}
		create_definition(key, value)
		add_definition_click_function(key);
	}

}

function clean_all_selection() {
	for (let selected_cell of CURRENT_SELECTED_DEFINITION[2]) {
		const cell_div = document.getElementById(`cell_div-${selected_cell}`);
		cell_div.style.backgroundColor = "white"	
	}
	CURRENT_SELECTED_CELL.style.backgroundColor = "white"	

}

function select_def(cell_num) {
	clean_all_selection()

	if(CURRENT_SELECTED_DEFINITION[0] == cell_num) {
		const num_of_directions = DEFINITIONS_ALL_CELLS[cell_num].length //will be two or one
		const new_index = (CURRENT_SELECTED_DEFINITION[1] + 1) % num_of_directions;
		CURRENT_SELECTED_DEFINITION = [cell_num, new_index, DEFINITIONS_ALL_CELLS[cell_num][new_index]]
		console.log("CURRENT_SELECTED_DEFINITION:" + CURRENT_SELECTED_DEFINITION.toString)
	}
	else {
		CURRENT_SELECTED_DEFINITION = [cell_num, 0, DEFINITIONS_ALL_CELLS[cell_num][0]];
	}

	for (let selected_cell of CURRENT_SELECTED_DEFINITION[2]) {
		const cell_div = document.getElementById(`cell_div-${selected_cell}`);

		cell_div.style.backgroundColor = "green"	
	}

	select_cell(`cell_div-${cell_num}`)

	console.log("select_def")
}

function select_non_def_cell(div_id) {
	const cell_num = parseInt(div_id.substring("cell_div-".length));
	if (CURRENT_SELECTED_DEFINITION[2].includes(cell_num)){
		CURRENT_SELECTED_CELL.style.backgroundColor = "green"
	}
	else {
		clean_all_selection()
		CURRENT_SELECTED_DEFINITION = [0,-1,[0,0]]
	}

	select_cell(div_id)
}

function select_cell(div_id) {
	
	let selected_div = document.getElementById(div_id);
	selected_div.style.backgroundColor = 'orange';
	CURRENT_SELECTED_CELL = selected_div;
}

function add_cell_click_function() {
	const cell_divs = document.getElementsByClassName("cell_div");
	for (let cell_div of cell_divs) {
		cell_div.onclick = function() {select_non_def_cell(cell_div.id)};
	}
}

function create_text_boxes(){
	const cell_divs = document.getElementsByClassName("cell_div");
	for (let cell_div of cell_divs) {
		let text_area = document.createElement('textarea');
		text_area.setAttribute('maxlength', 1);
		text_area.classList.add("char_inputs");
		const cell_num = parseInt(cell_div.id.substring("cell_div-".length));
		text_area.id = `text_area-${cell_num}`;
		text_area.oninput = function () {next_cell(cell_num)}
		cell_div.appendChild(text_area);

	}
}

function initiate_select(){
	CURRENT_SELECTED_CELL = document.getElementById("cell_div-0");
	CURRENT_SELECTED_DEFINITION = [0,-1,[0,0]];
}

function next_cell(cell_num) {
	const curr_ind = CURRENT_SELECTED_DEFINITION[2].indexOf(cell_num)
	if (curr_ind == -1) {return}
	CURRENT_SELECTED_CELL.style.backgroundColor = "green"
	const def_len = CURRENT_SELECTED_DEFINITION[2].length
	const new_cell_num = CURRENT_SELECTED_DEFINITION[2][(curr_ind + 1) % def_len]
	select_cell(`cell_div-${new_cell_num}`)
	document.getElementById(`text_area-${new_cell_num}`).focus()
	console.log("next_cell")

}

function reset_globals() {
	CURRENT_SELECTED_CELL = null;
	CURRENT_SELECTED_DEFINITION = null;
	DEFINITIONS_ALL_CELLS = {};
}

function create_crossword(crossword_layout) {
  if (document.getElementById(TABLE_ID) != null) {document.getElementById(TABLE_ID).remove()};
  reset_globals();
  create_html_table(crossword_layout['height'], crossword_layout['width'])
  create_black_cells(crossword_layout["black_locs"])
  add_cell_click_function()
  create_all_definitions(crossword_layout["vertical_definitions_locs"], crossword_layout["horizontal_definitions_locs"], crossword_layout['height'], crossword_layout['width'], crossword_layout["black_locs"])
  
  create_text_boxes()
  

  initiate_select()
}