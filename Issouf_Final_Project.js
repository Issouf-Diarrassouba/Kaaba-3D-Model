"use strict";

var canvas;
var gl;
var program; 

var rotation_Spinning_Direction = 1; 
var rotation_Direction_Speed = .09; 

var numVertices  = 36;

var pointsArray = [];
var colorsArray = [];
var texCoordsArray = [];

var yAxis = 1;
var axis = yAxis;

var theta = [0, -10, 0.0];

var thetaLoc;
var texture ;


var texCoord = [
    vec2(0, 0),   
    vec2(0, 1), 
    vec2(1, 1),   
    vec2(1, 0)  
];


var cube_scaling = 0.75;
var increasing_height_of_cube = 0.5;

var vertices = [
    vec4(-0.5 * cube_scaling, (-1.0 + increasing_height_of_cube) * cube_scaling,  0.5 * cube_scaling, 1.0 ),
    vec4(-0.5 * cube_scaling,  increasing_height_of_cube * cube_scaling,  0.5 * cube_scaling, 1.0 ),
    vec4(0.5 * cube_scaling,  increasing_height_of_cube * cube_scaling,  0.5 * cube_scaling, 1.0 ),
    vec4(0.5 * cube_scaling, (-1.0 + increasing_height_of_cube) * cube_scaling,  0.5 * cube_scaling, 1.0 ),
    vec4(-0.5 * cube_scaling, (-1.0 + increasing_height_of_cube) * cube_scaling, -0.5 * cube_scaling, 1.0 ),
    vec4(-0.5 * cube_scaling,  increasing_height_of_cube * cube_scaling, -0.5 * cube_scaling, 1.0 ),
    vec4(0.5 * cube_scaling,  increasing_height_of_cube * cube_scaling, -0.5 * cube_scaling, 1.0 ),
    vec4(0.5 * cube_scaling, (-1.0 + increasing_height_of_cube) * cube_scaling, -0.5 * cube_scaling, 1.0 )
];




var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black 
    vec4( 1.0, 0.843, 0.0, 0.9 ),  // Gold
    vec4( 1.0, 0.843, 0.0, 0.9 ),  // Gold
    vec4( 1.0, 0.843, 0.0, .9 ),  // Gold
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black 
    vec4( 1.0, 0.843, 0.0, 1.0 ),  // Gold
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.843, 0.0, 1.0 )  // Gold
];




function configureTexture(image) {

    var image = document.getElementById("texture");
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}


function quad(a, b, c, d) {

     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[b]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[1]);

     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[2]);

     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[2]);

     pointsArray.push(vertices[d]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[3]);
}


function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}




window.onload = function init(){
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.enable(gl.DEPTH_TEST);

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    colorCube();

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord");
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);

    configureTexture();

    thetaLoc = gl.getUniformLocation(program, "theta");

    

    document.getElementById("go").onclick = function(){axis = yAxis;};
    document.getElementById("stop").onclick = function(){axis = yAxis - 1;};
    document.getElementById('reverse').addEventListener('click', function() {
        rotation_Spinning_Direction *= -1; 
    });
    document.getElementById('plusspeed').addEventListener('click', function() {
        rotation_Direction_Speed += 0.01; 
    });
    
    document.getElementById('downspeed').addEventListener('click', function() {
        rotation_Direction_Speed -= 0.01; 
        if (rotation_Direction_Speed < 0) {
            rotation_Direction_Speed = 0;
        }
    });

 
    
    render();
}


var maxRotationAngle = 70;

var render = function() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta[axis] += rotation_Spinning_Direction * rotation_Direction_Speed;

    if (Math.abs(theta[axis]) >= maxRotationAngle) {
        rotation_Spinning_Direction *= -1;
        
        theta[axis] = maxRotationAngle * Math.sign(theta[axis]);
     
    }

    gl.uniform3fv(thetaLoc, theta);
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
    requestAnimFrame(render);
    
}
