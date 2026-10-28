/* 365 Dias com Maria • Nossa Senhora da Conceição 2027
   - Abre automaticamente o devocional do dia (fuso de Recife, America/Recife)
   - Teste qualquer data com ?data=2027-02-10                                  */
(function () {
  "use strict";

  var ANO = 2027;
  var FUSO = "America/Recife";
  var MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho",
               "agosto", "setembro", "outubro", "novembro", "dezembro"];
  var DIAS_MES = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Cor de destaque de cada mês (acompanha a arte)
  var PALETA = {
    1: ["#2a5fa8", "#eef3fb"], 2: ["#b0506d", "#fbeaf0"], 3: ["#6a3d8f", "#efe7f6"],
    4: ["#a77a22", "#fbf3df"], 5: ["#c0587a", "#fbe9ef"], 6: ["#c8611e", "#fdeedd"],
    7: ["#3f5c94", "#e9eef8"], 8: ["#8a6a1f", "#f8f0dc"], 9: ["#2f6b5a", "#e6f2ee"],
    10: ["#a8445a", "#f9e8ea"], 11: ["#5b6478", "#eceef3"], 12: ["#14306b", "#e3e9f7"]
  };

  // Ícones do medalhão das datas especiais
  var ICONES = {
    estrela: '<path d="M12 2.8l2.4 6.3 6.6.3-5.2 4.1 1.8 6.5L12 16.3 6.4 20l1.8-6.5L3 9.4l6.6-.3z"/>',
    cruz: '<path d="M12 3v18M7 8.5h10"/>',
    lirio: '<path d="M12 21v-7M12 14c-3 0-5.5-2.5-5.5-6 2.2.2 4 1.4 5.5 3.2 1.5-1.8 3.3-3 5.5-3.2 0 3.5-2.5 6-5.5 6zM12 11.2c-1-2.7-1-5.2 0-7.7 1 2.5 1 5 0 7.7M9 21h6"/>',
    coracao: '<path d="M12 20s-7.5-4.6-7.5-10A4.2 4.2 0 0 1 12 7.6 4.2 4.2 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
    pomba: '<path d="M3 14c3.5.5 6-1 8-3.5L14 6c1.4-1.6 3.8-1.4 5 .3l2 .4-1.8 1.4c-.2 4.6-3.6 8.4-8.4 8.4-3 0-5.6-1-6.8-2.5zM11 10.5c-.6 2.2-.2 4 1 5.5"/>',
    bandeirinha: '<path d="M2.5 6.5h19M4 6.5l2.5 7 2.5-7M10 6.5l2 7 2-7M15 6.5l2.5 7 2.5-7"/>',
    balao: '<path d="M12 3a5.5 6.3 0 0 1 5.5 6.3c0 4-3 6.7-5.5 6.7s-5.5-2.7-5.5-6.7A5.5 6.3 0 0 1 12 3zM11 17.2h2L12 16zM12 17.2c0 2-2 2.6-.8 4.3"/>',
    vela: '<path d="M9 10.5h6V21H9zM12 10.5V8.5M12 3c1.6 1.8 1.6 3.4 0 4.6-1.6-1.2-1.6-2.8 0-4.6z"/>',
    terco: '<circle cx="12" cy="9" r="5.5"/><path d="M12 14.5V21M10 18h4"/><circle cx="12" cy="3.5" r=".6"/><circle cx="17.5" cy="9" r=".6"/><circle cx="6.5" cy="9" r=".6"/>',
    biblia: '<path d="M6 3.5h11a1.5 1.5 0 0 1 1.5 1.5v15.5H7.5A2 2 0 0 1 5.5 18.5V4a.5.5 0 0 1 .5-.5zM5.5 18.5a2 2 0 0 1 2-2h11M12 7v6M9.5 9.5h5"/>',
    coroa: '<path d="M4 17h16l1.2-9.5-5.2 4L12 4.5 8 11.5l-5.2-4zM4 20.5h16"/>',
    flor: '<circle cx="12" cy="12" r="2.6"/><path d="M12 9.4C10 6 10.6 3.6 12 3c1.4.6 2 3 0 6.4zM12 14.6c2 3.4 1.4 5.8 0 6.4-1.4-.6-2-3 0-6.4zM9.4 12C6 14 3.6 13.4 3 12c.6-1.4 3-2 6.4 0zM14.6 12c3.4-2 5.8-1.4 6.4 0-.6 1.4-3 2-6.4 0z"/>',
    livro: '<path d="M12 6.5C10 5 7 4.5 4 5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5zM12 6.5v13"/>'
  };

  // Regras visuais: a primeira regra que combinar com o título da data é usada
  var REGRAS = [
    [/Evangelista/i, { icone: "livro", efeito: "estrelas-leve", cor: ["#14306b", "#e3e9f7"] }],
    [/Mães/i, { icone: "coracao", efeito: "petalas", cor: ["#c0587a", "#fbe9ef"] }],
    [/Namorados/i, { icone: "coracao", efeito: "petalas", cor: ["#b8435d", "#fbe8ec"] }],
    [/Ano-Novo|Confraterniza|Véspera de Ano/i, { icone: "estrela", efeito: "fogos", cor: ["#9a7b2e", "#fbf6e8"] }],
    [/Natal|Sagrada Família|Inocentes/i, { icone: "estrela", efeito: "estrelas", cor: ["#14306b", "#e3e9f7"] }],
    [/Reis|Epifania/i, { icone: "estrela", efeito: "estrelas" }],
    [/Advento/i, { icone: "vela", efeito: "vela", cor: ["#5d3d8c", "#eee7f6"] }],
    [/Conceição|Festa do Morro/i, { icone: "coroa", efeito: "fogos-azul", cor: ["#14306b", "#e3e9f7"] }],
    [/Cinzas|Quaresma|Ramos|Semana Santa|Quinta-feira Santa|Sábado Santo/i, { icone: "cruz", efeito: null, cor: ["#5d3d8c", "#eee7f6"] }],
    [/Sexta-feira Santa|Paixão|Santa Cruz/i, { icone: "cruz", efeito: "vela", cor: ["#4b2f6e", "#ece5f3"] }],
    [/Páscoa|Misericórdia|Ascensão/i, { icone: "lirio", efeito: "luz", cor: ["#a77a22", "#fbf3df"] }],
    [/Pentecostes|Trindade/i, { icone: "pomba", efeito: "pombas", cor: ["#b0412e", "#fbe9e4"] }],
    [/Pais|Padre|José/i, { icone: "coracao", efeito: "luz" }],
    [/São João|Santo Antônio|São Pedro/i, { icone: "bandeirinha", efeito: "bandeiras", cor: ["#c8611e", "#fdeedd"] }],
    [/Crianças/i, { icone: "balao", efeito: "baloes", cor: ["#c0465e", "#fdeef0"] }],
    [/Finados|Todos os Santos/i, { icone: "vela", efeito: "vela", cor: ["#5b6478", "#eceef3"] }],
    [/Rosário|Fátima/i, { icone: "terco", efeito: "petalas" }],
    [/Bíblia|Jerônimo/i, { icone: "biblia", efeito: "luz" }],
    [/Aparecida|Carmo|Nossa Senhora|Assunção|Imaculado|Visitação|Natividade|Anunciação|Rainha|Graças|Auxiliadora|Lourdes|Guadalupe/i, { icone: "coroa", efeito: "brilhos" }],
    [/Independência|República|Tiradentes|Data Magna|Consciência|Recife/i, { icone: "pomba", efeito: null }],
    [/Professores|Estudante|Catequista/i, { icone: "livro", efeito: null }],
    [/Carnaval/i, { icone: "flor", efeito: "confete" }],
    [/.*/, { icone: "flor", efeito: null }]
  ];
  // Clima de cada mês nos dias comuns
  var EFEITO_MES = { 1: "brilhos-leve", 5: "petalas-leve", 6: "bandeiras", 12: "estrelas-leve" };

  var $ = function (id) { return document.getElementById(id); };
  var cacheMeses = {};
  var atual = null;          // registro do dia exibido
  var dataAtual = null;      // "2027-MM-DD"
  var hojeISO = null;        // hoje em Recife (mapeado para 2027)
  var mesFolha = 1;
  var falando = false;

  // ---------- Datas ----------
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function iso(m, d) { return ANO + "-" + pad(m) + "-" + pad(d); }
  function partes(s) { var p = s.split("-"); return { a: +p[0], m: +p[1], d: +p[2] }; }

  function hojeRecife() {
    try {
      var f = new Intl.DateTimeFormat("en-CA", { timeZone: FUSO, year: "numeric", month: "2-digit", day: "2-digit" });
      var p = f.formatToParts(new Date()), o = {};
      p.forEach(function (x) { o[x.type] = x.value; });
      return { a: +o.year, m: +o.month, d: +o.day };
    } catch (e) {
      var n = new Date(Date.now() - 3 * 3600 * 1000); // Recife = UTC-3, sem horário de verão
      return { a: n.getUTCFullYear(), m: n.getUTCMonth() + 1, d: n.getUTCDate() };
    }
  }
  function valida(m, d) { return m >= 1 && m <= 12 && d >= 1 && d <= DIAS_MES[m - 1]; }
  function lerDataDaURL() {
    var q = new URLSearchParams(location.search);
    var v = (q.get("data") || q.get("dia") || "").trim();
    var m;
    if ((m = v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))) { if (+m[1] === ANO && valida(+m[2], +m[3])) return iso(+m[2], +m[3]); }
    if ((m = v.match(/^(\d{1,2})[\/\-.](\d{1,2})(?:[\/\-.](\d{4}))?$/))) { if (valida(+m[2], +m[1])) return iso(+m[2], +m[1]); }
    var nomes = ["janeiro", "fevereiro", "marco", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
    var mes = nomes.indexOf((q.get("mes") || "").toLowerCase().replace("ç", "c")) + 1;
    var dia = +(q.get("dia") || 1);
    if (mes > 0 && valida(mes, dia)) return iso(mes, dia);
    return null;
  }
  function somarDias(s, n) {
    var p = partes(s), t = Date.UTC(ANO, p.m - 1, p.d) + n * 86400000;
    var x = new Date(t), m = x.getUTCMonth() + 1, d = x.getUTCDate();
    if (x.getUTCFullYear() !== ANO) { return n > 0 ? iso(1, 1) : iso(12, 31); } // volta ao início/fim do ano
    return iso(m, d);
  }
  function dataLonga(s) { var p = partes(s); return p.d + " de " + MESES[p.m - 1] + " de " + ANO; }
  function dataCurta(s) { var p = partes(s); return p.d + " de " + MESES[p.m - 1]; }

  // ---------- Dados ----------
  function carregarMes(m) {
    if (cacheMeses[m]) return Promise.resolve(cacheMeses[m]);
    return fetch("data/mes/" + pad(m) + ".json", { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    }).then(function (j) { cacheMeses[m] = j; return j; });
  }
  function registro(s) {
    var p = partes(s);
    return carregarMes(p.m).then(function (j) {
      for (var i = 0; i < j.dias.length; i++) if (j.dias[i].data === s) return j.dias[i];
      throw new Error("Data não encontrada: " + s);
    });
  }

  // ---------- Visual ----------
  function regraVisual(r) {
    if (!r.especial || !r.especial.length) return null;
    var texto = r.especial.map(function (e) { return e.titulo; }).join(" | ") + " | " + r.tema;
    for (var i = 0; i < REGRAS.length; i++) if (REGRAS[i][0].test(texto)) return REGRAS[i][1];
    return null;
  }
  function aleat(seed) { var x = Math.sin(seed) * 10000; return x - Math.floor(x); }
  function efeitos(tipo, seedBase) {
    var box = $("efeitos");
    box.innerHTML = "";
    if (!tipo) return;
    var leve = /-leve$/.test(tipo);
    tipo = tipo.replace("-leve", "");
    var i, el, n, s = seedBase;
    function r() { s += 1.37; return aleat(s); }
    if (tipo === "brilhos" || tipo === "estrelas") {
      n = leve ? 7 : 16;
      for (i = 0; i < n; i++) {
        el = document.createElement("i");
        el.className = tipo === "brilhos" ? "ef-brilho" : "ef-estrela";
        el.style.left = (4 + r() * 92) + "%"; el.style.top = (3 + r() * 55) + "%";
        el.style.animationDelay = (-r() * 4).toFixed(2) + "s";
        var esc = 0.6 + r() * 0.9; el.style.width = el.style.height = (tipo === "brilhos" ? 6 : 14) * esc + "px";
        box.appendChild(el);
      }
    } else if (tipo === "petalas" || tipo === "confete") {
      n = leve ? 6 : 14;
      var cores = ["#f7c6d0", "#f39ab0", "#fff", "#ffe08a", "#9fc7ff", "#b9e3a8"];
      for (i = 0; i < n; i++) {
        el = document.createElement("i");
        el.className = "ef-petala" + (r() > 0.7 ? " branca" : "");
        if (tipo === "confete") { el.style.background = cores[Math.floor(r() * cores.length)]; el.style.borderRadius = "2px"; el.style.width = "8px"; el.style.height = "11px"; }
        el.style.left = (r() * 96) + "%"; el.style.top = "-20px";
        el.style.animationDuration = (7 + r() * 6).toFixed(1) + "s";
        el.style.animationDelay = (-r() * 12).toFixed(1) + "s";
        box.appendChild(el);
      }
    } else if (tipo === "baloes") {
      var cb = ["#ef5b6b", "#ffb938", "#4f9be8", "#6cc28a", "#b57be0", "#ff8fb1"];
      for (i = 0; i < 9; i++) {
        el = document.createElement("i");
        el.className = "ef-balao";
        el.style.background = "radial-gradient(circle at 35% 30%, #ffffffaa, " + cb[i % cb.length] + " 45%)";
        el.style.left = (i % 2 ? 2 + r() * 18 : 76 + r() * 18) + "%"; el.style.top = "100%"; // laterais, sem cobrir o rosto
        el.style.animationDuration = (10 + r() * 6).toFixed(1) + "s";
        el.style.animationDelay = (-r() * 14).toFixed(1) + "s";
        box.appendChild(el);
      }
    } else if (tipo === "fogos" || tipo === "fogos-azul") {
      var paleta = tipo === "fogos" ? ["#fff6d0", "#ffd36b", "#ffffff", "#f6c35b"] : ["#ffffff", "#bcd6ff", "#ffe08a", "#9cc0ff"];
      var centros = [[22, 16], [76, 12], [52, 30], [14, 40], [86, 36]];
      for (i = 0; i < centros.length; i++) {
        var burst = document.createElement("i");
        burst.className = "ef-fogo";
        burst.style.left = centros[i][0] + "%"; burst.style.top = centros[i][1] + "%";
        burst.style.animationDelay = (i * 0.9 + r() * 0.6).toFixed(2) + "s";
        var raios = 14, raio = 34 + r() * 26;
        for (var k = 0; k < raios; k++) {
          var faisca = document.createElement("b");
          var ang = (k / raios) * Math.PI * 2;
          faisca.style.setProperty("--dx", (Math.cos(ang) * raio).toFixed(1) + "px");
          faisca.style.setProperty("--dy", (Math.sin(ang) * raio).toFixed(1) + "px");
          faisca.style.background = paleta[(i + k) % paleta.length];
          faisca.style.animationDelay = burst.style.animationDelay;
          burst.appendChild(faisca);
        }
        box.appendChild(burst);
      }
      n = 8;
      for (i = 0; i < n; i++) {
        el = document.createElement("i"); el.className = "ef-brilho";
        el.style.left = (4 + r() * 92) + "%"; el.style.top = (3 + r() * 50) + "%";
        el.style.animationDelay = (-r() * 4).toFixed(2) + "s"; box.appendChild(el);
      }
    } else if (tipo === "luz") {
      el = document.createElement("i"); el.className = "ef-luz"; box.appendChild(el);
    } else if (tipo === "vela") {
      el = document.createElement("i"); el.className = "ef-vela"; box.appendChild(el);
    } else if (tipo === "pombas") {
      el = document.createElement("i"); el.className = "ef-luz"; box.appendChild(el);
      for (i = 0; i < 3; i++) {
        el = document.createElement("i"); el.className = "ef-pomba";
        el.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 14c3.5.5 6-1 8-3.5L14 6c1.4-1.6 3.8-1.4 5 .3l2 .4-1.8 1.4c-.2 4.6-3.6 8.4-8.4 8.4-3 0-5.6-1-6.8-2.5z"/></svg>';
        el.style.left = (12 + i * 30 + r() * 10) + "%"; el.style.top = (18 + r() * 22) + "%";
        el.style.animationDelay = (-r() * 8).toFixed(1) + "s";
        box.appendChild(el);
      }
    } else if (tipo === "bandeiras") {
      el = document.createElement("i"); el.className = "ef-bandeiras";
      var cf = ["#e94f5f", "#ffc533", "#3e8ee6", "#4cb87a", "#f07f2d", "#a06ad8"], tri = "", x;
      for (i = 0, x = 2; x < 98; i++, x += 7) {
        var y = 6 + Math.sin((x / 100) * Math.PI) * 10;
        tri += '<path d="M' + x + ' ' + y + 'l7 0.4-3.3 ' + (13 + (i % 2) * 2) + 'z" fill="' + cf[i % cf.length] + '"/>';
      }
      el.innerHTML = '<svg viewBox="0 0 100 34" preserveAspectRatio="none"><path d="M0 4 Q50 26 100 4" fill="none" stroke="#7a5a2a" stroke-width=".5"/>' + tri + "</svg>";
      box.appendChild(el);
    }
  }

  function aplicarCores(cor) {
    var root = document.documentElement.style;
    root.setProperty("--acento", cor[0]);
    root.setProperty("--acento-claro", cor[1]);
  }

  // ---------- Renderização ----------
  function render(r, mes) {
    atual = r; dataAtual = r.data;
    var p = partes(r.data);
    $("diaSemana").textContent = r.dia_semana + " • " + ANO;
    $("dataGrande").textContent = dataCurta(r.data);
    document.title = "Oração de " + dataCurta(r.data) + " • 365 Dias com Maria";

    var img = $("imgMes");
    if (img.getAttribute("src") !== r.imagem) {
      img.classList.remove("ok");
      img.onload = function () {
        // Arco acompanha o formato da arte (sem cortar crianças, presépio etc.)
        var prop = img.naturalWidth / img.naturalHeight;
        $("arco").style.aspectRatio = String(Math.min(1.65, Math.max(0.62, prop)));
        img.classList.add("ok");
      };
      img.onerror = function () {
        if (r.imagem !== "assets/meses/" + r.mes_slug + ".webp") { img.src = "assets/meses/" + r.mes_slug + ".webp"; }
      };
      img.src = r.imagem;
      img.alt = "Arte devocional de " + dataCurta(r.data);
      if (img.complete && img.naturalWidth) img.classList.add("ok");
    }

    var visual = regraVisual(r);
    aplicarCores((visual && visual.cor) || PALETA[p.m]);
    if (visual) {
      var med = $("medalhao");
      med.innerHTML = '<svg viewBox="0 0 24 24">' + ICONES[visual.icone] + "</svg>";
      med.hidden = false;
      var todos = r.especial.map(function (e) { return e.titulo; }).join(" • ");
      var tipos = r.especial.map(function (e) { return e.tipo; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
      if (todos.length <= 34) {
        $("faixaTitulo").textContent = todos;
        $("faixaTipo").textContent = tipos.join(" • ");
      } else {
        $("faixaTitulo").textContent = r.especial[0].titulo;
        $("faixaTipo").textContent = [r.especial[0].tipo].concat(r.especial.slice(1).map(function (e) { return e.titulo; })).join(" • ");
      }
      $("faixa").hidden = false;
      efeitos(visual.efeito || EFEITO_MES[p.m] || null, p.m * 40 + p.d);
    } else {
      $("medalhao").hidden = true;
      $("faixa").hidden = true;
      efeitos(EFEITO_MES[p.m] || null, p.m * 40 + p.d);
    }
    $("fraseMes").textContent = "“" + mes.mes.frase.replace(/\s*\(.*\)\s*$/, "") + "”";

    $("tituloOracaoHoje").textContent = r.tema;
    var boxOracao = $("oracao"); boxOracao.innerHTML = "";
    r.oracao.split(/\n\n+/).forEach(function (par) {
      var pEl = document.createElement("p"); pEl.textContent = par; boxOracao.appendChild(pEl);
    });
    var boxProp = $("proposito"); boxProp.innerHTML = "";
    var itens = r.proposito_itens && r.proposito_itens.length ? r.proposito_itens : [r.proposito];
    if (itens.length > 1) {
      var ol = document.createElement("ol"); ol.className = "passos";
      itens.forEach(function (t) { var li = document.createElement("li"); li.textContent = t.replace(/([^.!?])$/, "$1."); ol.appendChild(li); });
      boxProp.appendChild(ol);
    } else {
      var pp = document.createElement("p"); pp.textContent = itens[0].replace(/([^.!?])$/, "$1."); boxProp.appendChild(pp);
    }
    $("reflexao").textContent = r.reflexao;
    $("leitura").textContent = r.leitura;
    $("leituraExtenso").textContent = r.leitura_extenso;
    $("leituraTema").textContent = r.leitura_tema;

    prepararAudio(r);
    atualizarNavegacao();
    atualizarURL();
  }

  function atualizarNavegacao() {
    var ant = somarDias(dataAtual, -1), prox = somarDias(dataAtual, 1);
    $("navAnteriorTexto").textContent = dataCurta(ant);
    $("navProximoTexto").textContent = dataCurta(prox);
    registro(ant).then(function (x) { if (dataAtual && somarDias(dataAtual, -1) === x.data) $("navAnteriorTexto").textContent = dataCurta(ant) + " • " + x.tema; }).catch(function () {});
    registro(prox).then(function (x) { if (dataAtual && somarDias(dataAtual, 1) === x.data) $("navProximoTexto").textContent = dataCurta(prox) + " • " + x.tema; }).catch(function () {});
  }

  function atualizarURL() {
    try {
      var u = new URL(location.href);
      u.searchParams.delete("mes"); u.searchParams.delete("dia");
      if (dataAtual === hojeISO && !temAvisoForaDoAno) u.searchParams.delete("data");
      else u.searchParams.set("data", dataAtual);
      history.replaceState(null, "", u.pathname + (u.search ? u.search : "") + u.hash);
    } catch (e) {}
  }

  function irPara(s, rolar) {
    pararAudio();
    return registro(s).then(function (r) {
      render(r, cacheMeses[r.mes]);
      if (rolar) window.scrollTo({ top: 0, behavior: "smooth" });
    }).catch(function (e) {
      console.error(e);
      mensagem("Não foi possível carregar este dia. Verifique a sua conexão e tente novamente.");
    });
  }

  // ---------- Áudio ----------
  var audio = $("audio");
  function fmt(t) { if (!isFinite(t)) return "--:--"; t = Math.round(t); return Math.floor(t / 60) + ":" + pad(t % 60); }
  function estado(txt) { $("estadoAudio").textContent = txt; }
  function setTocando(sim) { $("btnPlay").classList.toggle("tocando", sim); $("btnPlay").setAttribute("aria-label", sim ? "Pausar" : "Ouvir a oração"); }
  var limiteCarga = null;
  function prepararAudio(r) {
    clearTimeout(limiteCarga);
    audio.removeAttribute("src");
    audio.preload = "none";              // só baixa quando a pessoa tocar no play
    audio.dataset.falhou = "";
    if (r.tem_audio === false) {
      audio.dataset.falhou = "1";        // MP3 ainda não publicado: usa a voz do aparelho
    } else {
      audio.src = r.audio;
    }
    $("barra").value = 0; $("barra").style.setProperty("--p", "0%");
    $("tempoAtual").textContent = "0:00"; $("tempoTotal").textContent = "--:--";
    estado(audio.dataset.falhou ? "Toque para ouvir (voz do aparelho)" : "Toque para ouvir");
    setTocando(false);
  }
  function pararAudio() {
    try { audio.pause(); } catch (e) {}
    if (falando && window.speechSynthesis) { speechSynthesis.cancel(); falando = false; }
    setTocando(false);
  }
  function tocar(doInicio) {
    if (falando) { speechSynthesis.cancel(); falando = false; setTocando(false); estado("Toque para ouvir"); return; }
    if (audio.dataset.falhou) { falarNoAparelho(); return; }
    if (doInicio) { try { audio.currentTime = 0; } catch (e) {} }
    if (!audio.paused && !doInicio) { audio.pause(); return; }
    $("btnPlay").classList.add("carregando");
    estado("Carregando…");
    clearTimeout(limiteCarga);
    limiteCarga = setTimeout(function () {   // internet muito lenta: não deixa o botão girando para sempre
      if (audio.paused && $("btnPlay").classList.contains("carregando")) {
        $("btnPlay").classList.remove("carregando");
        estado("Conexão lenta • toque de novo");
      }
    }, 12000);
    var pr = audio.play();
    if (pr && pr.catch) pr.catch(function (e) {
      $("btnPlay").classList.remove("carregando");
      if (e && e.name === "NotAllowedError") { estado("Toque para ouvir"); return; }
    });
  }
  function falarNoAparelho() {
    if (!("speechSynthesis" in window) || !atual) { estado("Áudio indisponível"); return; }
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(atual.texto_audio);
    u.lang = "pt-BR"; u.rate = 0.92;
    var vozes = speechSynthesis.getVoices().filter(function (v) { return /pt(-|_)BR/i.test(v.lang); });
    if (vozes.length) u.voice = vozes[0];
    u.onend = u.onerror = function () { falando = false; setTocando(false); estado("Toque para ouvir"); };
    falando = true; setTocando(true);
    estado("Narração do aparelho");
    speechSynthesis.speak(u);
  }
  audio.addEventListener("playing", function () { clearTimeout(limiteCarga); $("btnPlay").classList.remove("carregando"); setTocando(true); estado("Ouvindo a oração"); });
  audio.addEventListener("pause", function () { setTocando(false); if (!audio.ended) estado("Pausado"); });
  audio.addEventListener("ended", function () { setTocando(false); estado("Amém 🙏"); });
  audio.addEventListener("loadedmetadata", function () { $("tempoTotal").textContent = fmt(audio.duration); });
  audio.addEventListener("timeupdate", function () {
    if (!audio.duration) return;
    var p = audio.currentTime / audio.duration;
    $("barra").value = Math.round(p * 1000);
    $("barra").style.setProperty("--p", (p * 100).toFixed(1) + "%");
    $("tempoAtual").textContent = fmt(audio.currentTime);
  });
  audio.addEventListener("error", function () {
    if (!audio.getAttribute("src")) return;
    clearTimeout(limiteCarga);
    $("btnPlay").classList.remove("carregando");
    audio.dataset.falhou = "1";
    setTocando(false);
    estado("Toque para ouvir (voz do aparelho)");
  });
  $("barra").addEventListener("input", function () {
    var v = this.value / 1000;
    this.style.setProperty("--p", (v * 100).toFixed(1) + "%");
    if (audio.duration) audio.currentTime = v * audio.duration;
  });
  $("btnPlay").addEventListener("click", function () { audio._pediuPlay = true; tocar(false); });
  $("btnOuvirNovamente").addEventListener("click", function () {
    audio._pediuPlay = true;
    if (falando) { speechSynthesis.cancel(); falando = false; }
    if (audio.dataset.falhou) { falarNoAparelho(); return; }
    tocar(true);
    window.scrollTo({ top: $("btnPlay").getBoundingClientRect().top + window.scrollY - 140, behavior: "smooth" });
  });

  // ---------- Compartilhar ----------
  function linkDoDia() {
    var u = new URL(location.href);
    u.search = ""; u.hash = "";
    u.searchParams.set("data", dataAtual);
    return u.toString();
  }
  $("btnCompartilhar").addEventListener("click", function () {
    if (!atual) return;
    var props = (atual.proposito_itens && atual.proposito_itens.length ? atual.proposito_itens : [atual.proposito]);
    var texto = "🙏 Oração de " + dataCurta(dataAtual) + " • " + atual.tema + "\n\n" + atual.oracao +
      "\n\n🎯 Propósito:\n" + props.map(function (t) { return "• " + t; }).join("\n") + "\n📖 Leitura: " + atual.leitura +
      "\n\nNossa Senhora da Conceição, rogai por nós. Amém.";
    var url = linkDoDia();
    if (navigator.share) {
      navigator.share({ title: "365 Dias com Maria", text: texto, url: url }).catch(function () {});
    } else {
      window.open("https://wa.me/?text=" + encodeURIComponent(texto + "\n\n" + url), "_blank", "noopener");
    }
  });

  // ---------- Calendário ----------
  function abrirFolha(m) {
    mesFolha = m || partes(dataAtual).m;
    montarFolha();
    $("folhaFundo").hidden = false; $("folha").hidden = false;
    document.body.style.overflow = "hidden";
  }
  function fecharFolha() {
    $("folhaFundo").hidden = true; $("folha").hidden = true;
    document.body.style.overflow = "";
  }
  function montarFolha() {
    var m = mesFolha;
    $("folhaTitulo").textContent = MESES[m - 1].charAt(0).toUpperCase() + MESES[m - 1].slice(1) + " " + ANO;
    var g = $("grade"); g.innerHTML = "";
    var primeiro = new Date(Date.UTC(ANO, m - 1, 1)).getUTCDay();
    for (var b = 0; b < primeiro; b++) g.appendChild(document.createElement("span"));
    carregarMes(m).then(function (j) {
      if (mesFolha !== m) return;
      var lista = $("listaMes"); lista.innerHTML = "";
      var titulo = document.createElement("li"); titulo.className = "rotulo"; titulo.textContent = "Orações de " + MESES[m - 1];
      lista.appendChild(titulo);
      j.dias.forEach(function (x) {
        var bt = document.createElement("button");
        bt.textContent = x.dia;
        var dow = new Date(Date.UTC(ANO, m - 1, x.dia)).getUTCDay();
        if (dow === 0) bt.classList.add("domingo");
        if (x.especial.length) bt.classList.add("especial");
        if (x.data === hojeISO) bt.classList.add("hoje");
        if (x.data === dataAtual) bt.classList.add("ativo");
        bt.setAttribute("aria-label", x.dia + " de " + MESES[m - 1] + ": " + x.tema);
        bt.addEventListener("click", function () { fecharFolha(); irPara(x.data, true); });
        g.appendChild(bt);

        var li = document.createElement("li"), lb = document.createElement("button");
        lb.innerHTML = '<span class="num"></span><span class="txt"><b></b><small></small></span>';
        lb.querySelector(".num").textContent = x.dia;
        lb.querySelector("b").textContent = x.tema;
        lb.querySelector("small").textContent = x.dia_semana + (x.especial.length ? " • " + x.especial.map(function (e) { return e.titulo; }).join(" • ") : "");
        lb.addEventListener("click", function () { fecharFolha(); irPara(x.data, true); });
        li.appendChild(lb); lista.appendChild(li);
      });
    }).catch(function () { mensagem("Sem conexão para carregar este mês."); });
  }
  $("btnCalendario").addEventListener("click", function () { abrirFolha(); });
  $("btnOutras").addEventListener("click", function () { abrirFolha(); });
  $("mesAnterior").addEventListener("click", function () { mesFolha = mesFolha === 1 ? 12 : mesFolha - 1; montarFolha(); });
  $("mesProximo").addEventListener("click", function () { mesFolha = mesFolha === 12 ? 1 : mesFolha + 1; montarFolha(); });
  $("btnFecharFolha").addEventListener("click", fecharFolha);
  $("folhaFundo").addEventListener("click", fecharFolha);
  $("btnHoje").addEventListener("click", function () { fecharFolha(); irPara(hojeISO, true); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") fecharFolha();
    if (!$("folha").hidden) return;
    if (e.key === "ArrowLeft") irPara(somarDias(dataAtual, -1));
    if (e.key === "ArrowRight") irPara(somarDias(dataAtual, 1));
  });

  // Navegação entre dias
  function anterior() { irPara(somarDias(dataAtual, -1), true); }
  function proximo() { irPara(somarDias(dataAtual, 1), true); }
  $("btnAnterior").addEventListener("click", anterior);
  $("btnProximo").addEventListener("click", proximo);
  $("navAnterior").addEventListener("click", anterior);
  $("navProximo").addEventListener("click", proximo);

  // ---------- Mensagens ----------
  var tmToast;
  function mensagem(t) {
    var el = $("toast"); el.textContent = t; el.hidden = false;
    clearTimeout(tmToast); tmToast = setTimeout(function () { el.hidden = true; }, 3800);
  }

  // ---------- Início ----------
  var temAvisoForaDoAno = false;
  function iniciar() {
    var h = hojeRecife();
    var m = h.m, d = h.d;
    if (m === 2 && d === 29) d = 28;
    hojeISO = iso(m, d);
    var daURL = lerDataDaURL();
    if (h.a !== ANO && !daURL) {
      temAvisoForaDoAno = true;
      var av = $("aviso");
      av.innerHTML = h.a < ANO
        ? "O seu calendário começa em <strong>1º de janeiro de 2027</strong>. Até lá, reze com a oração preparada para <strong>" + d + " de " + MESES[m - 1] + "</strong>."
        : "Você está rezando com a oração de <strong>" + d + " de " + MESES[m - 1] + "</strong> do devocional de 2027.";
      av.hidden = false;
    }
    irPara(daURL || hojeISO);
    if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    }
  }
  iniciar();
})();
