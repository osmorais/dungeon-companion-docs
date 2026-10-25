---
resumo: Plano e prompts do ChatGPT pras imagens dos monstros do bestiário (medalhão em pixel art), em levas começando pelos mais usados, e onde salvar.
tipo: procedimento
status: ativo
atualizado: 2026-10-25
---

# Dungeon Companion — Artes dos monstros (bestiário)

Imagens dos monstros da tabela `monster` (428 fichas, ver [`conceitos/monstros.md`](../conceitos/monstros.md)),
geradas pelo usuário no ChatGPT. Hoje todo monstro sem imagem enviada pelo mestre aparece com a
mesma arte padrão (`dungeon-companion-web/src/assets/monster.png`, um dragão vermelho num medalhão);
a ideia é ter uma arte por monstro, **começando pelos mais usados**.

## Formato (igual à arte padrão)

- Medalhão redondo em pixel art, 1024 × 1024 px, borda dourada fina com quatro losangos (topo, base
  e laterais), cena escura de fundo **dentro** do círculo e **transparente fora** dele — como o
  `monster.png`, que vai **anexado como referência** em toda conversa.
- Sem texto. Desenho original: nada copiado de arte oficial de livro ou jogo.
- Onde aparece: mesa (lista de monstros, destaque do monstro revelado), início do combate e
  catálogo do mestre — sempre como imagem padrão quando o mestre não subiu uma própria.

## Onde salvar

- **Originais (PNG)**: neste repositório de docs, em `artes/monstros/<slug>.png`, com o `slug` da
  tabela (coluna "slug" nas listas abaixo). Fora do repositório web pra não pesar o clone.
- No web (depois, numa entrega): versão reduzida em WebP em `src/assets/monsters/<slug>.webp`, e a
  imagem padrão do monstro passa a ser a do slug quando existir (senão continua o `monster.png`).
  Isso precisa de código; ver "Depois das imagens".

## Como gerar

1. Abrir uma conversa nova no ChatGPT, **anexar o `monster.png`** e colar o prompt base com o
   primeiro monstro da leva.
2. Os seguintes, na **mesma conversa**, com o prompt curto de continuação (mantém estilo, borda e
   escala). Fazer no máximo ~6 por conversa; depois abrir outra, anexando de novo o `monster.png`
   e **uma imagem já aprovada** da leva.
3. Conferir cada imagem antes de salvar:
   - fora do círculo está transparente (se vier fundo preto/branco, pedir: "make everything outside
     the circle fully transparent, keep the rest identical");
   - sem letras ou números; borda igual à da referência; criatura reconhecível e centralizada.
4. Salvar como `artes/monstros/<slug>.png` e marcar na tabela da leva.

### Prompt base (primeiro da conversa)

Trocar `[CRIATURA]` e `[CENÁRIO]` pelos da tabela.

```
Create a single 1024x1024 PNG illustration in exactly the same style as the attached reference image: a round medallion portrait of a fantasy monster.
Format: a circular medallion filling the canvas, with a thin pixel-art gold border (#CCAA44) and four small diamond ornaments at the top, bottom, left and right, exactly like the reference. Everything OUTSIDE the circle must be fully TRANSPARENT (PNG with alpha). No text, no letters, no numbers, no watermark, no signature.
Style: crisp 16-bit pixel art with visible square pixels, no blur, no anti-aliasing, dark outline #1C0B0B on every shape, rich but limited palette, light coming from the top-left, dark fantasy mood.
Composition: the creature is the main subject, centered, in three-quarter view, filling about 70% of the circle, in a menacing ready-to-fight pose. Behind it, a simple dark background scene inside the circle, lower contrast than the creature so it stands out.
Original design: do not copy or imitate any official artwork from published books or games.
Creature: [CRIATURA]
Background inside the circle: [CENÁRIO]
```

### Prompt de continuação (mesma conversa)

```
Next image, same style, gold border, transparent outside the circle, palette, lighting, pixel size and scale as the previous ones. No text.
Creature: [CRIATURA]
Background inside the circle: [CENÁRIO]
```

## Levas (começando pelos mais usados)

A ordem abaixo segue os monstros mais comuns em aventuras de nível baixo, que é onde as mesas
estão. **Pra refinar pelo uso real**: contar em produção quantas vezes cada monstro foi catalogado
e posto em sessão (`monster_catalog` e `monster_session` agrupados por `monster_api_slug`, só
leitura, sem dado de usuário) — precisa de autorização pra consulta no banco de produção.
Monstros catalogados antes da 1.10.0 têm slug em inglês (ex.: `skeleton`), então a contagem tem que
juntar os dois nomes.

### Leva 1 — encontros de nível 1 a 3

| Slug | Nome | ND | `[CRIATURA]` | `[CENÁRIO]` |
|---|---|---|---|---|
| `goblin` | Goblin | 1/4 | a small green-skinned goblin with big pointed ears, yellow eyes and a toothy grin, wearing scrappy leather armor and a wooden shield, holding a short rusty scimitar | a dark forest trail at night with twisted roots |
| `kobold` | Kobold | 1/8 | a tiny reptilian kobold with rust-red scales, small horns and a long tail, holding a crude spear, crouched and sneaky | a narrow mine tunnel with a hanging lantern and scattered rocks |
| `orc` | Orc | 1/2 | a muscular grey-green orc with tusks and war paint, wearing hide armor, raising a heavy greataxe and shouting | a burning frontier village at dusk |
| `esqueleto` | Esqueleto | 1/4 | an animated human skeleton with glowing pale-blue eye sockets, in broken rusty armor scraps, holding a notched shortsword | a crypt with stone coffins and cobwebs |
| `zumbi` | Zumbi | 1/4 | a shambling rotting human zombie with grey-green skin, torn peasant clothes, outstretched arms and a vacant stare | a foggy graveyard with leaning tombstones |
| `lobo` | Lobo | 1/4 | a grey wolf with bared fangs and raised hackles, lunging forward | a snowy pine forest under a full moon |
| `bandido` | Bandido | 1/8 | a human bandit with a hooded cloak and cloth mask over the lower face, leather armor, holding a scimitar and a light crossbow on the back | a roadside ambush on a muddy forest road |
| `cultista` | Cultista | 1/8 | a human cultist in a dark red hooded robe with a strange sigil, face in shadow, holding a curved ritual dagger | a candle-lit underground altar with a dark symbol painted on the wall |
| `rato-gigante` | Rato Gigante | 1/8 | a dog-sized giant rat with mangy brown fur, red eyes, long yellow teeth and a scaly tail | a dark sewer with dripping water and green slime |
| `aranha-gigante` | Aranha Gigante | 1 | a huge black hairy spider with eight red eyes and dripping fangs, rearing up | a cave full of thick white webs and wrapped cocoons |
| `ogro` | Ogro | 2 | a huge brutish ogre with dull grey skin, a big belly, crude animal-hide clothes and a massive tree-trunk club | a rocky hillside with a crude campfire and bones |
| `gnoll` | Gnoll | 1/2 | a hyena-headed gnoll with spotted fur, wild mane, crude armor and a spear, snarling | a dry savanna at sunset with a broken wagon |

### Leva 2 — líderes, feras e masmorra

| Slug | Nome | ND | `[CRIATURA]` | `[CENÁRIO]` |
|---|---|---|---|---|
| `hobgoblin` | Hobgoblin | 1/2 | a disciplined hobgoblin soldier with orange-red skin, polished chain mail, a longsword and a military banner on the back | a fortified war camp with wooden palisades |
| `bugbear` | Bugbear | 1 | a tall hairy bugbear with bear-like face, long arms, brown fur and a spiked morningstar, sneaking forward | a dark forest ambush spot with thick undergrowth |
| `chefe-goblin` | Chefe Goblin | 1 | a goblin boss larger than common goblins, with a dented iron helmet, chain shirt, a scimitar and a crude bone trophy necklace | a goblin cave throne made of junk and skulls |
| `capitao-dos-bandidos` | Capitão dos Bandidos | 2 | a scarred human bandit captain with a long coat, studded leather armor, a scimitar in one hand and a dagger in the other | a bandit hideout in ruins with stolen chests |
| `lobo-atroz` | Lobo Atroz | 1 | an enormous dire wolf, horse-sized, with dark shaggy fur, glowing yellow eyes and huge fangs | a misty dark forest clearing |
| `worg` | Worg | 1/2 | an evil black worg with red eyes, scarred muzzle and a cruel intelligent look, growling | a ruined watchtower on a moor at night |
| `carnical` | Carniçal | 1 | a gaunt pale ghoul with grey skin stretched over bones, long claws, sharp teeth and a hungry crouching pose | a dark ossuary with stacked skulls |
| `sombra` | Sombra | 1/2 | a living shadow shaped like a human silhouette made of pure darkness, with faint white eyes and smoky edges | a dim corridor lit by a single dying torch |
| `urso-coruja` | Urso-Coruja | 3 | a huge owlbear with the body of a brown bear and the head of a great horned owl, sharp beak, feathers blending into fur, rearing up | a deep old forest with giant trees |
| `mimico` | Mímico | 2 | a mimic disguised as a wooden treasure chest, its lid opening into a toothy mouth with a long sticky tongue | a dungeon treasure room with scattered gold coins |
| `cubo-gelatinoso` | Cubo Gelatinoso | 2 | a large translucent green gelatinous cube filling a corridor, with a skeleton, a sword and coins suspended inside | a narrow stone dungeon corridor |
| `harpia` | Harpia | 1 | a harpy with the upper body of a wild-haired woman and the wings, legs and talons of a vulture, screeching | a rocky sea cliff with a stormy sky |

### Leva 3 — chefes e criaturas icônicas

| Slug | Nome | ND | `[CRIATURA]` | `[CENÁRIO]` |
|---|---|---|---|---|
| `troll` | Troll | 5 | a lanky green troll with rubbery warty skin, long arms, sharp claws, a long nose and messy dark hair | a swamp at night with a crumbling stone bridge |
| `minotauro` | Minotauro | 3 | a minotaur with a bull's head and horns, massive muscular body, a nose ring and a huge greataxe | a stone labyrinth with torches |
| `basilisco` | Basilisco | 3 | an eight-legged reptilian basilisk with dull brown scales, a row of spikes on its back and glowing eyes | a cave with petrified stone statues of adventurers |
| `manticora` | Manticora | 3 | a manticore with a lion's body, bat-like wings, a tail full of spikes and a fierce humanoid face | a rocky desert canyon at dusk |
| `grifo` | Grifo | 2 | a griffon with the head, wings and front talons of an eagle and the body of a lion, wings spread | a mountain peak above the clouds |
| `wyvern` | Wyvern | 6 | a wyvern, a two-legged dragon-like creature with leathery wings, a long neck and a venomous stinger tail | a stormy mountain crag |
| `dragao-vermelho-filhote` | Dragão Vermelho Filhote | 4 | a red dragon wyrmling the size of a large dog, young but fierce, with small horns and wings, breathing a little flame | a volcanic cave with glowing lava cracks and coins |
| `dragao-vermelho-jovem` | Dragão Vermelho Jovem | 10 | a large young red dragon with big horns, wide wings and fire glowing in its throat | a volcano lair with a pile of gold |
| `vampiro` | Vampiro | 13 | a pale aristocratic vampire with red eyes, fangs, slicked-back hair and a high-collared black and crimson cloak | a gothic castle hall with tall windows and moonlight |
| `lich` | Lich | 21 | a lich, a skeletal undead sorcerer with glowing blue eyes, a crown and tattered royal robes, holding a glowing staff | a dark tomb with floating arcane runes |
| `lobisomem` | Lobisomem | 3 | a werewolf in hybrid form, a huge wolf-headed humanoid with grey fur, claws and torn human clothes, howling | a dark village street under a full moon |
| `elemental-do-fogo` | Elemental do Fogo | 5 | a fire elemental, a roaring humanoid shape made of living flame with bright yellow core | a scorched stone chamber with embers in the air |

**Fica de fora por enquanto**: o Observador e o Devorador de Mentes (e outras criaturas que só
existem em D&D, fora do SRD) são marca registrada da editora — mesmo com desenho original, ilustrar
aumenta o risco de direitos autorais já anotado no `backlog.md`. Decidir antes de incluir.

## Depois das imagens

Entrega no web (pedir quando a leva 1 estiver pronta):

- reduzir os PNGs pra WebP (~384 px, mantendo os pixels nítidos) em `src/assets/monsters/`;
- lista dos slugs que têm arte (pra não pedir imagem que não existe) e a imagem padrão do monstro
  passa a ser a do slug, na mesa, no início do combate e no catálogo;
- monstros catalogados antes da 1.10.0 (slug em inglês) não casam com o slug da arte — ver o item
  de migração em `backlog.md`, seção "Monstros".
