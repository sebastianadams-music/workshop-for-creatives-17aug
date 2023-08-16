var vid;
var w, h, tow, toh;
var x, y, tox, toy;
var zoom = .01; //zoom step per mouse tick 
let gameStarted = false;
let song
let zoomCount = 1
let zoomChange = zoom/10
let lowPass, highPass


function preload() {
    soundFormats('mp3')
    song = loadSound("s/NikoPhilippElenaKat.mp3")
    vid = createVideo(
        ['s/NikoPhilippElenaKath264.mp4'], vidLoad
      )
  }
  

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    w = tow = windowWidth;
    h = toh = windowHeight * 9 / 16;
    x = tox = w / 2;
    y = toy = h / 2;
    initialx = x
    initialy = y

    
    


    
    
    

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
  vid.speed(zoomCount)
  song.rate(zoomCount)
  console.log(x - initialx)
  if ((x - initialx) < 0){
    let hpf = 20 + -8*(x - initialx)
    hpf = constrain(hpf, 120, 13000)
    highPass.freq(hpf)
    // console.log(hpf)
    lowPass.freq(13000)
  }
  else {
    highPass.freq(120)
    let lpf = 5000 - 8*(x - initialx)
    lpf = constrain(lpf, 120, 13000)
    lowPass.freq(lpf)
    // console.log(lpf)
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
                            lowPass = new p5.LowPass();
                            highPass = new p5.HighPass();
                            song.connect(lowPass)
                            song.connect(highPass)
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
        zoomCount -= zoomChange
      }
    }
    
    if (e<0) { //zoom out
      for (var i=0; i<-e; i++) {
        if (tow<width) return; //min zoom
        tox += zoom/(zoom+1) * (mouseX - tox); 
        toy += zoom/(zoom+1) * (mouseY - toy);
        toh /= zoom+1;
        tow /= zoom+1;
        zoomCount += zoomChange
      }
    }

    return false
  }