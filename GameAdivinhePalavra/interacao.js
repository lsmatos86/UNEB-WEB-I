let vidas;
let fasesCarregadas = []; 
let indiceFaseAtual = 0; 
let palavrasDaRodada = []; 
let indicePalavraAtual = 0; 
let palavraAtual = "";
let exibicao;

let btnIniciar = document.getElementById("btn_iniciar");
let imagemMenino = document.getElementById("img-menino");
let boxPalavra = document.getElementById("box-palavra");
let textoPalavra = document.getElementById("palavra");
let boxTeclado = document.getElementById("box-teclado");
let boxResultadoFinal = document.getElementById("box-resultado-final");
let textoDica = document.getElementById("dica-fase"); 


carregarFase();
btnIniciar.addEventListener("click", gerenciarBotaoIniciar);

function shuffle(array) {
    let m = array.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

async function carregarFase() {
    try {
        const response = await fetch("fases.json");
        fasesCarregadas = await response.json(); 
        console.log("Fases carregadas:", fasesCarregadas);
        btnIniciar.classList.remove('hidden');
    } catch (error) {
        console.error("Erro ao carregar fases.json:", error);
        alert("Erro ao carregar as fases. Certifique-se de rodar via servidor local (Live Server).");
    }
}


function prepararFase() {

    let faseObj = fasesCarregadas[indiceFaseAtual];
    
    if (!faseObj) {
        console.error("Fase não encontrada:", indiceFaseAtual);
        return;
    }
    
    textoDica.textContent = "Dica: " + faseObj.dica;
    
    let listaDePalavras = faseObj.palavras;
    
    let palavrasEmbaralhadas = shuffle([...listaDePalavras]);
    
    palavrasDaRodada = palavrasEmbaralhadas.slice(0, 3);
    
 
    indicePalavraAtual = 0;
    
    console.log(`Fase ${indiceFaseAtual + 1} (${faseObj.dica}) preparada com:`, palavrasDaRodada);
}


function gerenciarBotaoIniciar() {
    if (fasesCarregadas.length === 0) {
        alert("Aguarde, carregando fases...");
        return;
    }

    boxResultadoFinal.innerHTML = '';
    boxResultadoFinal.classList.add('hidden');

    if (indicePalavraAtual === 0) { 
        prepararFase(); 
    }

    configurarRodada();
}

function configurarRodada() {
    btnIniciar.classList.add('hidden');

    boxPalavra.classList.remove('hidden');
    boxTeclado.classList.remove('hidden');
    imagemMenino.classList.remove('hidden');
    textoDica.classList.remove('hidden'); 

    vidas = 6;
    imagemMenino.src = "assets/menino1.png";

    palavraAtual = palavrasDaRodada[indicePalavraAtual].toUpperCase();
    
    exibicao = Array(palavraAtual.length).fill('_');
    atualizarDisplayPalavra();

    carregarTeclado();
}


function atualizarDisplayPalavra() {
    textoPalavra.textContent = exibicao.join(" ");
}


function carregarTeclado() {
    boxTeclado.innerHTML = "";
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let i = 0; i < letras.length; i++) {
        let botao = document.createElement("button");
        botao.textContent = letras[i];
        botao.classList.add("tecla");
        botao.addEventListener("click", function () {
            verificarLetra(letras[i], botao);
        });
        boxTeclado.appendChild(botao);
    }
}


function verificarLetra(letra, botao) {
    botao.disabled = true;
    let acertou = false;

    for (let i = 0; i < palavraAtual.length; i++) {
        if (palavraAtual[i] === letra) {
            exibicao[i] = letra;
            acertou = true;
        }
    }

    atualizarDisplayPalavra();

    if (acertou) {
        botao.classList.add("certo");
    } else {
        botao.classList.add("errado");
        vidas--;
        if (vidas >= 0) {
            imagemMenino.src = "assets/menino" + (7 - vidas) + ".png";
        }
    }

    checarFimDeJogo();
}


function checarFimDeJogo() {
    if (vidas === 0) {
        finalizarRodada(false); 
    } else if (!exibicao.includes("_")) {
        finalizarRodada(true); 
    }
}


function finalizarRodada(vitoria) {

    boxTeclado.classList.add('hidden');
    boxPalavra.classList.add('hidden');
    imagemMenino.classList.add('hidden');
    textoDica.classList.add('hidden'); 


    textoPalavra.textContent = palavraAtual;
    boxPalavra.classList.remove('hidden');


    boxResultadoFinal.classList.remove('hidden');
    const imgResultado = document.createElement('img');
    if (vitoria) {
        imgResultado.src = "assets/img_vitoria.png";
        imgResultado.alt = "Você Venceu!";
    } else {
        imgResultado.src = "assets/img_derrota.png";
        imgResultado.alt = "Você Perdeu!";
    }
    boxResultadoFinal.innerHTML = '';
    boxResultadoFinal.appendChild(imgResultado);

    btnIniciar.classList.remove('hidden');
    
    if (vitoria) {
        indicePalavraAtual++; 

        if (indicePalavraAtual >= palavrasDaRodada.length) {
            
            indiceFaseAtual++;

            if (indiceFaseAtual < fasesCarregadas.length) {
                alert(`Parabéns! Você passou para a Fase ${indiceFaseAtual + 1}!`);
                indicePalavraAtual = 0; 
                btnIniciar.src = "assets/botao_iniciar.png"; 
                btnIniciar.alt = "Próxima Fase";
            } else {
                alert("🏆 PARABÉNS! Você completou todas as fases do jogo!");
                btnIniciar.src = "assets/botao_reiniciar.png";
                btnIniciar.alt = "Reiniciar Jogo";
                indiceFaseAtual = 0;
                indicePalavraAtual = 0;
            }
        } else {
            btnIniciar.src = "assets/botao_proxima_palavra.png";
            btnIniciar.alt = "Próxima Palavra";
        }
    } else { 
        btnIniciar.src = "assets/botao_reiniciar.png";
        btnIniciar.alt = "Reiniciar Jogo";
        indiceFaseAtual = 0;
        indicePalavraAtual = 0;
    }
}