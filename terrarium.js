var wall = {};

function elementFromCharacter(character) {
  if (character == "") {
    return undefined;
  }
  else if (character == "#") {
    return wall;
  }
  else if (character == "o") {
    return new StupidBug();
  }
}

wall.character = "#";
StupidBug.prototype.character = "o";

function characterFromElement(element) {
  if (element == undefined) {
    return " ";
  }
  else {
    return element.character;
  }
}

function Terrarium(plan) {
  var grid = new Grid(plan[0].length, plan.length);
  for (var y = 0; y < plan.length; y++) {
    var line = plan[y];
    for (var x = 0; x < line.length; x++) {
      grid.setValueAt(new Point(x, y), elementFromCharacter(line.charAt(x)));
    }
  }
  this.grid = grid;
}
  
Terrarium.prototype.toString = function() {
  var characters = [];
  var endOfLine = this.grid.width - 1;
  this.grid.each(function(point, value) {
    characters.push(characterFromElement(value));
    if (point.x == endOfLine) {
      characters.push("\n");
    }
  });
  return characters.join("");
}

Terrarium.prototype.listActingCreatures = function() {
  var found = [];
  this.grid.each(function(point, value){
    if (value != undefined && value.act) {
      found.push({object: value, point: point});
    }
  });
  return found;
};

Terrarium.prototype.listSurroundings = function(center) {
  var result = {};
  var grid = this.grid;
  directions.each(function(name, direction) {
    var place = center.add(direction);
    if (grid.isInside(place)) {
      result[name] = characterFromElement(grid.valueAt(place));
    }
    else {
      result[name] = "#";
    }
  });
  return result;
};

Terrarium.prototype.processCreature = function(creature) {
  var action = creature.object.act(this.listSurroundings(creature.point));
  if (action.type == "move" && directions.contains(action.direction)) {
    // book error?
    var to = creature.point.add(directions.lookup(action.direction));
    if (this.grid.isInside(to) && this.grid.valueAt(to) == undefined) {
      this.grid.moveValue(creature.point, to);
    }
  }
  else {
    throw new Error("Unsupported action: " + action.type);
  }
};

Terrarium.prototype.step = function() {
  forEach(this.listActingCreatures(), bind(this.processCreature, this));
};
