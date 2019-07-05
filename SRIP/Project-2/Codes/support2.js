//Getting the Canvas Element
var c = document.getElementById("myCanvas"); 
var context = c.getContext("2d");

//Google "html5 compositing"
context.globalCompositeOperation = 'source-over';

//For Printing The Values
var p0=document.getElementById("print0");
var p1=document.getElementById("print1");
var p2=document.getElementById("print2");
var p3=document.getElementById("print3");
var p4=document.getElementById("print4");
var p5=document.getElementById("print5");
var p6=document.getElementById("print6");
var p7=document.getElementById("print7");
var p8=document.getElementById("print8");
var p9=document.getElementById("print9");

//Declaring the variables for input values
var width, height;//for width and Height of the Polygon
var polyside;//For Sides Of the Polygon
var polyco;//For storing the coordinates in Text Form
var polygonPath=[];//For Storing actual Coordinates;
var lineRecord=[];
var coordinates=[[2,2],[2,8],[8,8],[8,2],[10,10],[12,13],[14,15],[16,17],[18,19],[20,21]];//temporary storage of coordinates
var activeEdge=[];


//For Informing Initial Function If all Values are correct and within the range or not
var wrongInputs=0;

//Multiplication factor For Printing In canvas
var factor=50;

//Scanline Current;
var scanline =0;
//EvenOdd Varaible
var even =0;

//Update Function
function update() 
{
    //Updating variable for wrong inputs
    wrongInputs=0;

    //Updating Scanline Current;
    scanline =0;

    //Updating EvenOdd Variable
    even=0;

    //Getting the values given by the user
    width=document.getElementById("width").value;
    height=document.getElementById("height").value;
    polyco = document.getElementById("polyco").value;
    polyside=document.getElementById("polyside").value;

    //Clearing canvas
    context.clearRect(0,0,550,550);

    //Clearing all back values
    polygonPath=[];
    lineRecord=[];
    activeEdge=[];

    //Updating Factor
    var greater;
    if(height>=width)
        greater=height;
    else
        greater=width;

    factor=Math.round(500.0/greater);
    if(factor%2!=0)
        factor--;


    //Clearing the Printing Area
    p1.innerHTML="Updates The Values ";
    p2.innerHTML="Now Start The Experiment";
    p3.innerHTML="";
    p4.innerHTML="";
    p5.innerHTML="";
    p6.innerHTML="";
    p7.innerHTML="";
    p8.innerHTML="";
    p9.innerHTML="";
    p0.innerHTML="";

    //Alert Conditions On entering wrong values by the user 
    var alreadyChecked=1;

    //Checking For the Wrong Inputs Given By the User
    if(width>25 || height>25 || width<1 || height<1)//for correct frame values 
    {
        p1.innerHTML="";
        p2.innerHTML="";
        alert("For Frame Width and Height\nMin. Value is 1\nMax. value is 25\nRe-enter the Values and Update");
        wrongInputs =1;
        alreadyChecked=0;
    }
    if(alreadyChecked)//for min. and max. polygon coordinate values
    {
        var p=0;var ev=0;
        for(var q=0;q<polyco.length;q++)
        {
            if(polyco[q]== " " || polyco[q]== ",")
            {
                var t = Number(polyco.substring(p,q));
                p=q+1;
                if(t<0 || (ev%2==0 && t>=width) || (ev%2!=0 && t>=height))
                {
                    p1.innerHTML="";
                    p2.innerHTML="";
                    alert("Polygon \nMin. value of coordinates (0,0)\nMax. value of coordinates ("+(width-1)+","+(height-1)+")\nRe-enter the Values and Update");
                    wrongInputs=1;
                    break;
                }
                ev++;
            }
        }
    }
    alreadyChecked=1;
    if(polyside<3 || polyside>10)//for correct polygon sides
    {
        p1.innerHTML="";
        p2.innerHTML="";
        alert("Min. Value of Polygon Sides is 3 \nMax. Value of Polygon Sides is 10\nRe-enter the Values and Update");
        wrongInputs=1;
        alreadyChecked=0;

    }
    var commaCount =0;
    var spaceCount =0;
    for (var i = 0; i < polyco.length; i++) //for correct order of inputs in textarea
    {
        if(polyco[i] == "," && commaCount<polyside )
            commaCount++;
        if(polyco[i] == " " && commaCount<polyside)
            spaceCount++;
        if(isNaN(polyco[i]) && (polyco[i]!=" ") && (polyco[i]!=","))
        {
            p1.innerHTML="";
            p2.innerHTML="";
            alert("Polygon Coordinates Entered Wrong\nEnter the Coordinates in format - x1 y1,x2 y2,x3 y3,\nRe-enter the Values and Update");
            wrongInputs=1;
            alreadyChecked=0;
            break;
        }   
    }
    if(alreadyChecked)  
    {
        if(commaCount<polyside)
        {
            p1.innerHTML="";
            p2.innerHTML="";
            alert("Enter the Remaining Coordinates and Update");
            wrongInputs=1;
        }
        else if(spaceCount!=polyside)
        {
            p1.innerHTML="";
            p2.innerHTML="";
            alert("Remove The Extra Spaces\nEnter the Coordinates in format - x1 y1,x2 y2,x3 y3,\nRe-enter the Values and Update");
            wrongInputs=1;
        }
    }
}
//Start Experiment Connected with it
function initial()
{
    update();//Updates The Values
    if(wrongInputs)//For Checking Wrong inputs
    {
    }
    else//If all values Are correct
    {
        p1.innerHTML="";
        p2.innerHTML="";
        var x=0,y=0;
        var j=0,i=0;
        for(i=0;i<polyco.length;i++)
        {
            if(polyco[i]== " " || polyco[i]== ",")
            {
                coordinates[x][y]=Number(polyco.substring(j,i));
                y++;
                j=i+1;
                if(polyco[i] == ",")
                {
                    x++;
                    y=0;
                }
            }
        }
        for (i = 0; i<polyside; i++) 
        {
            polygonPath.push([coordinates[i][0], coordinates[i][1]]);
        }
        p2.innerHTML=polygonPath;
        drawPolygon(polygonPath);
        drawGrid();
    }

}
//For Next iteration
function nextIteration()
{
    if(scanline<height)
        scanPolygon();
        
    else if(scanline==height)
    {
        p1.innerHTML="Polygon Filled";
        p2.innerHTML="Experiment Ends Here";
        p3.innerHTML="To perform Again Re-enter the Values and Update";
        p4.innerHTML="";
        p5.innerHTML="";
        p6.innerHTML="";
        p7.innerHTML="";
        p8.innerHTML="";
        p9.innerHTML="";
        p0.innerHTML="";
        scanline++;
    }
    else
    {
    }
}   

//For previous iteration
function previousIteration() 
{   // body...
}


//scanline algorithm main
function scanPolygon()
{

    p1.innerHTML="Scanline - "+scanline;
    if(even%2==0)
    {
        activeEdge=[];
        for(var i=0;i<width;i++)
        {
            fillbox(i,scanline,"white");
        }   

        var intersection=findIntersection(polygonPath[polygonPath.length-1],polygonPath[0],polygonPath[1]);
        if(intersection!=-1)
        {
            activeEdge.push(intersection);
        }

        for(var i=0;i<polygonPath.length-2;i++)
        {
            intersection=findIntersection(polygonPath[i],polygonPath[i+1],polygonPath[i+2]);
            if(intersection!=-1)
            {
                activeEdge.push(intersection);
            }
        }

        intersection=findIntersection(polygonPath[polygonPath.length-2],polygonPath[polygonPath.length-1],polygonPath[0]);
        if(intersection!=-1)
        {
            activeEdge.push(intersection);
        }

        activeEdge = sort(activeEdge);
        p2.innerHTML="Active Edges Found are";
        p3.innerHTML=activeEdge;
        for(var i=0;i<activeEdge.length;i++)
        {
            fillbox(activeEdge[i][0],activeEdge[i][1],"red");
        }
        even++; 
    }   
    else 
    {   
        p2.innerHTML="Filling Polygon Between The Active Edges";
        for(var i=0;i<activeEdge.length;i+=2)
        {
            for(var j=activeEdge[i][0];j<=activeEdge[i+1][0];j++)
            {   
                fillbox(j,scanline,"red");
            }
        }

        if(scanline<height)
            scanline++;
        even++;
    }
}
//Function To find Intersection with scanline w.r.t to a line
function findIntersection(point0,point1,point2)
{
    var intersectionPoints =[];//Where Intersection will be stored
    var x0=point0[0];
    var y0=point0[1]; 
    var x1=point1[0];
    var y1=point1[1];
    var x2=point2[0];
    var y2=point2[1];
    if((y1>scanline && y2>scanline) || (y1<scanline && y2<scanline) )
    {
        intersectionPoints.push(-1);
    }
    else if(y1==scanline)
    {   if(y0==scanline && y2==scanline)
        {
        }
        else
        {   
            intersectionPoints.push(x1,y1);
            if((y0<scanline && y2<scanline) || (y0>scanline && y2>scanline))
            {
                var forpush = [x1,y1];
                activeEdge.push(forpush);
            }
        }   
    }
    else if(y1!=scanline && y2!=scanline)
    {
        if(x1==x2)
        {
            intersectionPoints.push(x1,scanline);
        }
        else
        {   
            var m=(y2-y1)/(x2-x1);
            var x= Math.round(((scanline - y1)/m) +x1);
            intersectionPoints.push(x,scanline);
        }
    }
    else 
    {
        intersectionPoints=-1;
    }
    return(intersectionPoints);
}


//Sort Function for Active Edges
function sort(path)
{
    for(var i=0;i<path.length;i++)
    {
        for(var j=0;j<path.length-1;j++)
        {
            if(path[j][0]>path[j+1][0])
            {
                var t=path[j];
                path[j]=path[j+1];
                path[j+1]=t;
            }
        }
    }
    return(path);
}


//Draws the Polygon  
function drawPolygon(path)
{
    var leftMargin =40;
    var bottomMargin =510;
    var align=factor/2;
    context.beginPath();
    context.moveTo(path[0][0]*factor+leftMargin+align,bottomMargin-path[0][1]*factor-align);
    for(i=1; i<path.length; i++)
    {
        context.lineTo(path[i][0]*factor+leftMargin+align,bottomMargin-path[i][1]*factor-align);
    }
    context.lineTo(path[0][0]*factor+leftMargin+align,bottomMargin-path[0][1]*factor-align);
    context.lineWidth = 3;
    context.strokeStyle = "yellow";
    context.stroke();
}

//Draws The Grid
function drawGrid()
{
    var leftMargin =40;
    var bottomMargin =510;
    var align=(factor/2)-5;
    context.beginPath();
    for(i=0; i<=width; i++)
    {
        if(i<width)
        {
            context.fillStyle = "white";
            context.font="15px Arial";
            context.fillText(i,leftMargin+i*factor+align,bottomMargin+15)
        }
        context.moveTo(leftMargin+i*factor,bottomMargin);
        context.lineTo(leftMargin+i*factor,bottomMargin-height*factor);
    }
    for(i=0; i<=height; i++)
    {
        if(i<height)
        {
            context.fillStyle = "white";
            context.font="15px Arial";
            context.fillText(i,leftMargin-15,bottomMargin-i*factor-align)
        }
        context.moveTo(leftMargin,bottomMargin-i*factor);
        context.lineTo(leftMargin+width*factor,bottomMargin-i*factor);
    }
    context.lineWidth = 1;
    context.strokeStyle = 'white';
    context.stroke();
}

//fills boxes with colour and Point given
function fillbox(x,y,colour)
{
    //filling box
    var leftMargin =40;
    var bottomMargin =510;
    var align=(factor/2)-5;
    context.fillStyle = colour;
    //context.clearRect(leftMargin+x*factor,bottomMargin-y*factor-factor,factor+1,factor+1);
    context.fillRect(leftMargin+x*factor,bottomMargin-y*factor-factor,factor-1,factor-1);
    /*Filling grid bloack again 
    context.moveTo(leftMargin,bottomMargin);
    context.lineTo(leftMargin+(x+1)*factor,bottomMargin);
    context.lineTo(leftMargin+(x+1)*factor,bottomMargin-(y+1)*factor);
    context.lineTo(leftMargin,bottomMargin-(y+1)*factor);
    context.lineTo(leftMargin,bottomMargin);
    context.strokeStyle="black";
    context.stroke();*/
    //Reprinting the Polygon
    drawPolygon(polygonPath);
}