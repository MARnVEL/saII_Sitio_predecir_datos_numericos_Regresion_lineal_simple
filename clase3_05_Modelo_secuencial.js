
const model = tf.sequential();

// Obtengo los elementos HTML
let inputNumEpocas = document.getElementById('iInputEpocas');
const btnEntrenar = document.getElementById('btn_entrenar');
const btnPredecir = document.getElementById('btn_predecir');
const outDiv = document.getElementById('micro-out-div');

// Variable para almacenar el número ingresado por el usuario
let num;
let prevNum;


// Evento de input para validar el número ingresado y habilitar el botón "Entrenar"

inputNumEpocas.addEventListener( 'input', (event) => {
    
    // console.log("Imprimo el input", event.target.value);
    // console.log("Imprimo el TIPO del input", typeof(event.target.value));

    // Obtener el valor del input
    num = parseInt(inputNumEpocas.value);

    // console.log("Imprimo el num", num);
    // console.log("Imprimo el TIPO del num", typeof(num));

    // Validar que sea un número entero
    if (!isNaN(num) && Number.isInteger(num) && num > 0) {
        // Habilitar el botón "Entrenar"
        outDiv.innerHTML = ``;
        btnEntrenar.disabled = false;
    } else {
        // Deshabilitar el botón "Entrenar"
        btnEntrenar.disabled = true;
        console.warn("Debe ingresar n número entero POSITIVO!");
        outDiv.innerHTML = `
            <div class="alert alert-warning" role="alert">
                Debe ingresar un número entero POSITIVO!
            </div>`;
    }
});


btnEntrenar.addEventListener('click', function() {
    // Deshabilitar el input
    inputNumEpocas.disabled = true;
    // Mostrar alert rojo
    outDiv.innerHTML = `
        <div class="alert alert-danger" role="alert">
            Entrenando modelo. Espere por favor... 💬 🕐...
        </div>`;
    // Deshabilitar el botón "Entrenar"
    btnEntrenar.disabled = true;
    // Llamar a la función de entrenamiento
    run(num);
});

btnPredecir.addEventListener('click', function () {

    //Realizar la predicción:
    const resultado = Predecir();

    // Limpiar el input
    inputNumEpocas.value = "";

    //Habilitar el input
    inputNumEpocas.disabled = false;

    // Deshabilitar el botón "Predecir"
    btnPredecir.disabled = true;

    // Mostrar alert azul con el resultado de la predicción
    outDiv.innerHTML = `
        <div class="alert alert-primary" role="alert">
            <p> El resultado de la predicción es: 
                <strong>${resultado}</strong>
            </p>
        </div>`;

});






async function run(num)  {
    /*
    Creamos con tf un modelo que predice cuando el usuario ingrese un valor x, la computadora

    */
    // Create a simple model.
    model.add(tf.layers.dense({units: 1, inputShape: [1]}));
    
    // Prepare the model for training: Specify the loss and the optimizer.
    model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});
    
    // Generate some synthetic data for training. (y = 2x - 1)
    const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1]);
    const ys = tf.tensor2d([-3, -1, 1, 3, 5, 7], [6, 1]);
    
    // Train the model using the data.
    await model.fit(xs, ys, {epochs: num});

    
    // Mostrar alert verde
    outDiv.innerHTML = `
        <div class="alert alert-success" role="alert">
            Terminé de entrenar el modelo 🤖
        </div>`;

    // document.getElementById('micro-out-div').innerText = "Terminé de entrenar";

    // Habilitar el botón "Predecir"
    btnPredecir.disabled = false;
}
// run();

function Predecir () {
    // Use the model to do inference on a data point the model hasn't seen.
    // Should print approximately 39.
    
    // document.getElementById('micro-out-div').innerText = model.predict(tf.tensor2d([20], [1, 1])).dataSync();
    const resultado = model.predict(tf.tensor2d([20], [1, 1])).dataSync();
    return resultado
}

