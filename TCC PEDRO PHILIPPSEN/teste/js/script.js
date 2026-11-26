/* =========================================
   CLUB DA BARBA
   JavaScript principal
========================================= */


/* =========================================
   1. CONFIGURAÇÕES
========================================= */

const CFG = {
  whatsapp: "5500000000000", // Substituir pelo número real com DDI e DDD
  instagram: "clubedabarba2025filial",

  endereco: "Bairro Santa Isabel, Viamão - RS",

  abertura: 9,
  fechamento: 20,

  intervalo: 40,

  diasFuncionamento: [1, 2, 3, 4, 5, 6]
};


/* =========================================
   2. DADOS DA EQUIPE
========================================= */

const equipe = [
  {
    nome: "Roger Bento",
    foto: "./roger.jpg",
    descricao: "Profissional do Club da Barba."
  },
  {
    nome: "Anderson da Silva Alves",
    foto: "./andy.jpg",
    descricao: "Profissional do Club da Barba."
  },
  {
    nome: "Nicolas de Oliveira",
    foto: "./nicolas.jpg",
    descricao: "Profissional do Club da Barba."
  },
  
];

/* =========================================
   3. DADOS DOS SERVIÇOS
========================================= */

const servicos = [
  {
    nome: "Corte adulto",
    preco: "A partir de R$ 40",
    descricao: "Corte personalizado de acordo com seu estilo."
  },
  {
    nome: "Corte infantil",
    preco: "R$ 45",
    descricao: "Atendimento com atenção e cuidado para crianças."
  },
  {
    nome: "Barba",
    preco: "Sob consulta",
    descricao: "Cuidados e acabamento para sua barba."
  },
  {
    nome: "Corte + Barba",
    preco: "R$ 75",
    descricao: "Uma combinação para renovar o visual."
  },
  {
    nome: "Sobrancelha",
    preco: "R$ 10",
    descricao: "Acabamento para complementar seu visual."
  },
  {
    nome: "Pigmentação",
    preco: "R$ 60",
    descricao: "Procedimento para valorizar o resultado do corte."
  },
  {
    nome: "Plano mensal",
    preco: "R$ 260",
    descricao: "Plano mensal de cuidados e serviços."
  }
];


/* =========================================
   4. ELEMENTOS DO HTML
========================================= */

const $ = (seletor) => document.querySelector(seletor);

const equipeGrade = $("#equipeGrade");
const tabela = $("#tabela");

const barbeiroSelect = $("#barbeiro");
const servicoSelect = $("#servico");
const dataInput = $("#data");
const horasContainer = $("#horas");

const formulario = $("#form");
const erro = $("#erro");

const confirmacao = $("#ok");
const sucesso = $("#sucesso");

const resumoAgendamento = $("#resumoAgendamento");
const pagamentoSelect = $("#pagamento");

const mensagemSucesso = $("#mensagemSucesso");
const enviarWhats = $("#enviarWhats");
const cancelarUltimoBtn = $("#cancelarUltimo");

const meusAgendamentosSec = $("#meusAgendamentosSec");
const listaAgendamentos = $("#listaAgendamentos");


/* =========================================
   5. ARMAZENAMENTO LOCAL
========================================= */

const CHAVE_RESERVAS = "clubBarbaReservas";
const CHAVE_FEEDBACKS = "clubBarbaFeedbacks";

function carregarDados(chave) {
  try {
    const dados = localStorage.getItem(chave);
    return dados ? JSON.parse(dados) : [];
  } catch (erro) {
    console.error("Erro ao carregar dados:", erro);
    return [];
  }
}

function salvarDados(chave, dados) {
  try {
    localStorage.setItem(chave, JSON.stringify(dados));
    return true;
  } catch (erro) {
    console.error("Erro ao salvar dados:", erro);
    return false;
  }
}


/* =========================================
   6. RENDERIZAR EQUIPE
========================================= */

function renderizarEquipe() {
  if (!equipeGrade) return;

  equipeGrade.replaceChildren();

  equipe.forEach((profissional) => {
    const card = document.createElement("article");
    card.className = "card-equipe";

    if (profissional.foto) {
      const imagem = document.createElement("img");

      imagem.src = profissional.foto;
      imagem.alt = `Foto de ${profissional.nome}`;
      imagem.loading = "lazy";

      imagem.onerror = () => {
        imagem.style.display = "none";
      };

      card.appendChild(imagem);
    }

    const conteudo = document.createElement("div");
    conteudo.className = "conteudo";

    const nome = document.createElement("h3");
    nome.textContent = profissional.nome;

    const descricao = document.createElement("p");
    descricao.textContent = profissional.descricao;

    const botao = document.createElement("button");
    botao.className = "btn";
    botao.type = "button";
    botao.textContent = "Agendar com este profissional";

    botao.addEventListener("click", () => {
      barbeiroSelect.value = profissional.nome;

      atualizarHorarios();

      $("#agendar").scrollIntoView({
        behavior: "smooth"
      });
    });

    conteudo.append(nome, descricao, botao);
    card.appendChild(conteudo);

    equipeGrade.appendChild(card);
  });
}


/* =========================================
   7. RENDERIZAR SERVIÇOS
========================================= */

function renderizarServicos() {
  if (!tabela) return;

  tabela.replaceChildren();

  servicos.forEach((servico) => {
    const card = document.createElement("article");
    card.className = "servico-card";

    const conteudo = document.createElement("div");

    const titulo = document.createElement("h3");
    titulo.textContent = servico.nome;

    const descricao = document.createElement("p");
    descricao.textContent = servico.descricao;

    const preco = document.createElement("span");
    preco.className = "servico-preco";
    preco.textContent = servico.preco;

    conteudo.append(titulo, descricao);
    card.append(conteudo, preco);

    tabela.appendChild(card);
  });
}


/* =========================================
   8. PREENCHER OS SELECTS
========================================= */

function preencherSelects() {
  barbeiroSelect.replaceChildren();

  const opcaoBarbeiro = document.createElement("option");
  opcaoBarbeiro.value = "";
  opcaoBarbeiro.textContent = "Selecione um profissional";

  barbeiroSelect.appendChild(opcaoBarbeiro);

  equipe.forEach((profissional) => {
    const opcao = document.createElement("option");

    opcao.value = profissional.nome;
    opcao.textContent = profissional.nome;

    barbeiroSelect.appendChild(opcao);
  });

  servicoSelect.replaceChildren();

  const opcaoServico = document.createElement("option");
  opcaoServico.value = "";
  opcaoServico.textContent = "Selecione um serviço";

  servicoSelect.appendChild(opcaoServico);

  servicos.forEach((servico) => {
    const opcao = document.createElement("option");

    opcao.value = servico.nome;
    opcao.textContent = `${servico.nome} — ${servico.preco}`;

    servicoSelect.appendChild(opcao);
  });
}


/* =========================================
   9. STATUS ABERTO OU FECHADO
========================================= */

function atualizarStatus() {
  const status = $("#status");

  if (!status) return;

  const agora = new Date();

  const dia = agora.getDay();
  const hora = agora.getHours();
  const minuto = agora.getMinutes();

  const horarioAtual = hora + minuto / 60;

  const funcionaHoje = CFG.diasFuncionamento.includes(dia);

  const estaAberto =
    funcionaHoje &&
    horarioAtual >= CFG.abertura &&
    horarioAtual < CFG.fechamento;

  if (estaAberto) {
    status.textContent = "● Estamos abertos agora";
    status.className = "status aberto";
  } else {
    status.textContent = "● Estamos fechados no momento";
    status.className = "status fechado";
  }
}


/* =========================================
   10. DATA MÍNIMA DO CALENDÁRIO
========================================= */

function formatarDataLocal(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

function configurarCalendario() {
  if (!dataInput) return;

  dataInput.min = formatarDataLocal(new Date());
}


/* =========================================
   11. HORÁRIOS DISPONÍVEIS
========================================= */

let horarioSelecionado = "";

function gerarHorarios() {
  const horarios = [];

  const minutosAbertura = CFG.abertura * 60;
  const minutosFechamento = CFG.fechamento * 60;

  for (
    let minuto = minutosAbertura;
    minuto + CFG.intervalo <= minutosFechamento;
    minuto += CFG.intervalo
  ) {
    const hora = Math.floor(minuto / 60);
    const restante = minuto % 60;

    const horario =
      String(hora).padStart(2, "0") +
      ":" +
      String(restante).padStart(2, "0");

    horarios.push(horario);
  }

  return horarios;
}

function dataEhValida(data) {
  if (!data) return false;

  const selecionada = new Date(`${data}T12:00:00`);
  const hoje = new Date();

  hoje.setHours(0, 0, 0, 0);

  if (selecionada < hoje) return false;

  if (!CFG.diasFuncionamento.includes(selecionada.getDay())) {
    return false;
  }

  return true;
}

function horarioJaPassou(data, horario) {
  const hoje = formatarDataLocal(new Date());

  if (data !== hoje) return false;

  const agora = new Date();

  const [hora, minuto] = horario.split(":").map(Number);

  const horarioEscolhido = new Date();
  horarioEscolhido.setHours(hora, minuto, 0, 0);

  return horarioEscolhido <= agora;
}

function atualizarHorarios() {
  if (!horasContainer) return;

  horarioSelecionado = "";
  horasContainer.replaceChildren();

  const profissional = barbeiroSelect.value;
  const data = dataInput.value;

  if (!profissional || !data) {
    const mensagem = document.createElement("p");
    mensagem.className = "dica";
    mensagem.textContent =
      "Escolha o barbeiro e a data para consultar os horários.";

    horasContainer.appendChild(mensagem);
    return;
  }

  if (!dataEhValida(data)) {
    const mensagem = document.createElement("p");
    mensagem.className = "dica";
    mensagem.textContent =
      "Escolha uma data válida, de segunda a sábado.";

    horasContainer.appendChild(mensagem);
    return;
  }

  const reservas = carregarDados(CHAVE_RESERVAS);
  const horarios = gerarHorarios();

  let quantidadeDisponivel = 0;

  horarios.forEach((horario) => {
    const ocupado = reservas.some((reserva) => {
      return (
        reserva.barbeiro === profissional &&
        reserva.data === data &&
        reserva.horario === horario
      );
    });

    const passou = horarioJaPassou(data, horario);

    const botao = document.createElement("button");

    botao.type = "button";
    botao.className = "hora";
    botao.textContent = horario;

    if (ocupado || passou) {
      botao.disabled = true;
      botao.title = ocupado
        ? "Horário já reservado"
        : "Horário já passou";
    } else {
      quantidadeDisponivel++;

      botao.addEventListener("click", () => {
        horarioSelecionado = horario;

        document.querySelectorAll(".hora").forEach((item) => {
          item.classList.remove("selecionado");
          item.setAttribute("aria-pressed", "false");
        });

        botao.classList.add("selecionado");
        botao.setAttribute("aria-pressed", "true");
      });
    }

    botao.setAttribute(
      "aria-pressed",
      horario === horarioSelecionado ? "true" : "false"
    );

    horasContainer.appendChild(botao);
  });

  if (quantidadeDisponivel === 0) {
    const mensagem = document.createElement("p");
    mensagem.className = "dica";
    mensagem.textContent =
      "Não há horários disponíveis nesta data. Experimente outro dia.";

    horasContainer.appendChild(mensagem);
  }
}


/* =========================================
   12. EVENTOS DO CALENDÁRIO E SELECTS
========================================= */

barbeiroSelect.addEventListener("change", atualizarHorarios);

dataInput.addEventListener("change", () => {
  horarioSelecionado = "";
  atualizarHorarios();
});


/* =========================================
   13. VALIDAÇÃO DO AGENDAMENTO
========================================= */

function mostrarErro(mensagem) {
  erro.textContent = mensagem;
  erro.hidden = false;

  erro.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

function limparErro() {
  erro.textContent = "";
  erro.hidden = true;
}

function obterPreferencias() {
  return Array.from(
    document.querySelectorAll(
      'input[name="preferencia"]:checked'
    )
  ).map((item) => item.value);
}

function validarTelefone(telefone) {
  const numeros = telefone.replace(/\D/g, "");
  return numeros.length >= 10 && numeros.length <= 13;
}


/* =========================================
   14. RESUMO DO AGENDAMENTO
========================================= */

let agendamentoTemporario = null;
let ultimoAgendamentoId = null;

function adicionarLinhaResumo(rotulo, valor) {
  const linha = document.createElement("div");

  const termo = document.createElement("dt");
  termo.textContent = rotulo;

  const descricao = document.createElement("dd");
  descricao.textContent = valor || "Não informado";

  linha.append(termo, descricao);

  resumoAgendamento.appendChild(linha);
}

function formatarDataBonita(data) {
  const [ano, mes, dia] = data.split("-");

  return `${dia}/${mes}/${ano}`;
}

function mostrarResumo(agendamento) {
  resumoAgendamento.replaceChildren();

  adicionarLinhaResumo("Nome", agendamento.nome);
  adicionarLinhaResumo("Profissional", agendamento.barbeiro);
  adicionarLinhaResumo("Serviço", agendamento.servico);
  adicionarLinhaResumo("Data", formatarDataBonita(agendamento.data));
  adicionarLinhaResumo("Horário", agendamento.horario);
  adicionarLinhaResumo("WhatsApp", agendamento.telefone);

  adicionarLinhaResumo(
    "Preferências",
    agendamento.preferencias.length
      ? agendamento.preferencias.join(", ")
      : "Nenhuma informada"
  );

  adicionarLinhaResumo(
    "Observações",
    agendamento.observacoes || "Nenhuma"
  );

  confirmacao.hidden = false;
  sucesso.hidden = true;

  confirmacao.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  confirmacao.focus();
}


/* =========================================
   15. ENVIAR FORMULÁRIO
========================================= */

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  limparErro();

  const nome = $("#nome").value.trim();
  const telefone = $("#tel").value.trim();

  const barbeiro = barbeiroSelect.value;
  const servico = servicoSelect.value;
  const data = dataInput.value;

  if (!nome || !telefone || !barbeiro || !servico || !data) {
    mostrarErro("Preencha todos os campos obrigatórios.");
    return;
  }

  if (!validarTelefone(telefone)) {
    mostrarErro("Digite um número de WhatsApp válido com DDD.");
    return;
  }

  if (!dataEhValida(data)) {
    mostrarErro("Escolha uma data válida, de segunda a sábado.");
    return;
  }

  if (!horarioSelecionado) {
    mostrarErro("Selecione um horário disponível.");
    return;
  }

  const reservas = carregarDados(CHAVE_RESERVAS);

  const conflito = reservas.some((reserva) => {
    return (
      reserva.barbeiro === barbeiro &&
      reserva.data === data &&
      reserva.horario === horarioSelecionado
    );
  });

  if (conflito) {
    mostrarErro(
      "Este horário acabou de ser reservado. Escolha outro horário."
    );

    atualizarHorarios();
    return;
  }

  agendamentoTemporario = {
    id: Date.now(),

    nome,
    telefone,

    barbeiro,
    servico,
    data,

    horario: horarioSelecionado,

    preferencias: obterPreferencias(),

    observacoes: $("#observacoes").value.trim(),

    criadoEm: new Date().toISOString()
  };

  pagamentoSelect.value = "";

  mostrarResumo(agendamentoTemporario);
});


/* =========================================
   16. VOLTAR PARA EDITAR
========================================= */

$("#voltarEdicao").addEventListener("click", () => {
  confirmacao.hidden = true;

  $("#agendar").scrollIntoView({
    behavior: "smooth"
  });
});


/* =========================================
   17. CONFIRMAR AGENDAMENTO
========================================= */

$("#finalizarAgendamento").addEventListener("click", () => {
  if (!agendamentoTemporario) return;

  const pagamento = pagamentoSelect.value;

  if (!pagamento) {
    alert("Escolha uma forma de pagamento para continuar.");
    pagamentoSelect.focus();
    return;
  }

  const reservas = carregarDados(CHAVE_RESERVAS);

  const conflito = reservas.some((reserva) => {
    return (
      reserva.barbeiro === agendamentoTemporario.barbeiro &&
      reserva.data === agendamentoTemporario.data &&
      reserva.horario === agendamentoTemporario.horario
    );
  });

  if (conflito) {
    alert("Este horário não está mais disponível. Escolha outro.");
    confirmacao.hidden = true;
    atualizarHorarios();
    return;
  }

  const reservaFinal = {
    ...agendamentoTemporario,
    pagamento
  };

  reservas.push(reservaFinal);

  const salvou = salvarDados(CHAVE_RESERVAS, reservas);

  if (!salvou) {
    alert(
      "Não foi possível salvar o agendamento neste navegador. Verifique o armazenamento disponível."
    );
    return;
  }

  exibirSucesso(reservaFinal);

  renderizarAgendamentos();
  atualizarHorarios();
});


/* =========================================
   18. CONFIRMAÇÃO E WHATSAPP
========================================= */

/* =========================================
   18. CONFIRMAÇÃO E WHATSAPP
========================================= */

function exibirSucesso(reserva) {
  ultimoAgendamentoId = reserva.id;
  confirmacao.hidden = true;
  sucesso.hidden = false;

  mensagemSucesso.textContent =
    `Olá, ${reserva.nome}! Seu agendamento foi registrado para ` +
    `${formatarDataBonita(reserva.data)} às ${reserva.horario}, ` +
    `com ${reserva.barbeiro}, para ${reserva.servico}. ` +
    `Forma de pagamento escolhida: ${reserva.pagamento}. ` +
    `Se não puder comparecer ou precisou corrigir algo, você pode cancelar abaixo.`;

  const textoWhats =
    `Olá! Gostaria de confirmar meu agendamento no Club da Barba.\n\n` +
    `Nome: ${reserva.nome}\n` +
    `Profissional: ${reserva.barbeiro}\n` +
    `Serviço: ${reserva.servico}\n` +
    `Data: ${formatarDataBonita(reserva.data)}\n` +
    `Horário: ${reserva.horario}\n` +
    `Pagamento: ${reserva.pagamento}\n` +
    `Preferências: ${reserva.preferencias.join(", ") || "Nenhuma"}\n` +
    `Observações: ${reserva.observacoes || "Nenhuma"}\n\n` +
    `Aguardo a confirmação.`;

  enviarWhats.href =
    `https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(textoWhats)}`;

  sucesso.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  sucesso.focus();
}


/* =========================================
   19. NOVO AGENDAMENTO E CANCELAMENTO
========================================= */

$("#novo").addEventListener("click", () => {
  formulario.reset();

  horarioSelecionado = "";
  agendamentoTemporario = null;
  ultimoAgendamentoId = null;

  confirmacao.hidden = true;
  sucesso.hidden = true;

  limparErro();

  atualizarHorarios();

  $("#agendar").scrollIntoView({
    behavior: "smooth"
  });
});

function cancelarAgendamento(idReserva, veioDaTelaSucesso = false) {
  const reservas = carregarDados(CHAVE_RESERVAS);
  const alvo = reservas.find((item) => item.id === idReserva);

  if (!alvo) return false;

  const confirmar = confirm(
    `Cancelar o pedido de ${alvo.nome} no dia ${formatarDataBonita(alvo.data)} às ${alvo.horario} com ${alvo.barbeiro}?`
  );

  if (!confirmar) return false;

  const atualizadas = reservas.filter((item) => item.id !== idReserva);
  const salvou = salvarDados(CHAVE_RESERVAS, atualizadas);

  if (!salvou) {
    alert("Não foi possível cancelar o pedido neste navegador.");
    return false;
  }

  if (ultimoAgendamentoId === idReserva) {
    ultimoAgendamentoId = null;
  }

  renderizarAgendamentos();
  atualizarHorarios();

  if (veioDaTelaSucesso) {
    sucesso.hidden = true;
    alert("Pedido cancelado! O horário já voltou a ficar disponível.");
    $("#agendar").scrollIntoView({
      behavior: "smooth"
    });
  }

  return true;
}

if (cancelarUltimoBtn) {
  cancelarUltimoBtn.addEventListener("click", () => {
    if (!ultimoAgendamentoId) return;
    cancelarAgendamento(ultimoAgendamentoId, true);
  });
}

function renderizarAgendamentos() {
  if (!meusAgendamentosSec || !listaAgendamentos) return;

  const reservas = carregarDados(CHAVE_RESERVAS);
  listaAgendamentos.replaceChildren();

  if (!reservas.length) {
    meusAgendamentosSec.hidden = true;
    return;
  }

  meusAgendamentosSec.hidden = false;

  reservas.forEach((reserva) => {
    const card = document.createElement("article");
    card.className = "agendamento-card";

    const info = document.createElement("div");
    info.className = "agendamento-info";

    const titulo = document.createElement("strong");
    titulo.textContent = `${formatarDataBonita(reserva.data)} às ${reserva.horario} — ${reserva.servico}`;

    const detalhes = document.createElement("span");
    detalhes.textContent = `Cliente: ${reserva.nome} · Profissional: ${reserva.barbeiro} · Pagamento: ${reserva.pagamento || "A definir"}`;

    info.append(titulo, detalhes);

    const botaoCancelar = document.createElement("button");
    botaoCancelar.type = "button";
    botaoCancelar.className = "btn-cancelar";
    botaoCancelar.textContent = "Cancelar agendamento";
    botaoCancelar.setAttribute(
      "aria-label",
      `Cancelar agendamento de ${reserva.nome} dia ${formatarDataBonita(reserva.data)} às ${reserva.horario}`
    );

    botaoCancelar.addEventListener("click", () => {
      cancelarAgendamento(reserva.id);
    });

    card.append(info, botaoCancelar);
    listaAgendamentos.appendChild(card);
  });
}


/* =========================================
   20. FEEDBACKS
========================================= */

const formFeedback = $("#formFeedback");
const listaFeedbacks = $("#listaFeedbacks");
const semFeedback = $("#semFeedback");
const erroFeedback = $("#erroFeedback");

function renderizarFeedbacks() {
  const feedbacks = carregarDados(CHAVE_FEEDBACKS);

  listaFeedbacks.replaceChildren();

  semFeedback.hidden = feedbacks.length > 0;

  feedbacks.slice().reverse().forEach((feedback) => {
    const item = document.createElement("article");
    item.className = "feedback-item";

    const nome = document.createElement("strong");
    nome.textContent = feedback.nome || "Cliente";

    const estrelas = document.createElement("div");
    estrelas.className = "feedback-estrelas";
    estrelas.textContent =
      "★".repeat(feedback.nota) +
      "☆".repeat(5 - feedback.nota);

    const comentario = document.createElement("p");
    comentario.textContent = feedback.comentario;

    item.append(nome, estrelas, comentario);

    listaFeedbacks.appendChild(item);
  });
}

formFeedback.addEventListener("submit", (evento) => {
  evento.preventDefault();

  erroFeedback.hidden = true;

  const nota = Number($("#nota").value);
  const comentario = $("#comentario").value.trim();
  const nome = $("#nomeFeedback").value.trim();

  if (!nota || nota < 1 || nota > 5 || !comentario) {
    erroFeedback.textContent =
      "Escolha uma avaliação e escreva um comentário.";

    erroFeedback.hidden = false;
    return;
  }

  const feedbacks = carregarDados(CHAVE_FEEDBACKS);

  feedbacks.push({
    nota,
    comentario,
    nome,
    data: new Date().toISOString()
  });

  const salvou = salvarDados(CHAVE_FEEDBACKS, feedbacks);

  if (!salvou) {
    erroFeedback.textContent =
      "Não foi possível salvar sua avaliação neste navegador.";

    erroFeedback.hidden = false;
    return;
  }

  formFeedback.reset();

  renderizarFeedbacks();

  alert("Obrigado por compartilhar sua experiência!");
});

renderizarFeedbacks();


/* =========================================
   21. LINKS DE CONTATO
========================================= */

function configurarLinks() {
  const zap = $("#zap");
  const mapa = $("#mapa");
  const insta = $("#insta");

  const mensagem =
    "Olá! Gostaria de saber mais sobre os serviços e agendamentos.";

  zap.href =
    `https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(mensagem)}`;

  mapa.href =
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CFG.endereco)}`;

  insta.href =
    `https://www.instagram.com/${CFG.instagram}/`;

  $("#ano").textContent = new Date().getFullYear();
}

configurarLinks();


/* =========================================
   22. MENU PARA CELULAR
========================================= */

const burger = $("#burger");
const menu = $("#menu");

burger.addEventListener("click", () => {
  const aberto = menu.classList.toggle("aberto");

  burger.setAttribute("aria-expanded", String(aberto));

  burger.setAttribute(
    "aria-label",
    aberto ? "Fechar menu" : "Abrir menu"
  );

  burger.textContent = aberto ? "✕" : "☰";
});

menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("aberto");

    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Abrir menu");
    burger.textContent = "☰";
  });
});


/* =========================================
   23. PAINEL DE ACESSIBILIDADE
========================================= */

const painelAcessibilidade = $("#painelAcessibilidade");
const abrirAcessibilidade = $("#abrirAcessibilidade");
const fecharAcessibilidade = $("#fecharAcessibilidade");

abrirAcessibilidade.addEventListener("click", () => {
  const aberto = painelAcessibilidade.hidden;

  painelAcessibilidade.hidden = !aberto;

  abrirAcessibilidade.setAttribute(
    "aria-expanded",
    String(aberto)
  );
});

fecharAcessibilidade.addEventListener("click", () => {
  painelAcessibilidade.hidden = true;

  abrirAcessibilidade.setAttribute("aria-expanded", "false");
});

let tamanhoTexto = 0;

function atualizarTamanhoTexto() {
  document.body.classList.remove(
    "texto-grande",
    "texto-pequeno"
  );

  const escala = 100 + (tamanhoTexto * 15);

  document.documentElement.style.fontSize = escala + "%";

  if (tamanhoTexto > 0) {
    document.body.classList.add("texto-grande");
  }

  if (tamanhoTexto < 0) {
    document.body.classList.add("texto-pequeno");
  }
}

document.querySelectorAll("[data-acessibilidade]").forEach((botao) => {
  botao.addEventListener("click", () => {
    const acao = botao.dataset.acessibilidade;

    switch (acao) {
      case "aumentar":
        tamanhoTexto = Math.min(tamanhoTexto + 1, 3);
        atualizarTamanhoTexto();
        break;

      case "diminuir":
        tamanhoTexto = Math.max(tamanhoTexto - 1, -1);
        atualizarTamanhoTexto();
        break;

      case "contraste":
        document.body.classList.toggle("alto-contraste");

        botao.setAttribute(
          "aria-pressed",
          String(document.body.classList.contains("alto-contraste"))
        );
        break;

      case "leitura":
        document.body.classList.toggle("leitura-confortavel");

        botao.setAttribute(
          "aria-pressed",
          String(document.body.classList.contains("leitura-confortavel"))
        );
        break;

      case "movimento":
        document.body.classList.toggle("reduzir-movimento");

        botao.setAttribute(
          "aria-pressed",
          String(document.body.classList.contains("reduzir-movimento"))
        );
        break;

      case "restaurar":
        tamanhoTexto = 0;

        document.body.classList.remove(
          "texto-grande",
          "texto-pequeno",
          "alto-contraste",
          "leitura-confortavel",
          "reduzir-movimento"
        );

        document.querySelectorAll(
          "[data-acessibilidade][aria-pressed]"
        ).forEach((item) => {
          item.setAttribute("aria-pressed", "false");
        });

        atualizarTamanhoTexto();
        break;
    }
  });
});


/* =========================================
   24. ATUALIZAÇÃO AUTOMÁTICA
========================================= */

function atualizarTudo() {
  atualizarStatus();
  configurarCalendario();
  atualizarHorarios();
  renderizarAgendamentos();
}

renderizarEquipe();
renderizarServicos();
preencherSelects();

atualizarTudo();

// Atualiza o status e os horários a cada minuto.
setInterval(() => {
  atualizarStatus();
  atualizarHorarios();
}, 60000);


/* =========================================
   CLUB DA BARBA — SCRIPT CARREGADO
========================================= */

console.log("Club da Barba iniciado com sucesso!");