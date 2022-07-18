function Pokemon(PokemonName, PokemonID, PokedexID, primaryType, secondaryType, Level, Health, Attack, Defense, Special, Speed){
	this.PokemonName = PokemonName;
	this.PokemonID = PokemonID;
	this.PokedexID = PokedexID;
	this.MoveList = MoveFiller();       
	this.primaryType = primaryType;
	this.secondaryType = secondaryType;
	this.Level = Level;
	this.Health = Health;
	this.Attack = Attack;
	this.Defense = Defense;
	this.Special = Special;
	this.Speed = Speed;
	this.Status = "None";
	this.primaryTypeNum = TypeToInt(primaryType);
	this.secondaryTypeNum = TypeToInt(secondaryType);
	this.Exp = Level * Level * Level;
	
	//Battle Health
	this.HealthPoints = HPCalc(Level, Health);
	
	//Additions: Evasion, IV's (add to base during object creation), Natures, Evolution Level
	//Advanced stat values: https://bulbapedia.bulbagarden.net/wiki/Individual_values
}

function Move(MoveID, MoveName, MoveType, PowerPoints, MovePower, Accuracy, Inflicts, InflictChance){
	this.MoveID = MoveID;
	this.MoveName = MoveName;
	this.MoveType = MoveType;
	this.PowerPoints = PowerPoints;
	this.MovePower = MovePower;
	this.Accuracy = Accuracy;
	this.Inflicts = Inflicts;
	this.InflictChance = InflictChance;
	this.MoveTypeNum = TypeToInt(MoveType);
}

let teamMon = [];
let registeredPokemon = [];
let enemyMon = [];
let Types = ["Normal", "Fighting", "Flying", "Poison", "Ground", "Rock", "Bug", "Ghost", 
"Fire", "Water", "Grass", "Electric", "Psychic", "Ice", "Dragon"];
let Status = ["Burn", "Freeze", "Paralysis", "Poison", "Confused", "Sleeping"];

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
	moveSlots[1] = new Move("Tackle", "Attack", 10, 35, "Normal", 0);  //40
	moveSlots[2] = new Move("Water Gun", "Attack", 10, 25, "Water", 0);  //40
	moveSlots[3] = new Move("Struggle", "Attack", 10, 1, "Normal", 0);  //50
	return moveSlots;
	}

	//Currently not working
function DamageMultiplier(move, targetPkmn){
	var critMultiplier = 1;
	var attackType = move.MoveTypeNum;
	var dType1 = targetPkmn.primaryTypeNum;
	var dType2 = targetPkmn.secondaryTypeNum;
	if (Math.floor(Math.random() * 10) > 8)
		critMultiplier = 1.5;
	return critMultiplier * (typeMults[attackType][dType1]) * (typeMults[attackType][dType2]) * ((Math.floor(Math.random() * 15) + 85)/100);
	//Un-Implemented: same-type attack bonus: 1.5   burn: 0.5 for physical attack from burned pkmn   Other: Field effects: 0.5
}

function MoveUse(move, sourcePkmn, targetPkmn){
	var Attack = sourcePkmn.Attack;
	var Defense = targetPkmn.Defense;
	
	
	//Status Effect Checks
	if (sourcePkmn.Status == "Freeze" || sourcePkmn.Status =="Sleeping"){
		if (randomInt(0, 100) < 33){
			sourcePkmn.Status = "None";
		}
		else{
			console.log("The status condition prevented an attack");
		}
	}
	
	var statClear = randomInt(0, 100);
	if (sourcePkmn.Status == "Paralysis" || sourcePkmn.Status =="Confused"){
		if (statusClear < 75){
			if (statusClear < 25)
				sourcePkmn.Status = "None";
		}
		else{
			console.log("The status condition prevented an attack");
		}
	}
	
	
	if (randomInt(0, 100) > move.Accuracy){
		console.log("The attack missed");
		return 0;
	}
	
	if (move.MoveTypeNum > 7){
		Attack = sourcePkmn.Special;
		Defense = targetPkmn.Special;
	}
	else if (move.MovePower == 0){
		targetPkmn.Status = move.Inflicts;
	}
	else{	
		var name = targetPkmn.PokemonName + " Damage: ";
		var damage = ((((sourcePkmn.Level/2.5) + 2) * move.MovePower * Attack / Defense / 50) + 2);
		//console.log(name + Math.floor(damage));
		var hpName = targetPkmn.PokemonName + " HP: ";
		//console.log(hpName + targetPkmn.HealthPoints);
		//console.log(Math.floor(targetPkmn.HealthPoints - damage));
		//targetPkmn.HealthPoints = Math.floor(targetPkmn.HealthPoints - ((((sourcePkmn.Level/2.5) + 2) * move.MovePower * Attack / Defense / 50) + 2) * DamageMultiplier(move, targetPkmn));
		targetPkmn.HealthPoints = Math.floor(targetPkmn.HealthPoints - damage);
		if (targetPkmn.HealthPoints < 0)
			targetPkmn.HealthPoints = 0;
		
		if (move.InflictChance > 0){
			if (randomInt(0, 100) <= moveInflictChance){
				targetPkmn.Status = move.Inflicts;
			}
		}
	}
}


//Battle Menu Functions
function BattleMenu(subMenuID){
	if (subMenuID = "Fight"){
		BattleMoveMenu();
	}
	if (subMenuID = "Bag"){
		BattleBag();
	}
	if (subMenuID = "Pokemon"){
		//Option to swap pokemon in combat
		BattleTeam();
	}
	if (subMenuID = "Flee"){
		//Overworld() return to overworld map
		console.log("You fled");
	}
}

function BattleMoveMenu(){
	//Animation code goes here
}
function BattleBag(){
	//Come back later
}
function BattleTeam(){
	var teamSize = teamMon.length;
	for (var i = 0; i < teamSize; i++){
		TeamSummary(teamMon[i]);
	}
}

function TeamPositionSwap(from, to){
	var movingMon = teamMon[from];
	teamMon[from] = teamMon[to];
	teamMon[to] = movingMon;
}

function BattleAttack(trainerMon, AIMon, selectedMove){
	//var selectedMove = trainerMon.MoveList[0];
	//var enemyMove = AIMon.MoveList[Math.floor(Math.random() * 4)];
	var enemyMove = AIMon.MoveList[2];
	
	//For use in animation
	var tMonStartHP = trainerMon.HealthPoints;
	var aMonStartHP = AIMon.HealthPoints;
	
	if (trainerMon.Speed > AIMon.Speed){
		MoveUse(selectedMove, trainerMon, AIMon);
		if (AIMon.HealthPoints <= 0){
			console.log(trainerMon.PokemonName + " wins!");
			return 1;
		}		
		MoveUse(enemyMove, AIMon, trainerMon);
		if (trainerMon.HealthPoints <= 0){
			console.log(AIMon.PokemonName + " wins!");
			return 2;
		}	
	}
	else{
		MoveUse(enemyMove, AIMon, trainerMon);
		if (trainerMon.HealthPoints <= 0){
			console.log(AIM.PokemonName + " wins!");
			return 2;
		}	
		MoveUse(selectedMove, trainerMon, AIMon);
		if (AIMon.HealthPoints <= 0){
			console.log(trainerMon.PokemonName + " wins!");
			return 1;
		}	
	}

	if (trainerMon.Status == "Poison" || trainerMon.Status == "Burn")
		trainerMon.HealthPoints = trainerMon.HealthPoints - Math.floor(HPCalc(trainerMon.Level, trainerMon.Health)/16);
	if (AIMon.Status == "Poison" || AIMon.Status == "Burn")
		AIMon.HealthPoints = AIMon.HealthPoints - Math.floor(HPCalc(AIMon.Level, AIMon.Health)/16);
	
	if (trainerMon.HealthPoints <= 0){
		console.log(AIM.PokemonName + " wins!");
		return 2;
	}	

	if (AIMon.HealthPoints <= 0){
		console.log(trainerMon.PokemonName + " wins!");
		return 1;
	}	
	
	
	return 0;
}


//Keep persistent test code below this line

function backEndTesting(){
	registeredPokemon.push(new Pokemon("Bulbasaur", 1, 1, "Grass", "None", 1, 45, 49, 49, 65, 45));
	var bulbasaur = registeredPokemon[0];
	enemyMon.push(new Pokemon("Squirtle", 2, 7, "Water", "None", 1, 44, 48, 65, 50, 43));
	var squirtle = enemyMon[0];
	//console.log(pkmn.PokemonName);
	//console.log(typeMults[0][5]);
	//PokemonConsoleSummary(bulbasaur);
	//console.log("HP: " + bulbasaur.HealthPoints);
	BattleAttack(bulbasaur, squirtle, bulbasaur.MoveList[0]);
	//console.log("Past the turn");
	//PowerLeveler(bulbasaur, 4)
	//PokemonName, PokemonID, PokedexID, primaryType, secondaryType, Level, Health, Attack, Defense, Special, Speed){
	//Move(MoveID, MoveName, MoveType, PowerPoints, MovePower, Accuracy, Inflicts, InflictChance)	
}

function PokemonConsoleSummary(Pkmn){
	console.log("Name: " + Pkmn.PokemonName);
	console.log("ID#: " + Pkmn.PokemonID);
	console.log("Dex#: " + Pkmn.PokedexID);
	console.log("primaryType: " + Pkmn.primaryType);
	console.log("secondaryType: " + Pkmn.secondaryType);
	console.log("Move 1: " + Pkmn.MoveList[0].MoveName);
	console.log("Move 2: " + Pkmn.MoveList[1].MoveName);
	console.log("Move 3: " + Pkmn.MoveList[2].MoveName);
	console.log("Move 4: " + Pkmn.MoveList[3].MoveName);
	console.log("Level: " + Pkmn.Level);
	console.log("Attack: " + Pkmn.Attack);
	console.log("Defense: " + Pkmn.Defense);
	console.log("Special: " + Pkmn.Special);
	console.log("Speed: " +Pkmn.Speed);
	console.log("primaryTypeNum: " + Pkmn.primaryTypeNum);
	console.log("secondaryTypeNum: " + Pkmn.secondaryTypeNum);
	//Pokemon(PokemonName, PokemonID, PokedexID, primaryType, secondaryType, Attack, Defense, Special, Speed) 
	//primaryTypeNum secondaryTypeNum  HealthPoints
	//Move(MoveName, MoveStyle, MovePower, PowerPoints, MoveType, MovePriority)
	return 0;
}

function BattleSummary(Pkmn, Pkmn2){
	console.log("Your HP: " + Pkmn.HealthPoints);
	console.log("Move 1: " + Pkmn.MoveList[0].MoveName);
	console.log("Move 2: " + Pkmn.MoveList[1].MoveName);
	console.log("Move 3: " + Pkmn.MoveList[2].MoveName);
	console.log("Move 4: " + Pkmn.MoveList[3].MoveName);
	console.log("Enemy HP: " + Pkmn2.HealthPoints);
	console.log("Move 1: " + Pkmn2.MoveList[0].MoveName);
	console.log("Move 2: " + Pkmn2.MoveList[1].MoveName);
	console.log("Move 3: " + Pkmn2.MoveList[2].MoveName);
	console.log("Move 4: " + Pkmn2.MoveList[3].MoveName);
	return 0;
}

function PokemonConsoleHP(Pkmn, Pkmn2){
	console.log("Your HP: " + Pkmn.HealthPoints);
	console.log("Enemy HP: " + Pkmn2.HealthPoints);
	return 0;
}

function TeamSummary(Pkmn){
	var name = Pkmn.PokemonName;
	console.log(name + " HP: " + Pkmn.Pkmn.HealthPoints);
}


