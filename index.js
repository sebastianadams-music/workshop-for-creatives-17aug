var vid;
var w, h, tow, toh;
var x, y, tox, toy;
var zoom = .0001; //zoom step per mouse tick 
let gameStarted = false;
let song
let zoomCount = 1
let zoomChange = zoom/10
let lowPass, highPass
let textStatusContent = "not set"
let zoomTouches = []
let eventDelta = 0
let lastEventDelta = 0
let e = 0
let lasttouchx, lasttouchy
let introtext

function preload() {
    soundFormats('mp3')
    song = loadSound("s/NikoPhilippElenaKat.mp3", function(){vid = createVideo(
        ['s/NikoPhilippElenaKath264.mp4'], vidLoad
      )})
    
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

  // textStatusContent = "gamestarted"

       //tween/smooth motion
  x = lerp(x, tox, .1);
  y = lerp(y, toy, .1);
  w = lerp(w, tow, .1); 
  h = lerp(h, toh, .1);


  image(vid, x-w/2, y-h/2, w, h);
  vid.speed(zoomCount)
  song.rate(zoomCount)
  // console.log(x - initialx)
  // textSize(windowWidth/6)
  // textAlign(CENTER, CENTER)
  // text(textStatusContent, windowWidth/6, windowWidth/6)


    // let hpf = 20 + -8*(x - initialx)
    // hpf = constrain(hpf, 120, 13000)
    // highPass.freq(hpf)
    // // console.log(hpf)
    // lowPass.freq(13000)

    // highPass.freq(120)
    let filterVal = Math.abs(initialx - tox)
    bandPass.res(map(filterVal, 1, 200, 1, 4))
    bandPass.freq(map(tox, -300, 500, 6000, 9000))
    // let lpf = scaleValue(tox, [-400, 0], [150, 12000])
    // lowPass.freq(lpf)
    // console.log(lpf)
}
}
  
  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }
  
  function vidLoad() {
    vid.hide()
    button = createButton(`Start Performance!
    (Use your fingers to pan and zoom in the video)
    [(]works best if you play together with friends]`);
    // color("white")
    // textAlign(CENTER, CENTER)
    button.width = windowWidth/3
    button.position(50, windowHeight/2);
    

    // center(button)
    button.mousePressed(() => {
        button.remove();
                            gameStarted = true; 
                            
                            vid.loop(1); 
                            vid.volume(0)
                            bandPass = new p5.BandPass()
                            bandPass.freq(8000)
                            bandPass.res(1)
                            // lowPass.freq(100)
                            song.disconnect()
                            song.connect(bandPass)
                            song.play()

                        })
    // vid.loop();
    // vid.volume(0);
    
  }

  function mouseDragged() {
    tox += mouseX-pmouseX;
    toy += mouseY-pmouseY;
  }



  
  function touchStarted() {
    lasttouchx = touches[0].x
    lasttouchy = touches[0].y
    if (touches.length == 2) {//check if two fingers touched screen
      dist1 = Math.hypot( //get rough estimate of distance between two fingers
      touches[0].x - touches[1].x,
      touches[0].y - touches[1].y);
  }
  }
  function touchMoved(event) {
    // textStatusContent = "touchmoved"
    // event.preventDefault()
    
    // if (touches.length == 1){

      tox += (touches[0].x-lasttouchx)/5;
      toy += (touches[0].y-lasttouchy)/5;
      // touchDragged(touches[0].x, touches[0].y, lasttouchx, lasttouchy)
      lasttouchx = touches[0].x
      lasttouchy = touches[0].y
      textStatusContent = Math.round(initialx - tox) // Math.round(zoomCount)

    // }

    if (touches.length == 2){

      var dist2 = Math.hypot( //get rough estimate of new distance between two fingers
      touches[0].x - touches[1].x,
      touches[0].y - touches[1].y);
       

      zoomTouches = [touches[0].y, touches[1].y].sort() 
      lastEventDelta = eventDelta
      eventDelta =  - zoomTouches[0] + zoomTouches[1]

      e = eventDelta

      // if (eventDelta > 0) {
      //   e = 30
      // }
      // else{
      //   e = -30
      // }

      e = (lastEventDelta - eventDelta)
      // e = e + (lastEventDelta - eventDelta)
     
      // textStatusContent = Math.round(e)
    
    if (dist1<dist2) { //zoom in
      for (var i=0; i<30; i++) {
        if (tow>30*width) return; //max zoom
        tox -= zoom * (touches[0].x - tox);
        toy -= zoom * (touches[0].y - toy);
        tow *= zoom+1;
        toh *= zoom+1;
        zoomCount -= zoomChange
        textStatusContent = Math.round(initialx - tox) // Math.round(zoomCount)
      }
    }
    
    if (dist2<dist1) { //zoom out
      for (var i=0; i<30; i++) {
        if (tow<width/2) return; //min zoom
        tox += zoom/(zoom+1) * (touches[0].x - tox); 
        toy += zoom/(zoom+1) * (touches[0].y - toy);
        toh /= zoom+1;
        tow /= zoom+1;
        zoomCount += zoomChange
        textStatusContent = Math.round(tox) // Math.round(zoomCount)

      }
    }
    }

    return false
  }

  function mouseWheel(event) {
    event.preventDefault()
    var e = -event.delta;
  
    if (e>0) { //zoom in
      for (var i=0; i<e; i++) {
        if (tow>30*width) return; //max zoom
        tox -= zoom * (mouseX - tox);
        toy -= zoom * (mouseY - toy);
        tow *= zoom+1;
        toh *= zoom+1;
        zoomCount -= zoomChange
        textStatusContent = "zoom in"
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
        textStatusContent = "zoom out"

      }
    }

    return false
  }


  function scaleValue(value, from, to) {
    var scale = (to[1] - to[0]) / (from[1] - from[0]);
    var capped = Math.min(from[1], Math.max(from[0], value)) - from[0];
    return ~~(capped * scale + to[0]);
  }