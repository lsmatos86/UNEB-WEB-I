let numeroSecreto;
let vidas;
let statusBar = document.getElementById("status-bar"); 
let btnIniciar = document.getElementById("btIniciar"); 
let btnReiniciar = document.getElementById("btReiniciar");
let numeroChute = document.getElementById("num1");
let btnChutar = document.getElementById("btChutar");
let resultadoDiv = document.getElementById("resultado"); 
let txtResultado = document.getElementById("txtResultado"); 
let boxPalpiteChute = document.getElementById("box-palpite-chute"); 
let boxVitoria = document.getElementById("box-vitoria");
let boxDerrota = document.getElementById("box-derrota");


// Event Listeners
btnIniciar.addEventListener("click", novoJogo);
btnReiniciar.addEventListener("click", novoJogo);
btnChutar.addEventListener("click", chutar);
numeroChute.addEventListener("keydown", function(event){
   if (event.key === "Enter"){
      chutar();
   }
});

// --- Estado Inicial do Jogo ---
boxPalpiteChute.classList.add("oculto"); 
resultadoDiv.classList.add("oculto");    
btnReiniciar.classList.add("oculto");    
boxVitoria.classList.add("oculto");      // NOVO: Oculta vitória
boxDerrota.classList.add("oculto");      // NOVO: Oculta derrota
btnIniciar.classList.remove("oculto");   

numeroChute.disabled = true;
btnChutar.disabled = true;


function novoJogo() {
    // botoes Iniciar/Reiniciar
    btnIniciar.classList.add("oculto");
    btnReiniciar.classList.remove("oculto");

    // Mostrar caixas de jogo
    boxPalpiteChute.classList.remove("oculto"); // Mostra input e botão chutar
    resultadoDiv.classList.remove("oculto");    // Mostra o histórico
    
    // Ocultar caixas de fim de jogo
    boxVitoria.classList.add("oculto");
    boxDerrota.classList.add("oculto");

    // configuracao do jogo ao reiniciar
    numeroChute.disabled = false;
    btnChutar.disabled = false;
    numeroSecreto = parseInt(Math.random() * 100) + 1;
    vidas = 10;
    renderizarVidas(); 
    numeroChute.value = "";
    txtResultado.innerHTML = "";
    numeroChute.focus();
}

function renderizarVidas() {
    statusBar.innerHTML = "";
    for (let i = 0; i < vidas; i++) {
        const coracao = document.createElement("img");
        coracao.src = "img/coracao.png";
        coracao.alt = "Vida";
        coracao.classList.add("coracao-vida");
        statusBar.appendChild(coracao);
    }

    if (vidas <= 0) { 
        txtResultado.innerHTML += "Fim de Jogo! O número secreto era " + numeroSecreto + "\n";
        
        // FIM DE JOGO
        boxPalpiteChute.classList.add("oculto"); // Oculta input/chute
        resultadoDiv.classList.add("oculto");    // Oculta o histórico
        boxDerrota.classList.remove("oculto");   // Exibe box de derrota
        
        numeroChute.disabled = true;
        btnChutar.disabled = true;
        btnReiniciar.classList.remove("oculto");
    }
}


function chutar() {
    let num = Number(numeroChute.value); 
    
    if (!num || isNaN(num) || num < 1 || num > 100) {
        alert("Por favor, digite um número válido entre 1 e 100.");
        numeroChute.value = "";
        numeroChute.focus();
        return; 
    }

    // Lógica do jogo
    if (num == numeroSecreto) { // GANHOU
        txtResultado.innerHTML += "Parabéns, você acertou o número " + numeroSecreto + "!\n";
        
        // FIM DE JOGO
        boxPalpiteChute.classList.add("oculto"); // Oculta input/chute
        resultadoDiv.classList.add("oculto");    // Oculta o histórico
        boxVitoria.classList.remove("oculto");   // Exibe box de vitória

        numeroChute.disabled = true;
        btnChutar.disabled = true;
        btnReiniciar.classList.remove("oculto");
    } else if (num > numeroSecreto) {
        txtResultado.innerHTML += "Palpite: " + num + " - O número é Menor! \n";
        vidas--;
    } else { 
        txtResultado.innerHTML += "Palpite: " + num + " - O número é Maior! \n";
        vidas--;
    }
    
    numeroChute.value = "";
    numeroChute.focus();
    renderizarVidas();
}