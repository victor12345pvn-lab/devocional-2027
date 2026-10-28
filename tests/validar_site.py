# -*- coding: utf-8 -*-
"""
Testes automáticos do site publicado (rodam no GitHub a cada envio).
Não precisam de internet nem de bibliotecas extras.

  python tests/validar_site.py        (na pasta do site)

Falha (código 1) se encontrar: data ausente/duplicada, JSON inválido, imagem ou áudio
inexistente, data obrigatória sem o conteúdo esperado, recurso externo não autorizado,
ou falta de proteções básicas (CSP, 404).
"""
import datetime as dt
import json
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
ANO = 2027
erros, avisos = [], []


def erro(m):
    erros.append(m)


# 1) Dados: 12 meses, 365 dias, sem lacunas nem duplicadas
dias = []
for m in range(1, 13):
    p = RAIZ / "data" / "mes" / f"{m:02d}.json"
    try:
        j = json.loads(p.read_text(encoding="utf-8"))
        dias += j["dias"]
    except Exception as e:  # noqa: BLE001
        erro(f"JSON inválido ou ausente: {p.name} ({e})")
datas = [d.get("data") for d in dias]
esperadas = [(dt.date(ANO, 1, 1) + dt.timedelta(days=i)).isoformat() for i in range(365)]
if len(datas) != 365:
    erro(f"Esperados 365 devocionais, encontrados {len(datas)}")
if len(set(datas)) != len(datas):
    erro("Há datas duplicadas")
for falta in sorted(set(esperadas) - set(datas)):
    erro(f"Data ausente: {falta}")

# 2) Campos, imagens e áudios
CAMPOS = ["data", "dia_semana", "tema", "oracao", "proposito", "reflexao", "leitura", "leitura_tema", "imagem", "audio"]
SEMANA = ["segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado", "domingo"]
com_audio = 0
for d in dias:
    for c in CAMPOS:
        if not str(d.get(c, "")).strip():
            erro(f"{d.get('data')}: campo vazio '{c}'")
    try:
        if SEMANA[dt.date.fromisoformat(d["data"]).weekday()] != d["dia_semana"]:
            erro(f"{d['data']}: dia da semana errado")
    except Exception:  # noqa: BLE001
        pass
    if not (RAIZ / d["imagem"]).is_file():
        erro(f"{d['data']}: imagem não existe ({d['imagem']})")
    if d.get("tem_audio"):
        a = RAIZ / d["audio"]
        if not a.is_file() or a.stat().st_size < 20000:
            erro(f"{d['data']}: áudio marcado como existente, mas ausente/vazio ({d['audio']})")
        else:
            cab = a.read_bytes()[:3]
            if not (cab == b"ID3" or cab[:2] in (b"\xff\xfb", b"\xff\xf3", b"\xff\xf2")):
                erro(f"{d['data']}: arquivo de áudio não parece MP3")
            com_audio += 1
if com_audio < 365:
    avisos.append(f"{365 - com_audio} dia(s) sem MP3 (usam a voz do aparelho)")

# 3) Datas obrigatórias com conteúdo esperado
por_data = {d["data"]: d for d in dias}
OBRIG = {
    "2027-01-01": "Recomeçar com Maria", "2027-02-08": "Carnaval", "2027-02-10": "Cinzas",
    "2027-03-26": "Sexta-feira Santa", "2027-03-28": "Páscoa", "2027-05-09": "Mães",
    "2027-06-13": "Santo Antônio", "2027-06-24": "São João", "2027-06-29": "São Pedro",
    "2027-07-16": "Carmo", "2027-10-12": "Aparecida", "2027-11-02": "Finados",
    "2027-12-08": "Conceição", "2027-12-25": "Natal",
}
for data, palavra in OBRIG.items():
    d = por_data.get(data)
    if not d:
        continue
    texto = d["tema"] + " " + " ".join(e.get("titulo", "") for e in d.get("especial", []))
    if palavra.lower() not in texto.lower():
        erro(f"{data}: conteúdo esperado '{palavra}' não encontrado")
ARTES = {"2027-05-09", "2027-06-13", "2027-06-24", "2027-06-29", "2027-07-16", "2027-10-12", "2027-12-25"}
for data in ARTES:
    if data in por_data and "especiais" not in por_data[data]["imagem"]:
        erro(f"{data}: deveria usar a arte especial aprovada")

# 4) Arquivos do site e recursos externos
for f in ["index.html", "app.js", "style.css", "sw.js", "manifest.webmanifest", "404.html"]:
    if not (RAIZ / f).is_file():
        erro(f"Arquivo do site ausente: {f}")
html = (RAIZ / "index.html").read_text(encoding="utf-8")
for ref in re.findall(r'(?:href|src)="([^"]+)"', html):
    if not ref.startswith(("http", "#", "data:")) and not (RAIZ / ref).exists():
        erro(f"index.html referencia arquivo inexistente: {ref}")
PERMITIDOS = ("https://devocional-2027.pages.dev", "https://wa.me/", "http://www.w3.org/",
              "https://static.cloudflareinsights.com", "https://cloudflareinsights.com")  # Web Analytics da Cloudflare (sem cookies)
for f in ["index.html", "app.js", "style.css", "sw.js"]:
    for url in re.findall(r"https?://[^\s\"')]+", (RAIZ / f).read_text(encoding="utf-8")):
        if not url.startswith(PERMITIDOS):
            erro(f"{f}: recurso externo não autorizado: {url}")
if "Content-Security-Policy" not in html:
    erro("index.html sem Content-Security-Policy")
cab = (RAIZ / "_headers").read_text(encoding="utf-8") if (RAIZ / "_headers").exists() else ""
for h in ["Content-Security-Policy", "X-Frame-Options", "X-Content-Type-Options", "Referrer-Policy"]:
    if h not in cab:
        erro(f"_headers sem {h}")
if re.search(r"\b(eval|document\.write)\s*\(", (RAIZ / "app.js").read_text(encoding="utf-8")):
    erro("app.js usa eval/document.write")

print(f"Devocionais: {len(dias)} | com áudio: {com_audio}")
for a in avisos:
    print("AVISO:", a)
if erros:
    print(f"\n{len(erros)} PROBLEMA(S):")
    for e in erros[:60]:
        print(" -", e)
    sys.exit(1)
print("OK: todos os testes passaram.")
