(function(){
"use strict";
var boot=document.getElementById("bootScreen"),deploy=document.getElementById("bootDeploy"),bootHelp=document.getElementById("bootHelp"),bootTrack=document.getElementById("bootTrack");
var manual=document.getElementById("bootManual"),manualClose=document.getElementById("bootManualClose");
var menuTrack={title:"Synthwave House Loop",artist:"Fupi",src:"https://opengameart.org/sites/default/files/synthwavehouse_0.ogg",license:"CC0"};
var battleTracks=[
 {title:"MindStream",artist:"DST",src:"https://opengameart.org/sites/default/files/DST-MindStream.mp3",license:"CC0"},
 {title:"Technological Messup",artist:"Centurion_of_war",src:"https://opengameart.org/sites/default/files/tecnological_messup_v2.ogg",license:"CC0"},
 {title:"Claimed by the Void",artist:"vitalezzz",src:"https://opengameart.org/sites/default/files/claimed_by_the_void_loop.mp3",license:"CC0"},
 {title:"Brute Force",artist:"vitalezzz",src:"https://opengameart.org/sites/default/files/brute_force_loop.mp3",license:"CC0"},
 {title:"Bilwe",artist:"cinameng",src:"https://opengameart.org/sites/default/files/bilwe.mp3",license:"CC0"},
 {title:"Calm Loop",artist:"wipics",src:"https://opengameart.org/sites/default/files/Relaxing_0.mp3",license:"CC0"}
];
var preferredGameplayTrack={title:"Exploration Theme",artist:"Cleyton Kauffman",src:null,license:"CC0"};
var music=new Audio(),musicOn=true,musicVolume=.30,currentKind="",battleIndex=-1,failed={};
music.preload="auto";music.loop=false;

function uiTrack(t){
 var name=document.getElementById("musicTrackName"),toggle=document.getElementById("musicToggle"),mv=document.getElementById("musicVolume"),mvv=document.getElementById("musicVolumeVal");
 if(name&&t)name.textContent=t.title+" · "+t.artist;
 if(toggle)toggle.textContent=musicOn?"Music on":"Music off";
 if(mv)mv.value=Math.round(musicVolume*100);
 if(mvv)mvv.textContent=Math.round(musicVolume*100)+"%";
 if(bootTrack&&t)bootTrack.textContent=t.title+" // "+t.license;
}
function playTrack(t,kind){
 if(!t||!t.src)return;
 currentKind=kind;music.pause();music.src=t.src;music.volume=musicVolume;music.loop=kind==="menu";
 uiTrack(t);
 if(musicOn)music.play().catch(function(){});
}
function nextBattle(){
 if(!battleTracks.length)return;
 var tries=0;
 do{battleIndex=(battleIndex+1)%battleTracks.length;tries++;}while(failed[battleIndex]&&tries<=battleTracks.length);
 if(tries>battleTracks.length)return;
 playTrack(battleTracks[battleIndex],"battle");
}
function prevBattle(){
 if(!battleTracks.length)return;
 battleIndex=(battleIndex-1+battleTracks.length)%battleTracks.length;
 playTrack(battleTracks[battleIndex],"battle");
}
function startMenuMusic(){if(currentKind!=="menu")playTrack(menuTrack,"menu");else if(musicOn)music.play().catch(function(){});}
function deployGame(){
 startMenuMusic();
 if(boot)boot.classList.add("dismissed");
 setTimeout(function(){battleIndex=Math.floor(Math.random()*battleTracks.length)-1;nextBattle();},420);
}
music.addEventListener("ended",function(){if(currentKind==="battle")nextBattle();});
music.addEventListener("error",function(){if(currentKind==="battle"&&battleIndex>=0){failed[battleIndex]=true;setTimeout(nextBattle,80);}});

function injectMusicControls(){
 var host=document.querySelector(".audioControls");if(!host||document.getElementById("musicToggle"))return;
 var box=document.createElement("div");box.className="musicPanel";
 box.innerHTML='<div class="musicRow"><button id="musicToggle" class="musicToggle" type="button">Music on</button><div class="musicMeta">BATTLE PLAYLIST<strong id="musicTrackName">—</strong></div><button id="musicPrev" class="musicSkip" type="button" aria-label="Previous track">◀</button><button id="musicNext" class="musicSkip" type="button" aria-label="Next track">▶</button></div><input id="musicVolume" type="range" min="0" max="100" value="30" aria-label="Music volume">';
 host.appendChild(box);
 var toggle=document.getElementById("musicToggle"),mv=document.getElementById("musicVolume");
 toggle.addEventListener("click",function(){musicOn=!musicOn;if(musicOn)music.play().catch(function(){});else music.pause();uiTrack(currentKind==="menu"?menuTrack:battleTracks[battleIndex]);});
 mv.addEventListener("input",function(){musicVolume=Number(mv.value)/100;music.volume=musicVolume;uiTrack(currentKind==="menu"?menuTrack:battleTracks[battleIndex]);});
 document.getElementById("musicNext").addEventListener("click",nextBattle);
 document.getElementById("musicPrev").addEventListener("click",prevBattle);
}
if(deploy)deploy.addEventListener("click",deployGame);
if(bootHelp)bootHelp.addEventListener("click",function(){if(manual)manual.classList.toggle("open");});
if(manualClose)manualClose.addEventListener("click",function(){if(manual)manual.classList.remove("open");});
if(boot){["pointerdown","touchstart"].forEach(function(evt){boot.addEventListener(evt,startMenuMusic,{once:true,passive:true});});}
injectMusicControls();uiTrack(menuTrack);
window.GraphWarMusic={menu:menuTrack,battle:battleTracks,next:nextBattle,previous:prevBattle,preferredGameplayTrack:preferredGameplayTrack};
})();