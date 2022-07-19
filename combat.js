//TODO: dummy object, to be replaced with actual pokemon when integration is complete
function PokemonSprite(pkmn){
	this.pokemon = pkmn;
	this.name = pkmn.PokemonName;
	this.sprite_x = sprite_CalcX(pkmn);
	this.sprite_y = sprite_CalcY(pkmn);
	this.enemy_sprite_y = sprite_CalcY2(pkmn);
	this.Health = pkmn.HealthPoints;
	this.current_health = pkmn.currentHealth;
	this.Attack = pkmn.MoveList;
	this.Type = pkmn.primaryType;
	this.Level = pkmn.Level;
	this.Exp = pkmn.Exp;	//max exp
	this.current_exp = pkmn.currentEXP;	//current exp

}

let player_pokemon = new PokemonSprite(test1);	//dummy values
let enemy_pokemon = new PokemonSprite(test2);		//dummy values


function sprite_CalcX(pkmn){
	var xQuad = pkmn.PokedexID % 15;
	if (xQuad === 0){
		xQuad = 15;
	}
	return 130 * (xQuad - 1) + 11;
}

function sprite_CalcY(pkmn){  //165
	var yQuad = 110;
	if (pkmn.PokedexID % 15 > 1){
		yQuad = 110 + (165 * Math.floor(pkmn.PokedexID /15));
	}
	return yQuad;
}

function sprite_CalcY2(pkmn){  //165
	var yQuad = 45;
	if (pkmn.PokedexID % 15 > 1){
		yQuad = 45 + (165 * Math.floor(pkmn.PokedexID /15));
	}
	return yQuad;
}

//TODO: these values depend on what pokemon is chosen for the battle
let player_sprite_x = player_pokemon.sprite_x;
let player_sprite_y = player_pokemon.sprite_y;
let enemy_sprite_x = enemy_pokemon.sprite_x;
let enemy_sprite_y = enemy_pokemon.enemy_sprite_y;

//TODO: change this to the correct background
let bg_x = 249;
let bg_y = 6;

const main_canvas = document.getElementById("main_canvas");
const main_ctx = main_canvas.getContext("2d");
if(window.innerWidth < window.innerHeight) {
	main_canvas.width = window.innerWidth;
}else {
	main_canvas.width = window.innerHeight;
}
main_canvas.height = main_canvas.width / 1.5;
let scalingFactor = main_canvas.width / 240;

let battle_mode = "main_menu";		//move select, pokemon select, item select

//loading the background
const battle_main_background = new Image();
battle_main_background.src = "img/battle_backgrounds.png";
const battle_ui = new Image();
const pokemon_sprite_sheet = new Image();

//choosing the correct background
battle_main_background.onload = function() {
	main_ctx.imageSmoothingEnabled = false;
	main_ctx.webitImageSmoothingEnabled = false;
	main_ctx.drawImage(battle_main_background, bg_x, bg_y, 240, 112, 0, 0, main_canvas.width, main_canvas.height * 7 / 10);

	pokemon_sprite_sheet.src = "img/battle_pokemons.png";
	pokemon_sprite_sheet.onload = function() {
		//TODO: change this to the correct pokemon
		battle_ui.src = "img/battle_ui.png";
		battle_ui.onload = function () {
			draw_options_pane();
			draw_player_pokemon();
			draw_enemy_pokemon();
		}
	}
};
//function to draw the player's pokemon
function draw_player_pokemon(){
	let player_x = 40 * scalingFactor;
	let player_y = 48 * scalingFactor;
	main_ctx.drawImage(pokemon_sprite_sheet, player_sprite_x, player_sprite_y, 64, 64, player_x, player_y,  64 * scalingFactor,  64 * scalingFactor);
	fill_player_info();
}
function fill_player_info() {
	main_ctx.save();
	main_ctx.font = (10 * scalingFactor) + "px Courier New";
	main_ctx.fillStyle = "rgb(64,64,64)";
	main_ctx.shadowColor = "rgb(216,208,176)";
	main_ctx.shadowOffsetX = scalingFactor;
	main_ctx.shadowOffsetY = scalingFactor;
	//TODO: replace player_pokemon.Level with real value
	main_ctx.fillText(player_pokemon.Level, 216 * scalingFactor, 86 * scalingFactor, 7 * scalingFactor);
	main_ctx.fillText(player_pokemon.name, 142 * scalingFactor, 86 * scalingFactor, 64 * scalingFactor);
	main_ctx.restore();
}
//function to draw the enemy's pokemon
function draw_enemy_pokemon(){
	let enemy_x = 144 * scalingFactor;
	let enemy_y = 10 * scalingFactor;
	main_ctx.drawImage(pokemon_sprite_sheet, enemy_sprite_x, enemy_sprite_y, 64, 64, enemy_x, enemy_y, 64 * scalingFactor,  64 * scalingFactor);
	main_ctx.save();
	main_ctx.font = (10 * scalingFactor) + "px Courier New";
	main_ctx.fillStyle = "rgb(64,64,64)";
	main_ctx.shadowColor = "rgb(216,208,176)";
	main_ctx.shadowOffsetX = scalingFactor;
	main_ctx.shadowOffsetY = scalingFactor;
	//TODO: replace enemy_pokemon.Level with real value
	main_ctx.fillText(enemy_pokemon.Level, 94 * scalingFactor, 28 * scalingFactor);
	main_ctx.fillText(enemy_pokemon.name, 20 * scalingFactor, 28 * scalingFactor);
	main_ctx.restore();
}
function draw_options_pane() {
	battle_mode = "main_menu";
	//draw blue options pane
	main_ctx.drawImage(battle_ui, 297, 56, 240, 48, 0, main_canvas.height * 7 / 10, main_canvas.width, main_canvas.height * 3 / 10);
	//draw fight bag and run buttons
	main_ctx.drawImage(battle_ui, 146, 4, 120, 48, 121 * scalingFactor, main_canvas.height * 7 / 10, 120 * scalingFactor, main_canvas.height * 3 / 10);
	//draw enemy's stats box
	main_ctx.drawImage(battle_ui, 3, 3, 100, 30, 13 * scalingFactor, 16 * scalingFactor, 100 * scalingFactor, 30 * scalingFactor);
	//draw player's stats box
	main_ctx.drawImage(battle_ui, 3, 44, 104, 37, 126 * scalingFactor, 74 * scalingFactor, 104 * scalingFactor, 37 * scalingFactor);
	//draw selection arrow
	main_ctx.drawImage(battle_ui, 269, 4, 6, 10, 129 * scalingFactor, 124 * scalingFactor, 6 * scalingFactor, 10 * scalingFactor);
	main_ctx.save();
	main_ctx.font = (1/20 * main_canvas.width) + "px Courier New";
	main_ctx.fillStyle = "rgb(248,248,248)";
	main_ctx.shadowColor = "rgb(104,88,112)";
	main_ctx.shadowOffsetX = 2;
	main_ctx.shadowOffsetY = 2;
	main_ctx.fillText("What will", 10 * scalingFactor, 133 * scalingFactor);
	//TODO: change this to the correct pokemon
	main_ctx.fillText(player_pokemon.name + " do?", 10 * scalingFactor, 148 * scalingFactor);
	main_ctx.restore();
	expBar();
}
//displaying health of the Pokemon
function healthBar(){
	let depleted_health_bar_x = 117;
	let depleted_health_bar_y = 21;

	let player_health_bar_x = 221 * scalingFactor;
	let player_health_bar_y = 91 * scalingFactor;
	let enemy_health_bar_x = 100 * scalingFactor;
	let enemy_health_bar_y = 33 * scalingFactor;

	//TODO: change this to the real pokemon health values
	let player_health_percent = player_pokemon.current_health / player_pokemon.Health;
	let enemy_health_percent = enemy_pokemon.current_health / enemy_pokemon.Health;

	let player_depleted_health_bar_width = 48 * scalingFactor * (1 - player_health_percent);
	let enemy_depleted_health_bar_width = 48 * scalingFactor * (1 - enemy_health_percent);

	main_ctx.save();
	main_ctx.drawImage(battle_ui, depleted_health_bar_x, depleted_health_bar_y, 9, 3, player_health_bar_x - player_depleted_health_bar_width, player_health_bar_y, player_depleted_health_bar_width, 3 * scalingFactor);
	main_ctx.drawImage(battle_ui, depleted_health_bar_x, depleted_health_bar_y, 9, 3, enemy_health_bar_x - enemy_depleted_health_bar_width, enemy_health_bar_y, enemy_depleted_health_bar_width, 3 * scalingFactor);
	main_ctx.restore();
}
function moveSelect() {
	battle_mode = "move_select";
	main_ctx.drawImage(battle_ui, 297, 4, 240, 48, 0, main_canvas.height * 7 / 10, main_canvas.width, main_canvas.height * 3 / 10);
	main_ctx.save();
	main_ctx.font = (1/24 * main_canvas.width) + "px Courier New";
	main_ctx.fillStyle = "rgb(72,72,72)";
	main_ctx.shadowColor = "rgb(208,208,200)";
	main_ctx.shadowOffsetX = 2;
	main_ctx.shadowOffsetY = 2;
	//TODO: change this to the correct pokemon
	main_ctx.fillText(player_pokemon.Attack[0].MoveID, 15 * scalingFactor, 133 * scalingFactor, 58 * scalingFactor);
	main_ctx.fillText(player_pokemon.Attack[1].MoveID, 15 * scalingFactor, 148 * scalingFactor, 58 * scalingFactor);
	main_ctx.fillText(player_pokemon.Attack[2].MoveID, 90 * scalingFactor, 133 * scalingFactor, 58 * scalingFactor);
	main_ctx.fillText(player_pokemon.Attack[3].MoveID, 90 * scalingFactor, 148 * scalingFactor, 58 * scalingFactor);

	main_ctx.font = (1/20 * main_canvas.width) + "px Courier New";
	main_ctx.fillText(player_pokemon.Type, 191 * scalingFactor, 149 * scalingFactor, 43 * scalingFactor);

	main_ctx.restore();
}

//displaying exp of the Pokemon
function expBar() {
	let exp_bar_x = 129;
	let exp_bar_y = 9;

	let player_exp_bar_x = 158 * scalingFactor;
	let player_exp_bar_y = 107 * scalingFactor;

	//TODO: change this to the real pokemon exp values
	let player_exp_percent = player_pokemon.current_exp / player_pokemon.Exp;
	main_ctx.save();
	if (player_exp_percent === 0) {
		main_ctx.drawImage(battle_ui, 35, 77, 70, 2, player_exp_bar_x, player_exp_bar_y, 70 * scalingFactor, 2 * scalingFactor);
		//draw player's stats box
		main_ctx.drawImage(battle_ui, 3, 44, 104, 37, 126 * scalingFactor, 74 * scalingFactor, 104 * scalingFactor, 37 * scalingFactor);
		healthBar();
		fill_player_info();
	}
	main_ctx.drawImage(battle_ui, exp_bar_x, exp_bar_y, 7, 2, player_exp_bar_x, player_exp_bar_y, player_exp_percent * 64 * scalingFactor, 2 * scalingFactor);
	main_ctx.restore();
}

//TODO: change this so player health changes when it is damaged
addEventListener("keydown", function (e) {
	let key = e.key;
	if (key === "ArrowLeft") {
		if (player_pokemon.current_health > 0) {
			requestAnimationFrame(healthBar);
			player_pokemon.current_health -= 1;
		}
	}
//TODO: change this so player health changes when it is damaged
	if (key === "ArrowRight") {
		if (enemy_pokemon.current_health > 0) {
			enemy_pokemon.current_health -= 1;
			requestAnimationFrame(healthBar);
		}
	}
//TODO: change this so exp changes when it is gained
	if (key === "ArrowUp") {
		player_pokemon.current_exp += 10;
		if (player_pokemon.current_exp < player_pokemon.Exp) {
			requestAnimationFrame(expBar);
		} else {
			player_pokemon.Level += 1;
			player_pokemon.Exp = player_pokemon.Level ** 3;
			player_pokemon.current_exp = 0;

			draw_player_pokemon();
			requestAnimationFrame(expBar);
			PowerLeveler(player_pokemon.pokemon, 1);
		}
		console.log(player_pokemon.current_exp + " " + player_pokemon.Exp);
	}
//TODO: change this so exp changes when it is gained

	if (key === "ArrowDown") {
		if (battle_mode === "main_menu") {
			moveSelect();
		} else if (battle_mode === "move_select") {
			draw_options_pane();
			draw_enemy_pokemon();
		}
	}

});
