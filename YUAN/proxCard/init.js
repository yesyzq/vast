var img0 = new Image();
var img1 = new Image();
var img2 = new Image();
    
init();
function init()
{
    img0.src = 'VAST_ProxZones_F1.jpg';
    img1.src = 'VAST_ProxZones_F2.jpg';
    img2.src = 'VAST_ProxZones_F3.jpg';
}

var ctx = document.getElementById('view').getContext('2d');
draw();
function draw()
{
        
    img0.onload = function()
        {
            ctx.drawImage(img0, 30, 30, 550, 420);
        }
    img1.onload = function()
        {
            ctx.drawImage(img1, 600, 30, 550, 420);
        }
    img2.onload = function()
        {
            ctx.drawImage(img2, 600, 480, 550, 420);
        }
}