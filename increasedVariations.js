const fs = require('fs');
var stdin = process.openStdin(); 
stdin.setRawMode( true );
stdin.resume();
stdin.setEncoding( 'utf8' );

stdin.on( 'data', function( key ){
    // ctrl-c ( end of text )
    if ( key === '\u0003' ) {
      process.exit();
    }
    // write the key to stdout all normal like
    process.stdout.write( key );
  });

let eggTimer;

let emPaths = [
    'nativePC/em/em001/00', //Rathian
    'nativePC/em/em001/01', //Pink Rathian
    'nativePC/em/em002/00', //Ratholos
    'nativePC/em/em002/01', //Azur Rathalos
    'nativePC/em/em007/00', //Diablos
    'nativePC/em/em007/01', //Black Diablos
    'nativePC/em/em011', //Legiana
    'nativePC/em/em024', //Kushala Daora
    'nativePC/em/em027', //Teostra
    'nativePC/em/em036',
    'nativePC/em/em043',
    'nativePC/em/em044',
    'nativePC/em/em045',
    'nativePC/em/em0100',
    'nativePC/em/em102',
    'nativePC/em/em103',
    'nativePC/em/em105',
    'nativePC/em/em106',
    'nativePC/em/em107',
    'nativePC/em/em108',
    'nativePC/em/em109',
    'nativePC/em/em110',
    'nativePC/em/em111',
    'nativePC/em/em112',
    'nativePC/em/em113',
    'nativePC/em/em114',
    'nativePC/em/em115',
    'nativePC/em/em116',
    'nativePC/em/em118',
    'nativePC/em/em120'
];

let availablePaths = [];
let currentPathIndex = 0;

function randVariations() {
    for(let i = 0; i < availablePaths; i++){
        fs.rename(availablePaths[i], availablePaths[i] + '_', function(err){
            if(err)
            {
                console.log('Error toggling ' + availablePaths[i]);
            }
            else{
                console.log('Success toggling ' + availablePaths[i]);
            }
        })
    }
}

function beginScript() {
    eggTimer = setInterval(randVariations, 60000);
}

function endScript() {
    clearInterval(eggTimer);
    for(let i = 0; i < emPaths.length; i++){
        emPaths[i] = emPaths[i] + "_"
    }

    for(let i = 0; i < emPaths.length; i++){
        fs.rename(emPaths[i], emPaths[i].slice(0,emPaths[i].length-1), function(err){
            if(err){
                console.log('Error resetting ', emPaths[i]);
            }
            else{
                console.log('Success resetting', emPaths[1]);
            }
        })
    }
}

function setUp() {
    fs.readFile(emPaths[currentPathIndex], doesPathExist);
}

function doesPathExist(err, data){
    if(err){
        console.log(emPaths[currentPathIndex] + ' does not exist!');
    }
    else{
        availablePaths.push(emPaths[currentPathIndex]);
    }
    currentPathIndex = currentPathIndex++;
    if(currentPathIndex === (emPaths.length - 1)){
        beginScript();
    }
    else{
        setUp();
    }
}