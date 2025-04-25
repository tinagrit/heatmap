const TEXTBOX_MARGIN = 30;
const OVERLAY_OPACITY_TRANSITION = 0.5;

const moveToSection = (textbox, section) => {
    textbox.scrollTo(section.offsetLeft - TEXTBOX_MARGIN,0);
    textbox.setAttribute("style","height: "+(section.offsetHeight + (2 * TEXTBOX_MARGIN))+"px"); 
}

const removeOverlay = (textbox) => {
    textbox.parentElement.style.opacity = 0;
    setTimeout(()=>{
        textbox.parentElement.style.display = 'none';
    },OVERLAY_OPACITY_TRANSITION*1000)
}

const generateMap = (properties, handler) => {
    handler();
}

document.addEventListener('DOMContentLoaded',()=>{
    const textbox = document.getElementById('textbox');
    textboxWidth = textbox.offsetWidth;
    textbox.scrollTo(0,0);

    document.getElementById('startButton').addEventListener('click',()=>{
        moveToSection(textbox,document.getElementById('generationLoader'));
        setTimeout(()=>{
            generateMap({},()=>{
                removeOverlay(textbox);
                document.getElementById('watermark').style.opacity = 1;
            })
        },3000)
    })
})