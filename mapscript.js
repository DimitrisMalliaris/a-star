//
// Button clicks
//
document.getElementById("submit").onclick = function() {
    if(document.getElementById("lock").value === '0'){
        CreateMap();
    }
}
document.getElementById("reset").onclick = function() {
    if(document.getElementById("lock").value === '0'){
        ClearMap();
    }
}
document.getElementById("pathfinder").onclick = function() {
    if(document.getElementById("lock").value === '0'){
        PathFind();
    }
}
document.getElementById("randomize").onclick = function() {
    if(document.getElementById("lock").value === '0'){
        Randomize();
    }
}
//
// Global variables
//
var rows = 0;
var columns = 0;
var startx = "";
var starty = "";
var endx = "";
var endy = "";
var cntrlIsPressed = false;
var shiftIsPressed = false;
//
// Methods
//
// Key press (for shift and ctrl)
document.addEventListener('keydown', function(args) {
    console.log(args.keyCode);
    if(args.keyCode === 16) {
        cntrlIsPressed = true;
    } else if(args.keyCode === 17) {
        shiftIsPressed = true;
    }
})
document.addEventListener('keyup', function(args) {
    console.log(args.keyCode);
    if(args.keyCode === 16) {
        cntrlIsPressed = false;
    } else if(args.keyCode === 17) {
        shiftIsPressed = false;
    }
})
// Create Map
function CreateMap ()
{
    // Get rows and columns
    rows = document.getElementById("rows").value;
    columns = document.getElementById("columns").value;
    // check values
    if(rows == 0 || columns == 0){
        alert("Please enter correct values");
        return;
    }
    // Create table 
    var str = "";
    for(var i = 0; i < rows; i++){
        str += "<tr>";
        for(var j = 0; j < columns; j++){
            str += "<td onclick='CellClick(" + i + "," + j + ");' id =" + i + "," + j + ">  </td>";
        }
        str += "<tr>";
    }
    document.getElementById("map").innerHTML = str;
}
// Create random obstacle 
function Randomize(){
    // iterate
    for(var i = 0; i < columns; i++){
        for( var j = 0 ; j < rows; j++){
            // Randomly create obstacle 20% chance
            if(Math.random() < 0.2){
                document.getElementById(j+','+i).style.backgroundColor = "gray";
            }
        }
    }
}
// Reset map
function ClearMap(){
    // iterate
    for(var i = 0; i < columns; i++){
        for( var j = 0 ; j < rows; j++){
            // restore default
            document.getElementById(j+','+i).style.backgroundColor = "azure";
            document.getElementById(j+','+i).innerHTML = "";
            document.getElementById(j+','+i).style.color = "black";
        }
    }
    // restore global variables
    startx = "";
    starty = "";
    endx = "";
    endy = "";
}
// Map cell click
function CellClick(r,c)
{
    if(document.getElementById("lock").value === '1'){
        return;
    }
    // Check if cntrl is pressed (ASSIGN START)
    if(cntrlIsPressed){
        // get START coordinates
        var id = starty + ',' + startx;
        // Clear previous START
        if(id != ","){
            document.getElementById(id).style.backgroundColor = "azure";
            document.getElementById(id).style.color = "black";
            document.getElementById(id).innerHTML = "";
        }
        // Assign new START
        startx = c;
        starty = r;
        id = starty + ',' + startx;
        document.getElementById(id).style.backgroundColor = "black";
        document.getElementById(id).innerHTML = "Start";
        document.getElementById(id).style.color = "white";

        // IF AUTOPATH equals TRUE RUN METHOD
        if(document.getElementById("autopath").checked){
            PathFind();
        }
    }
    // Check if shift is pressed (ASSIGN END)
    else if(shiftIsPressed){
        // get END coordinates
        var id = endy + ',' + endx;
        // Clear previous END
        if(id != ","){
            document.getElementById(id).style.backgroundColor = "azure";
            document.getElementById(id).style.color = "black";
            document.getElementById(id).innerHTML = "";
        }
        // Assign new END
        endx = c;
        endy = r;
        id = endy + ',' + endx;
        document.getElementById(id).style.backgroundColor = "black";
        document.getElementById(id).innerHTML = "End";
        document.getElementById(id).style.color = "white";

        // IF AUTOPATH = TRUE RUN METHOD
        if(document.getElementById("autopath").checked){
            PathFind();
        }
    }
    // Create/Remove Obstacle
    else{
        if(document.getElementById(r+','+c).style.backgroundColor == "gray"){
            document.getElementById(r+','+c).style.backgroundColor = "azure";
        }
        else{
            document.getElementById(r+','+c).style.backgroundColor = "gray";
        }
    }
}