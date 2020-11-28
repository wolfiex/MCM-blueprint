/*
Custom Reusable Drag Code
Dan Ellis 2020
*/

export function dragControls(canvas,dragAction,object) {  
    var mouseDown = false,
        mouseX = 0,
        mouseY = 0;
        
    console.log('mouseevents',canvas,object)
    
    canvas.addEventListener('mousemove', function (evt) {
            if (!mouseDown) {return}
            //console.log('drag')
            evt.preventDefault();
            var deltaX = evt.clientX - mouseX,
                deltaY = evt.clientY - mouseY;
            mouseX = evt.clientX;
            mouseY = evt.clientY;
            dragAction(deltaX, deltaY,object);
        }, false);
        
    canvas.addEventListener('mousedown', function (evt) {
        evt.preventDefault();
        mouseDown = true;
        mouseX = evt.clientX;
        mouseY = evt.clientY;
    }, false);
    
    canvas.addEventListener('mouseup', function (evt) {
        evt.preventDefault();
        mouseDown = false;
    }, false);
}



export function dragAction(deltaX, deltaY,object) {
    object.rotation.y += deltaX / 100;
    object.rotation.x += deltaY / 100;
}


module.exports = {dragControls:dragControls, dragAction:dragAction}