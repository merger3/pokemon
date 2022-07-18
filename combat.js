//TODO: dummy object, to be replaced with actual pokemon when intergration is complete
function Pokemon(x, y) {
	this.name = "Bulbasaur";
	this.sprite_x = x;
	this.sprite_y = y;
	this.Health = 100;
	this.current_health = 100;
	this.Level = 5;
	this.Exp = 100;	//max exp
	this.current_exp = 20;	//current exp

}
let player_pokemon = new Pokemon(11, 110);	//dummy values
let enemy_pokemon = new Pokemon(661, 45);		//dummy values

//TODO: these values depend on what pokemon is chosen for the battle
let player_sprite_x = player_pokemon.sprite_x;
let player_sprite_y = player_pokemon.sprite_y;
let enemy_sprite_x = enemy_pokemon.sprite_x;
let enemy_sprite_y = enemy_pokemon.sprite_y;

//TODO: change this to the correct background
let bg_x = 6;
let bg_y = 6;

const main_canvas = document.getElementById("main_canvas");
const main_ctx = main_canvas.getContext("2d");
main_ctx.imageSmoothingEnabled = false;
main_ctx.webitImageSmoothingEnabled = false;
main_canvas.width = window.innerWidth;
main_canvas.height = main_canvas.width / 1.5;
let scalingFactor = main_canvas.width / 240;


//loading the background
const battle_main_background = new Image();
battle_main_background.src = "img/battle_backgrounds.png";
const battle_ui = new Image();
const pokemon_sprite_sheet = new Image();

//choosing the correct background
battle_main_background.onload = function() {
	main_ctx.drawImage(battle_main_background, bg_x, bg_y, 240, 112, 0, 0, main_canvas.width, main_canvas.height * 7 / 10);

	pokemon_sprite_sheet.src = "img/battle_pokemons.png";
	pokemon_sprite_sheet.onload = function() {
		draw_player_pokemon();
		draw_enemy_pokemon();
		//TODO: change this to the correct pokemon
		battle_ui.src = "img/battle_ui.png";
		battle_ui.onload = function () {
			draw_options_pane();
		}
	}
}
//function to draw the player's pokemon
function draw_player_pokemon(){
	let player_x = 40 * scalingFactor;
	let player_y = 48 * scalingFactor;
	main_ctx.drawImage(pokemon_sprite_sheet, player_sprite_x, player_sprite_y, 64, 64, player_x, player_y,  64 * scalingFactor,  64 * scalingFactor);
}
//function to draw the enemy's pokemon
function draw_enemy_pokemon(){
	let enemy_x = 144 * scalingFactor;
	let enemy_y = 10 * scalingFactor;
	main_ctx.drawImage(pokemon_sprite_sheet, enemy_sprite_x, enemy_sprite_y, 64, 64, enemy_x, enemy_y, 64 * scalingFactor,  64 * scalingFactor);

}
function draw_options_pane() {
	main_ctx.drawImage(battle_ui, 297, 56, 240, 48, 0, main_canvas.height * 7 / 10, main_canvas.width, main_canvas.height * 3 / 10);
	main_ctx.drawImage(battle_ui, 146, 4, 120, 48, 121 * scalingFactor, main_canvas.height * 7 / 10, 120 * scalingFactor, main_canvas.height * 3 / 10);
	main_ctx.drawImage(battle_ui, 3, 3, 100, 30, 13 * scalingFactor, 16 * scalingFactor, 100 * scalingFactor, 30 * scalingFactor);
	main_ctx.drawImage(battle_ui, 3, 44, 104, 37, 126 * scalingFactor, 74 * scalingFactor, 104 * scalingFactor, 37 * scalingFactor);
	main_ctx.drawImage(battle_ui, 269, 4, 6, 10, 129 * scalingFactor, 124 * scalingFactor, 6 * scalingFactor, 10 * scalingFactor);

	main_ctx.font = "20px Courier New";
	main_ctx.fillStyle = "white";
	main_ctx.fillText("What will", 10 * scalingFactor, 133 * scalingFactor);

	//TODO: change this to the correct pokemon
	main_ctx.fillText(player_pokemon.name + " do?", 10 * scalingFactor, 148 * scalingFactor);
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
			player_pokemon.current_health -= 10;
		}
	}
});

//TODO: change this so player health changes when it is damaged
addEventListener("keydown", function (e) {
	let key = e.key;
	if (key === "ArrowRight") {
		if (enemy_pokemon.current_health > 0) {
			enemy_pokemon.current_health -= 10;
			requestAnimationFrame(healthBar);
		}
	}
});

//TODO: change this so exp changes when it is gained
addEventListener("keydown", function (e) {
	let key = e.key;
	if (key === "ArrowUp") {
		if (player_pokemon.current_exp < player_pokemon.Exp) {
			player_pokemon.current_exp += 10;
			requestAnimationFrame(expBar);
		}else{
			player_pokemon.Level += 1;
			player_pokemon.Exp = player_pokemon.Level ** 3;
			player_pokemon.current_exp = 0;
			requestAnimationFrame(expBar);
		}
	}
	console.log(player_pokemon.current_exp + " " + player_pokemon.Exp);
});
