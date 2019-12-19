//canvas events
const canvas = document.getElementById("js-canvas"),
    ctx = canvas.getContext("2d");

let painting = false, mode = "painting", currentCanvasColor;

//width, height를 css가 아닌 엘리먼트 속성으로 정의해 주어야 작동함.
function setCanvasSize() {
    if (window.innerWidth < 700 ) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    } else {
        canvas.width = 700; 
        canvas.height = 700;
    }
}
window.addEventListener("resize", setCanvasSize);

//초기값 지정
function init() {
    setCanvasSize();
    ctx.strokeStyle = "#2c2c2c";
    ctx.lineWidth="2.5";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    currentCanvasColor = ctx.fillStyle;
}

function onMouseMove(e) {
    const x = e.offsetX;
    const y = e.offsetY;
    if (painting) {
        ctx.lineTo(x, y);
        ctx.stroke();
    } else {
        ctx.beginPath();
        ctx.moveTo(x, y);
    }
}

function onMouseDown() {
    if (mode !== "filling") {
        painting = true;
    } else {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        currentCanvasColor = ctx.fillStyle;
    }
}

function stopPainting() {
    painting = false;
}

function onTouchMove(e) {
    e.preventDefault();
    if (mode !== "filling") {
        const x = e.touches[0].pageX;
        const y = e.touches[0].pageY;
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}

function onTouchStart(e) {
    e.preventDefault();
    if (mode !== "filling") {
        const x = e.touches[0].pageX;
        const y = e.touches[0].pageY;
        ctx.beginPath();
        ctx.moveTo(x, y);
    } else {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        currentCanvasColor = ctx.fillStyle;
    }
}

// function onTouchEnd(e) {
//     e.preventDefault();
// }

init();
canvas.addEventListener("mousemove", onMouseMove);
canvas.addEventListener("mousedown", onMouseDown);
canvas.addEventListener("mouseup", stopPainting);
canvas.addEventListener("mouseleave", stopPainting);
//mobile
canvas.addEventListener("touchmove", onTouchMove);
canvas.addEventListener("touchstart", onTouchStart);
//canvas.addEventListener("touchend", onTouchEnd);


//change lineWidth
const rangeLabel = document.getElementById("js-label"),
    lineRange = document.getElementById("js-range");

function changeBrushSize() {
    ctx.lineWidth = lineRange.value; 
    rangeLabel.innerText = Number(lineRange.value).toFixed(1); //정수 뒤에 .0을 붙이기 위해
    const labelPosition = lineRange.value/lineRange.max * 135;
    rangeLabel.style.transform =`translateX(${labelPosition}px)`;
}

function showLabel() {
    rangeLabel.style.opacity = 1;
}

function hideLabel() {
    rangeLabel.style.opacity = 0;
}

changeBrushSize();
lineRange.addEventListener("mouseenter", showLabel);
lineRange.addEventListener("mouseleave", hideLabel);
lineRange.addEventListener("touchstart", showLabel);
lineRange.addEventListener("touchend", hideLabel);
lineRange.addEventListener("input", changeBrushSize);


//button controls
const modeBtn = document.getElementById("js-mode"),
    resetBtn = document.getElementById("js-reset"),
    saveBtn = document.getElementById("js-save");

let lastPenColor;

function setErasingMode() {
    lastPenColor = ctx.strokeStyle;
    ctx.lineWidth = "20";
    ctx.strokeStyle = currentCanvasColor;
}

function setPaintingMode() {
    ctx.lineWidth = lineRange.value;
    ctx.strokeStyle = lastPenColor;
}

function changeMode() {
    if (mode === "painting") {
        mode = "filling";
        modeBtn.innerText = "Filling";
    } else if (mode === "filling") {
        mode = "erasing";
        modeBtn.innerText = "Erasing";
        setErasingMode();
    } else {
        mode = "painting"
        modeBtn.innerText = "Painting";
        setPaintingMode();
    }
}

function reset() {
    mode = "painting"
    modeBtn.innerText = "Painting";
    ctx.strokeStyle = "#2c2c2c";
    lineRange.value = 2.5;
    changeBrushSize();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    currentCanvasColor = ctx.fillStyle;
}

function save() {
    const image = canvas.toDataURL(); //canvas.toDataURL(type, encoderOptions) type의 default는 "image/png"
    const link = document.createElement("a");
    link.href = image;
    link.download = "painting";
    link.click();
}

modeBtn.addEventListener("click", changeMode);
resetBtn.addEventListener("click", reset);
saveBtn.addEventListener("click", save);


//change colors
const colors = Array.from(document.getElementsByClassName("color"));

function changeColor(e) {
    if (mode === "painting")
        ctx.strokeStyle = e.target.style.backgroundColor;
    else if (mode === "filling")
        ctx.fillStyle = e.target.style.backgroundColor;
}

colors.forEach(color => color.addEventListener("click", changeColor));