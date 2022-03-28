import React from 'react';

var base64ImageData;

window.blockMenuHeaderScroll = false;

class Board extends React.Component {
    ctx;
    isDrawing = false;
    letDraw = true;

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.drawOnCanvas();

    }

    componentWillReceiveProps(newProps) {
        this.ctx.strokeStyle = newProps.color;
        this.ctx.lineWidth = newProps.size;
    }      

    drawOnCanvas() {
        var canvas = document.querySelector('#board');
        this.ctx = canvas.getContext('2d');
        
        document.body.addEventListener('touchstart', function(e) {
            if (e.target == canvas) {
                e.preventDefault();
              }
        }, false);

        document.body.addEventListener("touchend", function (e) {
            if (e.target == canvas) {
              e.preventDefault();
            }
          }, false);
        document.body.addEventListener("touchmove", function (e) {
            if (e.target == canvas) {
              e.preventDefault();
            }
        }, false);


        var ctx = this.ctx;

        var sketch = document.querySelector('#sketch');
        var sketch_style = getComputedStyle(sketch);
        canvas.width = parseInt(sketch_style.getPropertyValue('width'));
        canvas.height = parseInt(sketch_style.getPropertyValue('height'));

        var mouse = {x: 0, y: 0};
        var last_mouse = {x: 0, y: 0};
        canvas.addEventListener('touchmove', function(e) {
            e.preventDefault();

            window.blockMenuHeaderScroll = true;

            var touch = e.touches[0];

            last_mouse.x = mouse.x;
            last_mouse.y = mouse.y;

            mouse.x = touch.clientX - this.offsetLeft;
            mouse.y = touch.clientY - this.offsetTop;

        }, false);


        ctx.lineWidth = this.props.size;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = this.props.color;

        canvas.addEventListener('touchstart', function(e) {
            canvas.addEventListener('touchmove', onPaint, false);
            window.blockMenuHeaderScroll = true;

        }, false);


        canvas.addEventListener('touchend', function() {
            base64ImageData = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            canvas.removeEventListener('touchmove', onPaint, false);
            window.blockMenuHeaderScroll = false;

        }, false);

        canvas.addEventListener("mousedown", function (e) {
            canvas.addEventListener('mousemove', onPaint, false);
        }, false);

        canvas.addEventListener("mouseup", function (e) {
            base64ImageData = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            canvas.removeEventListener('mousemove', onPaint, false);
        }, false);

        canvas.addEventListener("mousemove", function (e) {
            last_mouse.x = mouse.x;
            last_mouse.y = mouse.y;

            mouse.x = e.pageX - this.offsetLeft;
            mouse.y = e.pageY - this.offsetTop;
        }, false);

        var onPaint = function() {
            ctx.beginPath();
            ctx.moveTo(last_mouse.x, last_mouse.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.closePath();
            ctx.stroke();
        };
    }

    

    render() {
        return (
            <div class="sketch" id="sketch">
                <div className='button-send'>
                    <button className='ui positive button'onClick={()=>this.props.onSubmit(base64ImageData)}>Send</button>
                </div>
                <canvas className="board" id="board"></canvas>
            </div>
        )
    }
}

export default Board;


