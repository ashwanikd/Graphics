/**
 *@author Ashwani kumar dwivedi ashwanikd0123@gmail.com
 *@version 1.0
 *the file is written for drawing maze generation graphics on the browser window using
 *HTML5 canvas and WebGL library and javascript. to run the code open the HTML file in the browser
 *and make sure it is run in WebGL enabled browser like Google Chrome, Firefox. and allow javascript and
 *webgl in the browser.
 */

// vertex shader source
var VSHADER_SRC =   'attribute vec4 a_Position;'+'\n'+
                    'attribute vec4 a_Color;'+'\n'+
                    'varying vec4 v_Color;'+'\n'+
                    'attribute float a_PointSize;'+'\n'+
                    'uniform mat4 u_modelMatrix;'+'\n'+
                    'void main(){'+'\n'+
                    '   gl_Position = u_modelMatrix * a_Position;'+'\n'+
                    '   gl_PointSize = a_PointSize;'+'\n'+
                    '   v_Color = a_Color;'+'\n'+
                    '}'+'\n';         

// fragment shader source
var FSHADER_SRC =   'precision mediump float;'+'\n'+
                    'varying vec4 v_Color;'+'\n'+
                    'void main(){'+'\n'+
                    '   gl_FragColor = v_Color;'+'\n'+
                    '}'+'\n';

/**
 *@Variable a_Position stores the location of attribute a_Position
 *@Variable a_PointSize stores location of attribute a_PointSize
 *@Variable a_Color stores location of attribute a_Color
 */
var a_Position;
var a_PointSize;
var a_Color;
var u_modelMatrix;
var modelMatrix;

/**
 *@Variable vertexBuffer buffer for vertices
 */
var vertexBuffer;

/**
 *@variable FSIZE to store size of single data element in bytes of array
 */
var FSIZE;

// webgl context
var gl;

// canvas element in html
var canvas;

// animation function
var animate;

// id of requestAnimationFrame
var animationID;

/**
 *@author Ashwani kumar dwivedi ashwanikd0123@gmail.com
 *@version 1.0
 *@function main
 *exectuion starts from main function
 */
function main(){
    // retriving canvas element
    canvas = document.getElementById('drawing_canvas');
    if(!canvas){
        console.log('unable to retrive canvas element');
    }
    
    // setting width and height
    if(window.innerHeight<window.innerWidth){
        canvas.width = window.innerHeight;
        canvas.height = window.innerHeight;
    }else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerWidth;
    }
    
    // getting webgl context from canvas
    gl = getWebGLContext(canvas);
    if(!gl){
        console.log('unable to retrive webgl context');
    }
    
    // initializing shaders
    if(!initShaders(gl,VSHADER_SRC,FSHADER_SRC)){
        console.log('unable to initialize shaders');
    }
    
    // getting locations of attributes and uniform variables
    a_Position = gl.getAttribLocation(gl.program,'a_Position');
    a_PointSize = gl.getAttribLocation(gl.program,'a_PointSize');
    a_Color = gl.getAttribLocation(gl.program,'a_Color');
    u_modelMatrix = gl.getUniformLocation(gl.program,'u_modelMatrix');
    
    if(a_Position<0){
        console.log('unable to retrive location of a_Position from shader programs');
    }
    if(a_PointSize<0){
        console.log('unable to retrive location of a_PointSize from shader programs');
    }
    if(a_Color<0){
        console.log('unable to retrive location of a_Color from shader programs');
    }
    if(u_modelMatrix<0){
        console.log('unable to retrive location of u_modelMatrix from shader programs');
    }
    
    // initializing buffers
    vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
        console.log('unable to create vertex buffer');
    }
    
    // binding buffer object to ARRAY_BUFFER
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    
    modelMatrix = new Matrix4();
    
    makeCube();
    
    draw();
    
    var animate = function(){
      animationID = requestAnimationFrame(animate);
      draw();
    };
    animationID = requestAnimationFrame(animate);
   
    canvas.onmousedown = function(ev){
        mousedown(ev);
    };
    
    canvas.onmousemove = function(ev){
        mousemove(ev);
    };
    
    canvas.onmouseup = function(){
        mouseup();
    };
    
}

function makeCube(){
    var d = 0.2;
    points.push(d,d,d,1.0,1.0,0.0,0.0, -d,d,d,1.0,1.0,0.0,0.0, -d,-d,d,1.0,1.0,0.0,0.0, -d,-d,d,1.0,1.0,0.0,0.0, d,d,d,1.0,1.0,0.0,0.0, d,-d,d,1.0,1.0,0.0,0.0);
    n+=6;
}

/**
 *Data about all the shapes stored in this variable
 *form of the data will be
 *x coordinate,y coordinate,pointsize,color(RGB)
 */
var points = [];

// number of shapes
var n=0;

// so that the binding of buffers happen only once
var check = false;

// scaling values
var scaleX = 1.0;
var scaleY = 1.0;
var scaleZ = 1.0;

// rotating axis values
var rx=0,ry=1,rz=0;
var angle=0.0;

/**
 *@author Ashwani kumar dwivedi ashwanikd0123@gmail.com
 *@version 1.0
 *@function draw
 *Draw the graphics on the canvas by taking data from the variables
 */
function draw(){
    // clearing the canvas for drawing
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // getting data in webgl supported format
    vertices = new Float32Array(points);
    FSIZE = vertices.BYTES_PER_ELEMENT;
    
    // passing data to buffers
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
    
    // passing data to a_Position attribute
    if(!check){
        gl.vertexAttribPointer(a_Position,3,gl.FLOAT,false,FSIZE*7,0);
        gl.enableVertexAttribArray(a_Position);
        
        // passing data to a_PointSize attribute
        gl.vertexAttribPointer(a_PointSize,1,gl.FLOAT,false,FSIZE*7,FSIZE*3);
        gl.enableVertexAttribArray(a_PointSize);
        
        // passing data to a_Color attribute
        gl.vertexAttribPointer(a_Color,3,gl.FLOAT,false,FSIZE*7,FSIZE*4);
        gl.enableVertexAttribArray(a_Color);
        check = true;
        
        //modelMatrix.setScale(scaleX, scaleY, scaleZ);
        modelMatrix.setRotate(angle, rx, ry, rz);
    }
    
    // setting model matrix
    //modelMatrix.scale(scaleX, scaleY, scaleZ);
    
    // passing transformtion matrix
    gl.uniformMatrix4fv(u_modelMatrix, false, modelMatrix.elements);
    
    // drawing command to webgl graphics
    gl.drawArrays(gl.TRIANGLES,0,n);
}

/**
 *@author Ashwani kumar dwivedi ashwanikd0123@gmail.com
 *@version 1.0
 *@function zoom
 *zoom in or out the picture area as mouse wheel moves
 */
function zoom(ev){
    if(ev.deltaY<0){
        scaleX+=0.01;
        scaleY+=0.01;
        scaleZ+=0.01;
    }else{
        scaleX-=0.01;
        scaleY-=0.01;
        scaleZ-=0.01;
    }
    draw();
}

var rotate = false;
var x1,y1,x2,y2;

function mousedown(ev){
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect() ;
  
    x1 = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y1 = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
    rotate = true;
}

function mousemove(ev){
    if(!rotate) return;
        var x = ev.clientX; // x coordinate of a mouse pointer
        var y = ev.clientY; // y coordinate of a mouse pointer
        var rect = ev.target.getBoundingClientRect() ;
      
        x2 = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
        y2 = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
        
        rx = x1-x2;
        ry = y2-y1;
        rz = 0;
        
        angle = 2.0;//Math.sqrt(Math.pow(rx,2)+Math.pow(ry,2))*2;
        modelMatrix.rotate(angle, rx, ry, rz);
        draw();
        ev.preventDefault();
    
}

function mouseup(){
    rotate = false;
}