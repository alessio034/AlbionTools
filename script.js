// ============================================================
//  CONFIGURACIÓN GENERAL
// ============================================================
// Región por defecto: "west" (Américas), "east" (Asia) o "europe".
const DEFAULT_REGION = "west";

const CITIES = ["Caerleon", "Bridgewatch", "Fort Sterling", "Lymhurst", "Martlock", "Thetford", "Brecilien"];
const SELL_CITIES = [...CITIES, "Black Market"];

// Impuestos del mercado al vender.
const TAX = {
  salesPremium: 0.04, // impuesto de venta con Premium
  salesNormal: 0.08,  // impuesto de venta sin Premium
  setupFee: 0.025,    // tarifa por publicar una orden de venta (no aplica en venta directa)
};

// Nutrición que consume la estación = valor del ítem × 0.1125.
// Tarifa en plata = nutrición × (tarifa de la estación / 100).
const NUTRITION_FACTOR = 0.1125;

// Categorías de Crafteo (armaduras, bolsas, capas, herramientas; las armas están en CRAFT_WEAPONS).
// "code" es la parte del ID que va después del tier (T4_<code>); "group" es la sección del selector.
// El Mercado NO usa esta lista: lee todos los ítems de market-data.js.
// Todos los códigos están verificados contra la API de Albion Online Data Project.
const CATEGORIES = [
  // === ARMAS CUERPO A CUERPO ===
  { name: "Espadas",                code: "MAIN_SWORD",           group: "Cuerpo a Cuerpo" },
  { name: "Hachas",                 code: "MAIN_AXE",             group: "Cuerpo a Cuerpo" },
  { name: "Mazas",                  code: "MAIN_MACE",            group: "Cuerpo a Cuerpo" },
  { name: "Martillos",              code: "MAIN_HAMMER",          group: "Cuerpo a Cuerpo" },
  { name: "Lanzas",                 code: "MAIN_SPEAR",           group: "Cuerpo a Cuerpo" },
  { name: "Bastones Quarterstaff",  code: "2H_QUARTERSTAFF",      group: "Cuerpo a Cuerpo" },
  { name: "Dagas",                  code: "MAIN_DAGGER",          group: "Cuerpo a Cuerpo" },
  { name: "Guantes de Guerra",      code: "2H_KNUCKLES_SET1",     group: "Cuerpo a Cuerpo" },

  // === ARMAS A DISTANCIA Y MAGIA ===
  { name: "Arcos",                  code: "2H_BOW",               group: "Distancia/Magia" },
  { name: "Ballestas",              code: "2H_CROSSBOW",          group: "Distancia/Magia" },
  { name: "Bastones de Fuego",      code: "MAIN_FIRESTAFF",       group: "Distancia/Magia" },
  { name: "Bastones Sagrados",      code: "MAIN_HOLYSTAFF",       group: "Distancia/Magia" },
  { name: "Bastones de Naturaleza", code: "MAIN_NATURESTAFF",     group: "Distancia/Magia" },
  { name: "Bastones Malditos",      code: "MAIN_CURSEDSTAFF",     group: "Distancia/Magia" },
  { name: "Bastones de Hielo",      code: "MAIN_FROSTSTAFF",      group: "Distancia/Magia" },
  { name: "Bastones Arcanos",       code: "MAIN_ARCANESTAFF",     group: "Distancia/Magia" },
  { name: "Cambiaformas",           code: "2H_SHAPESHIFTER_SET1", group: "Distancia/Magia" },

  // === ARMADURAS DE PLACAS (PLATE) ===
  { name: "Casco de Placas",        code: "HEAD_PLATE_SET1",      group: "Armadura Placas" },
  { name: "Pecho de Placas",        code: "ARMOR_PLATE_SET1",     group: "Armadura Placas" },
  { name: "Botas de Placas",        code: "SHOES_PLATE_SET1",     group: "Armadura Placas" },

  // === ARMADURAS DE CUERO (LEATHER) ===
  { name: "Casco de Cuero",         code: "HEAD_LEATHER_SET1",    group: "Armadura Cuero" },
  { name: "Pecho de Cuero",         code: "ARMOR_LEATHER_SET1",   group: "Armadura Cuero" },
  { name: "Botas de Cuero",         code: "SHOES_LEATHER_SET1",   group: "Armadura Cuero" },

  // === ARMADURAS DE TELA (CLOTH) ===
  { name: "Casco de Tela",          code: "HEAD_CLOTH_SET1",      group: "Armadura Tela" },
  { name: "Pecho de Tela",          code: "ARMOR_CLOTH_SET1",     group: "Armadura Tela" },
  { name: "Botas de Tela",          code: "SHOES_CLOTH_SET1",     group: "Armadura Tela" },

  // === ACCESORIOS Y OFF-HANDS ===
  { name: "Bolsas",                 code: "BAG",                  group: "Accesorios" },
  { name: "Capas",                  code: "CAPE",                 group: "Accesorios" },
  { name: "Escudos",                code: "OFF_SHIELD",           group: "Accesorios" },
  { name: "Antorchas",              code: "OFF_TORCH",            group: "Accesorios" },
  { name: "Libros (Tomos)",         code: "OFF_BOOK",             group: "Accesorios" },

  // === HERRAMIENTAS DE RECOLECCIÓN ===
  { name: "Pico (Mineral)",         code: "2H_TOOL_PICK",         group: "Herramientas" },
  { name: "Hacha (Madera)",         code: "2H_TOOL_AXE",          group: "Herramientas" },
  { name: "Hoz (Fibra)",            code: "2H_TOOL_SICKLE",       group: "Herramientas" },
  { name: "Cuchillo (Piel)",        code: "2H_TOOL_KNIFE",        group: "Herramientas" },
  { name: "Martillo (Piedra)",      code: "2H_TOOL_HAMMER",       group: "Herramientas" },

];


const TIERS = [4, 5, 6, 7, 8];
const ENCHANTS = [0, 1, 2, 3, 4];

// ============================================================
//  DATOS DE CRAFTEO Y REFINAMIENTO
//  Fuente: datos del juego (github.com/ao-data/ao-bin-dumps, items.json)
// ============================================================

// Materiales refinados por ítem. Son iguales para T4-T8; con encantamiento
// se usa el material del mismo encantamiento (ej: T5_MAIN_SWORD@2 → T5_METALBAR_LEVEL2@2).
// Armas y off-hands: ver CRAFT_WEAPONS más abajo.
const RECIPES = {
  HEAD_PLATE_SET1:      { METALBAR: 8 },
  ARMOR_PLATE_SET1:     { METALBAR: 16 },
  SHOES_PLATE_SET1:     { METALBAR: 8 },
  HEAD_LEATHER_SET1:    { LEATHER: 8 },
  ARMOR_LEATHER_SET1:   { LEATHER: 16 },
  SHOES_LEATHER_SET1:   { LEATHER: 8 },
  HEAD_CLOTH_SET1:      { CLOTH: 8 },
  ARMOR_CLOTH_SET1:     { CLOTH: 16 },
  SHOES_CLOTH_SET1:     { CLOTH: 8 },
  BAG:                  { CLOTH: 8, LEATHER: 8 },
  CAPE:                 { CLOTH: 4, LEATHER: 4 },
  "2H_TOOL_PICK":       { PLANKS: 6, METALBAR: 2 },
  "2H_TOOL_AXE":        { PLANKS: 6, METALBAR: 2 },
  "2H_TOOL_SICKLE":     { PLANKS: 6, METALBAR: 2 },
  "2H_TOOL_KNIFE":      { PLANKS: 6, METALBAR: 2 },
  "2H_TOOL_HAMMER":     { PLANKS: 6, METALBAR: 2 },
};

// ============================================================
//  ARMAS Y OFF-HANDS DE CRAFTEO (normales y de artefacto)
//  Fuente: items.xml (recetas, iguales en T4-T8) + formatted/items.json (nombres ES-ES)
// ============================================================
// line          = especialización padre (maestría), ej. "bow" = Fabricante de arcos
// recipe        = refinados (retornables con la RRR)
// artifact      = T{t}_<artifact>, 1 por ítem, NO retornable; no se encanta (sirve para .0 a .4)
// artifactValue = itemvalue del artefacto en T4 (se duplica por tier) → tarifa de la estación
// part          = restos de criatura de los Cambiaformas (ver creaturePart)
const WEAPON_LINES = {
  sword: "Espadas", axe: "Hachas", mace: "Mazas", hammer: "Martillos", spear: "Lanzas",
  quarterstaff: "Bastones de combate", dagger: "Dagas", knuckles: "Guanteletes",
  bow: "Arcos", crossbow: "Ballestas", firestaff: "Bastones de fuego", holystaff: "Bastones sagrados",
  naturestaff: "Bastones de naturaleza", cursestaff: "Bastones malditos", froststaff: "Bastones de escarcha",
  arcanestaff: "Bastones arcanos", shapeshifterstaff: "Cambiaformas",
  shieldtype: "Escudos", torchtype: "Antorchas", booktype: "Libros",
};
const OFFHAND_LINES = ["shieldtype", "torchtype", "booktype"];

const CRAFT_WEAPONS = [
  { code: "MAIN_SWORD", name: "Espada ancha", line: "sword", recipe: { METALBAR: 16, LEATHER: 8 } },
  { code: "2H_CLAYMORE", name: "Claymore", line: "sword", recipe: { METALBAR: 20, LEATHER: 12 } },
  { code: "2H_DUALSWORD", name: "Dos espadas", line: "sword", recipe: { METALBAR: 20, LEATHER: 12 } },
  { code: "MAIN_SCIMITAR_MORGANA", name: "Hoja Clarent", line: "sword", recipe: { METALBAR: 16, LEATHER: 8 }, artifact: "ARTEFACT_MAIN_SCIMITAR_MORGANA", artifactName: "Hoja forjada con sangre", artifactValue: 96 },
  { code: "2H_CLEAVER_HELL", name: "Espada tallada", line: "sword", recipe: { METALBAR: 20, LEATHER: 12 }, artifact: "ARTEFACT_2H_CLEAVER_HELL", artifactName: "Hoja demoníaca", artifactValue: 384 },
  { code: "2H_DUALSCIMITAR_UNDEAD", name: "Dos galatinas", line: "sword", recipe: { METALBAR: 20, LEATHER: 12 }, artifact: "ARTEFACT_2H_DUALSCIMITAR_UNDEAD", artifactName: "Hojas malditas", artifactValue: 896 },
  { code: "2H_CLAYMORE_AVALON", name: "Crea-reyes", line: "sword", recipe: { METALBAR: 20, LEATHER: 12 }, artifact: "ARTEFACT_2H_CLAYMORE_AVALON", artifactName: "Restos del viejo rey", artifactValue: 1920 },
  { code: "MAIN_SWORD_CRYSTAL", name: "Hoja infinita", line: "sword", recipe: { METALBAR: 16, LEATHER: 8 }, artifact: "ARTEFACT_MAIN_SWORD_CRYSTAL", artifactName: "Cristal infinito", artifactValue: 1440 },
  { code: "MAIN_AXE", name: "Hacha de guerra", line: "axe", recipe: { PLANKS: 8, METALBAR: 16 } },
  { code: "2H_AXE", name: "Gran hacha", line: "axe", recipe: { PLANKS: 12, METALBAR: 20 } },
  { code: "2H_HALBERD", name: "Alabarda", line: "axe", recipe: { PLANKS: 20, METALBAR: 12 } },
  { code: "2H_HALBERD_MORGANA", name: "Llamacarroña", line: "axe", recipe: { PLANKS: 20, METALBAR: 12 }, artifact: "ARTEFACT_2H_HALBERD_MORGANA", artifactName: "Cabeza de alabarda de Morgana", artifactValue: 128 },
  { code: "2H_SCYTHE_HELL", name: "Guadaña infernal", line: "axe", recipe: { PLANKS: 12, METALBAR: 20 }, artifact: "ARTEFACT_2H_SCYTHE_HELL", artifactName: "Cabeza de hoz diabólica", artifactValue: 384 },
  { code: "2H_DUALAXE_KEEPER", name: "Patas de oso", line: "axe", recipe: { PLANKS: 12, METALBAR: 20 }, artifact: "ARTEFACT_2H_DUALAXE_KEEPER", artifactName: "Cabezas de hacha de guardián", artifactValue: 896 },
  { code: "2H_AXE_AVALON", name: "Romperreinos", line: "axe", recipe: { PLANKS: 12, METALBAR: 20 }, artifact: "ARTEFACT_2H_AXE_AVALON", artifactName: "Recuerdos de batalla avalonianos", artifactValue: 1920 },
  { code: "2H_SCYTHE_CRYSTAL", name: "Falce de cristal", line: "axe", recipe: { PLANKS: 12, METALBAR: 20 }, artifact: "ARTEFACT_2H_SCYTHE_CRYSTAL", artifactName: "Cristal afilado", artifactValue: 1920 },
  { code: "MAIN_MACE", name: "Maza", line: "mace", recipe: { METALBAR: 16, CLOTH: 8 } },
  { code: "2H_MACE", name: "Maza pesada", line: "mace", recipe: { METALBAR: 20, CLOTH: 12 } },
  { code: "2H_FLAIL", name: "Mangual", line: "mace", recipe: { METALBAR: 20, CLOTH: 12 } },
  { code: "MAIN_ROCKMACE_KEEPER", name: "Maza de lecho de roca", line: "mace", recipe: { METALBAR: 16, CLOTH: 8 }, artifact: "ARTEFACT_MAIN_ROCKMACE_KEEPER", artifactName: "Roca rúnica", artifactValue: 96 },
  { code: "MAIN_MACE_HELL", name: "Maza íncubo", line: "mace", recipe: { METALBAR: 16, CLOTH: 8 }, artifact: "ARTEFACT_MAIN_MACE_HELL", artifactName: "Cabeza de maza infernal", artifactValue: 288 },
  { code: "2H_MACE_MORGANA", name: "Maza de Camlann", line: "mace", recipe: { METALBAR: 20, CLOTH: 12 }, artifact: "ARTEFACT_2H_MACE_MORGANA", artifactName: "Cabeza de maza imbuida", artifactValue: 896 },
  { code: "2H_DUALMACE_AVALON", name: "Juradores", line: "mace", recipe: { METALBAR: 20, CLOTH: 12 }, artifact: "ARTEFACT_2H_DUALMACE_AVALON", artifactName: "Juramentos rotos", artifactValue: 1920 },
  { code: "MAIN_MACE_CRYSTAL", name: "Monarca de la tormenta", line: "mace", recipe: { METALBAR: 16, CLOTH: 8 }, artifact: "ARTEFACT_MAIN_MACE_CRYSTAL", artifactName: "Cristal de la tormenta", artifactValue: 1440 },
  { code: "MAIN_HAMMER", name: "Martillo", line: "hammer", recipe: { METALBAR: 24 } },
  { code: "2H_POLEHAMMER", name: "Martillo largo", line: "hammer", recipe: { METALBAR: 20, CLOTH: 12 } },
  { code: "2H_HAMMER", name: "Gran martillo", line: "hammer", recipe: { METALBAR: 20, CLOTH: 12 } },
  { code: "2H_HAMMER_UNDEAD", name: "Martillo de la tumba", line: "hammer", recipe: { METALBAR: 20, CLOTH: 12 }, artifact: "ARTEFACT_2H_HAMMER_UNDEAD", artifactName: "Cabeza de martillo antigua", artifactValue: 128 },
  { code: "2H_DUALHAMMER_HELL", name: "Martillos de forja", line: "hammer", recipe: { METALBAR: 20, CLOTH: 12 }, artifact: "ARTEFACT_2H_DUALHAMMER_HELL", artifactName: "Cabezas de martillo diabólicas", artifactValue: 384 },
  { code: "2H_RAM_KEEPER", name: "Guardabosques", line: "hammer", recipe: { METALBAR: 20, CLOTH: 12 }, artifact: "ARTEFACT_2H_RAM_KEEPER", artifactName: "Tronco grabado", artifactValue: 896 },
  { code: "2H_HAMMER_AVALON", name: "Mano de justicia", line: "hammer", recipe: { METALBAR: 20, CLOTH: 12 }, artifact: "ARTEFACT_2H_HAMMER_AVALON", artifactName: "Mano metálica masiva", artifactValue: 1920 },
  { code: "2H_HAMMER_CRYSTAL", name: "Martillo Relámpago", line: "hammer", recipe: { METALBAR: 20, CLOTH: 12 }, artifact: "ARTEFACT_2H_HAMMER_CRYSTAL", artifactName: "Cristal Crepitante", artifactValue: 1920 },
  { code: "MAIN_SPEAR", name: "Lanza", line: "spear", recipe: { PLANKS: 16, METALBAR: 8 } },
  { code: "2H_SPEAR", name: "Pica", line: "spear", recipe: { PLANKS: 20, METALBAR: 12 } },
  { code: "2H_GLAIVE", name: "Guja", line: "spear", recipe: { PLANKS: 12, METALBAR: 20 } },
  { code: "MAIN_SPEAR_KEEPER", name: "Lanza de garza", line: "spear", recipe: { PLANKS: 16, METALBAR: 8 }, artifact: "ARTEFACT_MAIN_SPEAR_KEEPER", artifactName: "Cabeza de lanza de guardián", artifactValue: 96 },
  { code: "2H_HARPOON_HELL", name: "Cazaespíritus", line: "spear", recipe: { PLANKS: 20, METALBAR: 12 }, artifact: "ARTEFACT_2H_HARPOON_HELL", artifactName: "Punta de arpón infernal", artifactValue: 384 },
  { code: "2H_TRIDENT_UNDEAD", name: "Lanza de trinidad", line: "spear", recipe: { PLANKS: 20, METALBAR: 12 }, artifact: "ARTEFACT_2H_TRIDENT_UNDEAD", artifactName: "Pinchos malditos", artifactValue: 896 },
  { code: "MAIN_SPEAR_LANCE_AVALON", name: "Portador del alba", line: "spear", recipe: { PLANKS: 16, METALBAR: 8 }, artifact: "ARTEFACT_MAIN_SPEAR_LANCE_AVALON", artifactName: "Vamplate ancestral arruinado", artifactValue: 1440 },
  { code: "2H_GLAIVE_CRYSTAL", name: "Guja fisurante", line: "spear", recipe: { PLANKS: 12, METALBAR: 20 }, artifact: "ARTEFACT_2H_GLAIVE_CRYSTAL", artifactName: "Cristal fisurante", artifactValue: 1920 },
  { code: "2H_QUARTERSTAFF", name: "Vara", line: "quarterstaff", recipe: { METALBAR: 12, LEATHER: 20 } },
  { code: "2H_IRONCLADEDSTAFF", name: "Bastón metálico", line: "quarterstaff", recipe: { METALBAR: 12, LEATHER: 20 } },
  { code: "2H_DOUBLEBLADEDSTAFF", name: "Bastón de doble filo", line: "quarterstaff", recipe: { METALBAR: 12, LEATHER: 20 } },
  { code: "2H_COMBATSTAFF_MORGANA", name: "Bastón de monje negro", line: "quarterstaff", recipe: { METALBAR: 12, LEATHER: 20 }, artifact: "ARTEFACT_2H_COMBATSTAFF_MORGANA", artifactName: "Palo de Morgana reforzado", artifactValue: 128 },
  { code: "2H_TWINSCYTHE_HELL", name: "Guadaña de almas", line: "quarterstaff", recipe: { METALBAR: 12, LEATHER: 20 }, artifact: "ARTEFACT_2H_TWINSCYTHE_HELL", artifactName: "Par de cabezas de hoz diabólica", artifactValue: 384 },
  { code: "2H_ROCKSTAFF_KEEPER", name: "Bastón de equilibrio", line: "quarterstaff", recipe: { METALBAR: 12, LEATHER: 20 }, artifact: "ARTEFACT_2H_ROCKSTAFF_KEEPER", artifactName: "Rocas preservadas", artifactValue: 896 },
  { code: "2H_QUARTERSTAFF_AVALON", name: "Buscador de grial", line: "quarterstaff", recipe: { METALBAR: 12, LEATHER: 20 }, artifact: "ARTEFACT_2H_QUARTERSTAFF_AVALON", artifactName: "Bastón desgastado", artifactValue: 1920 },
  { code: "2H_DOUBLEBLADEDSTAFF_CRYSTAL", name: "Hoja doble fantasma", line: "quarterstaff", recipe: { METALBAR: 12, LEATHER: 20 }, artifact: "ARTEFACT_2H_DOUBLEBLADEDSTAFF_CRYSTAL", artifactName: "Cristal miraje", artifactValue: 1920 },
  { code: "MAIN_DAGGER", name: "Daga", line: "dagger", recipe: { METALBAR: 12, LEATHER: 12 } },
  { code: "2H_DAGGERPAIR", name: "Daga doble", line: "dagger", recipe: { METALBAR: 16, LEATHER: 16 } },
  { code: "2H_CLAWPAIR", name: "Garras", line: "dagger", recipe: { METALBAR: 12, LEATHER: 20 } },
  { code: "MAIN_RAPIER_MORGANA", name: "Sangradora", line: "dagger", recipe: { METALBAR: 16, LEATHER: 8 }, artifact: "ARTEFACT_MAIN_RAPIER_MORGANA", artifactName: "Punta endurecida", artifactValue: 96 },
  { code: "MAIN_DAGGER_HELL", name: "Colmillo demoníaco", line: "dagger", recipe: { METALBAR: 12, LEATHER: 12 }, artifact: "ARTEFACT_MAIN_DAGGER_HELL", artifactName: "Colmillo demoníaco roto", artifactValue: 288 },
  { code: "2H_DUALSICKLE_UNDEAD", name: "Concedemuertes", line: "dagger", recipe: { METALBAR: 16, LEATHER: 16 }, artifact: "ARTEFACT_2H_DUALSICKLE_UNDEAD", artifactName: "Hojas abominables", artifactValue: 896 },
  { code: "2H_DAGGER_KATAR_AVALON", name: "Furia contenida", line: "dagger", recipe: { METALBAR: 12, LEATHER: 20 }, artifact: "ARTEFACT_2H_DAGGER_KATAR_AVALON", artifactName: "Antigüedades sangrientas", artifactValue: 1920 },
  { code: "2H_DAGGERPAIR_CRYSTAL", name: "Gemelas asesinas", line: "dagger", recipe: { METALBAR: 16, LEATHER: 16 }, artifact: "ARTEFACT_2H_DAGGERPAIR_CRYSTAL", artifactName: "Cristal mortífero", artifactValue: 1920 },
  { code: "2H_KNUCKLES_SET1", name: "Guantes de peleador", line: "knuckles", recipe: { METALBAR: 12, LEATHER: 20 } },
  { code: "2H_KNUCKLES_SET2", name: "Brazales de batalla", line: "knuckles", recipe: { METALBAR: 12, LEATHER: 20 } },
  { code: "2H_KNUCKLES_SET3", name: "Guanteletes de púas", line: "knuckles", recipe: { METALBAR: 12, LEATHER: 20 } },
  { code: "2H_IRONGAUNTLETS_HELL", name: "Manos negras", line: "knuckles", recipe: { METALBAR: 12, LEATHER: 20 }, artifact: "ARTEFACT_2H_IRONGAUNTLETS_HELL", artifactName: "Cuero negro", artifactValue: 384 },
  { code: "2H_KNUCKLES_KEEPER", name: "Zarpas osunas", line: "knuckles", recipe: { METALBAR: 12, LEATHER: 20 }, artifact: "ARTEFACT_2H_KNUCKLES_KEEPER", artifactName: "Restos de guardián osuno", artifactValue: 128 },
  { code: "2H_KNUCKLES_HELL", name: "Manos infernales", line: "knuckles", recipe: { METALBAR: 12, LEATHER: 20 }, artifact: "ARTEFACT_2H_KNUCKLES_HELL", artifactName: "Cuernos demoníacos rotos", artifactValue: 384 },
  { code: "2H_KNUCKLES_MORGANA", name: "Cestus córvidos", line: "knuckles", recipe: { METALBAR: 12, LEATHER: 20 }, artifact: "ARTEFACT_2H_KNUCKLES_MORGANA", artifactName: "Placa de cuervo deforme", artifactValue: 896 },
  { code: "2H_KNUCKLES_AVALON", name: "Puños de Avalon", line: "knuckles", recipe: { METALBAR: 12, LEATHER: 20 }, artifact: "ARTEFACT_2H_KNUCKLES_AVALON", artifactName: "Guantelete avaloniano dañado", artifactValue: 1920 },
  { code: "2H_KNUCKLES_CRYSTAL", name: "Brazales de Fuerza Pulsante", line: "knuckles", recipe: { METALBAR: 12, LEATHER: 20 }, artifact: "ARTEFACT_2H_KNUCKLES_CRYSTAL", artifactName: "Cristal Pulsante", artifactValue: 1920 },
  { code: "2H_BOW", name: "Arco", line: "bow", recipe: { PLANKS: 32 } },
  { code: "2H_WARBOW", name: "Arco de guerra", line: "bow", recipe: { PLANKS: 32 } },
  { code: "2H_LONGBOW", name: "Arco largo", line: "bow", recipe: { PLANKS: 32 } },
  { code: "2H_LONGBOW_UNDEAD", name: "Arco susurrante", line: "bow", recipe: { PLANKS: 32 }, artifact: "ARTEFACT_2H_LONGBOW_UNDEAD", artifactName: "Flechas abominables", artifactValue: 128 },
  { code: "2H_BOW_HELL", name: "Arco de lamentaciones", line: "bow", recipe: { PLANKS: 32 }, artifact: "ARTEFACT_2H_BOW_HELL", artifactName: "Puntas de flecha demoníacas", artifactValue: 384 },
  { code: "2H_BOW_KEEPER", name: "Arco de Badon", line: "bow", recipe: { PLANKS: 32 }, artifact: "ARTEFACT_2H_BOW_KEEPER", artifactName: "Hueso tallado", artifactValue: 896 },
  { code: "2H_BOW_AVALON", name: "Perforador de niebla", line: "bow", recipe: { PLANKS: 32 }, artifact: "ARTEFACT_2H_BOW_AVALON", artifactName: "Tubo fabricado inmaculado", artifactValue: 1920 },
  { code: "2H_BOW_CRYSTAL", name: "Arco Cruzacielos", line: "bow", recipe: { PLANKS: 32 }, artifact: "ARTEFACT_2H_BOW_CRYSTAL", artifactName: "Cristal de Viento", artifactValue: 1920 },
  { code: "2H_CROSSBOW", name: "Ballesta", line: "crossbow", recipe: { PLANKS: 20, METALBAR: 12 } },
  { code: "2H_CROSSBOWLARGE", name: "Ballesta pesada", line: "crossbow", recipe: { PLANKS: 20, METALBAR: 12 } },
  { code: "MAIN_1HCROSSBOW", name: "Ballesta ligera", line: "crossbow", recipe: { PLANKS: 16, METALBAR: 8 } },
  { code: "2H_REPEATINGCROSSBOW_UNDEAD", name: "Repetidora de desconsuelo", line: "crossbow", recipe: { PLANKS: 20, METALBAR: 12 }, artifact: "ARTEFACT_2H_REPEATINGCROSSBOW_UNDEAD", artifactName: "Mecanismo perdido de ballesta", artifactValue: 128 },
  { code: "2H_DUALCROSSBOW_HELL", name: "Lanzasaetas", line: "crossbow", recipe: { PLANKS: 20, METALBAR: 12 }, artifact: "ARTEFACT_2H_DUALCROSSBOW_HELL", artifactName: "Saetas diabólicas", artifactValue: 384 },
  { code: "2H_CROSSBOWLARGE_MORGANA", name: "Arco de asedio", line: "crossbow", recipe: { PLANKS: 20, METALBAR: 12 }, artifact: "ARTEFACT_2H_CROSSBOWLARGE_MORGANA", artifactName: "Saetas tentadoras", artifactValue: 896 },
  { code: "2H_CROSSBOW_CANNON_AVALON", name: "Modelador de energía", line: "crossbow", recipe: { PLANKS: 20, METALBAR: 12 }, artifact: "ARTEFACT_2H_CROSSBOW_CANNON_AVALON", artifactName: "Veleta de zumbido avaloniano", artifactValue: 1920 },
  { code: "2H_DUALCROSSBOW_CRYSTAL", name: "Desintegradoras de Luz", line: "crossbow", recipe: { PLANKS: 20, METALBAR: 12 }, artifact: "ARTEFACT_2H_DUALCROSSBOW_CRYSTAL", artifactName: "Cristal de Luz", artifactValue: 1920 },
  { code: "MAIN_FIRESTAFF", name: "Bastón ígneo", line: "firestaff", recipe: { PLANKS: 16, METALBAR: 8 } },
  { code: "2H_FIRESTAFF", name: "Gran bastón ígneo", line: "firestaff", recipe: { PLANKS: 20, METALBAR: 12 } },
  { code: "2H_INFERNOSTAFF", name: "Bastón infernal", line: "firestaff", recipe: { PLANKS: 20, METALBAR: 12 } },
  { code: "MAIN_FIRESTAFF_KEEPER", name: "Bastón de fuego incontrolable", line: "firestaff", recipe: { PLANKS: 16, METALBAR: 8 }, artifact: "ARTEFACT_MAIN_FIRESTAFF_KEEPER", artifactName: "Orbe de fuego incontrolable", artifactValue: 96 },
  { code: "2H_FIRESTAFF_HELL", name: "Bastón de azufre", line: "firestaff", recipe: { PLANKS: 20, METALBAR: 12 }, artifact: "ARTEFACT_2H_FIRESTAFF_HELL", artifactName: "Orbe ardiente", artifactValue: 384 },
  { code: "2H_INFERNOSTAFF_MORGANA", name: "Bastón flamígero", line: "firestaff", recipe: { PLANKS: 20, METALBAR: 12 }, artifact: "ARTEFACT_2H_INFERNOSTAFF_MORGANA", artifactName: "Pergamino profano", artifactValue: 896 },
  { code: "2H_FIRE_RINGPAIR_AVALON", name: "Canción del despertar", line: "firestaff", recipe: { PLANKS: 20, METALBAR: 12 }, artifact: "ARTEFACT_2H_FIRE_RINGPAIR_AVALON", artifactName: "Anillo armónico brillante", artifactValue: 1920 },
  { code: "MAIN_FIRESTAFF_CRYSTAL", name: "Bastón de Caminallamas", line: "firestaff", recipe: { PLANKS: 16, METALBAR: 8 }, artifact: "ARTEFACT_MAIN_FIRESTAFF_CRYSTAL", artifactName: "Cristal de Corazón de Pira", artifactValue: 1440 },
  { code: "MAIN_HOLYSTAFF", name: "Bastón sagrado", line: "holystaff", recipe: { PLANKS: 16, CLOTH: 8 } },
  { code: "2H_HOLYSTAFF", name: "Gran bastón sagrado", line: "holystaff", recipe: { PLANKS: 20, CLOTH: 12 } },
  { code: "2H_DIVINESTAFF", name: "Bastón divino", line: "holystaff", recipe: { PLANKS: 20, CLOTH: 12 } },
  { code: "MAIN_HOLYSTAFF_MORGANA", name: "Bastón de toque de vida", line: "holystaff", recipe: { PLANKS: 16, CLOTH: 8 }, artifact: "ARTEFACT_MAIN_HOLYSTAFF_MORGANA", artifactName: "Pergamino poseído", artifactValue: 96 },
  { code: "2H_HOLYSTAFF_HELL", name: "Bastón caído", line: "holystaff", recipe: { PLANKS: 20, CLOTH: 12 }, artifact: "ARTEFACT_2H_HOLYSTAFF_HELL", artifactName: "Pergamino infernal", artifactValue: 384 },
  { code: "2H_HOLYSTAFF_UNDEAD", name: "Bastón de redención", line: "holystaff", recipe: { PLANKS: 20, CLOTH: 12 }, artifact: "ARTEFACT_2H_HOLYSTAFF_UNDEAD", artifactName: "Pergamino abominable", artifactValue: 896 },
  { code: "MAIN_HOLYSTAFF_AVALON", name: "Santificador", line: "holystaff", recipe: { PLANKS: 16, CLOTH: 8 }, artifact: "ARTEFACT_MAIN_HOLYSTAFF_AVALON", artifactName: "Rareza mesiánica", artifactValue: 1440 },
  { code: "2H_HOLYSTAFF_CRYSTAL", name: "Bastón exaltado", line: "holystaff", recipe: { PLANKS: 20, CLOTH: 12 }, artifact: "ARTEFACT_2H_HOLYSTAFF_CRYSTAL", artifactName: "Cristal exaltado", artifactValue: 1920 },
  { code: "MAIN_NATURESTAFF", name: "Bastón natural", line: "naturestaff", recipe: { PLANKS: 16, CLOTH: 8 } },
  { code: "2H_NATURESTAFF", name: "Gran bastón natural", line: "naturestaff", recipe: { PLANKS: 20, CLOTH: 12 } },
  { code: "2H_WILDSTAFF", name: "Bastón salvaje", line: "naturestaff", recipe: { PLANKS: 20, CLOTH: 12 } },
  { code: "MAIN_NATURESTAFF_KEEPER", name: "Bastón druida", line: "naturestaff", recipe: { PLANKS: 16, CLOTH: 8 }, artifact: "ARTEFACT_MAIN_NATURESTAFF_KEEPER", artifactName: "Inscripciones de druida", artifactValue: 96 },
  { code: "2H_NATURESTAFF_HELL", name: "Bastón de infortunio", line: "naturestaff", recipe: { PLANKS: 20, CLOTH: 12 }, artifact: "ARTEFACT_2H_NATURESTAFF_HELL", artifactName: "Símbolo de infortunio", artifactValue: 384 },
  { code: "2H_NATURESTAFF_KEEPER", name: "Bastón desenfrenado", line: "naturestaff", recipe: { PLANKS: 20, CLOTH: 12 }, artifact: "ARTEFACT_2H_NATURESTAFF_KEEPER", artifactName: "Tronco preservado", artifactValue: 896 },
  { code: "MAIN_NATURESTAFF_AVALON", name: "Bastón de raíz férrea", line: "naturestaff", recipe: { PLANKS: 16, CLOTH: 8 }, artifact: "ARTEFACT_MAIN_NATURESTAFF_AVALON", artifactName: "Plántula desarraigada perenne", artifactValue: 1440 },
  { code: "MAIN_NATURESTAFF_CRYSTAL", name: "Bastón de Forjacorteza", line: "naturestaff", recipe: { PLANKS: 16, CLOTH: 8 }, artifact: "ARTEFACT_MAIN_NATURESTAFF_CRYSTAL", artifactName: "Cristal Forjado", artifactValue: 1440 },
  { code: "MAIN_CURSEDSTAFF", name: "Bastón maldito", line: "cursestaff", recipe: { PLANKS: 16, METALBAR: 8 } },
  { code: "2H_CURSEDSTAFF", name: "Gran bastón maldito", line: "cursestaff", recipe: { PLANKS: 20, METALBAR: 12 } },
  { code: "2H_DEMONICSTAFF", name: "Bastón demoníaco", line: "cursestaff", recipe: { PLANKS: 20, METALBAR: 12 } },
  { code: "MAIN_CURSEDSTAFF_UNDEAD", name: "Bastón de maldición de vida", line: "cursestaff", recipe: { PLANKS: 16, METALBAR: 8 }, artifact: "ARTEFACT_MAIN_CURSEDSTAFF_UNDEAD", artifactName: "Cristal maldito perdido", artifactValue: 96 },
  { code: "2H_SKULLORB_HELL", name: "Calavera maldita", line: "cursestaff", recipe: { PLANKS: 20, METALBAR: 12 }, artifact: "ARTEFACT_2H_SKULLORB_HELL", artifactName: "Quijada maldita", artifactValue: 384 },
  { code: "2H_CURSEDSTAFF_MORGANA", name: "Bastón de maldiciones", line: "cursestaff", recipe: { PLANKS: 20, METALBAR: 12 }, artifact: "ARTEFACT_2H_CURSEDSTAFF_MORGANA", artifactName: "Catalizador forjado con sangre", artifactValue: 896 },
  { code: "MAIN_CURSEDSTAFF_AVALON", name: "Invocador oscuro", line: "cursestaff", recipe: { PLANKS: 16, METALBAR: 8 }, artifact: "ARTEFACT_MAIN_CURSEDSTAFF_AVALON", artifactName: "Orbe opaco fracturado", artifactValue: 1440 },
  { code: "MAIN_CURSEDSTAFF_CRYSTAL", name: "Bastón Putrefacto", line: "cursestaff", recipe: { PLANKS: 16, METALBAR: 8 }, artifact: "ARTEFACT_MAIN_CURSEDSTAFF_CRYSTAL", artifactName: "Cristal Putrefacto", artifactValue: 1440 },
  { code: "MAIN_FROSTSTAFF", name: "Bastón de hielo", line: "froststaff", recipe: { PLANKS: 16, METALBAR: 8 } },
  { code: "2H_FROSTSTAFF", name: "Gran bastón de hielo", line: "froststaff", recipe: { PLANKS: 20, METALBAR: 12 } },
  { code: "2H_GLACIALSTAFF", name: "Bastón glacial", line: "froststaff", recipe: { PLANKS: 20, METALBAR: 12 } },
  { code: "MAIN_FROSTSTAFF_KEEPER", name: "Bastón de escarcha", line: "froststaff", recipe: { PLANKS: 16, METALBAR: 8 }, artifact: "ARTEFACT_MAIN_FROSTSTAFF_KEEPER", artifactName: "Orbe de escarcha", artifactValue: 96 },
  { code: "2H_ICEGAUNTLETS_HELL", name: "Bastón de carámbanos", line: "froststaff", recipe: { PLANKS: 20, METALBAR: 12 }, artifact: "ARTEFACT_2H_ICEGAUNTLETS_HELL", artifactName: "Orbe de carámbanos", artifactValue: 384 },
  { code: "2H_ICECRYSTAL_UNDEAD", name: "Prisma de hielos perpetuos", line: "froststaff", recipe: { PLANKS: 20, METALBAR: 12 }, artifact: "ARTEFACT_2H_ICECRYSTAL_UNDEAD", artifactName: "Cristal congelado maldito", artifactValue: 896 },
  { code: "MAIN_FROSTSTAFF_AVALON", name: "Grito gélido", line: "froststaff", recipe: { PLANKS: 16, METALBAR: 8 }, artifact: "ARTEFACT_MAIN_FROSTSTAFF_AVALON", artifactName: "Fragmento cristalino helado", artifactValue: 1440 },
  { code: "2H_FROSTSTAFF_CRYSTAL", name: "Bastón ártico", line: "froststaff", recipe: { PLANKS: 20, METALBAR: 12 }, artifact: "ARTEFACT_2H_FROSTSTAFF_CRYSTAL", artifactName: "Cristal álgido", artifactValue: 1920 },
  { code: "MAIN_ARCANESTAFF", name: "Bastón arcano", line: "arcanestaff", recipe: { PLANKS: 16, METALBAR: 8 } },
  { code: "2H_ARCANESTAFF", name: "Gran bastón arcano", line: "arcanestaff", recipe: { PLANKS: 20, METALBAR: 12 } },
  { code: "2H_ENIGMATICSTAFF", name: "Bastón enigmático", line: "arcanestaff", recipe: { PLANKS: 20, METALBAR: 12 } },
  { code: "MAIN_ARCANESTAFF_UNDEAD", name: "Bastón de brujería", line: "arcanestaff", recipe: { PLANKS: 16, METALBAR: 8 }, artifact: "ARTEFACT_MAIN_ARCANESTAFF_UNDEAD", artifactName: "Cristal arcano perdido", artifactValue: 96 },
  { code: "2H_ARCANESTAFF_HELL", name: "Bastón oculto", line: "arcanestaff", recipe: { PLANKS: 20, METALBAR: 12 }, artifact: "ARTEFACT_2H_ARCANESTAFF_HELL", artifactName: "Orbe oculto", artifactValue: 384 },
  { code: "2H_ENIGMATICORB_MORGANA", name: "Locus malévolo", line: "arcanestaff", recipe: { PLANKS: 20, METALBAR: 12 }, artifact: "ARTEFACT_2H_ENIGMATICORB_MORGANA", artifactName: "Catalizador poseído", artifactValue: 896 },
  { code: "2H_ARCANE_RINGPAIR_AVALON", name: "Sonido equilibrado", line: "arcanestaff", recipe: { PLANKS: 20, METALBAR: 12 }, artifact: "ARTEFACT_2H_ARCANE_RINGPAIR_AVALON", artifactName: "Anillo armónico hipnótico", artifactValue: 1920 },
  { code: "2H_ARCANESTAFF_CRYSTAL", name: "Bastón astral", line: "arcanestaff", recipe: { PLANKS: 20, METALBAR: 12 }, artifact: "ARTEFACT_2H_ARCANESTAFF_CRYSTAL", artifactName: "Cristal estrellado", artifactValue: 1920 },
  { code: "2H_SHAPESHIFTER_SET1", name: "Bastón de merodeador", line: "shapeshifterstaff", recipe: { PLANKS: 20, LEATHER: 12 }, part: "ALCHEMY_RARE_PANTHER", partNames: { 3: "Garras sombrías duras", 5: "Garras sombrías finas", 7: "Garras sombrías excelentes" } },
  { code: "2H_SHAPESHIFTER_SET2", name: "Bastón enraizado", line: "shapeshifterstaff", recipe: { PLANKS: 20, LEATHER: 12 }, part: "ALCHEMY_RARE_ENT", partNames: { 3: "Raíz silvana dura", 5: "Raíz silvana fina", 7: "Raíz silvana excelente" } },
  { code: "2H_SHAPESHIFTER_SET3", name: "Bastón primitivo", line: "shapeshifterstaff", recipe: { PLANKS: 20, LEATHER: 12 }, part: "ALCHEMY_RARE_DIREBEAR", partNames: { 3: "Patas de espíritu duras", 5: "Patas de espíritu finas", 7: "Patas de espíritu excelentes" } },
  { code: "2H_SHAPESHIFTER_MORGANA", name: "Bastón de luna sangrienta", line: "shapeshifterstaff", recipe: { PLANKS: 20, LEATHER: 12 }, artifact: "ARTEFACT_2H_SHAPESHIFTER_MORGANA", artifactName: "Restos de hombre lobo", artifactValue: 128, part: "ALCHEMY_RARE_WEREWOLF", partNames: { 3: "Colmillos de hombre lobo duros", 5: "Colmillos de hombre lobo finos", 7: "Colmillos de hombre lobo excelentes" } },
  { code: "2H_SHAPESHIFTER_HELL", name: "Bastón de criatura infernal", line: "shapeshifterstaff", recipe: { PLANKS: 20, LEATHER: 12 }, artifact: "ARTEFACT_2H_SHAPESHIFTER_HELL", artifactName: "Restos de diablillo de fuego infernal", artifactValue: 384, part: "ALCHEMY_RARE_IMP", partNames: { 3: "Cuerno de diablillo duro", 5: "Cuerno de diablillo fino", 7: "Cuerno de diablillo excelente" } },
  { code: "2H_SHAPESHIFTER_KEEPER", name: "Bastón terrúnico", line: "shapeshifterstaff", recipe: { PLANKS: 20, LEATHER: 12 }, artifact: "ARTEFACT_2H_SHAPESHIFTER_KEEPER", artifactName: "Restos de gólem de piedra rúnica", artifactValue: 896, part: "ALCHEMY_RARE_ELEMENTAL", partNames: { 3: "Diente de piedra rúnica duro", 5: "Diente de piedra rúnica fino", 7: "Diente de piedra rúnica excelente" } },
  { code: "2H_SHAPESHIFTER_AVALON", name: "Invocador de luz", line: "shapeshifterstaff", recipe: { PLANKS: 20, LEATHER: 12 }, artifact: "ARTEFACT_2H_SHAPESHIFTER_AVALON", artifactName: "Restos de ave del alba", artifactValue: 1920, part: "ALCHEMY_RARE_EAGLE", partNames: { 3: "Pluma de alba dura", 5: "Pluma de alba fina", 7: "Pluma de alba excelente" } },
  { code: "2H_SHAPESHIFTER_CRYSTAL", name: "Bastón de Mirada Firme", line: "shapeshifterstaff", recipe: { PLANKS: 20, LEATHER: 12 }, artifact: "ARTEFACT_2H_SHAPESHIFTER_CRYSTAL", artifactName: "Cristal Serpentino", artifactValue: 1920 },
  { code: "OFF_SHIELD", name: "Escudo", line: "shieldtype", recipe: { PLANKS: 4, METALBAR: 4 } },
  { code: "OFF_TOWERSHIELD_UNDEAD", name: "Sarcófago", line: "shieldtype", recipe: { PLANKS: 4, METALBAR: 4 }, artifact: "ARTEFACT_OFF_TOWERSHIELD_UNDEAD", artifactName: "Núcleo de escudo antiguo", artifactValue: 32 },
  { code: "OFF_SHIELD_HELL", name: "Escudo de villano", line: "shieldtype", recipe: { PLANKS: 4, METALBAR: 4 }, artifact: "ARTEFACT_OFF_SHIELD_HELL", artifactName: "Núcleo de escudo infernal", artifactValue: 96 },
  { code: "OFF_SPIKEDSHIELD_MORGANA", name: "Partecaras", line: "shieldtype", recipe: { PLANKS: 4, METALBAR: 4 }, artifact: "ARTEFACT_OFF_SPIKEDSHIELD_MORGANA", artifactName: "Púas forjadas con sangre", artifactValue: 224 },
  { code: "OFF_SHIELD_AVALON", name: "Aegis astral", line: "shieldtype", recipe: { PLANKS: 4, METALBAR: 4 }, artifact: "ARTEFACT_OFF_SHIELD_AVALON", artifactName: "Reliquia avaloniana destruida", artifactValue: 480 },
  { code: "OFF_SHIELD_CRYSTAL", name: "Barrera Inquebrantable", line: "shieldtype", recipe: { PLANKS: 4, METALBAR: 4 }, artifact: "ARTEFACT_OFF_SHIELD_CRYSTAL", artifactName: "Cristal Inquebrantable", artifactValue: 480 },
  { code: "OFF_TORCH", name: "Antorcha", line: "torchtype", recipe: { PLANKS: 4, CLOTH: 4 } },
  { code: "OFF_HORN_KEEPER", name: "Invocanieblas", line: "torchtype", recipe: { PLANKS: 4, CLOTH: 4 }, artifact: "ARTEFACT_OFF_HORN_KEEPER", artifactName: "Cuerno rúnico", artifactValue: 32 },
  { code: "OFF_TALISMAN_AVALON", name: "Cetro sagrado", line: "torchtype", recipe: { PLANKS: 4, CLOTH: 4 }, artifact: "ARTEFACT_OFF_TALISMAN_AVALON", artifactName: "Recuerdo avaloniano destrozado", artifactValue: 480 },
  { code: "OFF_LAMP_UNDEAD", name: "Vela de cripta", line: "torchtype", recipe: { PLANKS: 4, CLOTH: 4 }, artifact: "ARTEFACT_OFF_LAMP_UNDEAD", artifactName: "Candil abominable", artifactValue: 224 },
  { code: "OFF_JESTERCANE_HELL", name: "Bastón malicioso", line: "torchtype", recipe: { PLANKS: 4, CLOTH: 4 }, artifact: "ARTEFACT_OFF_JESTERCANE_HELL", artifactName: "Empuñadura diabólica", artifactValue: 96 },
  { code: "OFF_TORCH_CRYSTAL", name: "Antorcha Llamazul", line: "torchtype", recipe: { PLANKS: 4, CLOTH: 4 }, artifact: "ARTEFACT_OFF_TORCH_CRYSTAL", artifactName: "Cristal Llamazul", artifactValue: 480 },
  { code: "OFF_BOOK", name: "Libro de hechizos", line: "booktype", recipe: { CLOTH: 4, LEATHER: 4 } },
  { code: "OFF_ORB_MORGANA", name: "Ojo de los secretos", line: "booktype", recipe: { CLOTH: 4, LEATHER: 4 }, artifact: "ARTEFACT_OFF_ORB_MORGANA", artifactName: "Cristal tentador", artifactValue: 32 },
  { code: "OFF_DEMONSKULL_HELL", name: "Muisak", line: "booktype", recipe: { CLOTH: 4, LEATHER: 4 }, artifact: "ARTEFACT_OFF_DEMONSKULL_HELL", artifactName: "Quijada demoníaca", artifactValue: 96 },
  { code: "OFF_TOTEM_KEEPER", name: "Raíz primaria", line: "booktype", recipe: { CLOTH: 4, LEATHER: 4 }, artifact: "ARTEFACT_OFF_TOTEM_KEEPER", artifactName: "Piedra inscrita", artifactValue: 224 },
  { code: "OFF_CENSER_AVALON", name: "Incensario celestial", line: "booktype", recipe: { CLOTH: 4, LEATHER: 4 }, artifact: "ARTEFACT_OFF_CENSER_AVALON", artifactName: "Recuerdo celestial roto", artifactValue: 480 },
  { code: "OFF_TOME_CRYSTAL", name: "Grimorio Cronoestático", line: "booktype", recipe: { CLOTH: 4, LEATHER: 4 }, artifact: "ARTEFACT_OFF_TOME_CRYSTAL", artifactName: "Cristal Cronoestático", artifactValue: 480 },
];

// Restos de criatura (NO retornables): tiers impares 1× del mismo tier; pares 2× del tier anterior.
function creaturePart(item, tier) {
  const partTier = tier % 2 ? tier : tier - 1;
  return { id: `T${partTier}_${item.part}`, name: item.partNames[partTier], count: tier % 2 ? 1 : 2 };
}

const MATERIAL_NAMES = {
  METALBAR: "Barra de metal", PLANKS: "Tablones", LEATHER: "Cuero", CLOTH: "Tela", STONEBLOCK: "Bloque de piedra",
  ORE: "Mineral", WOOD: "Troncos", HIDE: "Piel", FIBER: "Fibra", ROCK: "Piedra",
};

// Recursos refinables: bruto → refinado, y la ciudad con bono de refinado.
const RESOURCES = {
  wood:    { name: "Madera", raw: "WOOD",  refined: "PLANKS",     bonusCity: "Fort Sterling" },
  metal:   { name: "Metal",  raw: "ORE",   refined: "METALBAR",   bonusCity: "Thetford" },
  leather: { name: "Cuero",  raw: "HIDE",  refined: "LEATHER",    bonusCity: "Martlock" },
  cloth:   { name: "Tela",   raw: "FIBER", refined: "CLOTH",      bonusCity: "Lymhurst" },
  // No existen bloques de piedra encantados, así que la piedra solo se refina en plano.
  stone:   { name: "Piedra", raw: "ROCK",  refined: "STONEBLOCK", bonusCity: "Bridgewatch", noEnchant: true },
};

// Recursos brutos necesarios por cada refinado (+1 refinado del tier anterior).
const RAW_PER_REFINE = { 4: 2, 5: 3, 6: 4, 7: 5, 8: 5 };

// RRR = 1 - 1 / (1 + bono de producción).
// Bonos: base de ciudad 18%, ciudad con bono de refinado +40%, bono de crafteo +15%, foco +59%.
// "pair" es la opción equivalente con/sin foco (para el interruptor de Foco).
const RRR_REFINING = [
  { value: "0.152", label: "15.2% — Ciudad sin bono",         focus: false, pair: "0.435" },
  { value: "0.367", label: "36.7% — Ciudad con bono",         focus: false, pair: "0.539" },
  { value: "0.435", label: "43.5% — Ciudad sin bono + Foco",  focus: true,  pair: "0.152" },
  { value: "0.539", label: "53.9% — Ciudad con bono + Foco",  focus: true,  pair: "0.367" },
];
const RRR_CRAFTING = [
  { value: "0.152", label: "15.2% — Ciudad sin bono" },
  { value: "0.248", label: "24.8% — Ciudad con bono de crafteo" },
  { value: "0.435", label: "43.5% — Sin bono + Foco" },
  { value: "0.479", label: "47.9% — Con bono + Foco" },
];

// ============================================================
//  DATOS DE CARNICERÍA
// ============================================================
// items.json: T{t}_MEAT se fabrica con 1 × T{t}_FARM_X_GROWN y produce 18 carnes (amountcrafted="18").
// Con returnproductnotresource="true" la RRR devuelve carne (producto), no animales:
//   carne total = animales × 18 × (1 + RRR)
const BUTCHER_MEAT_PER_ANIMAL = 18;
const BUTCHER_ANIMAL_VALUE = 720; // itemvalue del animal adulto (18 carnes × 40) → tarifa del taller
const BUTCHER_FOCUS_PER_ANIMAL = 38; // craftingfocus base, sin especializaciones

// RRR = 1 - 1 / (1 + bono de producción). craftingmodifiers.xml:
//   ciudad 18% (isla 0%) · ciudad con bono de esa carne +10% · foco +59%.
//   Isla 0% / 37.1% con foco · Ciudad 15.2% / 43.5% · Ciudad con bono 21.9% / 46.5%.
const BUTCHER_BONUS = { city: 0.18, meatCity: 0.10, focus: 0.59 };

// Ciudad con +10% para cada carne (craftingcategory "meat_x" del ítem).
const BUTCHER_BONUS_CITY = {
  chicken: "Fort Sterling",
  goat:    "Bridgewatch",
  goose:   "Lymhurst",
  sheep:   "Fort Sterling",
  pig:     "Thetford",
  cow:     "Martlock",
};

// ============================================================
//  DATOS DE CULTIVOS (granja y jardín de hierbas)
//  Fuente: items.xml (farmableitem *_SEED), loot.xml (*_LOOT) y farmingmodifiers.xml
// ============================================================
// Cada semilla cosecha 3-6 unidades (media 4,5); con Premium el doble (wiki: 6-12).
// seedChance = probabilidad base de recuperar la semilla; waterBonus = extra al regar con Foco
// (activefarmbonus). Si el total pasa de 100%, el resto es probabilidad de una semilla más.
// bonusCities = ciudades con +10% de producción local para esa planta (islandvalue 0.1).
const FARM_HARVEST_AVG = 4.5;
const FARM_PREMIUM_FACTOR = 2;
const FARM_CITY_BONUS = 0.1;
const FARM_WORM_CHANCE = 0.1;        // lombriz (T1_WORM) por semilla cosechada; ×2 con Premium
const FARM_WATER_FOCUS = 1000;       // foco por semilla regada, sin especialización
const FARM_GROW_HOURS = 22;
const FARM_SEEDS_PER_PLOT = 9;

const FARM_PLANTS = [
  // === CULTIVOS (granja) ===
  { kind: "crops", tier: 1, code: "CARROT",   name: "Zanahorias",       seedChance: 0,      waterBonus: 2,      npcPrice: 2000,  bonusCities: ["Lymhurst", "Brecilien"] },
  { kind: "crops", tier: 2, code: "BEAN",     name: "Frijoles",         seedChance: 0.3333, waterBonus: 1.3333, npcPrice: 3000,  bonusCities: ["Bridgewatch", "Brecilien"] },
  { kind: "crops", tier: 3, code: "WHEAT",    name: "Manojo de trigo",  seedChance: 0.6,    waterBonus: 0.8,    npcPrice: 5000,  bonusCities: ["Martlock", "Brecilien"] },
  { kind: "crops", tier: 4, code: "TURNIP",   name: "Rábanos",          seedChance: 0.7333, waterBonus: 0.5333, npcPrice: 7500,  bonusCities: ["Fort Sterling", "Brecilien"] },
  { kind: "crops", tier: 5, code: "CABBAGE",  name: "Coles",            seedChance: 0.8,    waterBonus: 0.4,    npcPrice: 10000, bonusCities: ["Thetford", "Brecilien"] },
  { kind: "crops", tier: 6, code: "POTATO",   name: "Patatas",          seedChance: 0.8667, waterBonus: 0.2667, npcPrice: 15000, bonusCities: ["Martlock", "Brecilien"] },
  { kind: "crops", tier: 7, code: "CORN",     name: "Fardo de maíz",    seedChance: 0.9111, waterBonus: 0.1778, npcPrice: 22500, bonusCities: ["Bridgewatch", "Brecilien"] },
  { kind: "crops", tier: 8, code: "PUMPKIN",  name: "Calabaza",         seedChance: 0.9333, waterBonus: 0.1333, npcPrice: 30000, bonusCities: ["Lymhurst", "Brecilien"] },
  // === HIERBAS (jardín de hierbas, para alquimia) ===
  { kind: "herbs", tier: 2, code: "AGARIC",   name: "Agárico arcano",          seedChance: 0.3333, waterBonus: 1.3333, npcPrice: 3000,  bonusCities: ["Thetford"] },
  { kind: "herbs", tier: 3, code: "COMFREY",  name: "Consuelda hojabrillante", seedChance: 0.6,    waterBonus: 0.8,    npcPrice: 5000,  bonusCities: ["Caerleon"] },
  { kind: "herbs", tier: 4, code: "BURDOCK",  name: "Bardana almenada",        seedChance: 0.7333, waterBonus: 0.5333, npcPrice: 7500,  bonusCities: ["Lymhurst"] },
  { kind: "herbs", tier: 5, code: "TEASEL",   name: "Cardo de dragón",         seedChance: 0.8,    waterBonus: 0.4,    npcPrice: 10000, bonusCities: ["Bridgewatch", "Caerleon"] },
  { kind: "herbs", tier: 6, code: "FOXGLOVE", name: "Dedalera elusiva",        seedChance: 0.8667, waterBonus: 0.2667, npcPrice: 15000, bonusCities: ["Martlock"] },
  { kind: "herbs", tier: 7, code: "MULLEIN",  name: "Gordolobo de fuego",      seedChance: 0.9111, waterBonus: 0.1778, npcPrice: 22500, bonusCities: ["Thetford", "Caerleon"] },
  { kind: "herbs", tier: 8, code: "YARROW",   name: "Milenrama demoníaca",     seedChance: 0.9333, waterBonus: 0.1333, npcPrice: 30000, bonusCities: ["Fort Sterling"] },
];
const FARM_KINDS = [
  { value: "crops", label: "🥕 Cultivos" },
  { value: "herbs", label: "🌿 Hierbas (alquimia)" },
];

// ============================================================
//  DATOS DE ESPECIALIZACIÓN Y FOCO (Destiny Board)
//  Fuente: wiki.albiononline.com (Crafting Focus, Crafting, Island Farms),
//  items.xml (craftingfocus) y gamedata.xml (CraftingQualityChances)
// ============================================================
// El costo de foco se reduce a la mitad por cada 10.000 de eficiencia de foco (FCE).
const FOCUS_HALVING_FCE = 10000;

// Foco base por fabricación (sin especialización):
//   refinado = 54 × 1,75^(tier + enc − 4)       (T4 54 … T8 503; T5.1 = 164)
//   equipo   = 53,6 × materiales de la receta × 1,75^(tier + enc − 4)   (espada T4: 24 mat. → 1286)
const FOCUS_REFINE_T4 = 54;
const FOCUS_PER_MATERIAL_T4 = 1286 / 24;
const FOCUS_TIER_FACTOR = 1.75;

// Consumibles: no siguen una fórmula. Según la wiki, se gasta por unidad fabricada (no por receta).
const CONSUMABLE_FOCUS = {
  T2_POTION_HEAL: 56, T4_POTION_HEAL: 210, T6_POTION_HEAL: 768,
  T2_POTION_ENERGY: 56, T4_POTION_ENERGY: 210, T6_POTION_ENERGY: 768,
  T3_POTION_REVIVE: 56, T5_POTION_REVIVE: 294, T7_POTION_REVIVE: 1020,
  T3_POTION_STONESKIN: 56, T5_POTION_STONESKIN: 294, T7_POTION_STONESKIN: 1272,
  T4_POTION_COOLDOWN: 84, T6_POTION_COOLDOWN: 378, T8_POTION_COOLDOWN: 1272,
  T1_MEAL_SOUP: 56, T3_MEAL_SOUP: 168, T5_MEAL_SOUP: 504,
  T2_MEAL_SALAD: 56, T4_MEAL_SALAD: 168, T6_MEAL_SALAD: 504,
  T3_MEAL_PIE: 53, T5_MEAL_PIE: 180, T7_MEAL_PIE: 540,
  T3_MEAL_OMELETTE: 52, T5_MEAL_OMELETTE: 155, T7_MEAL_OMELETTE: 464,
  T3_MEAL_OMELETTE_AVALON: 52, T5_MEAL_OMELETTE_AVALON: 155, T7_MEAL_OMELETTE_AVALON: 464,
  T4_MEAL_STEW: 61, T6_MEAL_STEW: 184, T8_MEAL_STEW: 551,
};

// Eficiencia (FCE) y calidad que da cada nivel:
//   maestría (ej. Chef, Espadero)           → 30 FCE y 0,75 de calidad a toda su línea
//   especialización del ítem                → unique + mutual
//   otras especializaciones de la línea     → 30 FCE y 0,75 de calidad cada nivel (las de artefacto: 15 y 0,38)
// Máximos comprobados con la wiki: refinado 40.000, arma normal 43.000, cocina/alquimia 55.000.
const SPEC_MASTERY = { fce: 30, quality: 0.75 };
const SPEC_OTHER = { fce: 30, quality: 0.75 };
const SPEC_OTHER_ARTIFACT = { fce: 15, quality: 0.38 }; // otras especializaciones de artefacto de la línea
const SPEC_NODES = {
  simple:  { unique: 250, mutual: 30, uniqueQ: 6,   mutualQ: 0.75 }, // armas/armaduras normales, refinado, cocina, alquimia
  offhand: { unique: 250, mutual: 90, uniqueQ: 6,   mutualQ: 2.3 },
  tool:    { unique: 250, mutual: 60, uniqueQ: 6,   mutualQ: 1.5 },
  bag:     { unique: 340, mutual: 0,  uniqueQ: 8.3, mutualQ: 0 },
  cape:    { unique: 370, mutual: 0,  uniqueQ: 9,   mutualQ: 0 },
  artifact: { unique: 250, mutual: 15, uniqueQ: 6,  mutualQ: 0.38 }, // armas y off-hands de artefacto
};
const specNodeFor = (code) =>
  code.startsWith("OFF_") ? "offhand" : code.startsWith("2H_TOOL_") ? "tool" : code === "BAG" ? "bag" : code === "CAPE" ? "cape" : "simple";

// Nutrir animales: 1000 de foco sin especialización → 125 con nivel 100 (3 mitades = 300 FCE por nivel).
// La especialización NO sube la probabilidad de cría.
const BREEDING_FCE_PER_LEVEL = 300;

// Calidad al craftear: 1 tirada + 1 por cada 100 de calidad; se queda la mejor.
const QUALITY_WEIGHTS = [689, 250, 50, 10, 1]; // Normal … Obra maestra (nombres en QUALITY_NAMES)

// Foco que regenera el Premium por día y máximo que se puede acumular (wiki: Crafting Focus).
const PREMIUM_FOCUS_PER_DAY = 10000;
const FOCUS_MAX = 30000;

// ============================================================
//  DATOS DE CRIANZA
//  Fuente: datos del juego (ao-bin-dumps, items.json → farmableitem)
// ============================================================

// Sub-categorías de la pestaña Crianza.
const BREEDING_CATEGORIES = [
  { value: "farm",    label: "🐔 Animales Domésticos" },
  { value: "special", label: "🐺 Monturas Especiales" },
];

// Materiales de ensillado (por tier).
const leather = (t, count = 20) => ({ id: `T${t}_LEATHER`, name: `Cuero T${t}`, count });
const planks = (t, count = 30) => ({ id: `T${t}_PLANKS`, name: `Tablones T${t}`, count });

// Corazones de facción de cada ciudad (se usan para ensillar sus monturas).
const HEARTS = {
  bridgewatch:  { id: "T1_FACTION_STEPPE_TOKEN_1",   name: "Corazón de bestia" },
  fortsterling: { id: "T1_FACTION_MOUNTAIN_TOKEN_1", name: "Corazón de montaña" },
  lymhurst:     { id: "T1_FACTION_FOREST_TOKEN_1",   name: "Corazón de árbol" },
  martlock:     { id: "T1_FACTION_HIGHLAND_TOKEN_1", name: "Corazón de piedra" },
  thetford:     { id: "T1_FACTION_SWAMP_TOKEN_1",    name: "Corazón de vid" },
  caerleon:     { id: "T1_FACTION_CAERLEON_TOKEN_1", name: "Corazón sombrío" },
  brecilien:    { id: "QUESTITEM_TOKEN_MISTS",       name: "Fuego de hadas" },
};

// Montura de facción: existe en T5 y T8 (élite).
// Ensillado: T5 = 20 cueros + 5 corazones · T8 = 20 cueros + 20 corazones.
function factionMount(key, name, beast, city, diet, heart) {
  return {
    key, name, category: "special", group: "Monturas de Facción", diet,
    ids: [5, 8].map((t) => `T${t}_FARM_${beast}_FW_${city}`),
    mount: {
      id: (t) => `T${t}_MOUNT_${beast}_FW_${city}${t === 8 ? "_ELITE" : ""}`,
      name,
      parts: (t) => [leather(t), { ...heart, count: t === 8 ? 20 : 5 }],
    },
  };
}

// Animales del selector.
//   ids   = IDs base (sin _BABY / _GROWN), uno por tier
//   group = grupo dentro del selector (optgroup)
//   diet  = "plants" (herbívoro) o "meat" (carnívoro)
//   mount = ensillado: adulto + parts(tier) → montura id(tier)
const ANIMALS = [
  // === ANIMALES DOMÉSTICOS ===
  { key: "chicken", name: "Pollos",   category: "farm", diet: "plants", ids: ["T3_FARM_CHICKEN"] },
  { key: "goat",    name: "Cabras",   category: "farm", diet: "plants", ids: ["T4_FARM_GOAT"] },
  { key: "goose",   name: "Gansos",   category: "farm", diet: "plants", ids: ["T5_FARM_GOOSE"] },
  { key: "sheep",   name: "Ovejas",   category: "farm", diet: "plants", ids: ["T6_FARM_SHEEP"] },
  { key: "pig",     name: "Cerdos",   category: "farm", diet: "plants", ids: ["T7_FARM_PIG"] },
  { key: "cow",     name: "Vacas",    category: "farm", diet: "plants", ids: ["T8_FARM_COW"] },
  {
    key: "horse", name: "Caballos", category: "farm", diet: "plants",
    ids: [3, 4, 5, 6, 7, 8].map((t) => `T${t}_FARM_HORSE`),
    mount: { id: (t) => `T${t}_MOUNT_HORSE`, name: "Caballo de montar", parts: (t) => [leather(t)] },
  },
  {
    key: "ox", name: "Bueyes", category: "farm", diet: "plants",
    ids: [3, 4, 5, 6, 7, 8].map((t) => `T${t}_FARM_OX`),
    mount: { id: (t) => `T${t}_MOUNT_OX`, name: "Buey de transporte", parts: (t) => [planks(t)] },
  },

  // === MONTURAS ESPECIALES: SALVAJES (carnívoras) ===
  {
    key: "swiftclaw", name: "Garrapresta", category: "special", group: "Salvajes", diet: "meat", ids: ["T5_FARM_COUGAR"],
    mount: { id: () => "T5_MOUNT_COUGAR_KEEPER", name: "Garrapresta", parts: (t) => [leather(t)] },
  },
  {
    key: "direwolf", name: "Lobo Huargo", category: "special", group: "Salvajes", diet: "meat", ids: ["T6_FARM_DIREWOLF"],
    mount: { id: () => "T6_MOUNT_DIREWOLF", name: "Lobo Huargo", parts: (t) => [leather(t)] },
  },
  {
    key: "direboar", name: "Jabalí Salvaje", category: "special", group: "Salvajes", diet: "meat", ids: ["T7_FARM_DIREBOAR"],
    mount: { id: () => "T7_MOUNT_DIREBOAR", name: "Jabalí Salvaje", parts: (t) => [leather(t)] },
  },
  {
    key: "direbear", name: "Oso Guadaña", category: "special", group: "Salvajes", diet: "meat", ids: ["T8_FARM_DIREBEAR"],
    mount: { id: () => "T8_MOUNT_DIREBEAR", name: "Oso Guadaña", parts: (t) => [leather(t)] },
  },

  // === MONTURAS ESPECIALES: CIERVOS (herbívoros) ===
  {
    key: "giantstag", name: "Ciervo gigante", category: "special", group: "Ciervos", diet: "plants", ids: ["T4_FARM_GIANTSTAG"],
    mount: { id: () => "T4_MOUNT_GIANTSTAG", name: "Ciervo gigante", parts: (t) => [leather(t)] },
  },
  {
    key: "moose", name: "Alce", category: "special", group: "Ciervos", diet: "plants", ids: ["T6_FARM_GIANTSTAG_MOOSE"],
    mount: { id: () => "T6_MOUNT_GIANTSTAG_MOOSE", name: "Alce", parts: (t) => [leather(t)] },
  },

  // === MONTURAS ESPECIALES: FACCIÓN (T5 y T8 élite) ===
  factionMount("fw-bridgewatch",  "Ave moa (Bridgewatch)",                 "MOABIRD",     "BRIDGEWATCH",  "plants", HEARTS.bridgewatch),
  factionMount("fw-fortsterling", "Oso de invierno (Fort Sterling)",       "DIREBEAR",    "FORTSTERLING", "meat",   HEARTS.fortsterling),
  factionMount("fw-lymhurst",     "Jabalí salvaje (Lymhurst)",             "DIREBOAR",    "LYMHURST",     "meat",   HEARTS.lymhurst),
  factionMount("fw-martlock",     "Carnero cimarrón (Martlock)",           "RAM",         "MARTLOCK",     "plants", HEARTS.martlock),
  factionMount("fw-thetford",     "Salamandra de pantano (Thetford)",      "SWAMPDRAGON", "THETFORD",     "meat",   HEARTS.thetford),
  factionMount("fw-caerleon",     "Lobo gris (Caerleon)",                  "GREYWOLF",    "CAERLEON",     "meat",   HEARTS.caerleon),
  factionMount("fw-brecilien",    "Búho místico (Brecilien)",              "OWL",         "BRECILIEN",    "meat",   HEARTS.brecilien),
];

// Por animal:
//   hours      = horas de crecimiento
//   nutrition  = nutrición total para crecer (tiempo de crecimiento / segundos por nutrición)
//   offspring  = probabilidad de obtener una cría al cosechar el adulto (sin foco)
//   focusBonus = probabilidad extra al nutrir con foco
//   focus      = foco que cuesta nutrir un animal
//   favorite   = comida favorita (da el doble de nutrición)
const FARM_STATS = {
  T3_FARM_CHICKEN: { hours: 44, nutrition: 864, offspring: 0.6,    focusBonus: 0.8,    focus: 1000, favorite: "T3_WHEAT" },
  T4_FARM_GOAT:    { hours: 44, nutrition: 864, offspring: 0.7333, focusBonus: 0.5333, focus: 1000, favorite: "T4_TURNIP" },
  T5_FARM_GOOSE:   { hours: 44, nutrition: 864, offspring: 0.8,    focusBonus: 0.4,    focus: 1000, favorite: "T5_CABBAGE" },
  T6_FARM_SHEEP:   { hours: 44, nutrition: 864, offspring: 0.8667, focusBonus: 0.2667, focus: 1000, favorite: "T6_POTATO" },
  T7_FARM_PIG:     { hours: 44, nutrition: 864, offspring: 0.9111, focusBonus: 0.1778, focus: 1000, favorite: "T7_CORN" },
  T8_FARM_COW:     { hours: 44, nutrition: 864, offspring: 0.9333, focusBonus: 0.1333, focus: 1000, favorite: "T8_PUMPKIN" },
  T3_FARM_HORSE:   { hours: 44,  nutrition: 480,    offspring: 0.84,   focusBonus: 0.2,    focus: 1000 },
  T4_FARM_HORSE:   { hours: 92,  nutrition: 1440,   offspring: 0.7867, focusBonus: 0.1333, focus: 1000 },
  T5_FARM_HORSE:   { hours: 140, nutrition: 4320,   offspring: 0.7867, focusBonus: 0.0889, focus: 1000 },
  T6_FARM_HORSE:   { hours: 188, nutrition: 12961,  offspring: 0.8104, focusBonus: 0.0593, focus: 1000 },
  T7_FARM_HORSE:   { hours: 236, nutrition: 38883,  offspring: 0.842,  focusBonus: 0.0395, focus: 1000 },
  T8_FARM_HORSE:   { hours: 284, nutrition: 116579, offspring: 0.8736, focusBonus: 0.0263, focus: 1000 },
  T3_FARM_OX:      { hours: 44,  nutrition: 480,    offspring: 0.84,   focusBonus: 0.2,    focus: 1000 },
  T4_FARM_OX:      { hours: 92,  nutrition: 1440,   offspring: 0.7867, focusBonus: 0.1333, focus: 1000 },
  T5_FARM_OX:      { hours: 140, nutrition: 4320,   offspring: 0.7867, focusBonus: 0.0889, focus: 1000 },
  T6_FARM_OX:      { hours: 188, nutrition: 12961,  offspring: 0.8104, focusBonus: 0.0593, focus: 1000 },
  T7_FARM_OX:      { hours: 236, nutrition: 38883,  offspring: 0.842,  focusBonus: 0.0395, focus: 1000 },
  T8_FARM_OX:      { hours: 284, nutrition: 116579, offspring: 0.8736, focusBonus: 0.0263, focus: 1000 },
  // Las monturas especiales no devuelven cría sin foco; con foco solo una probabilidad pequeña.
  T5_FARM_COUGAR:   { hours: 140, nutrition: 4320,   offspring: 0, focusBonus: 0.1,   focus: 1000 },
  T6_FARM_DIREWOLF: { hours: 188, nutrition: 12961,  offspring: 0, focusBonus: 0.06,  focus: 1000 },
  T7_FARM_DIREBOAR: { hours: 236, nutrition: 38883,  offspring: 0, focusBonus: 0.04,  focus: 1000 },
  T8_FARM_DIREBEAR: { hours: 284, nutrition: 116579, offspring: 0, focusBonus: 0.025, focus: 1000 },
  T4_FARM_GIANTSTAG:       { hours: 92,  nutrition: 1440,  offspring: 0, focusBonus: 0.175, focus: 1000 },
  T6_FARM_GIANTSTAG_MOOSE: { hours: 188, nutrition: 12961, offspring: 0, focusBonus: 0.06,  focus: 1000 },
};

// Todas las monturas de facción comparten estadísticas según su tier.
const FACTION_STATS = {
  5: { hours: 140, nutrition: 4320,   offspring: 0, focusBonus: 0.1,   focus: 1000 },
  8: { hours: 284, nutrition: 116579, offspring: 0, focusBonus: 0.025, focus: 1000 },
};
ANIMALS.filter((a) => a.group === "Monturas de Facción").forEach((a) => {
  a.ids.forEach((id) => (FARM_STATS[id] = FACTION_STATS[id[1]]));
});

// Comida según la dieta. Todas las plantas dan 48 de nutrición (el doble si es la favorita
// del animal) y todas las carnes 52.
const FOODS = {
  plants: {
    label: "plantas",
    nutrition: 48,
    default: "T1_CARROT",
    items: [
      { id: "T1_CARROT",  name: "Zanahoria" },
      { id: "T2_BEAN",    name: "Frijoles" },
      { id: "T3_WHEAT",   name: "Trigo" },
      { id: "T4_TURNIP",  name: "Nabo" },
      { id: "T5_CABBAGE", name: "Col" },
      { id: "T6_POTATO",  name: "Papa" },
      { id: "T7_CORN",    name: "Maíz" },
      { id: "T8_PUMPKIN", name: "Calabaza" },
    ],
  },
  meat: {
    label: "carne",
    nutrition: 52,
    default: "T3_MEAT",
    items: [
      { id: "T3_MEAT", name: "Carne de pollo" },
      { id: "T4_MEAT", name: "Carne de cabra" },
      { id: "T5_MEAT", name: "Carne de ganso" },
      { id: "T6_MEAT", name: "Carne de oveja" },
      { id: "T7_MEAT", name: "Carne de cerdo" },
      { id: "T8_MEAT", name: "Carne de res" },
    ],
  },
};

// ============================================================
//  DATOS DE CONSUMIBLES (Cocina y Alquimia)
//  Fuente: datos del juego (ao-bin-dumps). Nombres oficiales en español.
// ============================================================

// Sub-pestañas de Consumibles.
const CONSUMABLE_TABS = [
  { value: "cooking", label: "🍲 Cocina" },
  { value: "alchemy", label: "⚗️ Alquimia" },
];

// Familias del selector: "code" + tier forman el ID (ej: T5 + MEAL_SOUP → T5_MEAL_SOUP).
const CONSUMABLE_FAMILIES = [
  // === COCINA (10 unidades por receta) ===
  { tab: "cooking", name: "Sopas",               effect: "Regeneración de vida",        code: "MEAL_SOUP",            tiers: [1, 3, 5] },
  { tab: "cooking", name: "Ensaladas",           effect: "Velocidad de crafteo",        code: "MEAL_SALAD",           tiers: [2, 4, 6] },
  { tab: "cooking", name: "Pasteles",            effect: "Carga máxima",                code: "MEAL_PIE",             tiers: [3, 5, 7] },
  { tab: "cooking", name: "Tortillas",           effect: "Reducción de enfriamientos",  code: "MEAL_OMELETTE",        tiers: [3, 5, 7] },
  { tab: "cooking", name: "Tortillas avalonianas", effect: "Reducción de enfriamientos", code: "MEAL_OMELETTE_AVALON", tiers: [3, 5, 7] },
  { tab: "cooking", name: "Guisos",              effect: "Aumento de daño",             code: "MEAL_STEW",            tiers: [4, 6, 8] },

  // === ALQUIMIA (5 unidades por receta) ===
  { tab: "alchemy", name: "Pociones de curación",    effect: "Cura vida",                 code: "POTION_HEAL",      tiers: [2, 4, 6] },
  { tab: "alchemy", name: "Pociones de energía",     effect: "Recupera energía",          code: "POTION_ENERGY",    tiers: [2, 4, 6] },
  { tab: "alchemy", name: "Pociones de gigantismo",  effect: "Aumenta tamaño y vida",     code: "POTION_REVIVE",    tiers: [3, 5, 7] },
  { tab: "alchemy", name: "Pociones de resistencia", effect: "Aumenta resistencias",      code: "POTION_STONESKIN", tiers: [3, 5, 7] },
  { tab: "alchemy", name: "Pociones de veneno",      effect: "Daño de veneno en área",    code: "POTION_COOLDOWN",  tiers: [4, 6, 8] },
];

// Recetas por ID: yield = unidades producidas por receta.
// ingredients = [id, cantidad por receta, retornable (por defecto true; false = la RRR no lo devuelve)]
const CONSUMABLE_RECIPES = {
  T2_POTION_HEAL: { name: "Poción de curación menor", yield: 5, ingredients: [["T2_AGARIC", 8]] },
  T4_POTION_HEAL: { name: "Poción de curación", yield: 5, ingredients: [["T4_BURDOCK", 24], ["T3_EGG", 6]] },
  T6_POTION_HEAL: { name: "Poción de curación mayor", yield: 5, ingredients: [["T6_FOXGLOVE", 72], ["T5_EGG", 18], ["T6_ALCOHOL", 18]] },
  T2_POTION_ENERGY: { name: "Poción de energía menor", yield: 5, ingredients: [["T2_AGARIC", 8]] },
  T4_POTION_ENERGY: { name: "Poción de energía", yield: 5, ingredients: [["T4_BURDOCK", 24], ["T4_MILK", 6]] },
  T6_POTION_ENERGY: { name: "Poción de energía mayor", yield: 5, ingredients: [["T6_FOXGLOVE", 72], ["T6_MILK", 18], ["T6_ALCOHOL", 18]] },
  T3_POTION_REVIVE: { name: "Poción de gigantismo menor", yield: 5, ingredients: [["T3_COMFREY", 8]] },
  T5_POTION_REVIVE: { name: "Poción de gigantismo", yield: 5, ingredients: [["T5_TEASEL", 24], ["T4_BURDOCK", 12], ["T5_EGG", 6]] },
  T7_POTION_REVIVE: { name: "Poción de gigantismo mayor", yield: 5, ingredients: [["T7_MULLEIN", 72], ["T6_FOXGLOVE", 36], ["T5_EGG", 18], ["T7_ALCOHOL", 18]] },
  T3_POTION_STONESKIN: { name: "Poción de resistencia menor", yield: 5, ingredients: [["T3_COMFREY", 8]] },
  T5_POTION_STONESKIN: { name: "Poción de resistencia", yield: 5, ingredients: [["T5_TEASEL", 24], ["T4_BURDOCK", 12], ["T4_MILK", 6]] },
  T7_POTION_STONESKIN: { name: "Poción de resistencia mayor", yield: 5, ingredients: [["T7_MULLEIN", 72], ["T6_FOXGLOVE", 36], ["T4_BURDOCK", 36], ["T6_MILK", 18], ["T7_ALCOHOL", 18]] },
  T4_POTION_COOLDOWN: { name: "Poción de veneno menor", yield: 5, ingredients: [["T4_BURDOCK", 8], ["T3_COMFREY", 4]] },
  T6_POTION_COOLDOWN: { name: "Poción de veneno", yield: 5, ingredients: [["T6_FOXGLOVE", 24], ["T5_TEASEL", 12], ["T3_COMFREY", 12], ["T6_MILK", 6]] },
  T8_POTION_COOLDOWN: { name: "Poción de veneno mayor", yield: 5, ingredients: [["T8_YARROW", 72], ["T7_MULLEIN", 36], ["T5_TEASEL", 36], ["T8_MILK", 18], ["T8_ALCOHOL", 18]] },
  T1_MEAL_SOUP: { name: "Sopa de zanahoria", yield: 10, ingredients: [["T1_CARROT", 16]] },
  T3_MEAL_SOUP: { name: "Sopa de trigo", yield: 10, ingredients: [["T3_WHEAT", 48]] },
  T5_MEAL_SOUP: { name: "Sopa de col", yield: 10, ingredients: [["T5_CABBAGE", 144]] },
  T2_MEAL_SALAD: { name: "Ensalada de frijoles", yield: 10, ingredients: [["T2_BEAN", 8], ["T1_CARROT", 8]] },
  T4_MEAL_SALAD: { name: "Ensalada de rábano", yield: 10, ingredients: [["T4_TURNIP", 24], ["T3_WHEAT", 24]] },
  T6_MEAL_SALAD: { name: "Ensalada de patata", yield: 10, ingredients: [["T6_POTATO", 72], ["T5_CABBAGE", 72]] },
  T3_MEAL_PIE: { name: "Pastel de pollo", yield: 10, ingredients: [["T3_WHEAT", 2], ["T3_FLOUR", 4], ["T3_MEAT", 8]] },
  T5_MEAL_PIE: { name: "Pastel de ganso", yield: 10, ingredients: [["T5_CABBAGE", 6], ["T3_FLOUR", 12], ["T5_MEAT", 24], ["T4_MILK", 6]] },
  T7_MEAL_PIE: { name: "Pastel de cerdo", yield: 10, ingredients: [["T7_CORN", 18], ["T3_FLOUR", 36], ["T7_MEAT", 72], ["T6_MILK", 18]] },
  T3_MEAL_OMELETTE: { name: "Tortilla de pollo", yield: 10, ingredients: [["T3_WHEAT", 4], ["T3_MEAT", 8], ["T3_EGG", 2]] },
  T5_MEAL_OMELETTE: { name: "Tortilla de ganso", yield: 10, ingredients: [["T5_CABBAGE", 12], ["T5_MEAT", 24], ["T5_EGG", 6]] },
  T7_MEAL_OMELETTE: { name: "Tortilla de cerdo", yield: 10, ingredients: [["T7_CORN", 36], ["T7_MEAT", 72], ["T5_EGG", 18]] },
  T3_MEAL_OMELETTE_AVALON: { name: "Tortilla de pollo avaloniana", yield: 10, ingredients: [["T4_MILK", 4], ["T3_MEAT", 8], ["T3_EGG", 2], ["QUESTITEM_TOKEN_AVALON", 10, false]] },
  T5_MEAL_OMELETTE_AVALON: { name: "Tortilla de ganso avaloniana", yield: 10, ingredients: [["T6_MILK", 12], ["T5_MEAT", 24], ["T5_EGG", 6], ["QUESTITEM_TOKEN_AVALON", 30, false]] },
  T7_MEAL_OMELETTE_AVALON: { name: "Tortilla de cerdo avaloniana", yield: 10, ingredients: [["T8_MILK", 36], ["T7_MEAT", 72], ["T5_EGG", 18], ["QUESTITEM_TOKEN_AVALON", 90, false]] },
  T4_MEAL_STEW: { name: "Guiso de cabra", yield: 10, ingredients: [["T4_TURNIP", 4], ["T4_BREAD", 4], ["T4_MEAT", 8]] },
  T6_MEAL_STEW: { name: "Guiso de carnero", yield: 10, ingredients: [["T6_POTATO", 12], ["T4_BREAD", 12], ["T6_MEAT", 24]] },
  T8_MEAL_STEW: { name: "Guiso de ternera", yield: 10, ingredients: [["T8_PUMPKIN", 36], ["T4_BREAD", 36], ["T8_MEAT", 72]] },
};

const INGREDIENT_NAMES = {
  QUESTITEM_TOKEN_AVALON: "Energía avaloniana",
  T1_CARROT: "Zanahorias",
  T2_AGARIC: "Agárico arcano",
  T2_BEAN: "Frijoles",
  T3_COMFREY: "Consuelda hojabrillante",
  T3_EGG: "Huevos de gallina",
  T3_FLOUR: "Harina",
  T3_MEAT: "Carne de pollo",
  T3_WHEAT: "Manojo de trigo",
  T4_BREAD: "Pan",
  T4_BURDOCK: "Bardana almenada",
  T4_MEAT: "Carne de cabra",
  T4_MILK: "Leche de cabra",
  T4_TURNIP: "Rábanos",
  T5_CABBAGE: "Coles",
  T5_EGG: "Huevos de ganso",
  T5_MEAT: "Carne de ganso",
  T5_TEASEL: "Cardo de dragón",
  T6_ALCOHOL: "Schnapps de patata",
  T6_FOXGLOVE: "Dedalera elusiva",
  T6_MEAT: "Carne de carnero",
  T6_MILK: "Leche de oveja",
  T6_POTATO: "Patatas",
  T7_ALCOHOL: "Orujo de maíz",
  T7_CORN: "Fardo de maíz",
  T7_MEAT: "Carne de cerdo",
  T7_MULLEIN: "Gordolobo de fuego",
  T8_ALCOHOL: "Aguardiente de calabaza",
  T8_MEAT: "Carne de ternera",
  T8_MILK: "Leche de vaca",
  T8_PUMPKIN: "Calabaza",
  T8_YARROW: "Milenrama demoníaca",
};

// ============================================================
//  API Y UTILIDADES
// ============================================================
const API_URL = (region, ids) =>
  `https://${region}.albion-online-data.com/api/v2/stats/prices/${ids.map(encodeURIComponent).join(",")}.json`;

const RENDER_URL = (itemId, size = 128) =>
  `https://render.albiononline.com/v1/item/${encodeURIComponent(itemId)}.png?size=${size}`;

const QUALITY_NAMES = { 1: "Normal", 2: "Buena", 3: "Notable", 4: "Sobresaliente", 5: "Obra maestra" };

const $ = (id) => document.getElementById(id);
const regionSelect = $("region-select");

// ID de un ítem de equipo: T{tier}_{code} + @{enchant} si no es plano.
function buildItemId({ category, tier, enchant }) {
  return `T${tier}_${category}` + (enchant > 0 ? `@${enchant}` : "");
}

// ID de un recurso: los encantados llevan además _LEVEL{n} (ej: T5_METALBAR_LEVEL2@2).
function materialId(code, tier, enchant) {
  return enchant > 0 ? `T${tier}_${code}_LEVEL${enchant}@${enchant}` : `T${tier}_${code}`;
}

// Valor de un material refinado (se usa para la tarifa de la estación).
const itemValue = (tier, enchant) => 2 ** (tier + enchant);

const tierLabel = (tier, enchant) => `T${tier}${enchant > 0 ? "." + enchant : ""}`;

// useGrouping "always": en español, sin esto 1234 no lleva separador de miles.
const formatSilver = (n) => Math.round(n).toLocaleString("es-ES", { useGrouping: "always" });
const formatNumber = (n) => n.toLocaleString("es-ES", { maximumFractionDigits: 1, useGrouping: "always" });

async function fetchPrices(ids, { locations, qualities } = {}, signal) {
  const params = [];
  if (locations) params.push("locations=" + [...new Set(locations)].map(encodeURIComponent).join(","));
  if (qualities) params.push("qualities=" + qualities);
  const url = API_URL(regionSelect.value, ids) + (params.length ? "?" + params.join("&") : "");
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function setStatus(el, msg, isError = false) {
  el.textContent = msg;
  el.classList.toggle("error", isError);
}

function fillSelect(select, values, selected) {
  select.innerHTML = "";
  values.forEach((v) => select.add(new Option(v, v, false, v === selected)));
}

// Crea un grupo de botones de selección única. Devuelve un objeto para cambiar la selección.
function makeButtonGroup(container, options, initial, onChange) {
  container.innerHTML = "";
  const buttons = options.map((opt) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "filter-btn" + (opt.className ? ` ${opt.className}` : "");
    btn.dataset.value = opt.value;
    if (opt.style) btn.setAttribute("style", opt.style);
    if (opt.icon) {
      const img = document.createElement("img");
      img.src = RENDER_URL(opt.icon, 64);
      img.alt = "";
      img.loading = "lazy";
      btn.appendChild(img);
    }
    btn.append(opt.label);
    btn.addEventListener("click", () => {
      group.set(opt.value);
      onChange(opt.value);
    });
    container.appendChild(btn);
    return btn;
  });

  const group = {
    set(value) {
      buttons.forEach((b) => b.classList.toggle("active", b.dataset.value === String(value)));
    },
    disable(predicate) {
      buttons.forEach((b) => (b.disabled = predicate(b.dataset.value)));
    },
  };
  group.set(initial);
  return group;
}

const tierOptions = () => TIERS.map((t) => ({ label: `T${t}`, value: t }));
const enchantOptions = () =>
  ENCHANTS.map((e) => ({
    label: e === 0 ? "Plano" : `.${e}`,
    value: e,
    className: "ench",
    style: `--ench-color: var(--ench-${e})`,
  }));

// ============================================================
//  NAVEGACIÓN POR PESTAÑAS
// ============================================================
const TAB_NAMES = ["market", "refining", "crafting", "breeding", "farming", "consumables", "butcher"];
const navButtons = document.querySelectorAll(".nav-btn");
const calculators = {}; // se rellenan más abajo: { refining, crafting, breeding, farming, consumables, butcher }
let currentTab = null;

function showTab(name) {
  if (!TAB_NAMES.includes(name)) name = "market";
  currentTab = name;

  navButtons.forEach((b) => {
    const isActive = b.dataset.tab === name;
    b.classList.toggle("active", isActive);
    b.setAttribute("aria-selected", isActive);
  });
  document.querySelectorAll(".tab-section").forEach((s) => {
    s.classList.toggle("active", s.id === `tab-${name}`);
  });
  if (location.hash !== `#${name}`) history.replaceState(null, "", `#${name}`);

  // Las calculadoras cargan sus precios la primera vez que se abren.
  calculators[name]?.refresh();
}

navButtons.forEach((b) => b.addEventListener("click", () => showTab(b.dataset.tab)));
window.addEventListener("hashchange", () => showTab(location.hash.slice(1)));

// ============================================================
//  PESTAÑA: MERCADO
// ============================================================
// Los ítems vienen de market-data.js (MARKET_TABS: pestaña → subcategoría → ítems).
const market = { code: "BAG", tier: 4, enchant: 0 };

// "1-8" → [1..8]; "1,3,5" → [1,3,5]
function parseTiers(str) {
  if (!str.includes("-")) return str.split(",").map(Number);
  const [a, b] = str.split("-").map(Number);
  return Array.from({ length: b - a + 1 }, (_, i) => a + i);
}

// Índice plano: { code, name, tiers, ench, names?, level?, tab, sub, tierList }
const MARKET_ITEMS = MARKET_TABS.flatMap((tab) =>
  tab.subs.flatMap((sub) => sub.items.map((item) => ({ ...item, tab: tab.name, sub: sub.name, tierList: parseTiers(item.tiers) })))
);
const marketItem = (code) => MARKET_ITEMS.find((i) => i.code === code);
const marketItemName = (item, tier) => item.names?.[tier] ?? item.name;
const marketItemId = (item, tier, enchant) =>
  item.level ? materialId(item.code, tier, enchant) : buildItemId({ category: item.code, tier, enchant });
const iconTier = (item) => item.tierList.find((t) => t >= 4) ?? item.tierList[item.tierList.length - 1];
// Para buscar sin tildes ni mayúsculas.
const normalize = (text) => text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

const form = $("search-form");
const input = $("item-input");
const statusEl = $("status");
const table = $("prices-table");
const tbody = table.querySelector("tbody");
const itemHeader = $("item-header");
const itemImg = $("item-img");
const itemTitle = $("item-title");
const itemIdEl = $("item-id");
const itemRegion = $("item-region");
const groupTabs = $("group-tabs");
const subGroup = $("sub-buttons");
const categoryGroup = $("category-buttons");
const itemFilter = $("item-filter");
const filterHint = $("filter-hint");

let visibleTab = null; // pestaña que se está mostrando (puede no ser la del ítem activo)
let visibleSub = null;
let categoryButtons = null;

// El mercado usa T1-T8 (hay ítems de T1-T3: comida, semillas, monturas...).
const tierButtons = makeButtonGroup(
  $("tier-buttons"),
  [1, 2, 3, 4, 5, 6, 7, 8].map((t) => ({ label: `T${t}`, value: t })),
  market.tier,
  (t) => {
    market.tier = t;
    updateFromFilters();
  }
);
const enchantButtons = makeButtonGroup($("enchant-buttons"), enchantOptions(), market.enchant, (e) => {
  market.enchant = e;
  updateFromFilters();
});

function renderGroupTabs() {
  MARKET_TABS.forEach(({ name }) => {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = "tab";
    tab.role = "tab";
    tab.dataset.group = name;
    tab.textContent = name;
    tab.addEventListener("click", () => {
      itemFilter.value = "";
      showGroup(name);
    });
    groupTabs.appendChild(tab);
  });
}

// Muestra las subcategorías de la pestaña (ej. Armas → Espadas, Arcos…) y los ítems de la elegida.
function showGroup(tabName, subName) {
  visibleTab = tabName;
  const tab = MARKET_TABS.find((t) => t.name === tabName);
  const current = marketItem(market.code);
  visibleSub = subName ?? (current.tab === tabName ? current.sub : tab.subs[0].name);
  makeButtonGroup(subGroup, tab.subs.map((s) => ({ label: s.name, value: s.name })), visibleSub, (sub) => showGroup(tabName, sub));
  subGroup.classList.toggle("hidden", tab.subs.length < 2);
  renderItemButtons(MARKET_ITEMS.filter((i) => i.tab === tabName && i.sub === visibleSub));
  filterHint.textContent = "";
  updateTabs();
}

function renderItemButtons(items) {
  const options = items.map((item) => ({ label: item.name, value: item.code, icon: `T${iconTier(item)}_${item.code}` }));
  categoryButtons = makeButtonGroup(categoryGroup, options, market.code, (code) => {
    market.code = code;
    updateFromFilters();
  });
}

// Buscador por nombre: muestra hasta 60 coincidencias de todas las pestañas.
const MAX_FILTER_RESULTS = 60;
itemFilter.addEventListener("input", () => {
  const query = normalize(itemFilter.value.trim());
  if (!query) {
    showGroup(visibleTab ?? marketItem(market.code).tab);
    return;
  }
  const matches = MARKET_ITEMS.filter((item) =>
    [item.name, item.code, ...Object.values(item.names ?? {})].some((text) => normalize(text).includes(query))
  );
  subGroup.classList.add("hidden");
  renderItemButtons(matches.slice(0, MAX_FILTER_RESULTS));
  filterHint.textContent = matches.length
    ? `${matches.length} resultado(s)${matches.length > MAX_FILTER_RESULTS ? ` · mostrando ${MAX_FILTER_RESULTS}, escribe más para afinar` : ""}`
    : "Sin resultados. También puedes escribir el ID exacto arriba.";
  visibleTab = null;
  updateTabs();
});

// Marca la pestaña visible y pone un punto en la que contiene el ítem seleccionado.
function updateTabs() {
  const selectedTab = marketItem(market.code)?.tab;
  groupTabs.querySelectorAll(".tab").forEach((tab) => {
    const isVisible = tab.dataset.group === visibleTab;
    tab.classList.toggle("active", isVisible);
    tab.setAttribute("aria-selected", isVisible);
    tab.classList.toggle("has-selection", tab.dataset.group === selectedTab && !isVisible);
  });
}

function updateFromFilters() {
  const item = marketItem(market.code);
  // Solo se activan los tiers y encantamientos que existen para este ítem.
  if (!item.tierList.includes(market.tier)) {
    market.tier = item.tierList.reduce((best, t) => (Math.abs(t - market.tier) < Math.abs(best - market.tier) ? t : best));
  }
  tierButtons.disable((v) => !item.tierList.includes(Number(v)));
  enchantButtons.disable((v) => Number(v) > item.ench);
  market.enchant = Math.min(market.enchant, item.ench);

  input.value = "";
  categoryButtons.set(market.code);
  tierButtons.set(market.tier);
  enchantButtons.set(market.enchant);
  updateTabs();

  const itemId = marketItemId(item, market.tier, market.enchant);
  searchItem(itemId, `${marketItemName(item, market.tier)} ${tierLabel(market.tier, market.enchant)}`);
}

let marketRequest = null; // para cancelar peticiones viejas si el usuario hace clic rápido

async function searchItem(itemId, title = itemId) {
  if (marketRequest) marketRequest.abort();
  const controller = new AbortController();
  marketRequest = controller;

  setStatus(statusEl, `Buscando ${itemId}...`);
  table.classList.add("hidden");
  tbody.innerHTML = "";
  showItemHeader(itemId, title);

  try {
    const data = await fetchPrices([itemId], {}, controller.signal);

    // Descartamos filas sin ningún precio (la API devuelve todas las ciudades aunque estén vacías)
    const rows = data.filter((r) => r.sell_price_min > 0 || r.buy_price_max > 0);

    if (rows.length === 0) {
      setStatus(statusEl, `No hay precios registrados para ${itemId}.`, true);
      return;
    }

    rows.sort((a, b) => a.city.localeCompare(b.city) || a.quality - b.quality);
    rows.forEach((r) => tbody.appendChild(buildRow(r)));
    table.classList.remove("hidden");
    setStatus(statusEl, `${rows.length} resultados.`);
  } catch (err) {
    if (err.name === "AbortError") return;
    console.error(err);
    setStatus(statusEl, `Error al consultar la API: ${err.message}`, true);
  }
}

function buildRow(r) {
  const tr = document.createElement("tr");
  const updated = latestDate(r.sell_price_min_date, r.buy_price_max_date);

  tr.append(
    cell(r.city),
    cell(QUALITY_NAMES[r.quality] || r.quality),
    priceCell(r.sell_price_min, "sell"),
    priceCell(r.buy_price_max, "buy"),
    cell(updated ? formatDate(updated) : "—", updated ? "" : "empty")
  );
  return tr;
}

function cell(text, className = "") {
  const td = document.createElement("td");
  td.textContent = text;
  if (className) td.className = className;
  return td;
}

function priceCell(value, className) {
  return value > 0 ? cell(formatSilver(value), className) : cell("—", "empty");
}

// La API da fechas separadas para venta y compra; mostramos la más reciente.
// Las fechas vienen en UTC sin "Z", así que la añadimos.
function latestDate(...dates) {
  const valid = dates
    .filter((d) => d && !d.startsWith("0001"))
    .map((d) => new Date(d.endsWith("Z") ? d : d + "Z"));
  return valid.length ? new Date(Math.max(...valid)) : null;
}

function formatDate(date) {
  return date.toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" });
}

function showItemHeader(itemId, title) {
  itemImg.style.visibility = "visible";
  itemImg.onerror = () => (itemImg.style.visibility = "hidden");
  itemImg.src = RENDER_URL(itemId);
  itemImg.alt = itemId;
  itemTitle.textContent = title;
  itemIdEl.textContent = itemId;
  itemRegion.textContent = `Servidor: ${regionSelect.value}`;
  itemHeader.classList.remove("hidden");
}

// Búsqueda manual: útil para objetos que aún no están en las categorías.
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const itemId = input.value.trim().toUpperCase();
  if (!itemId) return;
  [categoryButtons, tierButtons, enchantButtons].forEach((g) => g.set(null));
  searchItem(itemId);
});

function refreshMarket() {
  const manual = input.value.trim();
  if (manual) searchItem(manual.toUpperCase());
  else updateFromFilters();
}

// ============================================================
//  CALCULADORAS (base común para Refinamiento, Crafteo y Crianza)
// ============================================================
//
// Cada calculadora define buildModel(), que devuelve:
//   {
//     product:   { id, name, value },     // value = valor del ítem (para la tarifa de estación)
//     materials: [{
//       id, name, perUnit,                // perUnit = cantidad por cada ítem fabricado
//       returnable,                       // true → se le aplica la RRR del selector
//       returnRate,                       // opcional: función que devuelve su propia tasa de retorno (0-1)
//       short,                            // opcional: nombre corto para el desglose del gasto
//       fallbackPrice,                    // opcional: precio si la API no tiene datos
//     }],
//     extras: [{ id, side }]              // opcional: otros precios a consultar ("buy" = comprar, "sell" = vender)
//   }
// y la base común se encarga de pedir precios, pintar la tabla y calcular totales.
// Los campos de RRR y tarifa de estación son opcionales en el HTML.
// onRecalc(resultado) se llama tras cada cálculo, para paneles propios de cada calculadora.
//
function createCalculator(prefix, { rrrOptions = [], buildModel, defaultBuyCity, defaultSellCity, onRecalc }) {
  const el = (name) => $(`${prefix}-${name}`);
  const ui = {
    qty: el("qty"),
    fee: el("fee"),
    rrr: el("rrr"),
    rrrCustom: el("rrr-custom"),
    premium: el("premium"),
    sellOrder: el("sellorder"),
    buyCity: el("buy-city"),
    sellCity: el("sell-city"),
    reload: el("reload"),
    status: el("status"),
    materials: el("materials"),
    stats: el("stats"),
    productImg: el("product-img"),
    productName: el("product-name"),
    productId: el("product-id"),
  };

  const calc = {
    model: null,
    prices: {},      // id → precio unitario (editable por el usuario)
    priceKey: null,  // si cambia (ítems, ciudades, región...) hay que volver a pedir precios
    request: null,
    ui,
    refresh,
    recalc,
  };

  // --- Selectores ---
  fillSelect(ui.buyCity, CITIES, defaultBuyCity);
  fillSelect(ui.sellCity, SELL_CITIES, defaultSellCity);
  if (ui.rrr) {
    rrrOptions.forEach((o) => ui.rrr.add(new Option(o.label, o.value)));
    ui.rrr.add(new Option("Personalizado…", "custom"));
  }

  // --- Tarjetas de resultados (se crean una vez y luego solo se actualizan los valores) ---
  ui.stats.innerHTML = `
    <div class="stat">
      <span class="label">Precio venta (unid.)</span>
      <input type="number" min="0" class="price-input" data-stat="sell-price">
      <span class="sub" data-stat="sell-source"></span>
    </div>
    <div class="stat cost">
      <span class="label">🛑 Gasto total</span><span class="value" data-stat="cost"></span>
      <span class="sub" data-stat="cost-detail"></span>
    </div>
    <div class="stat income">
      <span class="label">💰 Ingreso bruto</span><span class="value" data-stat="gross"></span>
      <span class="sub" data-stat="tax"></span>
    </div>
    <div class="stat" data-stat="profit-card">
      <span class="label">📈 Ganancia neta</span><span class="value" data-stat="profit"></span>
      <span class="sub" data-stat="margin"></span>
    </div>`;
  const stat = (name) => ui.stats.querySelector(`[data-stat="${name}"]`);
  const sellPriceInput = stat("sell-price");

  sellPriceInput.addEventListener("input", () => {
    calc.prices[calc.model.product.id] = Number(sellPriceInput.value) || 0;
    recalc();
  });

  // --- Eventos ---
  ui.rrr?.addEventListener("change", () => {
    ui.rrrCustom.classList.toggle("hidden", ui.rrr.value !== "custom");
    recalc();
  });
  [ui.qty, ui.fee, ui.rrrCustom].filter(Boolean).forEach((i) => i.addEventListener("input", recalc));
  ui.premium.addEventListener("change", recalc);
  // Estos cambian qué precio hay que usar, así que vuelven a consultar la API.
  [ui.sellOrder, ui.buyCity, ui.sellCity].forEach((i) => i.addEventListener("change", () => refresh()));
  ui.reload.addEventListener("click", () => refresh(true));

  function getSettings() {
    let rrr = 0;
    if (ui.rrr) {
      rrr = ui.rrr.value === "custom"
        ? Math.min(Math.max(Number(ui.rrrCustom.value) || 0, 0), 99) / 100
        : Number(ui.rrr.value);
    }
    return {
      qty: Math.max(1, Math.floor(Number(ui.qty.value) || 1)),
      fee: ui.fee ? Math.max(0, Number(ui.fee.value) || 0) : 0,
      rrr,
      premium: ui.premium.checked,
      sellOrder: ui.sellOrder.checked,
      buyCity: ui.buyCity.value,
      sellCity: ui.sellCity.value,
    };
  }

  // Reconstruye el modelo (tras cambiar ítem/tier/encantamiento) y pide precios si hace falta.
  function refresh(force = false) {
    calc.model = buildModel();
    renderProduct();
    renderMaterials();

    const s = getSettings();
    const extras = calc.model.extras ?? [];
    const ids = [calc.model.product.id, ...calc.model.materials.map((m) => m.id), ...extras.map((e) => e.id)];
    const key = [regionSelect.value, s.buyCity, s.sellCity, s.sellOrder, ...ids].join("|");
    if (force || key !== calc.priceKey) {
      calc.priceKey = key;
      loadPrices(ids, s);
    } else {
      recalc();
    }
  }

  async function loadPrices(ids, s) {
    if (calc.request) calc.request.abort();
    const controller = new AbortController();
    calc.request = controller;
    setStatus(ui.status, "Cargando precios...");

    try {
      const rows = await fetchPrices(ids, { locations: [s.buyCity, s.sellCity], qualities: 1 }, controller.signal);
      const find = (id, city) => rows.find((r) => r.item_id === id && r.city === city);

      // Comprar: precio de compra inmediata (orden de venta más barata) en la ciudad de compra.
      const buyPrice = (id) => find(id, s.buyCity)?.sell_price_min || 0;
      // Vender: con orden de venta → sell_price_min; venta directa → buy_price_max.
      const sellPrice = (id) => {
        const row = find(id, s.sellCity);
        return (s.sellOrder ? row?.sell_price_min : row?.buy_price_max) || 0;
      };

      // fallbackPrice: precio de respaldo si la API no tiene datos (ej. semillas del mercader de granja).
      calc.model.materials.forEach((m) => (calc.prices[m.id] = buyPrice(m.id) || m.fallbackPrice || 0));
      calc.prices[calc.model.product.id] = sellPrice(calc.model.product.id);
      (calc.model.extras ?? []).forEach((e) => (calc.prices[e.id] = e.side === "sell" ? sellPrice(e.id) : buyPrice(e.id)));

      renderMaterials();
      const missing = ids.filter((id) => !calc.prices[id]).length;
      setStatus(
        ui.status,
        missing
          ? `⚠️ ${missing} precio(s) sin datos en la API. Escríbelos a mano en los campos marcados.`
          : `Precios de ${s.buyCity} (compra) y ${s.sellCity} (venta). Puedes editarlos.`
      );
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error(err);
      calc.priceKey = null; // permite reintentar
      setStatus(ui.status, `Error al consultar la API: ${err.message}`, true);
    }
  }

  function renderProduct() {
    const { product } = calc.model;
    ui.productImg.src = RENDER_URL(product.id);
    ui.productImg.alt = product.name;
    ui.productName.textContent = product.name;
    ui.productId.textContent = product.id;
  }

  function renderMaterials() {
    ui.materials.innerHTML = "";
    calc.model.materials.forEach((m) => {
      const tr = document.createElement("tr");

      const nameTd = document.createElement("td");
      nameTd.innerHTML = `<div class="mat-cell"><img alt="" loading="lazy"><div><span></span><small></small></div></div>`;
      nameTd.querySelector("img").src = RENDER_URL(m.id, 64);
      nameTd.querySelector("span").textContent = m.name;
      nameTd.querySelector("small").textContent = m.returnable === false ? `${m.id} · no retornable` : m.id;

      const priceTd = document.createElement("td");
      const priceInput = document.createElement("input");
      priceInput.type = "number";
      priceInput.min = "0";
      priceInput.className = "price-input";
      priceInput.value = calc.prices[m.id] ?? 0;
      priceInput.addEventListener("input", () => {
        calc.prices[m.id] = Number(priceInput.value) || 0;
        recalc();
      });
      priceTd.appendChild(priceInput);

      m.cells = { base: cell(""), used: cell(""), subtotal: cell(""), input: priceInput };
      tr.append(nameTd, m.cells.base, m.cells.used, priceTd, m.cells.subtotal);
      ui.materials.appendChild(tr);
    });
    sellPriceInput.value = calc.prices[calc.model.product.id] ?? 0;
    recalc();
  }

  // Calcula costos y ganancias con los precios actuales. No toca la API.
  function recalc() {
    if (!calc.model) return;
    const s = getSettings();
    const { product, materials } = calc.model;

    let materialsCost = 0;
    const breakdown = [];
    materials.forEach((m) => {
      const base = m.perUnit * s.qty;
      // La tasa de retorno (RRR, o la propia del material) devuelve parte de lo invertido.
      const rate = m.returnRate ? m.returnRate() : m.returnable ? s.rrr : 0;
      const used = base * (1 - rate);
      const price = calc.prices[m.id] || 0;
      const subtotal = used * price;
      materialsCost += subtotal;
      if (m.short) breakdown.push(`${m.short} ${formatSilver(subtotal)}`);

      m.cells.base.textContent = formatNumber(base);
      m.cells.used.textContent = formatNumber(used);
      m.cells.subtotal.textContent = formatSilver(subtotal);
      m.cells.input.classList.toggle("missing", price <= 0);
    });

    const stationFee = product.value * NUTRITION_FACTOR * (s.fee / 100) * s.qty;
    const sellPrice = calc.prices[product.id] || 0;
    const taxRate = (s.premium ? TAX.salesPremium : TAX.salesNormal) + (s.sellOrder ? TAX.setupFee : 0);
    const units = s.qty * (product.yield ?? 1); // una receta puede producir varias unidades (pociones, comida)
    const gross = sellPrice * units;
    const taxes = gross * taxRate;
    const totalCost = materialsCost + stationFee;
    const profit = gross - taxes - totalCost;
    const margin = totalCost > 0 ? (profit / totalCost) * 100 : 0;

    if (!breakdown.length) breakdown.push(`Materiales ${formatSilver(materialsCost)}`);
    if (ui.fee) breakdown.push(`estación ${formatSilver(stationFee)}`);

    sellPriceInput.classList.toggle("missing", sellPrice <= 0);
    stat("sell-source").textContent = `${s.sellCity} · ${s.sellOrder ? "orden de venta" : "venta directa"}`;
    stat("cost").textContent = formatSilver(totalCost);
    stat("cost-detail").textContent = breakdown.join(" + ");
    stat("gross").textContent = formatSilver(gross);
    stat("tax").textContent = `− ${formatSilver(taxes)} de impuestos (${formatNumber(taxRate * 100)}%)`;
    stat("profit").textContent = formatSilver(profit);
    stat("margin").textContent = `${formatNumber(margin)}% margen · ${formatSilver(profit / units)} por unidad`;
    stat("profit-card").className = "stat " + (profit >= 0 ? "profit" : "loss");

    onRecalc?.({ settings: s, materialsCost, stationFee, totalCost, gross, taxes, taxRate, profit, units, sellPrice });
  }

  return calc;
}

// ============================================================
//  ESPECIALIZACIÓN Y FOCO (panel común de las calculadoras)
// ============================================================
const focusCost = (base, fce) => base * 0.5 ** (fce / FOCUS_HALVING_FCE);

// En Crafteo y Consumibles el foco va incluido en la opción de RRR ("… + Foco").
// Devuelve null con RRR personalizada (no se puede saber).
function rrrUsesFocus(select) {
  if (select.value === "custom") return null;
  return select.selectedOptions[0]?.text.includes("Foco") ?? null;
}
const tierFactor = (tier, enchant) => FOCUS_TIER_FACTOR ** (tier + enchant - 4);
const clampLevel = (v, max = 100) => Math.min(max, Math.max(0, Math.floor(Number(v) || 0)));
const SPEC_OTHERS_MAX = 1500; // "otras especializaciones" es una suma de niveles

// Eficiencia de una especialización: maestría + especialización del ítem + otras de la línea.
function specFce(node, { mastery = 0, spec = 0, others = 0, othersArtifact = 0 }) {
  return SPEC_MASTERY.fce * mastery + (node.unique + node.mutual) * spec +
    SPEC_OTHER.fce * others + SPEC_OTHER_ARTIFACT.fce * othersArtifact;
}

// Los niveles se guardan en este navegador, por pestaña y contexto (recurso, ítem, familia...).
function loadSpec(key) {
  try { return JSON.parse(localStorage.getItem(`spec:${key}`)) || {}; } catch { return {}; }
}
function saveSpec(key, levels) {
  try { localStorage.setItem(`spec:${key}`, JSON.stringify(levels)); } catch { /* sin almacenamiento */ }
}

// Días de regeneración de foco con Premium (10.000 por día).
function premiumDays(focus) {
  const days = focus / PREMIUM_FOCUS_PER_DAY;
  return days < 0.1 ? "menos de 0,1 días de Premium" : `≈ ${formatNumber(days)} días de Premium`;
}

// Panel "Especialización y foco". render(key, fields) solo reconstruye los campos si cambia el contexto.
// fields: [{ key, label, max? }] con niveles 0-100 (o hasta max). onChange se llama al editar un nivel.
function createSpecPanel(prefix, onChange) {
  const fieldsEl = $(`${prefix}-spec-fields`);
  const summaryEl = $(`${prefix}-spec-summary`);
  const resultEl = $(`${prefix}-spec-result`);
  const focusLineEl = $(`${prefix}-focus-line`);
  const panel = { key: null, levels: {} };
  const maxByKey = {};

  panel.render = (key, fields) => {
    if (key === panel.key) return;
    panel.key = key;
    panel.levels = loadSpec(key);
    fieldsEl.innerHTML = "";
    fields.forEach((f) => {
      const label = document.createElement("label");
      label.className = "field";
      label.innerHTML = `<span class="filter-label"></span><input type="number" min="0" step="1">`;
      label.querySelector("span").textContent = f.label;
      const input = label.querySelector("input");
      const max = f.max ?? 100;
      input.max = max;
      maxByKey[f.key] = max;
      input.value = clampLevel(panel.levels[f.key], max);
      input.addEventListener("input", () => {
        panel.levels[f.key] = clampLevel(input.value, max);
        saveSpec(panel.key, panel.levels);
        onChange();
      });
      fieldsEl.appendChild(label);
    });
  };
  panel.level = (key) => clampLevel(panel.levels[key], maxByKey[key]);

  // Muestra el foco (por unidad y total) y una nota con el efecto de la especialización.
  // usingFocus: true/false según el interruptor o la RRR elegida; null si no se sabe (RRR personalizada).
  panel.show = ({ base, fce, units, unitLabel, note, extraHtml = "", usingFocus = null }) => {
    const unit = focusCost(base, fce);
    const total = unit * units;
    summaryEl.textContent = `· Foco: ${formatSilver(total)}`;

    // Línea visible en los resultados con el foco total para la cantidad consultada.
    const overMax = total > FOCUS_MAX ? ` ⚠️ Supera el máximo de ${formatSilver(FOCUS_MAX)} que puedes acumular: tendrás que hacerlo en varias tandas.` : "";
    const detail = `${formatNumber(units)} × ${formatNumber(unit)} por ${unitLabel} · ${premiumDays(total)}`;
    if (usingFocus === false) {
      focusLineEl.className = "focus-line off";
      focusLineEl.innerHTML = `🔷 Sin Foco. Si lo usas gastarías <b>${formatSilver(total)}</b> de foco (${detail}).`;
    } else {
      focusLineEl.className = "focus-line";
      focusLineEl.innerHTML = `🔷 Foco a gastar${usingFocus === null ? " (si usas Foco)" : ""}: <b>${formatSilver(total)}</b> (${detail})${overMax}`;
    }
    resultEl.innerHTML = `
      <p>Eficiencia de foco: <b>${formatSilver(fce)}</b> (−${formatNumber((1 - unit / base) * 100)}% de foco)</p>
      <p>Foco por ${unitLabel}: <b>${formatNumber(unit)}</b> <span class="muted">(base ${formatSilver(base)})</span></p>
      <p>Foco total: <b>${formatSilver(total)}</b> para ${formatNumber(units)} · ${premiumDays(total)}</p>
      ${extraHtml}
      <p class="hint">${note}</p>`;
  };
  return panel;
}

// Probabilidad de cada calidad al craftear: n = 1 + calidad/100 tiradas y se queda la mejor
// (la parte decimal se toma como probabilidad de una tirada extra). No incluye comida ni foco.
function qualityChances(points) {
  const rolls = 1 + points / 100;
  const n = Math.floor(rolls);
  const frac = rolls - n;
  const total = QUALITY_WEIGHTS.reduce((a, b) => a + b, 0);
  let cum = 0;
  const cdf = QUALITY_WEIGHTS.map((w) => (cum += w) / total);
  const best = (F) => F ** n * (1 - frac + frac * F); // P(mejor tirada ≤ calidad)
  return cdf.map((F, i) => best(F) - (i > 0 ? best(cdf[i - 1]) : 0));
}

function qualityHtml(points) {
  const chips = qualityChances(points)
    .map((p, i) => `<span class="chip">${QUALITY_NAMES[i + 1]}: <b>${formatNumber(p * 100)}%</b></span>`)
    .join("");
  return `<p>Calidad: <b>${formatNumber(points)}</b> puntos → ${formatNumber(1 + points / 100)} tiradas</p>
    <div class="info-chips">${chips}</div>`;
}

// ============================================================
//  PESTAÑA: REFINAMIENTO
// ============================================================
const refining = { resource: "metal", tier: 4, enchant: 0 };

calculators.refining = createCalculator("ref", {
  rrrOptions: RRR_REFINING,
  onRecalc: updateRefiningSpec,
  defaultBuyCity: "Thetford",
  defaultSellCity: "Thetford",
  buildModel() {
    const res = RESOURCES[refining.resource];
    const t = refining.tier;
    const e = res.noEnchant ? 0 : refining.enchant;
    // El refinado del tier anterior lleva el mismo encantamiento, salvo T3 (no existe encantado).
    const prevT = t - 1;
    const prevE = prevT >= 4 ? e : 0;

    return {
      product: {
        id: materialId(res.refined, t, e),
        name: `${MATERIAL_NAMES[res.refined]} ${tierLabel(t, e)}`,
        value: itemValue(t, e),
      },
      materials: [
        {
          id: materialId(res.raw, t, e),
          name: `${MATERIAL_NAMES[res.raw]} ${tierLabel(t, e)}`,
          perUnit: RAW_PER_REFINE[t],
          returnable: true,
        },
        {
          id: materialId(res.refined, prevT, prevE),
          name: `${MATERIAL_NAMES[res.refined]} ${tierLabel(prevT, prevE)}`,
          perUnit: 1,
          returnable: true,
        },
      ],
    };
  },
});

const refUi = calculators.refining.ui;
const refFocus = $("ref-focus");
const refBonusCity = $("ref-bonus-city");

makeButtonGroup(
  $("ref-resource"),
  Object.entries(RESOURCES).map(([key, r]) => ({ label: r.name, value: key, icon: `T4_${r.refined}` })),
  refining.resource,
  (key) => {
    refining.resource = key;
    updateRefiningResource();
    calculators.refining.refresh();
  }
);
makeButtonGroup($("ref-tier"), tierOptions(), refining.tier, (t) => {
  refining.tier = t;
  calculators.refining.refresh();
});
const refEnchantButtons = makeButtonGroup($("ref-enchant"), enchantOptions(), refining.enchant, (e) => {
  refining.enchant = e;
  calculators.refining.refresh();
});

// La piedra no tiene encantamientos: desactivamos .1-.4 y marcamos "Plano".
function updateRefiningResource() {
  const res = RESOURCES[refining.resource];
  refEnchantButtons.disable((v) => res.noEnchant && v !== "0");
  refEnchantButtons.set(res.noEnchant ? 0 : refining.enchant);
  refBonusCity.textContent = `Ciudad con bono de refinado: ${res.bonusCity}` +
    (res.noEnchant ? " · La piedra no tiene encantamientos" : "");
}

// El interruptor de Foco y el selector de RRR están enlazados.
refFocus.addEventListener("change", () => {
  const option = RRR_REFINING.find((o) => o.value === refUi.rrr.value);
  if (option && option.focus !== refFocus.checked) refUi.rrr.value = option.pair;
  calculators.refining.recalc();
});
refUi.rrr.addEventListener("change", () => {
  const option = RRR_REFINING.find((o) => o.value === refUi.rrr.value);
  if (option) refFocus.checked = option.focus;
});

updateRefiningResource();

// ---------- Especialización y foco ----------
// Cada tier (T4-T8) es una especialización: +280 FCE por nivel a su tier y +30 a los demás.
const refSpec = createSpecPanel("ref", () => calculators.refining.recalc());

function updateRefiningSpec({ settings: s }) {
  const res = RESOURCES[refining.resource];
  const t = refining.tier;
  const e = res.noEnchant ? 0 : refining.enchant;
  const tiers = [4, 5, 6, 7, 8];
  refSpec.render(`ref:${refining.resource}`, tiers.map((x) => ({ key: x, label: `Espec. T${x}` })));

  const spec = refSpec.level(t);
  const others = tiers.filter((x) => x !== t).reduce((sum, x) => sum + refSpec.level(x), 0);
  refSpec.show({
    base: FOCUS_REFINE_T4 * tierFactor(t, e),
    fce: specFce(SPEC_NODES.simple, { spec, others }),
    units: s.qty,
    unitLabel: "refinado",
    usingFocus: refFocus.checked,
    note: `Niveles de refinado de ${res.name.toLowerCase()} (Adepto T4 … Anciano T8). ` +
      "La especialización solo reduce el foco: no cambia la RRR ni los materiales.",
  });
}

// ============================================================
//  PESTAÑA: CRAFTEO
// ============================================================
const crafting = { category: "MAIN_SWORD", tier: 4, enchant: 0 };

// Ítems de Crafteo: todas las armas y off-hands (CRAFT_WEAPONS) + armaduras, bolsas, capas y
// herramientas de CATEGORIES. node = tipo de especialización (valores en SPEC_NODES).
const CRAFT_ITEMS = [
  ...CRAFT_WEAPONS.map((w) => ({
    ...w,
    group: WEAPON_LINES[w.line],
    node: w.artifact ? "artifact" : OFFHAND_LINES.includes(w.line) ? "offhand" : "simple",
  })),
  ...CATEGORIES.filter((c) => !CRAFT_WEAPONS.some((w) => w.code === c.code)).map((c) => ({
    code: c.code,
    name: c.name,
    group: c.group,
    recipe: RECIPES[c.code],
    node: specNodeFor(c.code),
  })),
];
const currentCraftItem = () => CRAFT_ITEMS.find((c) => c.code === crafting.category);

calculators.crafting = createCalculator("craft", {
  rrrOptions: RRR_CRAFTING,
  onRecalc: updateCraftingSpec,
  defaultBuyCity: "Caerleon",
  defaultSellCity: "Caerleon",
  buildModel() {
    const { tier: t, enchant: e } = crafting;
    const item = currentCraftItem();

    const materials = Object.entries(item.recipe).map(([mat, count]) => ({
      id: materialId(mat, t, e),
      name: `${MATERIAL_NAMES[mat]} ${tierLabel(t, e)}`,
      perUnit: count,
      returnable: true,
      short: MATERIAL_NAMES[mat],
    }));

    // El artefacto no se encanta: el mismo T{t}_ARTEFACT_… sirve para .0 a .4.
    if (item.artifact) {
      materials.push({
        id: `T${t}_${item.artifact}`,
        name: `${item.artifactName} T${t} (artefacto)`,
        perUnit: 1,
        returnable: false,
        short: "Artefacto",
      });
    }
    if (item.part) {
      const part = creaturePart(item, t);
      materials.push({ id: part.id, name: part.name, perUnit: part.count, returnable: false, short: "Restos" });
    }

    // Valor del ítem = valor de sus refinados + el del artefacto (se duplica por tier).
    const value = Object.values(item.recipe).reduce((sum, count) => sum + count * itemValue(t, e), 0) +
      (item.artifactValue ?? 0) * 2 ** (t - 4);

    return {
      product: { id: buildItemId({ category: item.code, tier: t, enchant: e }), name: `${item.name} ${tierLabel(t, e)}`, value },
      materials,
    };
  },
});

// Selector de ítem: una sección por línea (Espadas, Arcos…) y luego armaduras, accesorios y herramientas.
const craftItemSelect = $("craft-item");
[...new Set(CRAFT_ITEMS.map((c) => c.group))].forEach((group) => {
  const optgroup = document.createElement("optgroup");
  optgroup.label = group;
  CRAFT_ITEMS.filter((c) => c.group === group).forEach((c) =>
    optgroup.appendChild(new Option(c.artifact ? `${c.name} ◆` : c.name, c.code))
  );
  craftItemSelect.appendChild(optgroup);
});
craftItemSelect.value = crafting.category;
craftItemSelect.addEventListener("change", () => {
  crafting.category = craftItemSelect.value;
  calculators.crafting.refresh();
});

makeButtonGroup($("craft-tier"), tierOptions(), crafting.tier, (t) => {
  crafting.tier = t;
  calculators.crafting.refresh();
});
makeButtonGroup($("craft-enchant"), enchantOptions(), crafting.enchant, (e) => {
  crafting.enchant = e;
  calculators.crafting.refresh();
});

// ---------- Especialización, foco y calidad ----------
const craftSpec = createSpecPanel("craft", () => calculators.crafting.recalc());

function updateCraftingSpec({ settings: s }) {
  const { tier: t, enchant: e } = crafting;
  const item = currentCraftItem();
  const isWeapon = Boolean(item.line);
  craftSpec.render(`craft:${item.code}`, [
    { key: "mastery", label: isWeapon ? `Maestría ${item.group}` : "Maestría de la línea" },
    { key: "spec", label: `Espec. ${item.name}` },
    { key: "others", label: "Otras normales (suma)", max: SPEC_OTHERS_MAX },
    { key: "othersArtifact", label: "Otras de artefacto (suma)", max: SPEC_OTHERS_MAX },
  ]);

  const node = SPEC_NODES[item.node];
  const levels = {
    mastery: craftSpec.level("mastery"),
    spec: craftSpec.level("spec"),
    others: craftSpec.level("others"),
    othersArtifact: craftSpec.level("othersArtifact"),
  };
  const materials = Object.values(item.recipe).reduce((sum, n) => sum + n, 0);
  const quality = SPEC_MASTERY.quality * levels.mastery + (node.uniqueQ + node.mutualQ) * levels.spec +
    SPEC_OTHER.quality * levels.others + SPEC_OTHER_ARTIFACT.quality * levels.othersArtifact;

  const lineHelp = isWeapon
    ? `Maestría = nodo padre (ej. Fabricante de arcos). "Otras" = suma de niveles del resto de especializaciones de ${item.group.toLowerCase()}, ` +
      "separando normales y de artefacto (estas dan la mitad). "
    : "Maestría = nodo padre de la línea. \"Otras\" = suma de niveles del resto de especializaciones de esa línea. ";
  craftSpec.show({
    base: FOCUS_PER_MATERIAL_T4 * materials * tierFactor(t, e),
    fce: specFce(node, levels),
    units: s.qty,
    unitLabel: "ítem",
    usingFocus: rrrUsesFocus(calculators.crafting.ui.rrr),
    extraHtml: qualityHtml(quality),
    note: lineHelp + "La especialización no cambia la RRR; sube la probabilidad de calidad. " +
      "La calidad no incluye la comida de crafteo ni el foco, y los precios usan calidad Normal.",
  });
}

// ============================================================
//  PESTAÑA: CRIANZA
// ============================================================
const breeding = { category: "farm", animal: "chicken", tier: 3, food: "T1_CARROT" };

const breedAnimalSelect = $("breed-animal");
const breedFoodSelect = $("breed-food");
const breedFoodQty = $("breed-plants");
const breedOffspring = $("breed-offspring");
const breedFocus = $("breed-focus");
const breedOwnBabies = $("breed-own-babies");
const breedBabies = $("breed-babies");
const breedInfo = $("breed-info");
const breedTierField = $("breed-tier-field");
const mountPanel = $("breed-mount");
const mountField = (name) => mountPanel.querySelector(`[data-m="${name}"]`);

const currentAnimal = () => ANIMALS.find((a) => a.key === breeding.animal);
const currentFarmId = () => {
  const ids = currentAnimal().ids;
  return ids.find((id) => id.startsWith(`T${breeding.tier}_`)) ?? ids[0];
};
const currentTier = () => Number(currentFarmId()[1]);
const currentDiet = () => FOODS[currentAnimal().diet];
// Probabilidad de cría (puede pasar de 100%: cada 100% es una cría segura y el resto, probabilidad de otra).
const offspringRate = () => Math.min(Math.max(Number(breedOffspring.value) || 0, 0), 300) / 100;

// Montura del animal actual (null si no se puede ensillar), resuelta para el tier elegido:
// { id, name, tier, parts: [{ id, name, count }] }
function currentMount() {
  const { mount } = currentAnimal();
  if (!mount) return null;
  const t = currentTier();
  return { id: mount.id(t), name: mount.name, tier: t, parts: mount.parts(t) };
}

calculators.breeding = createCalculator("breed", {
  defaultBuyCity: "Caerleon",
  defaultSellCity: "Caerleon",
  buildModel() {
    const farmId = currentFarmId();
    const tier = farmId.slice(0, 2);
    const animal = currentAnimal();
    const food = currentDiet().items.find((f) => f.id === breeding.food);
    const mount = currentMount();

    return {
      // Se vende el animal adulto. (Los adultos de granja también producen huevos/leche, eso no se cuenta aquí.)
      product: { id: `${farmId}_GROWN`, name: `${animal.name} (adulto) ${tier}`, value: 0 },
      materials: [
        {
          id: `${farmId}_BABY`,
          name: `${animal.name} (cría) ${tier}`,
          short: breedOwnBabies.checked ? "Crías (propias)" : "Crías netas",
          perUnit: 1,
          // Compradas: costo real = precio × (1 − probabilidad de cría); si pasa de 100% las crías extra
          // restan gasto (valen su precio de compra). Propias: no se cobran (retorno 100%).
          returnRate: () => (breedOwnBabies.checked ? 1 : offspringRate()),
        },
        {
          id: food.id,
          name: food.name,
          short: "Comida",
          perUnit: Math.max(0, Number(breedFoodQty.value) || 0),
        },
      ],
      // Si se puede ensillar, pedimos también el precio de cada material (cuero, corazones...) y de la montura.
      extras: mount ? [...mount.parts.map((p) => ({ id: p.id, side: "buy" })), { id: mount.id, side: "sell" }] : [],
    };
  },
  onRecalc: (result) => {
    updateMountPanel(result);
    updateBreedingSpec(result);
    updateBabiesInfo(result);
  },
});

// ---------- Comparación: vender el adulto crudo vs. ensillado ----------
function updateMountPanel({ settings: s, totalCost, gross, taxes, taxRate, profit }) {
  const mount = currentMount();
  mountPanel.classList.toggle("hidden", !mount);
  if (!mount) return;

  const prices = calculators.breeding.prices;
  const rawId = `${currentFarmId()}_GROWN`;
  const rawPrice = prices[rawId] || 0;
  const mountPrice = prices[mount.id] || 0;

  // Si cambió la montura, regeneramos las filas de materiales de ensillado.
  if (mountPanel.dataset.mountId !== mount.id) renderMountParts(mount);

  let saddleCost = 0;
  mount.parts.forEach((part) => {
    const units = part.count * s.qty;
    const price = prices[part.id] || 0;
    const subtotal = units * price;
    saddleCost += subtotal;
    const row = mountPartRows[part.id];
    row.desc.textContent = `${part.count} × ${formatNumber(s.qty)} animales = ${formatNumber(units)} uds.`;
    setInputValue(row.input, price);
    row.subtotal.textContent = `= ${formatSilver(subtotal)}`;
  });

  const mountGross = mountPrice * s.qty;
  const mountTaxes = mountGross * taxRate;
  const mountProfit = mountGross - mountTaxes - totalCost - saddleCost;

  const setMoney = (name, value, colorize = false) => {
    const td = mountField(name);
    td.textContent = formatSilver(value);
    if (colorize) td.className = value >= 0 ? "pos" : "neg";
  };

  setInputValue(mountField("mount-price"), mountPrice);

  setMoney("raw-cost", totalCost);
  setMoney("mount-breed-cost", totalCost);
  setMoney("saddle-cost", saddleCost);
  mountField("raw-price").textContent = formatSilver(rawPrice);
  setMoney("raw-gross", gross);
  setMoney("mount-gross", mountGross);
  mountField("raw-tax").textContent = `− ${formatSilver(taxes)}`;
  mountField("mount-tax").textContent = `− ${formatSilver(mountTaxes)}`;
  setMoney("raw-profit", profit, true);
  setMoney("mount-profit", mountProfit, true);

  // Veredicto
  const verdict = mountField("verdict");
  const diff = mountProfit - profit;
  mountField("raw-profit").classList.toggle("best", diff < 0);
  mountField("mount-profit").classList.toggle("best", diff > 0);

  if (!rawPrice || !mountPrice || mount.parts.some((p) => !prices[p.id])) {
    verdict.className = "verdict warn";
    verdict.textContent = "⚠️ Faltan precios para comparar: completa los campos marcados en naranja.";
  } else if (diff > 0) {
    verdict.className = "verdict win";
    verdict.textContent = `✅ Conviene ensillar: +${formatSilver(diff)} frente a venderlo crudo (${formatSilver(diff / s.qty)} por animal).`;
  } else {
    verdict.className = "verdict win";
    verdict.textContent = `✅ Conviene vender el adulto crudo: +${formatSilver(-diff)} frente a ensillarlo.`;
  }
}

// No pisamos un campo mientras el usuario escribe en él.
function setInputValue(input, value) {
  if (document.activeElement !== input) input.value = value;
  input.classList.toggle("missing", value <= 0);
}

// Cabecera (imágenes y nombre) y una fila por material de ensillado, con su precio editable.
let mountPartRows = {}; // id del material → celdas de su fila
function renderMountParts(mount) {
  mountPanel.dataset.mountId = mount.id;
  mountPartRows = {};
  mountField("raw-img").src = RENDER_URL(`${currentFarmId()}_GROWN`, 64);
  mountField("mount-img").src = RENDER_URL(mount.id, 64);
  mountField("mount-name").textContent = `${mount.name} T${mount.tier}`;

  const tbody = mountField("parts");
  tbody.innerHTML = "";
  mount.parts.forEach((part) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><div class="mat-cell"><img alt="" loading="lazy"><div><span></span><small></small></div></div></td>
      <td class="empty">—</td>
      <td><input type="number" min="0" class="price-input"><span class="part-subtotal"></span></td>`;
    tr.querySelector("img").src = RENDER_URL(part.id, 64);
    tr.querySelector("span").textContent = `${part.count} × ${part.name}`;

    const input = tr.querySelector("input");
    input.title = `Precio unitario de ${part.name}`;
    input.addEventListener("input", () => {
      calculators.breeding.prices[part.id] = Number(input.value) || 0;
      calculators.breeding.recalc();
    });

    mountPartRows[part.id] = { desc: tr.querySelector("small"), input, subtotal: tr.querySelector(".part-subtotal") };
    tbody.appendChild(tr);
  });
}

mountField("mount-price").addEventListener("input", (e) => {
  calculators.breeding.prices[currentMount().id] = Number(e.target.value) || 0;
  calculators.breeding.recalc();
});

// ---------- Crías que se obtienen al cosechar ----------
function updateBabiesInfo({ settings: s }) {
  const rate = offspringRate();
  const babies = s.qty * rate;
  const balance = babies - s.qty; // crías de más (o de menos) para repetir el ciclo
  const price = calculators.breeding.prices[`${currentFarmId()}_BABY`] || 0;
  const name = currentAnimal().name.toLowerCase();

  let text = `🐣 Crías: crías ${formatNumber(s.qty)} y al cosechar los adultos te dan ≈ ${formatNumber(babies)} crías ` +
    `(${formatNumber(rate * 100)}% por animal). `;
  text += balance >= 0
    ? `Te alcanza para volver a criar ${formatNumber(s.qty)} y te quedan ≈ ${formatNumber(balance)} de más para vender o criar más.`
    : `Para volver a criar ${formatNumber(s.qty)} ${name} tendrás que conseguir ≈ ${formatNumber(-balance)} crías más.`;
  if (breedOwnBabies.checked) {
    text += " Las crías son tuyas: no se cuentan en el gasto.";
  } else if (price > 0) {
    text += ` Compras ${formatNumber(s.qty)} crías (${formatSilver(s.qty * price)}); las que recuperas descuentan ${formatSilver(babies * price)}.`;
  }
  breedBabies.textContent = text;
  breedBabies.className = "verdict " + (balance >= 0 ? "win" : "warn");
}

// ---------- Valores por defecto e información ----------
// Rellena comida por animal y probabilidad de cría con los datos del juego.
function resetBreedingDefaults() {
  const stats = FARM_STATS[currentFarmId()];
  const perUnit = currentDiet().nutrition * (stats.favorite === breeding.food ? 2 : 1);
  breedFoodQty.value = Math.ceil(stats.nutrition / perUnit);

  // Con foco puede superar el 100% (ej. pollos 60% + 80% = 140%): 1 cría segura y 40% de otra.
  const chance = stats.offspring + (breedFocus.checked ? stats.focusBonus : 0);
  breedOffspring.value = +(chance * 100).toFixed(1);
  updateBreedingInfo();
}

function updateBreedingInfo() {
  const stats = FARM_STATS[currentFarmId()];
  const diet = currentDiet();
  const qty = Math.max(1, Math.floor(Number(calculators.breeding.ui.qty.value) || 1));
  const favorite = diet.items.find((f) => f.id === stats.favorite);
  // La comida por animal se reparte a lo largo de todo el crecimiento.
  const days = stats.hours / 24;
  const foodName = diet.items.find((f) => f.id === breeding.food)?.name ?? diet.label;
  const perDay = Math.max(0, Number(breedFoodQty.value) || 0) / days;
  const chips = [
    `Crecimiento: <b>${stats.hours} h</b> (${formatNumber(days)} días)`,
    `Nutrición: <b>${formatSilver(stats.nutrition)}</b> por animal`,
    `Por día: <b>${formatNumber(perDay)}</b> ${foodName} por animal · <b>${formatNumber(perDay * qty)}</b> en total`,
    currentAnimal().diet === "meat" ? `Dieta: <b>carnívoro</b>` : `Dieta: <b>herbívoro</b>`,
  ];
  if (favorite) chips.push(`Favorita: <b>${favorite.name}</b> (×2 nutrición)`);
  breedInfo.innerHTML = chips.map((c) => `<span class="chip">${c}</span>`).join("");
}

// ---------- Selectores ----------
makeButtonGroup($("breed-category"), BREEDING_CATEGORIES, breeding.category, (category) => {
  breeding.category = category;
  renderAnimalOptions();
  breeding.animal = breedAnimalSelect.value;
  onAnimalChange();
});

// Opciones del selector de animal; si tienen "group" se agrupan con <optgroup>.
function renderAnimalOptions() {
  breedAnimalSelect.innerHTML = "";
  const groups = {};
  ANIMALS.filter((a) => a.category === breeding.category).forEach((a) => {
    let parent = breedAnimalSelect;
    if (a.group) {
      if (!groups[a.group]) {
        groups[a.group] = document.createElement("optgroup");
        groups[a.group].label = a.group;
        breedAnimalSelect.appendChild(groups[a.group]);
      }
      parent = groups[a.group];
    }
    parent.appendChild(new Option(a.name, a.key));
  });
}

// Selector de comida según la dieta; marca la favorita del animal actual con ★
function renderFoodOptions() {
  const diet = currentDiet();
  const favorite = FARM_STATS[currentFarmId()].favorite;
  if (!diet.items.some((f) => f.id === breeding.food)) breeding.food = diet.default;

  breedFoodSelect.innerHTML = "";
  diet.items.forEach((f) => breedFoodSelect.add(new Option(f.id === favorite ? `★ ${f.name} (favorita)` : f.name, f.id)));
  breedFoodSelect.value = breeding.food;
}

// Botones de tier (solo para caballos y bueyes, que tienen varios)
function renderBreedingTiers() {
  const ids = currentAnimal().ids;
  breedTierField.classList.toggle("hidden", ids.length < 2);
  if (!ids.some((id) => id.startsWith(`T${breeding.tier}_`))) breeding.tier = Number(ids[0][1]);
  const options = ids.map((id) => ({ label: id.slice(0, 2), value: Number(id[1]) }));
  makeButtonGroup($("breed-tier"), options, breeding.tier, (t) => {
    breeding.tier = t;
    onBreedingChange();
  });
}

function onAnimalChange() {
  renderBreedingTiers();
  onBreedingChange();
}

function onBreedingChange() {
  renderFoodOptions();
  resetBreedingDefaults();
  calculators.breeding.refresh();
}

breedAnimalSelect.addEventListener("change", () => {
  breeding.animal = breedAnimalSelect.value;
  onAnimalChange();
});
breedFoodSelect.addEventListener("change", () => {
  breeding.food = breedFoodSelect.value;
  resetBreedingDefaults();
  calculators.breeding.refresh();
});
breedFocus.addEventListener("change", () => {
  resetBreedingDefaults();
  calculators.breeding.recalc();
});
breedFoodQty.addEventListener("input", () => { // cambia la cantidad de comida
  calculators.breeding.refresh();
  updateBreedingInfo();
});
breedOffspring.addEventListener("input", () => calculators.breeding.recalc());
breedOwnBabies.addEventListener("change", () => calculators.breeding.refresh()); // cambia el nombre del gasto
calculators.breeding.ui.qty.addEventListener("input", updateBreedingInfo);

renderAnimalOptions();
breedAnimalSelect.value = breeding.animal;
renderBreedingTiers();
renderFoodOptions();
resetBreedingDefaults();

// ---------- Especialización y foco (nutrir) ----------
const breedSpec = createSpecPanel("breed", () => calculators.breeding.recalc());

function updateBreedingSpec({ settings: s }) {
  const animal = currentAnimal();
  breedSpec.render(`breed:${animal.key}`, [{ key: "spec", label: `Espec. ${animal.name}` }]);
  breedSpec.show({
    base: FARM_STATS[currentFarmId()].focus,
    fce: BREEDING_FCE_PER_LEVEL * breedSpec.level("spec"),
    units: s.qty,
    unitLabel: "animal",
    usingFocus: breedFocus.checked,
    note: "Especialización de criador de este animal: el foco de nutrir baja de 1.000 (nivel 0) a 125 (nivel 100). " +
      "No sube la probabilidad de cría: esa la da el foco (activa \"¿Usar Foco?\").",
  });
}

// ============================================================
//  PESTAÑA: CULTIVOS (granja y jardín de hierbas)
// ============================================================
// "Cantidad" = semillas plantadas. Producto = la cosecha: yield = 4,5 por semilla (×2 Premium, ×1,1 con bono
// de ciudad). La semilla es el material: se recupera con probabilidad seedChance (+ waterBonus si se riega).
const farming = { kind: "crops", seed: "T1_FARM_CARROT_SEED" };

const farmSeedSelect = $("farm-seed");
const farmLocation = $("farm-location");
const farmLocationHint = $("farm-location-hint");
const farmFocus = $("farm-focus");
const farmOwnSeeds = $("farm-own-seeds");
const farmPlots = $("farm-plots");
const farmInfo = $("farm-info");
const farmSeeds = $("farm-seeds");

const seedId = (plant) => `T${plant.tier}_FARM_${plant.code}_SEED`;
const cropId = (plant) => `T${plant.tier}_${plant.code}`;
const currentPlant = () => FARM_PLANTS.find((p) => seedId(p) === farming.seed);

// Probabilidad de recuperar la semilla (puede pasar de 100%, igual que las crías).
const seedReturnRate = () => {
  const plant = currentPlant();
  return plant.seedChance + (farmFocus.checked ? plant.waterBonus : 0);
};
const farmHasCityBonus = () => currentPlant().bonusCities.includes(farmLocation.value);

calculators.farming = createCalculator("farm", {
  defaultBuyCity: "Lymhurst",
  defaultSellCity: "Lymhurst",
  buildModel() {
    const plant = currentPlant();
    return {
      product: {
        id: cropId(plant),
        name: `${plant.name} T${plant.tier}`,
        value: 0,
        // Getter: Premium y bono de ciudad cambian la cosecha sin reconstruir el modelo.
        get yield() {
          return FARM_HARVEST_AVG * (calculators.farming.ui.premium.checked ? FARM_PREMIUM_FACTOR : 1) *
            (1 + (farmHasCityBonus() ? FARM_CITY_BONUS : 0));
        },
      },
      materials: [
        {
          id: seedId(plant),
          name: `Semillas de ${plant.name.toLowerCase()} T${plant.tier}`,
          short: farmOwnSeeds.checked ? "Semillas (propias)" : "Semillas netas",
          perUnit: 1,
          fallbackPrice: plant.npcPrice, // si nadie la vende en el mercado, precio del mercader de granja
          // Compradas: costo real = precio × (1 − recuperación). Propias: no se cobran.
          returnRate: () => (farmOwnSeeds.checked ? 1 : seedReturnRate()),
        },
      ],
    };
  },
  onRecalc: (result) => {
    updateFarmInfo(result);
    updateFarmSpec(result);
  },
});

// ---------- Información: parcelas, cosecha, semillas y lombrices ----------
function updateFarmInfo({ settings: s, units }) {
  const plant = currentPlant();
  const premium = s.premium ? FARM_PREMIUM_FACTOR : 1;
  const bonus = farmHasCityBonus();

  farmPlots.textContent = `= ${formatNumber(s.qty / FARM_SEEDS_PER_PLOT)} parcela(s) de ${FARM_SEEDS_PER_PLOT} semillas`;
  farmLocationHint.textContent = bonus
    ? `✅ +10% de cosecha: ${farmLocation.value} tiene bono de ${plant.name.toLowerCase()}.`
    : `Bono de ${plant.name.toLowerCase()} (+10% de cosecha): ${plant.bonusCities.join(" y ")}.`;

  const chips = [
    `Crecimiento: <b>${FARM_GROW_HOURS} h</b>`,
    `Cosecha por semilla: <b>${formatNumber(units / s.qty)}</b> (3–6${s.premium ? " ×2 Premium" : ""}${bonus ? " +10%" : ""})`,
    `Cosecha total: <b>${formatNumber(units)}</b> ${plant.name.toLowerCase()}`,
    `Lombrices: <b>≈ ${formatNumber(s.qty * FARM_WORM_CHANCE * premium)}</b>`,
    `Semilla en el mercader de granja: <b>${formatSilver(plant.npcPrice)}</b> (varía con el oro)`,
  ];
  farmInfo.innerHTML = chips.map((c) => `<span class="chip">${c}</span>`).join("");

  const rate = seedReturnRate();
  const seeds = s.qty * rate;
  const balance = seeds - s.qty;
  let text = `🌱 Semillas: plantas ${formatNumber(s.qty)} y al cosechar recuperas ≈ ${formatNumber(seeds)} ` +
    `(${formatNumber(rate * 100)}% por semilla). `;
  text += balance >= 0
    ? `Te alcanza para volver a plantar ${formatNumber(s.qty)} y te quedan ≈ ${formatNumber(balance)} de más para vender o plantar más.`
    : `Para volver a plantar ${formatNumber(s.qty)} tendrás que comprar ≈ ${formatNumber(-balance)} semillas.`;
  if (farmOwnSeeds.checked) text += " Las semillas son tuyas: no se cuentan en el gasto.";
  else if (!farmFocus.checked && plant.waterBonus > 0) {
    text += ` Regando con Foco recuperarías ${formatNumber((plant.seedChance + plant.waterBonus) * 100)}%.`;
  }
  farmSeeds.textContent = text;
  farmSeeds.className = "verdict " + (balance >= 0 ? "win" : "warn");
}

// ---------- Especialización y foco (regar) ----------
// Igual que nutrir animales: 1000 de foco por semilla sin especialización → 125 con nivel 100.
const farmSpec = createSpecPanel("farm", () => calculators.farming.recalc());

function updateFarmSpec({ settings: s }) {
  const plant = currentPlant();
  farmSpec.render(`farm:${plant.code}`, [{ key: "spec", label: `Espec. ${plant.name}` }]);
  farmSpec.show({
    base: FARM_WATER_FOCUS,
    fce: BREEDING_FCE_PER_LEVEL * farmSpec.level("spec"),
    units: s.qty,
    unitLabel: "semilla regada",
    usingFocus: farmFocus.checked,
    note: `Especialización de ${plant.kind === "crops" ? "Granjero" : "Herbolario"} en esta planta: el foco de regar baja de 1.000 a 125 con nivel 100. ` +
      "Regar solo aumenta las semillas que recuperas, no la cosecha. " +
      (farmFocus.checked ? "" : "Activa \"¿Regar con Foco?\" para usarlo."),
  });
}

// ---------- Selectores ----------
function renderFarmSeeds() {
  farmSeedSelect.innerHTML = "";
  FARM_PLANTS.filter((p) => p.kind === farming.kind).forEach((p) =>
    farmSeedSelect.add(new Option(`${p.name} (T${p.tier})`, seedId(p)))
  );
  if (currentPlant()?.kind !== farming.kind) farming.seed = farmSeedSelect.options[0].value;
  farmSeedSelect.value = farming.seed;
}

// Ubicación: sin bono o cada ciudad, con ★ en las que tienen bono para la planta actual.
function renderFarmLocations() {
  const plant = currentPlant();
  const selected = farmLocation.value;
  farmLocation.innerHTML = "";
  farmLocation.add(new Option("Sin bono de ciudad", "none"));
  CITIES.forEach((c) =>
    farmLocation.add(new Option(plant.bonusCities.includes(c) ? `★ ${c} (+10% de cosecha)` : c, c))
  );
  farmLocation.value = selected || plant.bonusCities[0];
}

makeButtonGroup($("farm-kind"), FARM_KINDS, farming.kind, (kind) => {
  farming.kind = kind;
  renderFarmSeeds();
  renderFarmLocations();
  calculators.farming.refresh();
});
farmSeedSelect.addEventListener("change", () => {
  farming.seed = farmSeedSelect.value;
  renderFarmLocations();
  calculators.farming.refresh();
});
farmLocation.addEventListener("change", () => calculators.farming.recalc());
farmFocus.addEventListener("change", () => calculators.farming.recalc());
farmOwnSeeds.addEventListener("change", () => calculators.farming.refresh()); // cambia el nombre del gasto

renderFarmSeeds();
renderFarmLocations();

// ============================================================
//  PESTAÑA: CONSUMIBLES (Cocina y Alquimia)
// ============================================================
const consumables = { tab: "cooking", family: "MEAL_SOUP", tier: 5 };

const consItemSelect = $("cons-item");
const consYield = $("cons-yield");
const consVerdict = $("cons-verdict");
const verdictField = (name) => consVerdict.querySelector(`[data-v="${name}"]`);

const currentFamily = () => CONSUMABLE_FAMILIES.find((f) => f.code === consumables.family);
const currentConsumableId = () => `T${consumables.tier}_${consumables.family}`;

calculators.consumables = createCalculator("cons", {
  rrrOptions: RRR_CRAFTING,
  defaultBuyCity: "Caerleon",
  defaultSellCity: "Caerleon",
  buildModel() {
    const id = currentConsumableId();
    const recipe = CONSUMABLE_RECIPES[id];
    return {
      // "cantidad" = número de recetas; cada una produce recipe.yield unidades (5 pociones o 10 comidas).
      product: { id, name: recipe.name, value: 0, yield: recipe.yield },
      materials: recipe.ingredients.map(([ingId, count, returnable = true]) => ({
        id: ingId,
        name: INGREDIENT_NAMES[ingId],
        perUnit: count,
        returnable,
      })),
    };
  },
  onRecalc: (result) => {
    updateConsumableVerdict(result);
    updateConsumableSpec(result);
  },
});

// ---------- Análisis de rentabilidad: fabricar vs. comprar hecho ----------
function updateConsumableVerdict({ settings: s, totalCost, taxRate, profit, units, sellPrice }) {
  const recipe = CONSUMABLE_RECIPES[currentConsumableId()];
  consYield.textContent = `Cada receta produce ${recipe.yield} unidades · ${formatNumber(s.qty)} receta(s) = ${formatNumber(units)} unidades`;

  const costPerUnit = totalCost / units;
  const netPerUnit = sellPrice * (1 - taxRate);
  const profitPerUnit = profit / units;

  verdictField("cost").textContent = formatSilver(costPerUnit);
  verdictField("market").textContent = formatSilver(sellPrice);
  verdictField("net").textContent = `${formatSilver(netPerUnit)} neto tras impuestos`;

  const missing = !sellPrice || calculators.consumables.model.materials.some((m) => !calculators.consumables.prices[m.id]);
  const msg = verdictField("message");

  if (missing) {
    consVerdict.className = "verdict-panel warn";
    msg.textContent = "⚠️ Faltan precios: completa los campos marcados en naranja para ver el análisis.";
  } else if (profit > 0) {
    consVerdict.className = "verdict-panel good";
    msg.textContent = `✅ ¡Rentable! Fabricar cuesta ${formatSilver(costPerUnit)} por unidad y ganas ${formatSilver(profitPerUnit)} por unidad (${formatSilver(profit)} en total).`;
  } else if (costPerUnit > sellPrice) {
    consVerdict.className = "verdict-panel bad";
    msg.textContent = `⛔ Sale más barato comprarla hecha: fabricarla cuesta ${formatSilver(costPerUnit)} por unidad y en el mercado está a ${formatSilver(sellPrice)}.`;
  } else {
    consVerdict.className = "verdict-panel bad";
    msg.textContent = `⛔ No compensa: fabricarla es más barato que el precio de mercado, pero tras impuestos pierdes ${formatSilver(-profitPerUnit)} por unidad.`;
  }
}

// ---------- Selectores ----------
makeButtonGroup($("cons-category"), CONSUMABLE_TABS, consumables.tab, (tab) => {
  consumables.tab = tab;
  renderConsumableOptions();
  consumables.family = consItemSelect.value;
  onConsumableFamilyChange();
});

function renderConsumableOptions() {
  consItemSelect.innerHTML = "";
  CONSUMABLE_FAMILIES.filter((f) => f.tab === consumables.tab).forEach((f) =>
    consItemSelect.add(new Option(`${f.name} — ${f.effect}`, f.code))
  );
  consItemSelect.value = consumables.family;
}

// Tiers disponibles de la familia (ej: sopas T1/T3/T5, guisos T4/T6/T8).
function renderConsumableTiers() {
  const { tiers } = currentFamily();
  if (!tiers.includes(consumables.tier)) consumables.tier = tiers[tiers.length - 1];
  makeButtonGroup($("cons-tier"), tiers.map((t) => ({ label: `T${t}`, value: t })), consumables.tier, (t) => {
    consumables.tier = t;
    calculators.consumables.refresh();
  });
}

function onConsumableFamilyChange() {
  renderConsumableTiers();
  calculators.consumables.refresh();
}

consItemSelect.addEventListener("change", () => {
  consumables.family = consItemSelect.value;
  onConsumableFamilyChange();
});

renderConsumableOptions();
renderConsumableTiers();

// ---------- Especialización y foco ----------
const consSpec = createSpecPanel("cons", () => calculators.consumables.recalc());

function updateConsumableSpec({ units }) {
  const family = currentFamily();
  const isCooking = family.tab === "cooking";
  consSpec.render(`cons:${family.code}`, [
    { key: "mastery", label: isCooking ? "Maestría Chef" : "Maestría Alquimista" },
    { key: "spec", label: `Espec. ${family.name}` },
    { key: "others", label: "Otras espec. (suma)", max: SPEC_OTHERS_MAX },
  ]);
  consSpec.show({
    base: CONSUMABLE_FOCUS[currentConsumableId()],
    fce: specFce(SPEC_NODES.simple, {
      mastery: consSpec.level("mastery"),
      spec: consSpec.level("spec"),
      others: consSpec.level("others"),
    }),
    units,
    unitLabel: isCooking ? "comida" : "poción",
    usingFocus: rrrUsesFocus(calculators.consumables.ui.rrr),
    note: `"Otras" = suma de niveles del resto de especializaciones de ${isCooking ? "Chef (incluido Carnicero)" : "Alquimista"}. ` +
      "Comidas y pociones no tienen calidad: la especialización solo reduce el foco. El foco se cuenta por unidad fabricada.",
  });
}

// ============================================================
//  PESTAÑA: CARNICERÍA (animales adultos → carne cruda)
// ============================================================
// "Cantidad" = animales a sacrificar (1 animal por receta, no retornable).
// La carne es el producto: yield = 18 × (1 + RRR), según ubicación y foco.
const butchAnimalSelect = $("butch-animal");
const butchLocation = $("butch-location");
const butchFocus = $("butch-focus");
const butchRrrHint = $("butch-rrr-hint");
const butchSummary = $("butch-summary");
const summaryField = (name) => butchSummary.querySelector(`[data-s="${name}"]`);

// Animales de granja de Crianza que se carnean (Pollo T3 … Vaca T8; caballos y bueyes no).
const BUTCHER_ANIMALS = ANIMALS.filter((a) => a.key in BUTCHER_BONUS_CITY).map((a) => {
  const baseId = a.ids[0];
  const tier = Number(baseId[1]);
  return { id: `${baseId}_GROWN`, meat: `T${tier}_MEAT`, name: a.name, tier, bonusCity: BUTCHER_BONUS_CITY[a.key] };
});
BUTCHER_ANIMALS.forEach((a) => butchAnimalSelect.add(new Option(`${a.name} T${a.tier}`, a.id)));

const currentButcherAnimal = () => BUTCHER_ANIMALS.find((a) => a.id === butchAnimalSelect.value);

// Ubicación: "island" o el nombre de una ciudad.
function butcherRrr() {
  const loc = butchLocation.value;
  let bonus = loc === "island" ? 0 : BUTCHER_BONUS.city;
  if (loc === currentButcherAnimal().bonusCity) bonus += BUTCHER_BONUS.meatCity;
  if (butchFocus.checked) bonus += BUTCHER_BONUS.focus;
  return 1 - 1 / (1 + bonus);
}

// Rellena las ubicaciones marcando con ★ la ciudad con bono para el animal actual.
function renderButcherLocations() {
  const { bonusCity } = currentButcherAnimal();
  const selected = butchLocation.value || bonusCity;
  butchLocation.innerHTML = "";
  butchLocation.add(new Option("🏝️ Isla Privada", "island"));
  CITIES.forEach((c) => butchLocation.add(new Option(c === bonusCity ? `★ ${c} (+10% bono de carne)` : c, c)));
  butchLocation.value = selected;
}

calculators.butcher = createCalculator("butch", {
  defaultBuyCity: "Caerleon",
  defaultSellCity: "Caerleon",
  buildModel() {
    const animal = currentButcherAnimal();
    return {
      product: {
        id: animal.meat,
        name: INGREDIENT_NAMES[animal.meat],
        value: BUTCHER_ANIMAL_VALUE,
        // Getter: la RRR cambia con la ubicación y el foco sin reconstruir el modelo.
        get yield() { return BUTCHER_MEAT_PER_ANIMAL * (1 + butcherRrr()); },
      },
      materials: [{ id: animal.id, name: `${animal.name} adultos T${animal.tier}`, perUnit: 1, returnable: false }],
    };
  },
  onRecalc: (result) => {
    updateButcherSummary(result);
    updateButcherSpec(result);
  },
});

// ---------- Resumen: inversión, taller, carne, impuestos y ganancia ----------
function updateButcherSummary({ settings: s, materialsCost, stationFee, taxes, taxRate, profit, units }) {
  const rrr = butcherRrr();
  const baseMeat = s.qty * BUTCHER_MEAT_PER_ANIMAL;
  const { name, bonusCity } = currentButcherAnimal();
  const bonusText = butchLocation.value === bonusCity ? "con bono de carne" : `el bono de ${name.toLowerCase()} está en ${bonusCity}`;
  butchRrrHint.textContent = `RRR aplicada: ${formatNumber(rrr * 100)}% · ${bonusText}`;

  summaryField("invest").textContent = formatSilver(materialsCost);
  summaryField("invest-sub").textContent = `${formatNumber(s.qty)} animales × ${formatSilver(calculators.butcher.prices[currentButcherAnimal().id] || 0)}`;
  summaryField("fee").textContent = formatSilver(stationFee);
  summaryField("fee-sub").textContent = `${formatSilver(BUTCHER_ANIMAL_VALUE * NUTRITION_FACTOR)} nutrición por animal`;
  summaryField("meat").textContent = formatNumber(units);
  summaryField("meat-sub").textContent = `${formatNumber(baseMeat)} base + ${formatNumber(units - baseMeat)} por RRR`;
  summaryField("tax").textContent = `− ${formatSilver(taxes)}`;
  summaryField("tax-sub").textContent = `${formatNumber(taxRate * 100)}% ${s.premium ? "con" : "sin"} Premium`;
  summaryField("profit").textContent = formatSilver(profit);

  const missing = !calculators.butcher.prices[currentButcherAnimal().meat] ||
    !calculators.butcher.prices[currentButcherAnimal().id];
  butchSummary.className = "verdict-panel " + (missing ? "warn" : profit >= 0 ? "good" : "bad");
  summaryField("message").textContent = missing
    ? "⚠️ Faltan precios: complétalos a mano en los campos marcados en naranja."
    : profit >= 0
      ? `✅ Ganancia de ${formatSilver(profit / s.qty)} por animal sacrificado.`
      : `⛔ Pérdida de ${formatSilver(-profit / s.qty)} por animal: sale mejor vender el animal vivo.`;
}

// ---------- Especialización y foco ----------
// Carnicero es una especialización de Chef (misma línea que la cocina).
const butchSpec = createSpecPanel("butch", () => calculators.butcher.recalc());

function updateButcherSpec({ settings: s }) {
  butchSpec.render("butch", [
    { key: "mastery", label: "Maestría Chef" },
    { key: "spec", label: "Espec. Carnicero" },
    { key: "others", label: "Otras espec. Chef (suma)", max: SPEC_OTHERS_MAX },
  ]);
  butchSpec.show({
    base: BUTCHER_FOCUS_PER_ANIMAL,
    fce: specFce(SPEC_NODES.simple, {
      mastery: butchSpec.level("mastery"),
      spec: butchSpec.level("spec"),
      others: butchSpec.level("others"),
    }),
    units: s.qty,
    unitLabel: "animal",
    usingFocus: butchFocus.checked,
    note: "La especialización solo reduce el foco: no cambia la carne obtenida ni la RRR.",
  });
}

// ---------- Selectores ----------
butchLocation.addEventListener("change", () => calculators.butcher.recalc());
butchFocus.addEventListener("change", () => calculators.butcher.recalc());
butchAnimalSelect.addEventListener("change", () => {
  renderButcherLocations();
  calculators.butcher.refresh();
});
renderButcherLocations();

// ============================================================
//  INICIO
// ============================================================
regionSelect.value = DEFAULT_REGION;
regionSelect.addEventListener("change", () => {
  refreshMarket();
  calculators[currentTab]?.refresh(); // las demás se actualizan al abrirlas (la región forma parte de su priceKey)
});

renderGroupTabs();
showGroup(marketItem(market.code).tab);
updateFromFilters();
showTab(location.hash.slice(1));
