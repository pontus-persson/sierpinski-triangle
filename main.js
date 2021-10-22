var canvas, ctx;

jQuery(document).ready(function($) {

    canvas = document.getElementById('can');
    canvas.width = jQuery(window).width();
    canvas.height = jQuery(window).height();
    ctx = canvas.getContext("2d");
    // ctx.lineWidth = 3;
    // ctx.fillStyle = "#D3A664";
    // ctx.strokeStyle = "#F45E5A";
    // ctx.strokeStyle = "#22211F";
    // ctx.lineWidth = 1;

    tri = new triangle(
        canvas.width / 2, 0,
        0, canvas.height,
        canvas.width, canvas.height,
        Math.round(255 * Math.random()), Math.round(255 * Math.random()), Math.round(255 * Math.random()),
        0
    );
    tri.increaseDepth(7);

    var updateAll = function() {
        window.requestAnimFrame(updateAll);
        let col = randomRGB(tri.r, tri.g, tri.b);
        tri.updateColor(col.r, col.g, col.b);
        tri.updateChildren();
    }


    requestAnimFrame(updateAll);
});

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame  ||
        window.mozRequestAnimationFrame     ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();


function randomRGB(r, g, b) {
    return {
        r: clamp(r + ((Math.random() - 0.5) * 5), 0, 255),
        g: clamp(g + ((Math.random() - 0.5) * 5), 0, 255),
        b: clamp(b + ((Math.random() - 0.5) * 5), 0, 255),
    }
}

function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
}

var triangle = function(x1, y1, x2, y2, x3, y3, r, g, b, depth) {
    this.X1 = x1; this.Y1 = y1;
    this.X2 = x2; this.Y2 = y2;
    this.X3 = x3; this.Y3 = y3;
    this.r = r;
    this.g = g;
    this.b = b;
    this.tri1 = null;
    this.tri2 = null;
    this.tri3 = null;
    this.col = "rgba("+Math.round(this.r)+","+Math.round(this.g)+","+Math.round(this.b)+",1)";
    this.depth = depth;

    this.updateChildren = function() {
        // console.log("children");
        if(this.tri1 !== null) {
            this.tri1.updateColor(this.r, this.g, this.b);
            this.tri1.updateChildren();
        }
        if(this.tri2 !== null) {
            this.tri2.updateColor(this.r, this.g, this.b);
            this.tri2.updateChildren();
        }
        if(this.tri3 !== null) {
            this.tri3.updateColor(this.r, this.g, this.b);
            this.tri3.updateChildren();
        }
    }

    this.updateColor = function(r, g, b) {
        let col = randomRGB(r, g, b)
        this.r = col.r;
        this.g = col.g;
        this.b = col.b;
        this.col = "rgba("+Math.round(this.r)+","+Math.round(this.g)+","+Math.round(this.b)+",1)";
        this.draw();
    }

    this.draw = function() {
        ctx.lineWidth = 1;
        ctx.fillStyle = this.col;
        ctx.strokeStyle = this.col;

        ctx.beginPath();
        ctx.moveTo(this.X1,this.Y1);
        ctx.lineTo(this.X2,this.Y2);
        ctx.lineTo(this.X3,this.Y3);
        ctx.lineTo(this.X1,this.Y1);
        ctx.stroke();
    }

    // create 3 more triangles
    this.increaseDepth = function(count) {
        if(--count < 0) return;

        var x1 = (this.X1 + this.X2) * 0.5;
        var y1 = (this.Y1 + this.Y2) * 0.5;
        var x2 = (this.X1 + this.X3) * 0.5;
        var y2 = (this.Y1 + this.Y3) * 0.5;
        var x3 = (this.X2 + this.X3) * 0.5;
        var y3 = (this.Y2 + this.Y3) * 0.5;

        // console.log('creating at dept ', count);

        this.tri1 = new triangle(this.X1, this.Y1, x1, y1, x2, y2, this.r, this.g, this.b, count);
        this.tri1.updateColor();
        this.tri1.increaseDepth(count);
        this.tri2 = new triangle(x1, y1, this.X2, this.Y2, x3, y3, this.r, this.g, this.b, count);
        this.tri2.updateColor();
        this.tri2.increaseDepth(count);
        this.tri3 = new triangle(x3, y3, x2, y2, this.X3, this.Y3, this.r, this.g, this.b, count);
        this.tri3.updateColor();
        this.tri3.increaseDepth(count);
    }

}
