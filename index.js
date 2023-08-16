var vid;
var w, h, tow, toh;
var x, y, tox, toy;
var zoom = .01; //zoom step per mouse tick 
let gameStarted = false;
let song


function preload() {
    song = loadSound("s/NikoPhilippElenaKat.mp3")
    
    soundFormats('mp3')
    vid = createVideo(
        ['s/NikoPhilippElenaKath264.mp4'], vidLoad
      )
  }
  

function setup() {
    createCanvas(windowWidth, windowHeight);
    w = tow = vid.width;
    h = toh = vid.height;
    x = tox = w / 2;
    y = toy = h / 2;
    
    
    

}

function draw() {
    background(0);
 if (gameStarted){

       //tween/smooth motion
  x = lerp(x, tox, .1);
  y = lerp(y, toy, .1);
  w = lerp(w, tow, .1); 
  h = lerp(h, toh, .1);


  image(vid, x-w/2, y-h/2, w, h);
  if ((w - x) >= 130 && (w - x) <= 400){
    vid.speed(1)
    song.rate(1)
    console.log(w - x, 1)

  }
  else{
    
        let spd = 1 - (((w - x) - 400) / 700) 
        vid.speed(spd)
        song.rate(spd)
        console.log(w - x, spd)
      
  }
 }
}
  
  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }
  
  function vidLoad() {
    vid.hide()
    button = createButton("Start performance");
    button.position(windowWidth/2, windowWidth/2);
    button.mousePressed(() => {
        button.remove(); 
                            gameStarted = true; 
                            
                            vid.loop(1); 
                            vid.volume(0)
                            song.play()
                        })
    // vid.loop();
    // vid.volume(0);
    
  }

  function mouseDragged() {
    tox += mouseX-pmouseX;
    toy += mouseY-pmouseY;
  }
  
  function mouseWheel(event) {
    var e = -event.delta;
  
    if (e>0) { //zoom in
      for (var i=0; i<e; i++) {
        if (tow>30*width) return; //max zoom
        tox -= zoom * (mouseX - tox);
        toy -= zoom * (mouseY - toy);
        tow *= zoom+1;
        toh *= zoom+1;
      }
    }
    
    if (e<0) { //zoom out
      for (var i=0; i<-e; i++) {
        if (tow<width) return; //min zoom
        tox += zoom/(zoom+1) * (mouseX - tox); 
        toy += zoom/(zoom+1) * (mouseY - toy);
        toh /= zoom+1;
        tow /= zoom+1;
      }
    }
  }