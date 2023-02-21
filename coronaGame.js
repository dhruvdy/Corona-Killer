const startbtn = document.getElementById('startbtn');
const startScreen = document.getElementById('startScreen')
let space = document.querySelectorAll('#space')[0];
let scoreBoard = document.querySelectorAll('.score>span')[0];

space.height=window.innerHeight;
space.width=window.innerWidth;

let tool = space.getContext("2d");
startbtn.addEventListener('click',startGame)

let earthimg=new Image();
earthimg.src = "images/earth.png";
let bgroundimg= new Image();
bgroundimg.src = "images/space.jpg";
let coronaimg = new Image();
coronaimg.src = "images/corona.png";
let eheight=80;
let ewidth=80;
let eposx=space.width/2-40;
let eposy=space.height/2-40;


class planet{
    constructor(x,y,width,height){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
    }
    draw(){
    tool.drawImage(earthimg,this.x,this.y,this.width,this.height);
    }
}

class corona {
    constructor(x,y,width,height,velocity){
        this.x=x;
        this.y=y;
        this.width = width;
        this.height = height;
        this.velocity = velocity;
    }
     draw(){
        tool.drawImage(coronaimg,this.x,this.y,this.width,this.height);
    }
    update(){
        this.x=this.x-this.velocity.x;
        this.y=this.y-this.velocity.y;
        tool.drawImage(coronaimg,this.x,this.y,this.width,this.height);
    }
}

class bullet{
    constructor(x,y,width,height,velocity){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.velocity = velocity;
    }
    draw(){
    tool.fillStyle = "rgb(255,255,255)";
    tool.fillRect(this.x,this.y,this.width,this.height);
    }    
    update(){
        tool.fillStyle = "rgb(255,255,255)";
        this.x=this.x+this.velocity.x;
        this.y=this.y+this.velocity.y;
        tool.fillRect(this.x+this.velocity.x,this.y+this.velocity.y,10,10);
    }
}

let bullets = [];
let coronas = [];
function animate(){
    tool.clearRect(0,0,space.width,space.height);
    tool.fillRect(0,0,space.width,space.height);
    tool.drawImage(bgroundimg,0,0,space.width,space.height);
    let earth = new planet(eposx,eposy,ewidth,eheight);
    earth.draw();
    for(let i=0;i<bullets.length;++i){
        bullets[i].update();
        if(bullets[i].x<0 || bullets[i].y<0 || bullets[i].x>space.width || bullets[i].y>space.height) {
            setTimeout(() => {
            bullets.splice(i,1);
            });
        } 
    }

    for(let i=0;i<coronas.length;++i){
        coronas[i].update();
        if(collision(earth,coronas[i])){
            alert('Game OVER!!!!! Click OK to restart.');
            bullets.length=0;
            coronas.length=0;
            scoreBoard.innerText = 0+"";
        }
        bullets.forEach((bulet,buletIndex)=>{
            if(collision(coronas[i],bulet)) 
            {coronas.splice(i,1);bullets.splice(buletIndex,1);
                scoreBoard.innerText = parseInt(scoreBoard.innerText) + 100+"";
            }
        })
        } 
    let idd = requestAnimationFrame(animate);
}

function collision(entity1,entity2){
    let l1=entity1.x;
    let r1 = entity1.x+entity1.width;
    let l2 = entity2.x;
    let r2 = entity2.x + entity2.width;
    let b1 = entity1.y;
    let t1 = entity1.y + entity1.height;
    let b2 = entity2.y;
    let t2 = entity2.y + entity2.height;
    if(l1<r2 && l2<r1 && t1>b2 && t2>b1) return true;
    return false;
}

function createcorona(){
    setInterval(() => {
        let x=Math.random()*space.width;
        let y=Math.random()*space.height;
        let delta=Math.random();
        if(delta<0.5){
            x=Math.random()<0.5?0:space.width;
            y=Math.random()*space.height;
        }
        else{
            y=Math.random()<0.5?0:space.height;
            x=Math.random()*space.width;           
        }
        let angle = Math.atan2(y-space.height/2,x-space.width/2);
        let velocity={
            x:Math.cos(angle),
            y:Math.sin(angle)
        }
        let coro = new corona(x,y,40,40,velocity);
        coronas.push(coro);
        coro.draw();
    }, 1000);
}
function startGame(e){
    
    e.stopImmediatePropagation()
    startScreen.style.display = 'none';
    animate();
    createcorona();
    window.addEventListener("click",function(e){
       console.log(e);
       let angle = Math.atan2(e.clientY-space.height/2,e.clientX-space.width/2);
       let velocity = {
        x:5*Math.cos(angle),
        y:5*Math.sin(angle)
       }
       var fire = new bullet(eposx+40,eposy+40,10,10,velocity);
       bullets.push(fire);

       
      // animate();
     //  animate(fire)
       //bullet.update();
    })
}