//
// Global Variables
//
var openList;
var closedList;
var endingCell;
var startingCell;
var interval;
var currentCell;
var diagonally;
var fscorevisible;
var grid;
var pathFound;

// Heuristic calculating method
function heuristic(from, to){
    var d1 = Math.abs(to.column - from.column);
    var d2 = Math.abs(to.row - from.row);
    return d1 + d2;
}
async function PathFind(){
    pathFound = false;
    // Set lock
    document.getElementById("lock").value = 1;
    var result = await A_Star();
    if(result){
        alert('Done!');
    }
    // Unset lock
    document.getElementById("lock").value = 0;
}
async function A_Star(){
    // Get currentCell options
    interval = document.getElementById("interval").value;
    if(interval == undefined){
        interval = 20;
    }
    diagonally = document.getElementById("diagonal").checked;
    fscorevisible = document.getElementById("fvalues").checked;
    // Check if START/END point is assigned
    if(startx==="" || starty==="" || endx==="" || endy===""){
        if(!document.getElementById("autopath").checked){
            alert('Assign start and end position.');
        }
        return;
    }
    // Clear map except obstacles / start / end points
    for(var i = 0; i< columns; i++){
        for(var j = 0; j< rows; j++){
            id = j + ',' + i;
            if(document.getElementById(id).style.backgroundColor==="black"){
                continue;
            }
            document.getElementById(id).innerHTML="";
            if(document.getElementById(id).style.backgroundColor==="gray"){
                continue;
            }
            document.getElementById(id).style.backgroundColor="azure";
        }
    }
    grid = CreateGrid();
    // Create open/close lists
    openList = [];
    closedList = [];
    // Set Start/End cell
    endingCell = grid[endx][endy];
    startingCell = grid[startx][starty];
    startingCell.g = 0;
    startingCell.f = heuristic(startingCell, endingCell);
    // Add Starting cell to the open list
    openList.push(startingCell);
    // Set Starting Cell as currentCell point
    currentCell = startingCell;
    // Loop
    while(openList.length > 0){
        // Iterate openlist to find smallest fscore
        var currentCellIndex = 0;
        var lowestfscore = Infinity;
        for(var i = 0; i < openList.length; i++){
            if(openList[i].f<lowestfscore){
                currentCell = openList[i];
                lowestfscore = currentCell.f;
                currentCellIndex = i;
            }
        }
        // Stop if current is goal
        if(currentCell === endingCell){
            pathFound = true;
            ColorTiles();
            return true;
        }
        // remove from openlist - add to closed list
        openList.splice(currentCellIndex, 1);
        closedList.push(currentCell);
        // Find neighbors
        currentCell.addNeighbors();
        var neighbors = currentCell.neighbors;
        var diagonalNeighbors = currentCell.diagonalNeighbors;
        // Calculate Neighbors' g,h,f
        UpdateNeigbors(neighbors, 1);
        UpdateNeigbors(diagonalNeighbors, Math.sqrt(2));
        // Update colors of tiles
        ColorTiles();
        await sleep(interval);
    }
    alert('Cannot find path.');
    return false;
}
function UpdateNeigbors(neighbors, movementCost){
    for(var i = 0; i < neighbors.length; i++){
        if(closedList.includes(neighbors[i]) || neighbors[i].wall)
        {
            continue;
        }
        var tentative_gScore = currentCell.g + movementCost;
        if(tentative_gScore < neighbors[i].g){
            neighbors[i].g = tentative_gScore;
            neighbors[i].f = neighbors[i].g + heuristic(neighbors[i], endingCell);
            neighbors[i].parent = currentCell;
            neighbors[i].showf();
            if(!openList.includes(neighbors[i])){
                openList.push(neighbors[i]);
            }
        }
    }
}
function ColorTiles(){
    for(var i = 0; i < openList.length; i++){
        openList[i].Show("green");
    }
    for(var i = 0; i < closedList.length; i++){
        closedList[i].Show("red");
    }
    Draw_Path(currentCell);
}
function CreateGrid(){
    // Create grid
    var grid = [columns];
    for(var i = 0; i< columns; i++){
        grid[i] = new Array();
    }
    // Fill out grid with cells
    for(var i = 0; i< columns; i++){
        for(var j = 0; j< rows; j++){
            grid[i][j] = new Cell(i,j);
        }
    }
    return grid;
}
function Draw_Path(cell){
    cell.Show("cyan");
    if(pathFound === true){
        cell.Put("🦝");
    }
    if(cell.parent != undefined ){
        Draw_Path(cell.parent);
    }
}
function Cell(column,row){
    this.column = column;
    this.row = row;
    this.f = Infinity;
    this.g = Infinity;
    this.h = 0;
    this.parent = undefined;
    this.diagonalNeighbors = [];
    this.neighbors = [];
    this.wall = (document.getElementById(this.row+','+this.column).style.backgroundColor == "gray");
    this.Show = function(col){
        if(document.getElementById(this.row+','+this.column).style.backgroundColor === "black"){
            return;
        }
        document.getElementById(this.row+','+this.column).style.backgroundColor = col;
    }
    this.Put = function(text){
        document.getElementById(this.row+','+this.column).innerHTML = text;
    }
    this.showf = function(){
        if(!fscorevisible){
            return;
        }
        if(document.getElementById(this.row+','+this.column).style.backgroundColor === "black"){
            return;
        }
        document.getElementById(this.row+','+this.column).innerHTML = this.f.toFixed(2);
    }
    this.addNeighbors = function(){
        if(this.column < columns - 1){
            this.neighbors.push(grid[this.column + 1][this.row]);
        }
        if(this.column > 0){
            this.neighbors.push(grid[this.column - 1][this.row]);
        }
        if(this.row < rows - 1){
            this.neighbors.push(grid[this.column][this.row + 1]);
        }
        if(this.row > 0){
            this.neighbors.push(grid[this.column][this.row - 1]);
        }
        // continue if diagonally is checked
        if(!diagonally){
            return;
        }
        if(this.column > 0 && this.row > 0){
            this.diagonalNeighbors.push(grid[this.column - 1][this.row - 1]);
        }
        if(this.column > 0 && this.row < rows - 1){
            this.diagonalNeighbors.push(grid[this.column - 1][this.row + 1]);
        }
        if(this.column < columns - 1 && this.row > 0){
            this.diagonalNeighbors.push(grid[this.column + 1][this.row - 1]);
        }
        if(this.column < columns - 1 && this.row < rows - 1){
            this.diagonalNeighbors.push(grid[this.column + 1][this.row + 1]);
        }
    }
}
// sleep method
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}