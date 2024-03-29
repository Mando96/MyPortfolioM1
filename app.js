const text = document.getElementsByClassName('text');
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

//mouse position
let mouse = {
    x: null,
    y: null,
    radius: (canvas.height/100) * (canvas.width/100)
}

//Navbar Animation
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    

    burger.addEventListener('click',()=>{

        //Toggle Nav
        nav.classList.toggle('nav-active');
        
         //Animate links

    navLinks.forEach((link, index) => {
        if (link.style.animation){
            link.style.animation = ""
        }
        else {
            link.style.animation = `navLinkFade 0.8s ease forwards ${index / 7 + 0.8}s`;
        }
    });
    //Burger Animation
    burger.classList.toggle('toggle');

 });

 addEventListener('scroll', ()=>{

    //Toggle Nav
    nav.classList.toggle('nav-inactive');
    burger.classList.toggle('toggle');
    

});
   
}
////////Navbar Animation Ends/////

//mouse current positon
window.addEventListener('mousemove',
    function(event){
        mouse.x = event.x
        mouse.y = event.y
    }
);

//particle creation
class particle{
    constructor(x,y,directionX,directionY,size,color){
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    //method to draw individual particles
    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle ='#74f7e6';
        ctx.fill();
    }
    
    //check mouse and patticle positions, move the particle, draw the partcle
    update(){

        //check if particle is still withing canvas
        if(this.x > canvas.width || this.x < 0){
            this.directionX = -this.directionX;
        }
        if(this.y > canvas.height || this.y <0){
            this.directionY = -this.directionY;
        }

        //Check collision detection: mouse postion , particle position 
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt((dx*dx) + (dy*dy));
        
        if(distance < mouse.radius + this.size){
            if(mouse.x < this.x && this.x < canvas.width - this.size * 10){
                this.x += 5;
            }
            if(mouse.x > this.x && this.x > this.size * 10){
                this.x -= 5;
            }
            if(mouse.y < this.y && this.y < canvas.height - this.size * 10){
                this.y += 5;
            }
            if(mouse.y > this.y && this.y > this.size * 10){
                this.y -= 5;
            }
        }

        //move particle
        this.x += this.directionX;
        this.y += this.directionY;

        //draw praticles
        this.draw();
    }
}

//create particle array
function init(){
    particlesArray = [];
    let numberOfParticles = (canvas.width * canvas.height) / 8000;
    for(let i = 0; i < numberOfParticles; i++){
        let size = (Math.random() * 5 ) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size* 2 );
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size* 2 );
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;
        let color = '#8c5523';

        particlesArray.push(new particle(x, y, directionX, directionY, size, color));
    }
}

//check if particles are close enough to draw line between the
function connect(){
    let opacityValue = 1;
    for(let a = 0; a < particlesArray.length; a++){
        for(let b = a; b < particlesArray.length; b++){
            let distance = (( particlesArray[a].x - particlesArray[b].x) 
            * (particlesArray[a].x - particlesArray[b].x)) 
            + ((particlesArray[a].y - particlesArray[b].y) 
            * (particlesArray[a].y - particlesArray[b].y));
            if(distance < (canvas.width / 7) * (canvas.height / 7)){
                opacityValue = 1 - (distance / 20000);
                ctx.strokeStyle = 'rgba(205, 247, 242,' + opacityValue + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

//animation loop
function animate(){
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for(let i =0; i < particlesArray.length; i++){
        particlesArray[i].update();
    }
    connect();
}

// resize event
window.addEventListener('resize',
    function(){
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = ((canvas.height / 80) * (canvas.width /80));
        init();
    }
);

//mouse out event
window.addEventListener('mouseout',
    function(){
        mouse.x = undefined;
        mouse.y = undefined;
    }
);

init();
//animate();
//navSlide();

/* Code needs to be studied (Kuno)
function fullPage(){
    $("#js-fullpage").fullpage({
        easingcss3:"cubic-bezier(0.645, 0.045, 0.355, 1)",scrollingSpeed:1e3,anchors:["top","reile","about","contact"],
        navigation:!0,navigationPosition:"left",
        animateAnchor:!1,
        onLeave:function(index,nextIndex,direction){
            if(1==index)anime({
                targets:".scrollDown",translateY:"180%",duration:500,easing:"easeInOutCubic"
            });
            if(1==nextIndex)anime({
                targets:".scrollDown",
                translateY:["180%",0],duration:500,easing:"easeInOutCubic"
            });
            if(0==state){
                var nextClass=".fp-section-"+nextIndex;
                anime.timeline().add({
                    targets:nextClass+" .image",
                    scale:[.85,1],
                    translateX:["10%",0],
                    translateZ:0,
                    easing:"easeOutCubic",
                    duration:1500,delay:500
                })
                .add({
                    targets:nextClass+" .image__cover",
                    translateX:[0,"110%"],translateZ:0,
                    easing:"easeInOutQuart",
                    duration:function(el,i){
                        return 1200-200*i},offset:"-=1700"
                })
                .add({
                    targets:nextClass+" .page-num p",
                    translateY:["100%",0],
                    translateZ:0,easing:"easeInOutCubic",
                    duration:1e3,offset:"-=1200"
                })
                .add({
                    targets:nextClass+" .js-letter",
                    translateX:["-105%",0],
                    translateZ:0,easing:"easeInOutCubic",
                    duration:800,
                    delay:function(el,i){
                        return 50*i
                    },
                    offset:"-=1500"
                });
                if(1==index)anime({
                    targets:".js-moon",
                    translateX:[0,"100%"],
                    translateZ:0,
                    opacity:[1,0],
                    easing:"easeOutCubic",
                    duration:800,
                    delay:function(el,i){
                        return 50*i
                    }
                });
                if(1==nextIndex)anime({
                    targets:".js-moon",translateX:["100%",0],
                    translateZ:0,
                    opacity:[0,1],
                    easing:"easeOutCubic",
                    duration:800,
                    delay:function(el,i){
                        return 500+50*i
                    }
                })
            }
        },
        afterLoad:function(anchorLink,index){},
        afterRender:function(){
            $(".section").each(function(i){
                var num=i+1;
                $(this).addClass("fp-section-"+num)
            })
        }
    })
}
function headerColor(){
    var pageName=$(".barba-container").attr("data-namespace");
    $(window).on("scroll",function(){
        "top"!==pageName && $(window).scrollTop() > $(window).height() ? ($("header").addClass("js-color"), $(".back-arrow").addClass("js-color")):($("header").removeClass("js-color"), $(".back-arrow").removeClass("js-color"))
    })
}
$('<img src="./assets/img/reile.jpg">'),
$('<img src="./assets/img/about.jpg">'),
$('<img src="./assets/img/contact.jpg">'),
$(window).on("load",function(){
    anime.timeline().add({
        targets:".loader",
        translateY:[0,"-100%"],
        translateZ:0,easing:"easeInOutCubic",
        duration:800,complete:function(){
            $(".loader").addClass(".js-hidden")
        }
    })
    .add({
        targets:".js-moon",
        translateX:["100%",0],
        translateZ:0,
        opacity:[0,1],
        easing:"easeOutCubic",
        duration:800,
        delay:function(el,i){
            return 500+50*i
        },
        offset:"-=1000"
    })
    .add({
        targets:".active .js-letter",
        translateX:["-105%",0],
        translateZ:0,
        easing:"easeInOutCubic",
        duration:800,
        delay:function(el,i){
            return 50*i
        },
        offset:"-=1200"
    })
});
var $win=$(window),
fpnav={},
image={},
imageBig={},
isSp=!1;
$(function(){
    $win.on("load resize",function(){
        isSp=!0,
        fpnav={
            y:"100%",
            x:0
        },
        image={
            width:"80%",
            height:"55.633%",
            top:"9.859%",
            marginRight:"10%",
            marginLeft:"10%"
        },
        imageBig={
            width:"100%",
            height:"65.492%",
            marginLeft:0,
            top:0
        }
        console.log("sp"+isSp),
            window.matchMedia("(min-width: 801px)").matches?(isSp=!1,fpnav={
                y:0,
                x:"-100%"
            },
            image={
                width:"53.125%",
                height:"74.81%",
                top:"auto",
                marginRight:"8%",
                marginLeft:"auto"
            },
            imageBig={
                width:"60.677%",
                height:"100vh",
                marginLeft:"auto",
                top:"auto"
            },
        console.log("pc"+isSp)):
        window.matchMedia("(min-width: 421px)").matches && (isSp=!1,fpnav={
                y:"100%",
                x:0
            },
            image={
                width:"53.125%",
                height:"74.81%",
                marginRight:40,
                marginLeft:"auto"
            },
            imageBig={
                width:"60.677%",
                height:"100vh",top:"auto",
                marginLeft:"auto"
            },
            console.log("tb"+isSp)
        )
    })
}),

Barba.Pjax.originalPreventCheck=Barba.Pjax.preventCheck,
Barba.Pjax.preventCheck = function(evt,element){
    return!!($(element).attr("href") && -1 < $(element).attr("href").indexOf("#")) || Barba.Pjax.originalPreventCheck(evt,element)
};

var state=0;

Barba.Dispatcher.on("newPageReady",function(){
    if(
        $("#js-fullpage").length)new Parallax($(".js-parallax-moon").get(0)),new Parallax($(".js-parallax-moonlight").get(0)),new Parallax($(".js-parallax-star").get(0));
        isSp && $(".page-top").height($(window).height()),ga("send","pageview",window.location.pathname.replace(/^\/?/,"/")+ window.location.search)
}),

$(function(){
    fullPage();
    var height=$(window).height();
    $(".js-menuBtn").on("click",function(){
        $(".menuIcon").toggleClass("js-menuOpen"),$(".global-nav").toggleClass("js-open"),$(window).scrollTop()>height&&$("header").toggleClass("js-color"),$(this).hasClass("js-menuOpen")?
        (console.log("curation"),
        Barba.Pjax.getTransition=function(){
            return PageTransitionCurtain
        }):
        $("#js-fullpage").length?(console.log("top"),Barba.Pjax.getTransition=function(){
            return PageTransitionTop
        }):
        (console.log("under"),Barba.Pjax.getTransition=function(){
            return PageTransitionUnder
        })
    })
});

var topTransition=Barba.BaseView.extend({
    namespace:"top",onEnter:function(){
        Barba.Pjax.getTransition=function(){
            return PageTransitionTop
        },
        $(".js-contact").on("click",function(){
            $(".menuIcon").removeClass("js-menuOpen"),
            $(".global-nav").removeClass("js-open"),
            $.fn.fullpage.moveTo("contact"),
            Barba.Pjax.getTransition=function(){
                return PageTransitionTop
            }
        })
    },
    onEnterCompleted:function(){},
    onLeave:function(){},
    onLeaveCompleted:function(){
        $.fn.fullpage.destroy("all")
    }
});

topTransition.init();

var underLayer=Barba.BaseView.extend({
    namespace:"underlayer",
    onEnter:function(){
        Barba.Pjax.getTransition=function(){
            return PageTransitionUnder
        },
        $(window).scroll(function(){
            $(".js-scroll").each(function(i){
                $(window).scrollTop() + $(window).height() >
                $(this).offset().top&&$(this).addClass("in")
            })
        }),
        isSp && $(".page-top").height($(window).height()), console.log(isSp)
    },
    onEnterCompleted:function(){
        headerColor();
        anime.timeline({
            duration:500,
            easing:"easeInOutCubic"
        })
        .add({
            targets:".btn-wrap",
            translateY:["110%",0]
        })
        .add({
            targets:".back-arrow svg",
            translateX:["100%",0],
            offset:"-=500"
        })
        .add({
            targets:".scrollDown",
            translateY:["180%",0],
            offset:"-=500"
        })
    },
    onLeave:function(){
        state=1;
        anime.timeline({
            duration:500,
            easing:"easeInOutCubic"
        })
        .add({
            targets:".btn-wrap",
            translateY:[0,"110%"]
        })
        .add({
            targets:".back-arrow svg",
            translateX:[0,"-100%"],
            offset:"-=500"
        })
    },
    onLeaveCompleted:function(){
        fullPage(),state=0;anime.timeline({
            duration:500,
            easing:"easeInOutCubic"
        })
        .add({
            targets:".active .page-num p",
            translateY:["100%",0],
            translateZ:0
        })
        .add({
            targets:"#fp-nav ul",
            translateY:[fpnav.y,0],
            translateX:[fpnav.x,0],
            translateZ:0,offset:"-=500"
        })
        .add({
            targets:".fullpage__slide",
            background:["#020b16","rgba(0,0,0,0)"],
            offset:"-=500"
        })
        .add({
            targets:".active .btn-wrap",
            translateY:["110%",0],
            translateZ:0,offset:"-=500"
        })
    }
});

underLayer.init();
var PageTransitionTop = Barba.BaseTransition.extend({
    start:function(){
        this.open().then(this.newContainerLoading).then(this.finish.bind(this))
    },
    open:function(){
        return new Promise(function(resolve){
            anime.timeline({
                duration:500,
                easing:"easeInOutCubic",
                complete:function(){resolve()
                }
            })
            .add({
                targets:".active .image",
                width:[image.width,imageBig.width],
                height:[image.height,imageBig.height],
                marginRight:[image.marginRight,0],
                marginLeft:[image.marginLeft,imageBig.marginLeft],
                top:[image.top,imageBig.top]
            })
            .add({
                targets:".fullpage__slide",
                background:["rgba(0,0,0,0)","#020b16"],
                offset:"-=500"
            })
            .add({
                targets:".page-num p",
                translateY:[0,"100%"],
                translateZ:0,offset:"-=500"
            })
            .add({
                targets:"#fp-nav ul",
                translateY:[0,fpnav.y],
                translateX:[0,fpnav.x],
                translateZ:0,offset:"-=500"
            })
            .add({
                targets:".active .btn-wrap",
                translateY:[0,"110%"],
                translateZ:0,offset:"-=500"
            })
            .play()
        })
    },
    finish:function(){
        this.done()
    }
}),

PageTransitionCurtain = Barba.BaseTransition.extend({
    start:function(){
        this.open().then(this.newContainerLoading).then(this.finish.bind(this))
    },
    open:function(){
        return new Promise(function(resolve){
            anime({
                targets:".curtain",
                translateY:["100%",0],
                translateZ:0,
                duration:800,
                easing:"easeInOutCubic",
                complete:function(){
                    $(".menuIcon").removeClass("js-menuOpen"),
                    $(".global-nav").removeClass("js-open"),
                    $("body,html").scrollTop(0),
                    resolve()
                }
            })
        })
    },
    finish:function(){
        anime({
            targets:".curtain",
            translateY:[0,"-100%"],
            translateZ:0,
            duration:800,
            easing:"easeInOutCubic"
        });
        this.done()
    }
}),

PageTransitionUnder = Barba.BaseTransition.extend({
    start:function(){
        this.close().then(this.newContainerLoading).then(this.finish.bind(this))
    },
    close:function(){
        return new Promise(function(resolve){
            var closeAnime=anime.timeline({
                duration:500,
                easing:"easeInOutCubic",
                autoplay:!1,
                complete:function(){
                    resolve()
                }
            })
            .add({
                targets:".page-top .image",
                width:[imageBig.width,image.width],
                height:[imageBig.height,image.height],
                marginRight:[0,image.marginRight],
                marginLeft:[imageBig.marginLeft,image.marginLeft],
                top:[imageBig.top,image.top]
            });
            0!==$(window).scrollTop()?$("body,html").animate({scrollTop:0},500,"swing",closeAnime.play):
            closeAnime.play()
        })
    },
    finish:function(){
        this.done()
    }
});

$(function(){
    Barba.Pjax.start()
    Barba.Prefetch.init(),
    Barba.Utils.xhrTimeout=1e4
});

*/