let canvas = document.getElementById('canvas');
let canvblock = document.getElementById('canblock');
let ctx = canvas.getContext('2d');

var blockSize = document.getElementById('canblock').getBoundingClientRect();

canvas.setAttribute('width', blockSize.width);
canvas.setAttribute('height', blockSize.height);

let canvasX = getOffset(canvas).left;
let canvasY = getOffset(canvas).top;

class Point{
    constructor(X,Y){
        this.X = X;
        this.Y = Y;
    }
}

let dragPointId;

let offset;

let points = [];

canvas.addEventListener('mousedown', function(e){

    points.forEach(function(item, index){
        if(checkPointInsideCircle(item, e.clientX - canvasX, e.clientY - canvasY, 7.5).result){
            canvas.addEventListener("mousemove", onMouseMove);
            canvas.addEventListener("mouseup", onMouseUp);
            dragPointId = index;
            offset = new Point(e.clientX - canvasX - item.X, e.clientY - canvasY - item.Y);
        }
        
    });
    
    if(points.length < 3){
        points.push(new Point(e.clientX - canvasX, e.clientY - canvasY));
    }

    draw(points);
});

function onMouseMove(e){
    points[dragPointId].X = e.clientX - canvasX - offset.X;
    points[dragPointId].Y = e.clientY - canvasY - offset.Y;
    draw(points);
}
function onMouseUp(e){
    canvas.removeEventListener("mousemove", onMouseMove);
    canvas.removeEventListener("mouseup", onMouseUp);
    draw(points);
}


function draw(array){
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    array.forEach(element => {
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(element.X, element.Y, 7, 0, Math.PI * 2);
        ctx.fill();
    });

    if(array.length==3){
        drawParallelogramCircle(array);
    }
}
function drawParallelogramCircle(array){
    
    let params = findparams(array);
    
    // Parallelogram
    ctx.beginPath();
    ctx.moveTo(params.first.X, params.first.Y);
    ctx.lineTo(params.second.X, params.second.Y);
    ctx.lineTo(params.third.X, params.third.Y);
    ctx.lineTo(params.fourth.X, params.fourth.Y);
    ctx.closePath();
    ctx.strokeStyle = '#2980b9';
    ctx.stroke();
    
    // Circle
    let circleR = Math.sqrt(params.S / Math.PI);
    ctx.beginPath();
    ctx.arc(params.centre.X, params.centre.Y, circleR, 0, Math.PI * 2);
    ctx.strokeStyle = '#f1c40f';
    ctx.stroke();

    // Output params
    outPut(params.first, params.second, params.third, params.fourth, params.centre,params.S);
}

function findparams(array){

    let firstPoint = array[0];
    let secondPoint = array[1];
    let thirdPoint = array[2];


    let k1 = (secondPoint.Y - firstPoint.Y) / (secondPoint.X - firstPoint.X);
    let b1 = firstPoint.Y - firstPoint.X * k1;
    let b2 = thirdPoint.Y - k1 * thirdPoint.X;
    let k3 = (thirdPoint.Y - secondPoint.Y) / (thirdPoint.X - secondPoint.X);
    let b3 = secondPoint.Y - k3 * secondPoint.X;
    let b4 = firstPoint.Y - k3 * firstPoint.X;

    let x4 = (b2 - b4) / (k3 - k1);
    let y4 = k3 * x4 + b4;

    // p - perpendicular
    let sideLenght = Math.sqrt(Math.pow(thirdPoint.X - secondPoint.X, 2) + Math.pow(thirdPoint.Y - secondPoint.Y, 2));
    let kp = -1/k3;
    let bp = firstPoint.Y - kp * firstPoint.X;
    let xp = (b3 - bp) / (kp - k3);
    let yp = kp * xp + bp;
    let pLenght = Math.sqrt(Math.pow(xp - firstPoint.X, 2) + Math.pow(yp - firstPoint.Y, 2));
    let Sparalel = sideLenght * pLenght; 

    // c - centre
    let kc1 = (y4 - secondPoint.Y) / (x4 - secondPoint.X);
    let bc1 = secondPoint.Y - kc1 * secondPoint.X;
    let kc2 = (thirdPoint.Y - firstPoint.Y) / (thirdPoint.X - firstPoint.X);
    let bc2 = firstPoint.Y - kc2 * firstPoint.X;
    let xc  = (bc2 - bc1) / (kc1 - kc2);
    let yc  = kc1 * xc + bc1;

    return{
        first: firstPoint,
        second: secondPoint,
        third: thirdPoint,
        fourth: new Point(x4, y4),
        S: Sparalel,
        centre: new Point(xc, yc)
    };
}

function outPut(point1, point2, point3, point4, centrePoint,S){

    let outPoint1 = document.getElementById('point1');
    let outPoint2 = document.getElementById('point2');
    let outPoint3 = document.getElementById('point3');
    let outPoint4 = document.getElementById('point4');
    let outCentrePoint = document.getElementById('centrePoint');
    let outS = document.getElementById('s');
    
    outPoint1.innerHTML = 'x: ' + point1.X.toFixed(2) + ', '+ 'y: '+point1.Y.toFixed(2);
    outPoint2.innerHTML = 'x: ' + point2.X.toFixed(2) + ', '+ 'y: '+point2.Y.toFixed(2);
    outPoint3.innerHTML = 'x: ' + point3.X.toFixed(2) + ', '+ 'y: '+point3.Y.toFixed(2);
    outPoint4.innerHTML = 'x: ' + point4.X.toFixed(2) + ', '+ 'y: '+point4.Y.toFixed(2);
    outCentrePoint.innerHTML = 'x: ' + centrePoint.X.toFixed(2) + ', '+ 'y: '+centrePoint.Y.toFixed(2);
    outS.innerHTML = S.toFixed(0);
 
}

function checkPointInsideCircle(point, X, Y, R){
    let result = Math.sqrt(Math.pow(X - point.X, 2) + Math.pow(Y - point.Y, 2)) <= R;
    return{
        result: result
    };
}

function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY
    };
}

function clearCanvas(){
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    points = [];
}