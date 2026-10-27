---
resumo: Imagens do Tom (o ferreiro que ajuda pelo site): as 9 poses, como editar todas de uma vez no ChatGPT (grade 3x3) e recortar de volta.
tipo: procedimento
status: ativo
atualizado: 2026-10-27
---

# Dungeon Companion — Imagens do Tom

O Tom (`tom-assistant` no web) tem **9 poses**, em `dungeon-companion-web/src/assets/tom/`, todas
PNG 402×436 com fundo transparente: `tom` (parado), `tom-hi`, `tom-pointing`, `tom-like`,
`tom-celebrating`, `tom-reading`, `tom-casting-spell`, `tom-forging` e `tom-stop`.

## Editar todas de uma vez (2026-10-27, 1.14.1)

Feito pra tirar a estrela de 6 pontas do avental, mantendo o resto.

1. Montar a grade 3×3 com as poses atuais (na ordem acima, 48 px entre elas):
   [`scripts/tom/montar_grade.py`](../scripts/tom/montar_grade.py) (precisa do Pillow — num venv
   no scratchpad: `python3 -m venv imgenv && imgenv/bin/pip install pillow`).
2. Pedir a edição ao ChatGPT com a grade, deixando claro que é **a única mudança**: manter grade,
   posições, fundo transparente, cores e pixel art. Prompt usado:

   ```
   Edite esta imagem em pixel art com o MÍNIMO de alteração possível.
   A imagem é uma folha com 9 poses do mesmo personagem (um anão ferreiro com chapéu de mago roxo
   e avental de couro marrom), numa grade 3 x 3, com fundo transparente.
   ÚNICA alteração: em todas as 9 poses, remova o símbolo da estrela de 6 pontas desenhado no
   avental de couro (na parte de baixo do avental, abaixo do cinto). No lugar dele, pinte o couro
   liso do avental, continuando a mesma cor marrom, o mesmo sombreamento e a mesma textura de
   pixel do couro ao redor, como se o símbolo nunca tivesse existido. Não coloque nenhum outro
   símbolo, emblema, costura ou detalhe no lugar.
   Mantenha EXATAMENTE igual todo o resto: o tamanho total da imagem, a grade 3 x 3, a posição e
   o tamanho de cada pose; o fundo transparente; o personagem (rosto, barba, chapéu, roupas,
   cores, contornos, pose, mãos e ferramentas); o estilo pixel art, sem suavizar nem redesenhar.
   Não melhore, não reinterprete e não mude a iluminação nem a paleta.
   ```
3. Recortar de volta: [`scripts/tom/recortar_grade.py`](../scripts/tom/recortar_grade.py). O
   ChatGPT devolveu a grade **menor** (1211×1299 em vez de 1398×1500) e o Tom ~10% maior dentro
   de cada quadro, com um contorno quase transparente: o script ajusta cada pose à altura da
   original (pés na mesma linha, mesmo centro) e limpa esse contorno. Conferir com uma grade
   montada das poses novas e uma comparação ampliada antes de trocar os arquivos.

Grades guardadas em [`artes/tom/`](../artes/tom/): `tom-grade-com-estrela.png` (antes),
`tom-grade-sem-estrela-chatgpt.png` (o que o ChatGPT devolveu) e `tom-grade-atual.png` (as poses
recortadas que estão no site).
