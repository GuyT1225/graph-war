(function(){
"use strict";
var boot=document.getElementById("bootScreen"),deploy=document.getElementById("bootDeploy"),bootHelp=document.getElementById("bootHelp"),bootTrack=document.getElementById("bootTrack");
var MENU_SRC="https://opengameart.org/sites/default/files/synthwavehouse_0.ogg";
var GAME_FALLBACK_SRC="https://opengameart.org/sites/default/files/Relaxing_0.mp3";
var tracks={
 menu:{title:"Synthwave House Loop",artist:"Fupi",src:MENU_SRC,loop:true},
 game:{title:"Calm Loop · temp field channel",artist:"wipics",src:GAME_FALLBACK_SRC,loop:true},
 preferred:{title:"Exploration Theme",artist:"Cleyton Kauffman",src:null,loop:true}
};
var music=new Audio(),musicOn=true,musicVolume=.32,currentMode="";
music.preload="auto";music.loop=true;
function setTrack(mode,autoplay){
 var t=tracks[mode];if(!t||!t.src)return;
 if(currentMode===mode){if(autoplay&&musicOn)music.play().catch(function(){});return;}
 currentMode=mode;music.pause();music.src=t.src;music.loop=t.loop;music.volume=musicVolume;
 if(bootTrack)bootTrack.textContent=t.title+" // CC0";
 updateMusicUi(t);
 if(autoplay&&musicOn)music.play().catch(function(){});
}
function updateMusicUi(t){
 var name=document.getElementById("musicTrackName"),toggle=document.getElementById("musicToggle"),mv=document.getElementById("musicVolume"),mvv=document.getElementById("musicVolumeVal");
 if(name)name.textContent=(t||tracks[currentMode]||tracks.menu).title;
 if(toggle)toggle.textContent=musicOn?"Music on":"Music off";
 if(mv)mv.value=Math.round(musicVolume*100);
 if(mvv)mvv.textContent=Math.round(musicVolume*100)+"%";
}
function startMenuMusic(){setTrack("menu",true)}
function deployGame(){
 startMenuMusic();
 if(boot)boot.classList.add("dismissed");
 setTimeout(function(){setTrack("game",true);},480);
 try{sessionStorage.setItem("graphWarBooted","1");}catch(e){}
}
function injectMusicControls(){
 var host=document.querySelector(".audioControls");if(!host||document.getElementById("musicToggle"))return;
 var box=document.createElement("div");box.className="musicPanel";
 box.innerHTML='<div class="musicRow"><button id="musicToggle" class="musicToggle" type="button">Music on</button><div class="musicMeta">NOW PLAYING<strong id="musicTrackName">Synthwave House Loop</strong></div><span id="musicVolumeVal">32%</span></div><input id="musicVolume" type="range" min="0" max="100" value="32" aria-label="Music volume">';
 host.appendChild(box);
 var toggle=document.getElementById("musicToggle"),mv=document.getElementById("musicVolume");
 toggle.addEventListener("click",function(){musicOn=!musicOn;if(musicOn){music.volume=musicVolume;music.play().catch(function(){});}else music.pause();updateMusicUi();});
 mv.addEventListener("input",function(){musicVolume=Number(mv.value)/100;music.volume=musicVolume;updateMusicUi();});
 updateMusicUi();
}
if(deploy)deploy.addEventListener("click",deployGame);
if(bootHelp)bootHelp.addEventListener("click",function(){var h=document.querySelector(".howTo");if(h)h.open=true;deployGame();setTimeout(function(){if(h)h.scrollIntoView({behavior:"smooth",block:"center"});},520);});
if(boot){
 ["pointerdown","touchstart"].forEach(function(evt){boot.addEventListener(evt,startMenuMusic,{once:true,passive:true});});
}
injectMusicControls();
if(bootTrack)bootTrack.textContent="Synthwave House Loop // CC0";
window.GraphWarMusic={tracks:tracks,setTrack:setTrack,preferredGameplayTrack:tracks.preferred};
})();