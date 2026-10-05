# PROMPTING_CONTEXT — Albion Tools

Resumen técnico para retomar el proyecto en un chat nuevo. Leer esto antes de tocar código.

## 1. Arquitectura general

- **SPA** en JS clásico, sin frameworks ni build. 5 archivos: `index.html`, `style.css`, `script.js` (~2900 líneas), `market-data.js` (datos generados del Mercado) y `fishing-data.js` (datos generados de pesca). Los dos de datos se cargan antes de `script.js`.
- Se ejecuta abriendo `index.html` o con `python -m http.server 8000`.
- **Pestañas**: `.nav-btn[data-tab]` → `showTab(name)` activa `section#tab-<name>.tab-section.active` (el resto `display:none`). El estado va en el hash (`#refining`). `TAB_NAMES = market, refining, crafting, breeding, farming, consumables, butcher, fishing`.
- **Estilo**: dark gamer con acento dorado. Variables CSS en `:root` (`--accent #e0a526`, `--sell`, `--error`, `--warn`, `--ench-0..4`). Navbar sticky; con 8 pestañas, por debajo de 1400 px los botones se compactan (`@media (max-width: 1400px)`) para que el selector de servidor quepa en la misma línea; en móvil las pestañas se desplazan en horizontal.
- **Orden de `script.js`**: config/datos → API y utilidades → pestañas → Mercado → `createCalculator` → Refinamiento → Crafteo → Crianza → Cultivos → Consumibles → Carnicería → INICIO.
- **Helpers**:
  - `$(id)`
  - `makeButtonGroup(container, [{label,value,icon,className,style}], initial, onChange)` → `{set, disable}` (botones `.filter-btn`, `.active`)
  - `formatSilver` / `formatNumber` (es-ES, `useGrouping:"always"`)
  - `setStatus(el, msg, isError)`

## 2. Pestañas

| Pestaña | Qué hace |
|---|---|
| **Mercado** | 3 niveles: pestaña (Armas, Secundarias, Armaduras, Accesorios, Recolección, Artefactos, Recursos, Materiales, Consumibles, Granja, Monturas) → subcategoría → ítem con icono. Datos en `MARKET_TABS` (`market-data.js`, **666 ítems**). Buscador por nombre sin tildes (máx. 60 resultados), Tier T1–T8 y Encantamiento; solo se activan los tiers y encantamientos que existen para el ítem. Admite un ID manual. |
| **Refinamiento** | Recurso (madera/metal/cuero/tela/piedra), tier, encantamiento, RRR y Foco (enlazados). Materiales: brutos + 1 refinado del tier anterior. La piedra no se encanta. |
| **Crafteo** | `CRAFT_ITEMS` = **155 armas y off-hands** de `CRAFT_WEAPONS` (normales y de artefacto ◆, una sección por línea) + armaduras, bolsas, capas y herramientas de `CATEGORIES`/`RECIPES`. Tier, encantamiento, RRR y tarifa de estación. El artefacto y los restos de criatura entran como materiales no retornables. Bajo la RRR se indica la ciudad con bono del ítem (`CRAFT_BONUS`, ej. "★ Caerleon con bono de crafteo de Herramientas") y las opciones 24.8/47.9% llevan su nombre. |
| **Crianza** | Sub-pestañas **Domésticos** / **Monturas Especiales** (optgroups Salvajes, Ciervos, Facción). Cría + comida → adulto. Si el animal se ensilla, un panel compara vender el adulto crudo vs. ensillarlo. Los chips de info muestran crecimiento en h y días, nutrición y **comida por día** (por animal y total). |
| **Cultivos** | Sub-pestañas **Cultivos** / **Hierbas (alquimia)**. Semilla → cosecha. Ubicación con ★ en las ciudades de bono (+10%), riego con Foco, Premium (cosecha ×2) y "¿Ya tengo las semillas?". Muestra parcelas, cosecha, lombrices y semillas recuperadas. |
| **Consumibles** | Sub-pestañas **Cocina** / **Alquimia**. **Categoría** (`#cons-item`: Sopas, Tortillas… en cocina; cada familia de pociones en alquimia) → **Comida/Poción** concreta (`#cons-recipe`, "T5 · Tortilla de cangrejo de río", value `FAMILIA|tier`) → encantamiento (solo comidas). Debajo se muestra el efecto y la receta. Cocina tiene **las 21 familias del juego**. Bajo la RRR se indica la ciudad con bono (cocina → Caerleon, alquimia → Brecilien). Panel "Costo de fabricación VS Precio de mercado" en verde/rojo/naranja. |
| **Pesca** | Lista de los 42 peces/objetos de pesca (`FISH_DATA` en `fishing-data.js`) con filtros de agua, tipo y texto. Cada tarjeta muestra en qué biomas sale y el % por tier de zona, los sitios fijos (aguas de ciudad, islas, escondite), el precio en la ciudad elegida y las comidas que lo usan. Al elegir zona + tier se ordena por probabilidad en esa zona. Panel **🪱 Cebo, especialización y comida**: cebo, niveles de Pescador y Especialista (guardados en `localStorage` `fish:master` / `fish:spec`), comida, **equipo de pescador** (caña, gorro, atuendo, botas, mochila y cargas 0-10, guardados en `localStorage` `fish:gear:*`) y espera actual → velocidad total, rendimiento y espera nueva. **🎯 Pez que quieres** (de la zona y el tier elegidos): % por captura, capturas de media para que salga, peces por cada 100 capturas y por hora (antes y después de los bonos). No es una calculadora: `calculators.fishing = { refresh: loadFishPrices }` solo para cargar precios al abrirla o cambiar de región. |
| **Carnicería** | Animal adulto de granja (Pollo T3 … Vaca T8; caballos y bueyes no se carnean) → carne. El selector "Dónde carnear" (Isla o cada ciudad, con ★ en la del bono) + Foco definen la RRR. Panel resumen: inversión, taller, carne, impuestos y ganancia en verde/rojo. |

**Panel "🎓 Especialización y foco"** (`<details class="spec-panel">` antes del botón Calcular en las 6 calculadoras; IDs `${prefix}-spec-summary|fields|result`):
- `createSpecPanel(prefix, onChange)` → `{ render(key, fields), level(key), show({ base, fce, units, unitLabel, note, extraHtml, usingFocus }) }`. `render` solo reconstruye los campos si cambia `key` (ej. `ref:metal`, `craft:MAIN_SWORD`, `cons:MEAL_SOUP`, `breed:horse`, `farm:WHEAT`, `butch`).
- Campos de Crafteo: Maestría de la línea, Espec. del ítem, Otras normales (suma) y Otras de artefacto (suma).
- Los niveles se guardan en `localStorage` (`spec:<key>`, con try/catch). "Otras espec. (suma)" admite hasta `SPEC_OTHERS_MAX` = 1500.
- `show({ ..., usingFocus })` también pinta `#${prefix}-focus-line`, una línea visible arriba de los resultados con el foco total para la cantidad consultada. `usingFocus` sale del interruptor de Foco o, en Crafteo/Consumibles, de `rrrUsesFocus(select)` (la opción de RRR contiene "Foco"; null si es personalizada). Avisa si pasa de `FOCUS_MAX` = 30.000 (el máximo acumulable).
- Se actualiza desde el `onRecalc` de cada calculadora (`updateRefiningSpec`, `updateCraftingSpec`, `updateBreedingSpec`, `updateFarmSpec`, `updateConsumableSpec`, `updateButcherSpec`). El chip de foco de Crianza se movió a este panel.

**Base común `createCalculator(prefix, {rrrOptions, buildModel, defaultBuyCity, defaultSellCity, onRecalc})`**:
- La usan las 6 calculadoras. Los IDs del HTML siguen el patrón `${prefix}-qty|fee|rrr|rrr-custom|premium|sellorder|buy-city|sell-city|reload|status|materials|stats|product-img|product-name|product-id`. Los prefijos son `ref`, `craft`, `breed`, `farm`, `cons`, `butch`.
- `fee` y `rrr` son opcionales en el HTML.
- `buildModel()` devuelve:
  ```js
  {
    product: { id, name, value, yield? },
    materials: [{ id, name, perUnit, returnable?, returnRate?(), short?, fallbackPrice? }],
    extras?: [{ id, side: "buy" | "sell" }],
  }
  ```
- `refresh(force)` reconstruye el modelo y **solo vuelve a pedir precios si cambia `priceKey`** (región + ciudades + tipo de venta + IDs). `recalc()` calcula sin tocar la API.
- `calc.prices[id]` guarda los precios, que el usuario puede editar (los campos sin precio salen en naranja con `.missing`).
- Material con `fallbackPrice`: se usa si la API no trae precio (semillas → precio del mercader de granja).
- **Precio por ciudad de cada material**: `loadPrices` pide las 7 `CITIES` (+ ciudad de venta). `calc.cityPrices[id]` = `[{city, price, date}]` y `calc.priceSource[id]` = ciudad, `"npc"` (fallbackPrice) o `"manual"`. Debajo de cada precio hay un `select.price-source` (`buildSourceSelect`): ciudades de más barata a más cara (💰 la más barata, antigüedad con `ageLabel`), las sin datos deshabilitadas, "Mercader" si hay `fallbackPrice` y "✏️ Precio manual". Por defecto, la ciudad de "Comprar en". Escribir en el campo pasa el selector a manual. Vale para las 6 calculadoras.
- `onRecalc(result)` (incluye `materialsCost` y `stationFee`) alimenta los paneles propios de cada pestaña (ensillado, veredicto de consumibles).

## 3. API (Albion Online Data Project)

- **Precios**: `https://{region}.albion-online-data.com/api/v2/stats/prices/{ID1,ID2,...}.json?locations=A,B&qualities=1`.
  - Cada ID va con `encodeURIComponent` (`@` → `%40` funciona) y se unen con `,`. Las ciudades con espacio también se codifican (`Black%20Market`).
- **Región**: `DEFAULT_REGION = "west"`. El `#region-select` de la navbar (`west`/`east`/`europe`) es global y forma parte de `priceKey`.
- **Imágenes**: `https://render.albiononline.com/v1/item/{ID}.png?size=N`.
- **Qué precio se usa**:
  - Comprar → `sell_price_min` en la ciudad de compra.
  - Vender → `sell_price_min` si es orden de venta, `buy_price_max` si es venta directa.
  - Las fechas vienen en UTC sin `Z` (se añade). `0001-01-01` significa sin dato.
- **Cancelación**: cada búsqueda crea un `AbortController` y aborta el anterior (`marketRequest` en Mercado, `calc.request` en cada calculadora). Se ignora `AbortError`. Así un clic rápido nunca pinta datos viejos.
- **Datos escasos**: faltan muchos precios (crías, monturas de facción, corazones) y hay órdenes absurdas (crías a 10M, Energía avaloniana a 50k). Por eso todo precio es editable.

## 4. Estructuras de datos clave

**IDs**:
- `buildItemId({category,tier,enchant})` → `T{t}_{code}` + `@{e}`.
- `materialId(code,t,e)` → `T{t}_{code}_LEVEL{e}@{e}` (los recursos encantados llevan `_LEVEL`).

**`CATEGORIES`**: `{ name, code, group }`. **Solo la usa Crafteo** (armaduras SET1, bolsa, capa, herramientas); el Mercado ya no.

**`MARKET_TABS`** (`market-data.js`): `[{ name, subs: [{ name, items: [{ code, name, tiers: "1-8" | "1,3,5", ench, names?, level? }] }] }]`.
- `script.js` lo aplana en `MARKET_ITEMS` (añade `tab`, `sub` y `tierList`).
- ID: `marketItemId` → `materialId` si `level` (recursos: `T5_FIBER_LEVEL2@2`), si no `T{t}_{code}@e`.
- `names[tier]`: nombre exacto cuando cambia por tier (recursos, carne, peces, pociones menor/mayor…). El botón usa las palabras comunes ("Carne") o una etiqueta de `LABELS`.
- `ench` = encantamiento máximo. Piedra bruta .3, bloques de piedra 0, el resto de recursos .4 (fijados a mano, porque en items.xml los recursos encantados son códigos `_LEVEL` aparte).
- **Cómo regenerarlo**: descargar `items.xml` y `formatted/items.json`. Recorrer los ítems `T{n}_{code}` y quedarse con los `shopcategory`/`shopsubcategory1` útiles; excluir `tradable="false"` y códigos con NONTRADABLE, DEBUG, SKIN, PROTOTYPE, EVENT, XMAS, GVG, SEASON… Luego sacar los tiers existentes y el máximo de `<enchantment>`, y quitar del nombre ES el sufijo de tier ("del principiante/novato/aprendiz/obrero/iniciado/experto/maestro/gran maestro/anciano").
- Las armas llevan el prefijo **`MAIN_`** (1 mano) o **`2H_`** (2 manos). Ejemplos: `MAIN_SWORD`, `MAIN_CURSEDSTAFF` (con D), `2H_BOW`, `2H_CROSSBOW`, `2H_KNUCKLES_SET1`, `2H_SHAPESHIFTER_SET1`.
- Las armaduras llevan `_SET1` (`HEAD_PLATE_SET1`…). Las herramientas son `2H_TOOL_PICK|AXE|SICKLE|KNIFE|HAMMER`. `BAG`, `CAPE` y `OFF_*` no llevan prefijo.

**`RECIPES[code]`**: `{ METALBAR: 16, LEATHER: 8 }` (igual en T4–T8 y en todos los encantamientos). Solo armaduras, bolsas, capas y herramientas; las armas están en `CRAFT_WEAPONS`.

**`CRAFT_BONUS`** (craftingmodifiers.xml, +15%): `craftingcategory → { name, city, rest? }`. `craftCategory(item)`: línea del arma (shieldtype/torchtype/booktype → `offhand`), `tools`, `bag`, `cape` o `<material>_<helmet|armor|shoes>` en armaduras. Herramientas → Caerleon; off-hands → Martlock; bolsas y capas → Brecilien. `rest` = descanso de Avalon (Arthur, Merlyn, Morgana) que también da el bono.

**`CRAFT_WEAPONS`** (generado desde `items.xml` + `formatted/items.json`, nombres ES-ES sin "del iniciado"): `{ code, name, line, recipe, artifact?, artifactName?, artifactValue?, part?, partNames? }`.
- `line` = shopsubcategory1 (`WEAPON_LINES` da el nombre ES; `OFFHAND_LINES` = shieldtype/torchtype/booktype).
- Artefacto: `T{t}_{artifact}`, 1 por ítem, no retornable y **no se encanta** (el mismo sirve de .0 a .4). `artifactValue` es el itemvalue en T4 y se duplica por tier; se suma al valor del ítem para la tarifa de estación. El artefacto **no cambia el foco**.
- Cambiaformas: `creaturePart(item, tier)` → restos `T{impar}_{part}` (×1 en tier impar, ×2 del tier anterior en tier par). `partNames` por tier 3/5/7.
- Ojo con los nombres: `2H_BOW_KEEPER` = **Arco de Badon**, `2H_LONGBOW_UNDEAD` = **Arco susurrante**.

**`RESOURCES`**: `{ raw, refined, bonusCity, noEnchant? }`. `RAW_PER_REFINE = {4:2, 5:3, 6:4, 7:5, 8:5}`.

**`ANIMALS`**:
```js
{ key, name, category: "farm" | "special", group?, diet: "plants" | "meat",
  ids: ["T5_FARM_X", ...],   // uno por tier; se añade _BABY / _GROWN
  mount?: { id: (t) => "T{t}_MOUNT_X", name, parts: (t) => [{ id, name, count }] } }
```
- **Ensillado**: caballo = 20 × `T{t}_LEATHER`, buey = 30 × `T{t}_PLANKS`, salvajes y ciervos = 20 cueros.
- **Facción** (`factionMount()`): solo existe en **T5** y **T8** (`_ELITE`). Lleva 20 cueros + **5 corazones en T5 y 20 en T8**. Corazones en `HEARTS`:

  | Ciudad | ID del corazón |
  |---|---|
  | Bridgewatch | `T1_FACTION_STEPPE_TOKEN_1` |
  | Fort Sterling | `MOUNTAIN` |
  | Lymhurst | `FOREST` |
  | Martlock | `HIGHLAND` |
  | Thetford | `SWAMP` |
  | Caerleon | `CAERLEON` |
  | Brecilien | `QUESTITEM_TOKEN_MISTS` |

  El Carnero (Martlock) y el Ave moa (Bridgewatch) son herbívoros; el resto de facción son carnívoros.
- **`FARM_STATS[id]`**: `{ hours, nutrition, offspring, focusBonus, focus, favorite? }`. `FACTION_STATS` se comparte por tier.
- **Comida**: no es un número fijo. Unidades por animal = `ceil(nutrition / nutrición_por_unidad)`, que se rellena en un input editable.
  - Plantas = 48 (×2 si es la favorita), carne = 52.
  - La zanahoria es `T1_CARROT` (`T4_CARROT` no existe).
  - La comida por animal es para **todo** el crecimiento, no por día. Comida por día = `comida_por_animal ÷ (hours / 24)` (promedio), × cantidad para el total. Se recalcula al editar el input. Ej.: caballo T5 = 140 h (5,8 días), 90 zanahorias → 15,4 por día.

**Pesca** (`fishing-data.js`, generado de `loot.xml` + `formatted/items.json`):
- `FISH_DATA`: `{ id, name, tier, water: "fresh"|"salt"|"both", kind: "common"|"rare"|"boss"|"extra", biome?, zones: { BIOMA: { tier: % } }, spots: { sitio: % } }`. % = cantidad esperada por captura, resolviendo las listas `T{n}_FISHING_ZONE_{FRESHWATER|OCEAN}_BASE_{BIOMA}_LOOT` (OR con pesos y `chance`).
- Biomas en `FISHING_BIOMES`: Bosque=Lymhurst, Montaña=Fort Sterling, Pantano=Thetford, Estepa=Bridgewatch, Tierras altas=Martlock, Ávalon, Tierras Ancestrales (`DRAGON_AREA`, nombre ES en localization.xml) y Océano. Cada raro sale en su bioma (peso 3) y en dos vecinos (pesos 2 y 1). Mazmorras = Montaña (agua dulce) / Océano. Ciudades = lista T4 de su bioma; islas y escondite = comunes T1–T2. Tiburón solo en `FISHING_ZONE_OCEAN_SPOT_BOSS`. El alga es un extra que sale además del pez.
- Colores de zona por tier (`TIER_ZONE_COLORS`, de `cluster/world.xml`): azul T1–T5 (T1–T2 son zonas de inicio), amarilla T5–T6, roja T6–T7, negra T5–T8. Cada tier se pinta con puntos de color en las tarjetas y con emojis en el selector; no se aplica en Ávalon ni en Tierras Ancestrales. El color no cambia la pesca, solo el riesgo.
- **Cebos** (`FISHING_BAITS`, de items.xml + spells.xml `FISHINGBAIT_LEVELn_USE`): Cebo simple T1 +50%, extravagante T3 +125%, especial T5 +250% de `fishingspeed`; 10 cargas (capturas) o 600 s; 1/5/25 × `T1_WORM`. **No cambian el botín** (ni la probabilidad de los raros). Los dumps no traen el tiempo base de espera: se asume espera con cebo = espera ÷ (1 + velocidad), y el usuario escribe su espera sin cebo. Los precios de cebos y lombriz se piden junto con los de los peces.
- **Especialización** (`FISHING_SPEC`, wiki oficial; los dumps no traen el árbol): Pescador +0,16% velocidad, +0,16% rendimiento y +0,5 de poder por nivel; Especialista +0,33%, +0,33% y +2,5 (máx. 100 cada uno). Una fuente dice 0,35 por nivel para el Especialista.
- **Comida** (`FISHING_FOODS`, spells.xml): Ensalada de alga +10% velocidad; pasteles normales y de pescado `FOOD_(FISH_)LOAD_GATHER_P1..P8` = rendimiento 5% + 2,5% × (tier − 3 + encantamiento).
- **Equipo de pescador** (`FISHING_GEAR`, `AVALON_ROD_YIELD`, `FISH_BAG_WEIGHT`; items.xml + spells.xml + texto ES de localization.xml): gorro, atuendo y botas `PASSIVE_(HEAD_|SHOES_)YIELD_FISH_T{n}` suman una carga de rendimiento cada 30 s mientras están puestos, hasta 10 cargas, solo para peces de tier ≤ n. Por carga: atuendo 0,5/1/1,5/2,5/3,5% (T4–T8), gorro y botas 0,25/0,5/0,75/1,25/1,75%. Caña avaloniana: +10/12,5/15/17,5/20% fijo para peces de tier ≤ n; la normal solo tiene `fishingspeed=0.05` en todos los tiers. Mochila: los peces de tier ≤ n pesan 20–40% menos (sin rendimiento). El encantamiento no cambia ninguna pasiva. El rendimiento del equipo se calcula para el tier del pez objetivo.
- **Cálculo** (`renderBait`): velocidades sumadas; espera nueva = espera actual × (1 + vel. espec.) ÷ (1 + vel. total), porque el usuario mide con su especialización pero sin cebo ni comida. Rendimiento = probabilidad de doble captura → peces por captura = 1 + rendimiento (por encima de 100% se asume que el exceso sigue sumando). "Ahora" = con especialización y equipo, sin cebo ni comida. Por hora = 3600 ÷ espera × p × (1 + rendimiento): solo cuenta la espera, no el minijuego. Nada de esto cambia la probabilidad de cada pez.
- Para regenerar: el script del scratchpad recorre `loot.xml`; los nombres salen de `formatted/items.json`.

**Consumibles**:
- `CONSUMABLE_FAMILIES`: `{ tab: "cooking" | "alchemy", category?, name, effect, code, tiers, enchants? }`. `category` = tipo de plato (sin ella, la categoría es `name`). La primera familia de cada categoría es la normal y su `code` es la clave de la especialización (`cons:MEAL_OMELETTE` para pollo, cangrejo, avaloniana y leyaleta); en "Otros" va por familia.
- `CONSUMABLE_RECIPES[id]` (ID sin `@`): `{ name, yield, sauce?, ingredients: [[id, count, returnable?]] }`. Comidas .1/.2/.3 = misma receta + `sauce` × `T1_FISHSAUCE_LEVEL{n}` (10/30/90 en comidas de 10 unidades; 3/9/27 en las de pescado, que dan 1). El producto lleva `@n`.
- `CONSUMABLE_FOCUS[id]`: número, o `[plano, .1, .2, .3]` en comidas encantables (`consumableFocus()`).
- `CONSUMABLE_BONUS_CITY = { cooking: "Caerleon", alchemy: "Brecilien" }` (craftingmodifiers.xml `food`/`potion`, +15%).
- `INGREDIENT_NAMES`: nombres oficiales ES.
- Curación y energía solo en T2/T4/T6. Gigantismo = `POTION_REVIVE`, resistencia = `POTION_STONESKIN`, veneno = `POTION_COOLDOWN`. No existen botellas vacías.

## 5. Fórmulas

- **RRR**: `consumo = base × (1 − RRR)` solo para materiales retornables. RRR = `1 − 1/(1 + bono)`, con bonos: ciudad 18%, bono de refinado +40, bono de crafteo +15, foco +59.

  | Calculadora | Opciones de RRR |
  |---|---|
  | Refinamiento | 15.2 / 36.7 / 43.5 / 53.9 %, con toggle de Foco enlazado por `pair` |
  | Crafteo y Consumibles | 15.2 / 24.8 / 43.5 / **47.9** % (el usuario pidió 47.7 → usar "Personalizado") |
- **Lotes**: `unidades = recetas × yield`. `yield` = 5 en pociones y 10 en comidas (1 en el resto). El costo de materiales es por receta; `ingreso bruto = precio × unidades`.
- **Impuestos**: venta 4% con Premium / 8% sin Premium, más 2.5% de publicación si se vende con orden de venta. `ganancia = bruto − impuestos − (materiales + tarifa de estación)`.
- **Tarifa de estación**: `valor_ítem × 0.1125 × tarifa/100 × cantidad`. Valor de un refinado = `2^(tier+enc)`; el de un ítem es la suma de sus materiales.
- **Crianza**: `costo real de la cría = precio × (1 − P(cría))`. `P = offspring + focusBonus` si hay Foco, **sin tope** (wiki: cada 100% es una cría segura y el resto, probabilidad de otra; ej. pollos con foco 140%). Si P > 100%, el "gasto" de crías sale negativo porque las crías extra valen su precio de compra. Las monturas especiales tienen offspring 0.
  - Interruptor `#breed-own-babies` ("¿Ya tengo las crías?"): la cría usa `returnRate = 1` → no se cobra.
  - `#breed-babies` (`updateBabiesInfo`): crías al cosechar = animales × P. Mensaje: "crías 9 y al cosechar los adultos te dan ≈ 12,6 crías (140% por animal). Te alcanza para volver a criar 9 y te quedan ≈ 3,6 de más…", o "tendrás que conseguir ≈ X crías más".
- **Carnicería** (constantes `BUTCHER_*` en los datos; `BUTCHER_ANIMALS` sale de `ANIMALS` filtrando por `BUTCHER_BONUS_CITY`): `T{t}_MEAT` = 1 × `T{t}_FARM_X_GROWN` → **18 carnes** (no 20). `returnproductnotresource="true"`: la RRR devuelve carne, así que `carne = animales × 18 × (1 + RRR)` (`yield` es un getter). RRR = `1 − 1/(1 + bono)` con ciudad 18% (isla 0%), **+10% en la ciudad de esa carne** (`craftingmodifiers.xml`: Fort Sterling pollo y oveja, Bridgewatch cabra, Lymhurst ganso, Thetford cerdo, Martlock vaca) y foco +59%. Resultados: isla 0 / 37.1%, ciudad 15.3 / 43.5%, ciudad con bono 21.9 / 46.5%. El `itemvalue` del animal es 720 → 81 de nutrición por animal. Foco base: 38 por animal.
- **Foco y especialización** (wiki.albiononline.com: Crafting Focus, Crafting, Island Farms; los dumps NO traen el árbol de especializaciones):
  - `foco = base × 0,5^(FCE / 10.000)`. `FCE = 30 × maestría + (unique + mutual) × espec. del ítem + 30 × Σ otras espec. de la línea`.
  - `SPEC_NODES`: normal 250 + 30 (armas, armaduras, refinado, cocina, alquimia), off-hand 250 + 90, herramientas 250 + 60, bolsa 340, capa 370, **artefacto 250 + 15** (calidad 6 + 0,38). En Crafteo, "otras" se separa en normales (×30, calidad 0,75) y de artefacto (×15, calidad 0,38: `SPEC_OTHER_ARTIFACT`).
  - Refinado: sin maestría; cada tier T4-T8 es una especialización (máx. 40.000). Arma normal: máx. 43.000. Cocina/alquimia: máx. 55.000. Carnicero = especialización de Chef.
  - Crianza: 300 FCE por nivel de la especialización del animal (1.000 → 125). **No** sube la probabilidad de cría.
  - Foco base: refinado `54 × 1,75^(t+e−4)`; equipo `(1286/24) × Σ materiales de la receta × 1,75^(t+e−4)` (verificado con items.xml en las 3.870 combinaciones de arma/tier/encantamiento; las herramientas encantadas no traen dato y se estima con la fórmula); consumibles en `CONSUMABLE_FOCUS` (craftingfocus de items.xml, **por unidad** según la wiki: dudoso, pendiente de confirmar en el juego); carne 38; nutrir 1.000.
  - Calidad (solo Crafteo): puntos = 0,75 × maestría + (6 + 0,75) × espec. + 0,75 × otras. Tiradas = 1 + puntos/100 (la parte decimal se toma como probabilidad de una tirada extra); se queda la mejor con pesos 689/250/50/10/1 (`gamedata.xml`). No incluye comida ni foco.
- **Cultivos** (`FARM_PLANTS`; datos de items.xml `farmableitem *_SEED`, loot.xml `*_LOOT`, farmingmodifiers.xml):
  - Cosecha = semillas × 4,5 (3–6) × 2 con Premium × 1,1 si la isla está en una ciudad con bono. Producto con `yield` getter.
  - Semilla = material con `returnRate = seedChance + waterBonus` (si se riega); puede pasar de 100%, igual que las crías. Con "semillas propias", `returnRate = 1`.
  - Riego: 1.000 de foco por semilla, 300 FCE por nivel (igual que nutrir). Regar NO aumenta la cosecha, solo las semillas. Lombriz: 10% por semilla (×2 Premium), sin precio.
  - 22 h de crecimiento, 9 semillas por parcela. Bonos: cultivos en su ciudad + Brecilien (todos); hierbas en la suya (Caerleon tiene 3).
  - Probabilidad de recuperar semilla (igual para el cultivo y la hierba del mismo tier; coincide con la wiki). Premium, el bono de ciudad y la especialización NO la cambian:

    | Tier | Base | + Riego | Total regando |
    |---|---|---|---|
    | T1 | 0% | +200% | 200% |
    | T2 | 33,3% | +133,3% | 166,7% |
    | T3 | 60% | +80% | 140% |
    | T4 | 73,3% | +53,3% | 126,7% |
    | T5 | 80% | +40% | 120% |
    | T6 | 86,7% | +26,7% | 113,3% |
    | T7 | 91,1% | +17,8% | 108,9% |
    | T8 | 93,3% | +13,3% | 106,7% |
  - `#farm-seeds` (`updateFarmInfo`): "plantas 54 y al cosechar recuperas ≈ 75,6 (140% por semilla). Te alcanza para volver a plantar 54 y te quedan ≈ 21,6 de más para vender o plantar más", o "tendrás que comprar ≈ X semillas". Sin riego, sugiere el % que tendría regando.
  - Caso de referencia (usuario): 54 semillas de trigo, espec. 65, con riego, Martlock, Premium → 534,6 manojos, 75,6 semillas de vuelta, foco 13.976 (258,8 por semilla).
- **Ensillado**: `ganancia montura = precio_montura × n × (1 − imp.) − gasto_crianza − Σ(parts × precio)`, comparada con vender el adulto crudo.

## 6. Reglas de trabajo en este proyecto

- **Los IDs que da el usuario suelen estar mal.** Verificarlos siempre contra `github.com/ao-data/ao-bin-dumps`: `items.xml` para recetas, `loot.xml` para cosechas, `farmingmodifiers.xml` para bonos de cultivos y crianza, `gamedata.xml` para la calidad, `craftingmodifiers.xml` para los bonos de ciudad (por `craftingcategory` del ítem; los `clusterid` llevan un comentario con el nombre de la ciudad), `@amountcrafted`, `@maxreturnamount="0"` (no retornable), `farmableitem`, `grownitem`, `consumption`; `formatted/items.json` para los nombres ES-ES. Después, comprobarlos contra la API.
- Si el volcado headless solo dice "Script error.", servir la copia con `python -m http.server` y abrirla por `http://localhost:...` para ver el mensaje real.
- En Edge headless las transiciones CSS no avanzan con `--virtual-time-budget` (un interruptor puede verse apagado estando activo), y la ventana no baja de ~477 px de ancho.
- Probar en Edge headless: `msedge --headless=new --virtual-time-budget=N --dump-dom http://localhost:PUERTO/index.html#pestaña` sobre una copia en el scratchpad servida con `python -m http.server`, con un script de volcado añadido al final. Usar un `--user-data-dir` nuevo en cada ejecución y apagar el servidor al terminar. Para capturas: `--screenshot=... --window-size=1280,1000`.
- El heredoc de bash falla con bloques largos de código con acentos o comillas triples: escribir el script de Python en un archivo del scratchpad con Write y ejecutarlo.
- **Caché**: `index.html` carga `style.css`, `market-data.js`, `fishing-data.js` y `script.js` con `?v=AAAAMMDD` + letra (ahora `20261004a`). Subir ese número en cada cambio (los cuatro a la vez); si no, el navegador mezcla el HTML nuevo con el JS viejo y la pestaña se rompe (pasó con el selector de Comida).
- Mantener el estilo: comentarios en español, datos al principio de `script.js` y reutilizar `createCalculator` y `makeButtonGroup`.
- Para descargar los datos: `curl -sL https://raw.githubusercontent.com/ao-data/ao-bin-dumps/master/<archivo>` en el scratchpad (`items.xml` pesa ~10 MB y se puede buscar con grep).

## 7. Historial reciente (en orden)

1. **Bonos Diarios**: descartada. El juego los reparte al azar y no hay calendario que calcular.
2. **Carnicería**: pestaña nueva. El usuario pidió 20 carnes por animal y "Isla = 0%" fijo; se corrigió a 18 carnes, a isla + foco = 37.1% y a un bono de +10% por ciudad según la carne. Ojo: el usuario creía que el bono del pollo estaba en Lymhurst; es Fort Sterling.
3. **Crianza**: se añadió el consumo de comida por día.
4. **Especialización y foco**: panel con el foco real según los niveles del usuario y, en Crafteo, la probabilidad de cada calidad.
5. **Crafteo completo**: el usuario quería elegir cualquier arma (ej. Arco largo, arcos de artefacto) con el costo del artefacto comprado. Se añadieron las 155 armas/off-hands.
6. **Mercado**: primero se añadieron recursos brutos y refinados; luego el usuario pidió "todas las opciones" y se pasó a `market-data.js` con 666 ítems, subcategorías y buscador. Truco para el usuario: el buscador también mira el ID (`baby`, `grown`, `artefact`, `seed`).
7. **Crianza**: crías esperadas al cosechar, interruptor de crías propias y se quitó el tope de 100% de la probabilidad de cría.
8. **Cultivos**: pestaña nueva (cultivos y hierbas de alquimia). La barra de navegación pasó a max-width 1400px para que quepan las 7 pestañas; `.filter-categories` lleva `min-width: 0` para no desbordar en móvil.
9. **Foco visible**: el usuario no veía el foco total (estaba en el panel plegado), así que se añadió la línea de foco en los resultados de las 6 calculadoras, con aviso si pasa de 30.000.
10. **Mensajes de semillas y crías**: el usuario no entendía "Te sobran 21,6 para volver a plantar". Se reescribieron para decir cuántas plantas o crías, cuántas recuperas y qué te queda o te falta.
11. **Cocina completa**: el usuario no veía todas las comidas. Se generaron desde items.xml las 57 recetas (bocadillos, asados, pescado, avalonianas, galletas de draco) con encantamientos .1–.3, y la RRR muestra la ciudad con bono. Arreglado: al cambiar Cocina ↔ Alquimia la familia quedaba vacía. Luego el usuario pidió elegir la comida concreta dentro de cada categoría (la tortilla normal y la de cangrejo tienen recetas distintas): se quitaron los botones de tier y se añadió el selector Categoría → Comida.
12. **Pesca**: pestaña nueva con todos los peces y dónde salen (pedida por el usuario). Se descubrió que los raros también salen en biomas vecinos, no solo en el suyo.
13. **Tier vs. color de zona**: el usuario creía que T7/T8 significaba zona negra. Se le explicó que el T es el tier del mapa (solo T8 es exclusivo de la zona negra) y pidió verlo en la pestaña: cada tier lleva puntos con los colores de zona donde existe, con leyenda.
14. **Caché del navegador**: tras quitar los botones de tier de Consumibles, al usuario no le salía nada en "Comida": el navegador mezclaba el HTML nuevo con el `script.js` viejo. Se añadió `?v=` a los archivos (ver reglas).
15. **Cebo en Pesca**: el usuario pidió ver cuánto sube el "rate de captura" según el cebo. Se le aclaró que el cebo solo acelera la picada (no cambia qué pez sale) y se añadió el panel de cebo.
16. **Especialización y pez objetivo**: el usuario preguntó si la especialización influye y quería saber si sube la tasa del pez que busca. Se le explicó que solo sube velocidad y doble captura (no la probabilidad del pez) y se añadieron niveles, comida y el cálculo del pez objetivo por captura y por hora.
17. **Equipo de pescador**: el usuario pidió sumar el buff del equipo de pesca "a 10" (las 10 cargas). Se añadieron caña, gorro, atuendo, botas, mochila y el número de cargas; cada pieza solo cuenta para peces de su tier o menor.
18. **Ciudad con bono en Crafteo y precio por ciudad de los materiales**: el usuario quería saber dónde fabricar (ej. la hoz → Caerleon, no Martlock) y poder ver el precio de los tablones en cada ciudad para elegir dónde comprarlos o escribir el suyo. Se añadió `CRAFT_BONUS` y el selector de ciudad en cada material (en todas las calculadoras).

## 8. Pendiente o por confirmar en el juego

- **Especialización de las comidas variantes**: se asume que la tortilla de cangrejo, la avaloniana y la de leyaleta usan la misma especialización que la tortilla normal (clave `cons:MEAL_OMELETTE`). Si en el juego tienen la suya, separarlas.
- **Alquimia incompleta**: faltan pociones (limpieza, ácido, tornado…) y sus encantamientos. Se ofreció añadirlas igual que la cocina; el usuario no respondió.
- **Pesca**: los % son los de las tablas del juego, sin cebo, equipo de pescador ni especialización. Muchos peces no tienen precio en la API (en Caerleon, 11 de 42).
- **Rendimiento > 100%**: con equipo T7–T8 + especialización + pastel puede pasar de 100%. Se asume que el exceso sigue sumando (≈ 1 + rendimiento peces por captura); no está confirmado en el juego.
- **Fórmula de velocidad**: que las velocidades se sumen y dividan la espera es una suposición; el juego no publica el tiempo base. Si el usuario mide otra cosa en el juego, ajustar `renderBait`.
- **Especialización de pesca**: 0,33 o 0,35 por nivel del Especialista (fuentes distintas; la wiki bloquea las lecturas automáticas). Tampoco se sabe cuánto sube la velocidad de la caña con el poder de objeto (`fishingspeedprogression="1.3"` en gamedata.xml), así que no se incluye.
- **Punto de la zona negra**: es negro con borde gris; si el usuario dice que se confunde con un círculo vacío, cambiarlo.
- **Foco de pociones y comidas**: la wiki dice que se cobra por unidad fabricada (no por receta). Si el juego muestra otro valor al fabricar una receta, corregir `updateConsumableSpec`.
- **Calidad en Crafteo**: estimación sin la comida de crafteo ni el extra del foco. La ganancia usa precios de calidad Normal.
- **"Otras espec. de artefacto"**: se asume 15 FCE por nivel (la mitad) según la tabla de la wiki; las off-hand normales pueden dar distinto.
- **+10% de cultivos por ciudad**: se aplica a la cosecha (`farmingyieldmodifier`), no a las semillas.
- **Precio de semillas del mercader**: `npcPrice` es el base de items.xml; en el juego cambia con el precio del oro.
- **Probabilidad de semilla**: fija con los datos del juego (no editable). El usuario puede pedir un campo editable como el de "Prob. de cría".
- **Si la probabilidad de cría o de semilla pasa de 100%**, el gasto de crías o semillas sale negativo (las extra valen su precio). Se ofreció dejarlo en 0; el usuario no respondió.
