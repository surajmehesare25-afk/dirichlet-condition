let tVals = [];
let xVals = [];

function checkDirichlet() {

    const signalStr = document.getElementById("signal").value;
    const T = parseFloat(document.getElementById("T").value);

    if (!signalStr || isNaN(T)) {
        alert("Please enter valid signal and T value");
        return;
    }

    const N = 5000;
    const dt = (2 * T) / N;
    tVals = [];
    xVals = [];

    try {
        for (let i = 0; i < N; i++) {
            let t = -T + i * dt;
            tVals.push(t);
            xVals.push(eval(signalStr));
        }
    } catch {
        alert("Invalid mathematical expression!");
        return;
    }

    /* CONDITION 1: Finite extrema */
    let extrema = 0;
    for (let i = 1; i < xVals.length - 1; i++) {
        if ((xVals[i] > xVals[i-1] && xVals[i] > xVals[i+1]) ||
            (xVals[i] < xVals[i-1] && xVals[i] < xVals[i+1])) {
            extrema++;
        }
    }
    let cond1 = extrema < 1000;

    /* CONDITION 2: Finite discontinuities */
    let jumps = 0;
    for (let i = 1; i < xVals.length; i++) {
        if (Math.abs(xVals[i] - xVals[i-1]) > 1000) {
            jumps++;
        }
    }
    let cond2 = jumps < 100;

    /* CONDITION 3: Absolute integrability */
    let absIntegral = 0;
    for (let i = 0; i < xVals.length; i++) {
        absIntegral += Math.abs(xVals[i]) * dt;
    }
    let cond3 = isFinite(absIntegral);

    /* DISPLAY RESULTS */
    let output = `<h2>Results</h2>`;
    output += cond1 ? "✔ Finite maxima and minima<br>" : "✘ Too many extrema<br>";
    output += cond2 ? "✔ Finite discontinuities<br>" : "✘ Too many discontinuities<br>";
    output += cond3 ? "✔ Absolutely integrable<br>" : "✘ Not absolutely integrable<br>";

    output += `<hr>`;
    output += (cond1 && cond2 && cond3)
        ? "<strong class='success'>Fourier Transform EXISTS</strong>"
        : "<strong class='fail'>Fourier Transform DOES NOT EXIST</strong>";

    document.getElementById("results").innerHTML = output;
}

/* =================== GRAPH PLOTTING =================== */

function plotSignal() {

    if (tVals.length === 0 || xVals.length === 0) {
        alert("Please check conditions first!");
        return;
    }

    const canvas = document.getElementById("graph");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Find scaling
    let maxX = Math.max(...xVals.map(Math.abs)) || 1;

    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 1.5;

    for (let i = 0; i < tVals.length; i++) {
        let x = (i / tVals.length) * canvas.width;
        let y = canvas.height / 2 - (xVals[i] / maxX) * (canvas.height / 2 - 10);

        if (i === 0)
            ctx.moveTo(x, y);
        else
            ctx.lineTo(x, y);
    }

    ctx.stroke();

    /* Draw axes */
    ctx.beginPath();
    ctx.strokeStyle = "black";

    // X-axis
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);

    // Y-axis
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);

    ctx.stroke();
}
