var model; 

(async function() {
    model = await tf.loadModel('https://xs-green-team.github.io/model/model.json');
    alert("Model has loaded!");
    document.getElementById('loader').style.display = 'none'; 

})();

function previewFile() {
    var preview = document.querySelector('img[class=preview]');
    var file = document.querySelector('input[type=file]').files[0];
    var reader = new FileReader();

    reader.onloadend = function() {
        preview.src = reader.result;
    }

    if (file) {
        reader.readAsDataURL(file);
    } else {
        preview.src = "food-wrapper.jpg";
    }
}

function analyze() {
    var file = document.querySelector('input[type=file]').files[0];
    if (file) {
        runModel(file)
    } else {
        alert('Please save the file and upload above, then click analyze!');
        document.getElementById('loader').style.display = 'none';
    }
}


async function runModel(file) {

    document.getElementById('loader').style.display = 'inline'; 
    
    let fileName = file.name;

    let img_tensor = tf.fromPixels(document.getElementById("preview")).resizeNearestNeighbor([224, 224]);

    img_tensor = tf.expandDims(img_tensor, axis = 0);

    img_tensor = tf.div(img_tensor, 255);
    let predictions = await model.predict(img_tensor).dataSync();

    var largest = predictions[0];
    var largest_class = 0;

    for (var i = 0; i < predictions.length; i++) {
        if (largest < predictions[i] ) {
        largest = predictions[i];
        largest_class = i;
        }
    }

     document.getElementById('loader').style.display = 'none'; 

     if (largest_class == 0) {
        document.getElementById("prediction-text").innerHTML = "That's a food container! (YELLOW BIN)";
     } else if (largest_class == 1) {
        document.getElementById("prediction-text").innerHTML = "That's a plastic wrapper! (ORANGE BIN)";
     } else if (largest_class == 2) {
        document.getElementById("prediction-text").innerHTML = "That's paper! (GREEN BIN)";
     } else if (largest_class == 3) {
        document.getElementById("prediction-text").innerHTML = "That's a plastic utensil! (ORANGE BIN)";
     }




}

function moveSection() {
    window.location.hash = '';
    window.location.hash = 'analysis-section'
}

function showLoader() {
    document.getElementById('prediction-text').innerHTML = ''; 
    document.getElementById('loader').style.display = 'inline'; 
}