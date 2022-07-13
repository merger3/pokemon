function Pokemon(PokemonName, PokemonID, PokedexID, Type1, Type2, Level, Health, Attack, Defense, Special, Speed){
	this.PokemonName = PokemonName;
	this.PokemonID = PokemonID;
	this.PokedexID = PokedexID;
	this.MoveList = MoveFiller();       
	this.Type1 = Type1;
	this.Type2 = Type2;
	this.Level = Level;
	this.Health = Health;
	this.Attack = Attack;
	this.Defense = Defense;
	this.Special = Special;
	this.Speed = Speed;
	this.Status = "none";
	this.Type1Num = TypeToInt(Type1);
	this.Type2Num = TypeToInt(Type2);
	this.Exp = Level * Level * Level;
	
	//Battle Health
	this.HealthPoints = HPCalc(Level, Health);
	
	//Additions: Evasion, Accuracy, IV's (add to base during object creation), Natures, Evolution Level
	//Advanced stat values: https://bulbapedia.bulbagarden.net/wiki/Individual_values
}

function Move(MoveName, MoveStyle, MovePower, PowerPoints, MoveType, MovePriority){
	this.MoveName = MoveName;
	this.MoveStyle = MoveStyle;
	this.MovePower = MovePower;
	this.PowerPoints = PowerPoints;
	this.MoveType = MoveType;
	this.MoveTypeNum = TypeToInt(MoveType);
	this.MovePriority = MovePriority;   //Not currently implemented
}

let registeredPokemon = [];
let Types = ["Normal", "Fighting", "Flying", "Poison", "Ground", "Rock", "Bug", "Ghost", 
"Fire", "Water", "Grass", "Electric", "Psychic", "Ice", "Dragon"];

var typeMults = [[1, 1, 1, 1, 1, 0.5, 1, 0, 1, 1, 1, 1, 1, 1, 1],  //Normal
				[2, 1, 0.5, 0.5, 1, 2, 0.5, 0, 1, 1, 1, 1, 0.5, 2, 1], //Fight
				[1, 2, 1, 1, 1, 0.5, 2, 1, 1, 1, 2, 0.5, 1, 1, 1],   //Flying
				[1, 1, 1, 0.5, 0.5, 0.5, 2, 0.5, 1, 1, 2, 1, 1, 1, 1],   //Poison
				[1, 1, 0, 2, 1, 2, 0.5, 1, 2, 1, 0.5, 2, 1, 1, 1],   //Ground
				[1, 0.5, 2, 1, 0.5, 1, 2, 1, 2, 1, 1, 1, 1, 2, 1],  //Rock
				[1, 0.5, 0.5, 2, 1, 1, 1, 0.5, 0.5, 1, 2, 1, 2, 1, 1],   //Bug
				[0, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 0, 1, 1],  //Ghost
				[1, 1, 1, 1, 1, 0.5, 2, 1, 0.5, 0.5, 2, 1, 1, 2, 0.5],  //Fire
				[1, 1, 1, 1, 2, 2, 1, 1, 2, 0.5, 0.5, 1, 1, 1, 0.5],  //Water
				[1, 1, 0.5, 0.5, 2, 2, 0.5, 1, 0.5, 2, 0.5, 1, 1, 1, 0.5],  //Grass
				[1, 1, 2, 1, 0, 1, 1, 1, 1, 2, 0.5, 0.5, 1, 1, 0.5],  //Electric
				[1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 0.5, 1, 1],  //Psychic
				[1, 1, 2, 1, 2, 1, 1, 1, 1, 0.5, 2, 1, 1, 0.5, 2],  //Ice
				[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2]]  //Dragon

function HPCalc(level, health){
	//Needs updating if IV and EV are implemented
	return Math.floor(((health * 2 + 100) * level)/100 + 10);
}

function TypeToInt(typeString){
	for (var i = 0; i < Types.length; i++){
		if (typeString == Types[i])
			return i;
	}
	return -1;
}

function PowerLeveler(pkmn, levelsUp){
	var HPLost = Math.floor(((pkmn.Health * 2 + 100) * pkmn.Level)/100 + 10) - pkmn.HealthPoints;
	
	pkmn.Level = pkmn.Level + levelsUp;
	for (var i = 0; i < levelsUp; i++){
		pkmn.Health = pkmn.Health + randomInt(1,3);
		pkmn.Attack = pkmn.Attack + randomInt(1,3);
		pkmn.Defense = pkmn.Defense + randomInt(1,3);
		pkmn.Special = pkmn.Special + randomInt(1,3);
		pkmn.Speed = pkmn.Speed + randomInt(1,3);
	}
	
	if (pkmn.Exp < pkmn.Level * pkmn.Level * pkmn.Level){
		pkmn.Exp = pkmn.Level * pkmn.Level * pkmn.Level;
	}
	
	var totalHP = Math.floor(((pkmn.Health * 2 + 100) * pkmn.Level)/100 + 10);
	
	pkmn.HealthPoints = totalHP - HPLost;
}

function randomInt(min, max){
	if (min == 0){
		return Math.floor(Math.random() * max);
	}
	return Math.floor(Math.random() * (max - min)) + min;
}

//Revise when MovePool is created
//Move(MoveName, MoveType, MovePower, PowerPoints, MoveType, MovePriority)
function MoveFiller(){
	var moveSlots = new Array(4);
	moveSlots[0] = new Move("Vine Whip", "Attack", 45, 25, "Grass", 0);
	moveSlots[1] = new Move("Tackle", "Attack", 40, 35, "Normal", 0);
	moveSlots[2] = new Move("Water Gun", "Attack", 40, 25, "Water", 0);
	moveSlots[3] = new Move("Struggle", "Attack", 50, 1, "Normal", 0);
	return moveSlots;
	}

	//Currently not working
function DamageMultiplier(move, targetPkmn){
	var critMultiplier = 1;
	var attackType = move.MoveTypeNum;
	var dType1 = targetPkmn.Type1Num;
	var dType2 = targetPkmn.Type2Num;
	if (Math.floor(Math.random() * 10) > 8)
		critMultiplier = 1.5;
	return critMultiplier * (typeMults[attackType][dType1]) * (typeMults[attackType][dType2]) * ((Math.floor(Math.random() * 15) + 85)/100);
	//Un-Implemented: same-type attack bonus: 1.5   burn: 0.5 for physical attack from burned pkmn   Other: Field effects: 0.5
}

function MoveUse(move, sourcePkmn, targetPkmn){
	var Attack = sourcePkmn.Attack;
	var Defense = targetPkmn.Defense;
	if (move.MoveTypeNum > 7){
		Attack = sourcePkmn.Special;
		Defense = targetPkmn.Special;
	}
	if (move.MoveStyle == "Support"){
		//Fill out later
	}
	else{	

		//targetPkmn.HealthPoints = Math.floor(targetPkmn.HealthPoints - ((((sourcePkmn.Level/2.5) + 2) * move.MovePower * Attack / Defense / 50) + 2) * DamageMultiplier(move, targetPkmn));
		targetPkmn.HealthPoints = Math.floor(targetPkmn.HealthPoints - ((((sourcePkmn.Level/2.5) + 2) * move.MovePower * Attack / Defense / 50) + 2) * 1);
	}
}

function BattleTurn(trainerMon, AIMon){
	//User input here
	//If "pokemon move"
	var selectedMove = trainerMon.MoveList[1];
	var enemyMove = AIMon.MoveList[Math.floor(Math.random() * 4)];
	
	if (trainerMon.Speed > AIMon.Speed){
		MoveUse(selectedMove, trainerMon, AIMon);
		if (AIMon.HealthPoints <= 0){
			console.log(trainerMon.PokemonName + " wins!");
			return 0;
		}		
		MoveUse(enemyMove, AIMon, trainerMon);
		if (trainerMon.HealthPoints <= 0){
			console.log(AIMon.PokemonName + " wins!");
			return 1;
		}	
	}
	else{
		MoveUse(enemyMove, AIMon, trainerMon);
		if (trainerMon.HealthPoints <= 0){
			console.log(AIM.PokemonName + " wins!");
			return 1;
		}	
		MoveUse(selectedMove, trainerMon, AIMon);
		if (AIMon.HealthPoints <= 0){
			console.log(trainerMon.PokemonName + " wins!");
			return 0;
		}	
	}
	PokemonConsoleHP(trainerMon, AIMon);
}

//Keep persistent test code below this line

function backEndTesting(){
	registeredPokemon.push(new Pokemon("Bulbasaur", 1, 1, "Grass", "None", 1, 45, 49, 49, 65, 45));
	var bulbasaur = registeredPokemon[0];
	var squirtle = new Pokemon("Squirtle", 2, 7, "Water", "None", 1, 44, 48, 65, 50, 43);
	//console.log(pkmn.PokemonName);
	console.log(typeMults[0][5]);
	//PokemonConsoleSummary(bulbasaur);
	console.log("HP: " + bulbasaur.HealthPoints);
	BattleTurn(bulbasaur, squirtle);
	//PowerLeveler(bulbasaur, 4)
}

function PokemonConsoleSummary(Pkmn){
	console.log("Name: " + Pkmn.PokemonName);
	console.log("ID#: " + Pkmn.PokemonID);
	console.log("Dex#: " + Pkmn.PokedexID);
	console.log("Type1: " + Pkmn.Type1);
	console.log("Type2: " + Pkmn.Type2);
	console.log("Move 1: " + Pkmn.MoveList[0].MoveName);
	console.log("Move 2: " + Pkmn.MoveList[1].MoveName);
	console.log("Move 3: " + Pkmn.MoveList[2].MoveName);
	console.log("Move 4: " + Pkmn.MoveList[3].MoveName);
	console.log("Level: " + Pkmn.Level);
	console.log("Attack: " + Pkmn.Attack);
	console.log("Defense: " + Pkmn.Defense);
	console.log("Special: " + Pkmn.Special);
	console.log("Speed: " +Pkmn.Speed);
	console.log("Type1Num: " + Pkmn.Type1Num);
	console.log("Type2Num: " + Pkmn.Type2Num);
	//Pokemon(PokemonName, PokemonID, PokedexID, Type1, Type2, Attack, Defense, Special, Speed) 
	//Type1Num Type2Num  HealthPoints
	//Move(MoveName, MoveStyle, MovePower, PowerPoints, MoveType, MovePriority)
}

function PokemonConsoleHP(Pkmn, Pkmn2){
	console.log("Your HP: " + Pkmn.HealthPoints);
	console.log("Enemy HP: " + Pkmn2.HealthPoints);
}


