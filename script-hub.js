// ==========================================================
// ARQUIVO: script-hub.js
// FUNÇÃO: Configurações Globais e Funções da PokeAPI
// ==========================================================

// 1. LISTA DE TODOS OS JOGOS
const GAME_CONFIGS = {
    'kanto': {
        regionApiId: 'kanto',
        title: 'Pokédex de Kanto',
        subtitle: '(151 Pokémon)',
        status: 'ready',
        games: ['red', 'blue', 'yellow', 'firered', 'leafgreen', 'lets-go-pikachu', 'lets-go-eevee']
    },
    'johto': {
        regionApiId: 'original-johto',
        title: 'Pokédex de Johto',
        subtitle: '(251 Pokémon)',
        status: 'ready',
        games: ['gold', 'silver', 'crystal', 'heartgold', 'soulsilver']
    },
    'hoenn': {
        regionApiId: 'hoenn',
        title: 'Pokédex de Hoenn',
        subtitle: '(202 Pokémon)',
        status: 'api-ready',
        games: ['ruby', 'sapphire', 'emerald', 'omega-ruby', 'alpha-sapphire']
    },
    'sinnoh': {
        regionApiId: 'extended-sinnoh',
        title: 'Pokédex de Sinnoh',
        subtitle: '(210 Pokémon)',
        status: 'api-ready',
        games: ['diamond', 'pearl', 'platinum', 'brilliant-diamond', 'shining-pearl']
    },
    'unova': {
        regionApiId: 'updated-unova',
        title: 'Pokédex de Unova',
        subtitle: '(300 Pokémon)',
        status: 'api-ready',
        games: ['black', 'white', 'black-2', 'white-2']
    },
    'kalos': {
        regionApiId: 'kalos-central',
        title: 'Pokédex de Kalos',
        subtitle: '(150 Pokémon)',
        status: 'api-ready',
        games: ['x', 'y']
    },
    'alola': {
        regionApiId: 'updated-alola',
        title: 'Pokédex de Alola',
        subtitle: '(403 Pokémon)',
        status: 'api-ready',
        games: ['sun', 'moon', 'ultra-sun', 'ultra-moon']
    },
    'galar': {
        regionApiId: 'galar',
        title: 'Pokédex de Galar',
        subtitle: '(400 Pokémon)',
        status: 'api-ready',
        games: ['sword', 'shield']
    },
    'hisui': {
        regionApiId: 'hisui',
        title: 'Pokédex de Hisui',
        subtitle: '(242 Pokémon)',
        status: 'api-ready',
        games: ['legends-arceus']
    },
    'paldea': {
        regionApiId: 'paldea',
        title: 'Pokédex de Paldea',
        subtitle: '(400 Pokémon)',
        status: 'api-ready',
        games: ['scarlet', 'violet']
    },
    'legends-za': {
        regionApiId: 'none',
        title: 'Pokémon Legends Z-A',
        subtitle: '(174 Pokémon - Lista Personalizada)',
        status: 'unavailable',
        games: []
    }
};

// --- MAPA DE NOMES BONITOS ---
const GAME_PRETTY_NAMES = {
    'red': 'Pokémon Red', 'blue': 'Pokémon Blue', 'yellow': 'Pokémon Yellow',
    'firered': 'Pokémon FireRed', 'leafgreen': 'Pokémon LeafGreen',
    'lets-go-pikachu': "Pokémon Let's Go Pikachu", 'lets-go-eevee': "Pokémon Let's Go Eevee",
    'gold': 'Pokémon Gold', 'silver': 'Pokémon Silver', 'crystal': 'Pokémon Crystal',
    'heartgold': 'Pokémon HeartGold', 'soulsilver': 'Pokémon SoulSilver',
    'ruby': 'Pokémon Ruby', 'sapphire': 'Pokémon Sapphire', 'emerald': 'Pokémon Emerald',
    'omega-ruby': 'Pokémon Omega Ruby', 'alpha-sapphire': 'Pokémon Alpha Sapphire',
    'diamond': 'Pokémon Diamond', 'pearl': 'Pokémon Pearl', 'platinum': 'Pokémon Platinum',
    'brilliant-diamond': 'Pokémon Brilliant Diamond', 'shining-pearl': 'Pokémon Shining Pearl',
    'black': 'Pokémon Black', 'white': 'Pokémon White',
    'black-2': 'Pokémon Black 2', 'white-2': 'Pokémon White 2',
    'x': 'Pokémon X', 'y': 'Pokémon Y',
    'sun': 'Pokémon Sun', 'moon': 'Pokémon Moon',
    'ultra-sun': 'Pokémon Ultra Sun', 'ultra-moon': 'Pokémon Ultra Moon',
    'sword': 'Pokémon Sword', 'shield': 'Pokémon Shield',
    'legends-arceus': 'Pokémon Legends: Arceus',
    'scarlet': 'Pokémon Scarlet', 'violet': 'Pokémon Violet'
};

// ==========================================================
// 2. FUNÇÕES DA POKEAPI (Corrigidas e Limpas)
// ==========================================================

function formatLocations(encounterData, targetVersions) {
    const results = {};
    if (!encounterData || !Array.isArray(encounterData)) return results;

    encounterData.forEach(area => {
        const locationName = area.location_area.name.replace(/-/g, ' '); 
        area.version_details.forEach(versionDetail => {
            const versionName = versionDetail.version.name;
            if (targetVersions.includes(versionName)) {
                if (!results[versionName]) results[versionName] = [];
                if (!results[versionName].includes(locationName)) results[versionName].push(locationName);
            }
        });
    });
    return results;
}

async function loadPokedex(regionId) {
    const config = Object.values(GAME_CONFIGS).find(c => c.regionApiId === regionId);
    const targetGames = config ? config.games : [];

    const pokedexData = [];
    
    const orderResponse = await fetch(`https://pokeapi.co/api/v2/pokedex/${regionId}/`);
    if (!orderResponse.ok) throw new Error(`Erro PokeAPI (${regionId}): ${orderResponse.status}`);
    
    const orderJson = await orderResponse.json();
    
    // Loop sequencial para garantir a ordem
    for (const entry of orderJson.pokemon_entries) {
        
        // Extrai o ID Nacional real da URL
        const speciesUrl = entry.pokemon_species.url;
        const nationalDexId = parseInt(speciesUrl.split('/').filter(Boolean).pop());

        // URLs
        const urls = [
            `https://pokeapi.co/api/v2/pokemon-species/${nationalDexId}/`, // 0: Species
            `https://pokeapi.co/api/v2/pokemon/${nationalDexId}/encounters`, // 1: Encounters
            `https://pokeapi.co/api/v2/pokemon/${nationalDexId}/` // 2: Pokemon
        ];

        // Busca tudo em paralelo
        const responses = await Promise.all(urls.map(url => fetch(url)));
        const [speciesRes, encountersRes, pokemonRes] = responses;

        // Se Species ou Pokemon falharem, não podemos continuar com este item
        if (!speciesRes.ok || !pokemonRes.ok) {
            console.warn(`Skipping Pokémon ID ${nationalDexId} (API Data Missing)`);
            continue;
        }
        
        // Leitura segura dos JSONs (cada .json() é chamado apenas UMA vez por resposta)
        const speciesData = await speciesRes.json();
        const pokemonData = await pokemonRes.json();
        
        // Encounters pode falhar (404) se não houver locais, isso é normal
        let encounterData = [];
        if (encountersRes.ok) {
            encounterData = await encountersRes.json();
        }

        // Processamento dos dados
        const nameEntry = speciesData.names.find(n => n.language.name === 'en');
        const name = nameEntry ? nameEntry.name : 'Unknown';
        
        const sprites = pokemonData.sprites.other['official-artwork']; 
        const imageNormal = sprites.front_default || pokemonData.sprites.front_default;
        const imageShiny = sprites.front_shiny || pokemonData.sprites.front_shiny;
        
        const locations = formatLocations(encounterData, targetGames);
        const evolutionChainUrl = speciesData.evolution_chain?.url || null;

        pokedexData.push({
            regionalDex: entry.entry_number, 
            nationalDex: nationalDexId,
            name: name,
            imageNormal: imageNormal,
            imageShiny: imageShiny,
            evolutionChainUrl: evolutionChainUrl,
            locations: locations
        });
    }
    return pokedexData;
}

// ==========================================================
// 3. LÓGICA DE INTERFACE DO HUB
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {

    const modal = document.getElementById('modal-new-checklist');
    const btnNew = document.getElementById('btn-new-checklist');
    const btnClose = document.getElementById('btn-close-modal');
    const btnCreate = document.getElementById('btn-create-checklist');
    const selectGame = document.getElementById('select-game');
    const inputName = document.getElementById('input-checklist-name');
    const listContainer = document.getElementById('my-checklists-container');
    const checkIsPublic = document.getElementById('check-is-public');

    let currentUserUid = null;

    // --- Lógica do Modal ---
    function openModal() {
        if (selectGame.options.length <= 1) {
            Object.keys(GAME_CONFIGS).forEach(regionKey => {
                const config = GAME_CONFIGS[regionKey];
                if (config.status !== 'unavailable') {
                    const group = document.createElement('optgroup');
                    group.label = config.title;
                    config.games.forEach(gameId => {
                        const option = document.createElement('option');
                        option.value = `${regionKey}:::${gameId}`;
                        option.textContent = GAME_PRETTY_NAMES[gameId] || gameId;
                        group.appendChild(option);
                    });
                    selectGame.appendChild(group);
                }
            });
        }
        modal.classList.remove('hidden');
        inputName.focus();
    }
    
    function closeModal() {
        modal.classList.add('hidden');
        inputName.value = '';
        selectGame.selectedIndex = 0;
        if(checkIsPublic) checkIsPublic.checked = true;
    }

    if (btnNew) btnNew.addEventListener('click', openModal);
    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    // --- Criar Checklist ---
    if (btnCreate) {
        btnCreate.addEventListener('click', async () => {
            const selectValue = selectGame.value;
            const name = inputName.value.trim();
            const isPublic = checkIsPublic ? checkIsPublic.checked : true;

            if (!selectValue) return alert("Por favor, selecione um jogo.");
            if (!name) return alert("Dê um nome para sua lista.");
            if (!currentUserUid) return alert("Erro de autenticação.");

            const [regionKey, specificGameId] = selectValue.split(':::');
            const btnOriginalText = btnCreate.textContent;
            btnCreate.textContent = "Criando...";
            btnCreate.disabled = true;

            try {
                const snapshot = await db.collection('users').doc(currentUserUid).collection('my_checklists').get();
                const newOrder = snapshot.size; 

                await db.collection('users').doc(currentUserUid).collection('my_checklists').add({
                    title: name,
                    gameId: regionKey,
                    specificGameId: specificGameId,
                    isPublic: isPublic,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    progress: 0,
                    order: newOrder
                });
                closeModal();
            } catch (error) {
                console.error("Erro detalhado:", error);
                alert("Erro ao criar checklist: " + error.message);
            } finally {
                btnCreate.textContent = btnOriginalText;
                btnCreate.disabled = false;
            }
        });
    }

    // --- Drag & Drop Logic ---
    let dragSrcEl = null;

    function handleDragStart(e) {
        dragSrcEl = this;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
        setTimeout(() => this.classList.add('dragging'), 0);
    }
    function handleDragOver(e) {
        if (e.preventDefault) e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        return false;
    }
    function handleDragEnter(e) { this.classList.add('drag-over'); }
    function handleDragLeave(e) { this.classList.remove('drag-over'); }
    function handleDrop(e) {
        if (e.stopPropagation) e.stopPropagation();
        if (dragSrcEl !== this) {
            const container = listContainer;
            const allCards = [...container.querySelectorAll('.checklist-card')];
            const srcIndex = allCards.indexOf(dragSrcEl);
            const targetIndex = allCards.indexOf(this);
            if (srcIndex < targetIndex) {
                container.insertBefore(dragSrcEl, this.nextSibling);
            } else {
                container.insertBefore(dragSrcEl, this);
            }
            saveNewOrder();
        }
        return false;
    }
    function handleDragEnd(e) {
        this.classList.remove('dragging');
        listContainer.querySelectorAll('.checklist-card').forEach(c => c.classList.remove('drag-over'));
    }

    async function saveNewOrder() {
        const cards = listContainer.querySelectorAll('.checklist-card');
        const batch = db.batch();
        cards.forEach((card, index) => {
            const docId = card.getAttribute('data-id');
            const docRef = db.collection('users').doc(currentUserUid).collection('my_checklists').doc(docId);
            batch.update(docRef, { order: index });
        });
        try { await batch.commit(); } catch (e) { console.error(e); }
    }

    // --- Renderizar Listas ---
    function subscribeToChecklists(uid) {
        if (!listContainer) return;
        
        db.collection('users').doc(uid).collection('my_checklists')
          .orderBy('order', 'asc')
          .onSnapshot(snapshot => {
              if (snapshot.empty) {
                  listContainer.innerHTML = `<div class="empty-state"><p>Clique no botão <strong>Nova Poké List</strong> para iniciar <span style="font-size:1.2em">↗️</span></p></div>`;
                  return;
              }
              listContainer.innerHTML = '';
              
              snapshot.forEach(doc => {
                  const data = doc.data();
                  const config = GAME_CONFIGS[data.gameId];
                  let displaySubtitle = "";
                  
                  if (data.specificGameId && GAME_PRETTY_NAMES[data.specificGameId]) {
                      displaySubtitle = GAME_PRETTY_NAMES[data.specificGameId];
                  } else if (config) {
                      displaySubtitle = config.title;
                  } else {
                      displaySubtitle = data.gameId;
                  }

                  const card = document.createElement('div');
                  card.className = 'checklist-card';
                  card.setAttribute('draggable', 'true');
                  card.setAttribute('data-id', doc.id);
                  
                  card.addEventListener('dragstart', handleDragStart);
                  card.addEventListener('dragenter', handleDragEnter);
                  card.addEventListener('dragover', handleDragOver);
                  card.addEventListener('dragleave', handleDragLeave);
                  card.addEventListener('drop', handleDrop);
                  card.addEventListener('dragend', handleDragEnd);

                  const contentLink = document.createElement('a');
                  contentLink.href = `checklist-game.html?id=${doc.id}&game=${data.gameId}`;
                  contentLink.className = 'card-content';
                  contentLink.innerHTML = `
                      <h3>${data.title}</h3>
                      <div class="meta">
                          <strong>${displaySubtitle}</strong><br>
                          ${data.isPublic ? '🌍 Pública' : '🔒 Privada'}
                      </div>
                  `;

                  const btnDelete = document.createElement('button');
                  btnDelete.className = 'btn-delete-list';
                  btnDelete.innerHTML = '🗑️';
                  btnDelete.title = 'Excluir Lista';
                  btnDelete.addEventListener('click', (e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      if (confirm(`Excluir "${data.title}"?`)) {
                          db.collection('users').doc(uid).collection('my_checklists').doc(doc.id).delete();
                      }
                  });

                  card.appendChild(contentLink);
                  card.appendChild(btnDelete);
                  listContainer.appendChild(card);
              });
          });
    }

    // --- Auth ---
    const logoffButton = document.getElementById('logoff-button');
    if (logoffButton) {
        logoffButton.addEventListener('click', () => {
            if(confirm('Sair?')) auth.signOut().then(() => window.location.href='index.html');
        });
    }

    auth.onAuthStateChanged(user => {
        if (!user) {
            window.location.href = 'index.html';
        } else {
            currentUserUid = user.uid;
            const profileLink = document.getElementById('profile-link');
            if(profileLink) profileLink.href = `profile-public.html?uid=${user.uid}`;
            
            if (listContainer) subscribeToChecklists(user.uid);
        }
    });
});