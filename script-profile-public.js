document.addEventListener('DOMContentLoaded', () => {
    
    // Pega o ID da URL (quem é o dono deste perfil?)
    const urlParams = new URLSearchParams(window.location.search);
    const targetUid = urlParams.get('uid');

    // Elementos da tela
    const avatarEl = document.getElementById('pub-avatar');
    const nameEl = document.getElementById('pub-name');
    const switchEl = document.getElementById('pub-fc-switch');
    const dsEl = document.getElementById('pub-fc-3ds');
    const checklistsContainer = document.getElementById('checklists-container');
    const shareBtn = document.getElementById('share-btn');
    const editBtn = document.getElementById('edit-profile-btn'); 
    
    // ==========================================================
    // --- 1. MAPEAMENTO DE IMAGENS (É PRECISO COMPLETAR!) ---
    // Você precisa adicionar o ID da PokeAPI de TODOS os 174 Pokémon aqui.
    // Ex: 'nome-do-pokemon': ID_NUMÉRICO
    // ==========================================================
    const POKEMON_ID_MAP = {
        'chikorita': 152,
        'bayleef': 153,
        'meganium': 154,
        'tepig': 498,
        'pignite': 499,
        'emboar': 500,
        'totodile': 158,
        'croconaw': 159,
        'feraligatr': 160,
        'fletchling': 661,
        'fletchinder': 662,
        'talonflame': 663,
        'bunnelby': 659,
        'diggersby': 660,
        'scatterbug': 664,
        'spewpa': 665,
        'vivillon': 666,
        'weedle': 13,
        'kakuna': 14,
        'beedrill': 15,
        'pidgey': 16,
        'pidgeotto': 17,
        'pidgeot': 18,
        'mareep': 179,
        'flaaffy': 180,
        'ampharos': 181,
        'patrat': 504,
        'watchog': 505,
        'budew': 406,
        'roselia': 315,
        'roserade': 407,
        'magikarp': 129,
        'gyarados': 130,
        'binacle': 688,
        'barbaracle': 689,
        'staryu': 120,
        'starmie': 121,
        'flabébé': 669,
        'floette': 670,
        'florges': 671,
        'skiddo': 672,
        'gogoat': 673,
        'espurr': 677,
        'meowstic': 678,
        'litleo': 667,
        'pyroar': 668,
        'pancham': 674,
        'pangoro': 675,
        'trubbish': 568,
        'garbodor': 569,
        'dedenne': 702,
        'pichu': 172,
        'pikachu': 25,
        'raichu': 26,
        'cleffa': 173,
        'clefairy': 35,
        'clefable': 36,
        'spinarak': 167,
        'ariados': 168,
        'ekans': 23,
        'arbok': 24,
        'abra': 63,
        'kadabra': 64,
        'alakazam': 65,
        'gastly': 92,
        'haunter': 93,
        'gengar': 94,
        'venipede': 543,
        'whirlipede': 544,
        'scolipede': 545,
        'honedge': 679,
        'doublade': 680,
        'aegislash': 681,
        'bellsprout': 69,
        'weepinbell': 70,
        'victreebel': 71,
        'pansage': 511,
        'simisage': 512,
        'pansear': 513,
        'simisear': 514,
        'panpour': 515,
        'simipour': 516,
        'meditite': 307,
        'medicham': 308,
        'electrike': 309,
        'manectric': 310,
        'ralts': 280,
        'kirlia': 281,
        'gardevoir': 282,
        'gallade': 475,
        'houndour': 228,
        'houndoom': 229,
        'swablu': 333,
        'altaria': 334,
        'audino': 531,
        'spritzee': 682,
        'aromatisse': 683,
        'swirlix': 684,
        'slurpuff': 685,
        'eevee': 133,
        'vaporeon': 134,
        'jolteon': 135,
        'flareon': 136,
        'espeon': 196,
        'umbreon': 197,
        'leafeon': 470,
        'glaceon': 471,
        'sylveon': 700,
        'buneary': 427,
        'lopunny': 428,
        'shuppet': 353,
        'banette': 354,
        'vanillite': 582,
        'vanillish': 583,
        'vanilluxe': 584,
        'numel': 322,
        'camerupt': 323,
        'hippopotas': 449,
        'hippowdon': 450,
        'drilbur': 529,
        'excadrill': 530,
        'sandile': 551,
        'krokorok': 552,
        'krookodile': 553,
        'machop': 66,
        'machoke': 67,
        'machamp': 68,
        'gible': 443,
        'gabite': 444,
        'garchomp': 445,
        'carbink': 703,
        'sableye': 302,
        'mawile': 303,
        'absol': 359,
        'riolu': 447,
        'lucario': 448,
        'slowpoke': 79,
        'slowbro': 80,
        'slowking': 199,
        'carvanha': 318,
        'sharpedo': 319,
        'tynamo': 602,
        'eelektrik': 603,
        'eelektross': 604,
        'dratini': 147,
        'dragonair': 148,
        'dragonite': 149,
        'bulbasaur': 1,
        'ivysaur': 2,
        'venusaur': 3,
        'charmander': 4,
        'charmeleon': 5,
        'charizard': 6,
        'squirtle': 7,
        'wartortle': 8,
        'blastoise': 9,
        'stunfisk': 618,
        'furfrou': 676,
        'inkay': 686,
        'malamar': 687,
        'skrelp': 690,
        'dragalge': 691,
        'clauncher': 692,
        'clawitzer': 693,
        'goomy': 704,
        'sliggoo': 705,
        'goodra': 706,
        'delibird': 225,
        'snorunt': 361,
        'glalie': 362,
        'froslass': 478,
        'snover': 459,
        'abomasnow': 460,
        'bergmite': 712,
        'avalugg': 713,
        'scyther': 123,
        'scizor': 212,
        'pinsir': 127,
        'heracross': 214,
        'emolga': 587,
        'hawlucha': 701,
        'phantump': 708,
        'trevenant': 709,
        'scraggy': 559,
        'scrafty': 560,
        'noibat': 714,
        'noivern': 715,
        'klefki': 707,
        'litwick': 607,
        'lampent': 608,
        'chandelure': 609,
        'aerodactyl': 142,
        'tyrunt': 696,
        'tyrantrum': 697,
        'amaura': 698,
        'aurorus': 699,
        'onix': 95,
        'steelix': 208,
        'aron': 304,
        'lairon': 305,
        'aggron': 306,
        'helioptile': 694,
        'heliolisk': 695,
        'pumpkaboo': 710,
        'gourgeist': 711,
        'larvitar': 246,
        'pupitar': 247,
        'tyranitar': 248,
        'froakie': 656,
        'frogadier': 657,
        'greninja': 658,
        'falinks': 870,
        'chespin': 650,
        'quilladin': 651,
        'chesnaught': 652,
        'skarmory': 227,
        'fennekin': 653,
        'braixen': 654,
        'delphox': 655,
        'bagon': 371,
        'shelgon': 372,
        'salamence': 373,
        'kangaskhan': 115,
        'drampa': 780,
        'beldum': 374,
        'metang': 375,
        'metagross': 376,
        'xerneas': 716,
        'yveltal': 717,
        'zygarde': 718,
        // ... ADICIONE O RESTANTE DOS POKÉMONS AQUI ...
    };

    function getPokemonImageUrl(pokemonKey) {
        const parts = pokemonKey.split('-');
        const pokeName = parts[0];
        const isShiny = parts.includes('shiny');
        const pokeId = POKEMON_ID_MAP[pokeName];

        if (!pokeId) {
            // Se o ID não for encontrado no mapa, retorna um placeholder vazio
            return 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='; 
        }

        // Usa os URLs previsíveis da PokeAPI (Formato de sprite pequeno e consistente)
        if (isShiny) {
            return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokeId}.png`;
        } else {
            return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeId}.png`;
        }
    }
    // ==========================================================

    if (!targetUid) {
        checklistsContainer.innerHTML = '<p>Usuário não encontrado.</p>';
        nameEl.textContent = 'Desconhecido';
        return;
    }

    // Botão de compartilhar
    shareBtn.addEventListener('click', () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => alert('Link copiado para a área de transferência!'));
    });

    // 1. VERIFICAÇÃO DE SEGURANÇA E BOTÃO EDITAR
    auth.onAuthStateChanged(user => {
        if (user && user.uid === targetUid) {
            editBtn.style.display = 'block';
            editBtn.addEventListener('click', () => {
                window.location.href = 'profile.html';
            });
        }
    });


    // --- 2. CARREGAR DADOS DO PERFIL (Coleção 'users') ---
    db.collection('users').doc(targetUid).get().then(doc => {
        if (doc.exists) {
            const data = doc.data();
            
            // Preenche Info Básica
            nameEl.textContent = data.displayName || 'Treinador Sem Nome';
            if (data.photoURL) avatarEl.src = data.photoURL;

            // Preenche FCs
            if (data.fcSwitch && data.fcSwitch.trim() !== "") {
                switchEl.textContent = `Switch FC: ${data.fcSwitch}`;
                switchEl.style.display = 'block'; 
            }
            if (data.fc3ds && data.fc3ds.trim() !== "") {
                dsEl.textContent = `3DS FC: ${data.fc3ds}`;
                dsEl.style.display = 'block'; 
            }

            // Carrega os checklists baseado na privacidade
            loadChecklists(targetUid, data.privacy);

        } else {
            nameEl.textContent = 'Perfil não configurado.';
        }
    }).catch(err => {
        console.error(err);
        nameEl.textContent = 'Erro ao carregar.';
    });


    // --- 3. CARREGAR CHECKLISTS ---
    function loadChecklists(uid, privacy) {
        checklistsContainer.innerHTML = ''; 

        db.collection('checklists').doc(uid).get().then(doc => {
            if (!doc.exists) {
                checklistsContainer.innerHTML = '<p>Nenhum checklist iniciado.</p>';
                return;
            }

            const data = doc.data(); 
            let hasAnyList = false;

            // Jogo: Legends Z-A
            if (data['legends-za'] && (!privacy || privacy.showZa !== false)) {
                hasAnyList = true;
                createAccordion('Pokémon Legends Z-A', data['legends-za']);
            }

            if (!hasAnyList) {
                checklistsContainer.innerHTML = '<p>Nenhum checklist visível para o público.</p>';
            }
        });
    }

    // Função auxiliar para criar o Accordion (Visualização)
    function createAccordion(title, pokemonMap) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('game-checklist');

        const header = document.createElement('div');
        header.classList.add('checklist-header');
        
        // Conta capturados
        const count = Object.keys(pokemonMap).length;
        header.innerHTML = `<span>${title}</span> <span>${count} capturados &#9660;</span>`;

        const content = document.createElement('div');
        content.classList.add('checklist-content');

        // ==== INÍCIO DA MUDANÇA: ADICIONANDO AS IMAGENS ====
        let htmlList = '<div class="poke-grid">';
        for (const [key, value] of Object.entries(pokemonMap)) {
            if (value === true) {
                const imageUrl = getPokemonImageUrl(key); // Obtém o URL
                
                // Formata o nome para o ALT da imagem (acessibilidade)
                let niceName = key.replace(/-/g, ' ');
                if (niceName.includes('shiny')) {
                    niceName = niceName.replace(' shiny', ' (Shiny)');
                }
                niceName = niceName.toUpperCase();

                htmlList += `
                    <div class="mini-poke" title="${niceName}">
                        <img src="${imageUrl}" alt="${niceName}">
                    </div>
                `;
            }
        }
        htmlList += '</div>';
        
        content.innerHTML = htmlList;
        // ==== FIM DA MUDANÇA: ADICIONANDO AS IMAGENS ====


        header.addEventListener('click', () => {
            content.classList.toggle('open');
        });

        wrapper.appendChild(header);
        wrapper.appendChild(content);
        checklistsContainer.appendChild(wrapper);
    }
});