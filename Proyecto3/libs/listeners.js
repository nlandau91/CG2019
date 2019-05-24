function onSliderRotation(){
    console.log('anda esta pija?');
    let rotation = [parseFloat(document.getElementById('slider0').value),
    parseFloat(document.getElementById('slider1').value),
    parseFloat(document.getElementById('slider2').value)];
}

function onSliderTranslation(){
    let translation = [parseFloat(document.getElementById('slider3').value),
    parseFloat(document.getElementById('slider4').value),
    parseFloat(document.getElementById('slider5').value)];
    selectedSceneObject.setPosition(translation);
    selectedSceneObject.updateModelMatrix;
}

function selectObject(){
    
}
