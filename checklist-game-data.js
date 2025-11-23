document.addEventListener('DOMContentLoaded', () => {

    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('game');
    const checklistId = urlParams.get('id'); 

    if (!gameId || !checklistId) return;

    // --- Referências DOM ---
    const modalDetails = document.getElementById('modal-pokemon-details');
    const btnCloseDetails = document.getElementById('btn-close-detail');
    
    // Elementos do Sub-Header
    const searchBar = document.getElementById('search-bar');
    const filterCaptured = document.getElementById('filter-captured');
    const btnSettings = document.getElementById('btn-settings');

    // Elementos do Modal de Edição
    const modalEdit = document.getElementById('modal-edit-list');
    const btnCloseEdit = document.getElementById('btn-close-edit');
    const btnSaveEdit = document.getElementById('btn-save-edit');
    const btnDeleteList = document.getElementById('btn-delete-list');
    const inputEditName = document.getElementById('edit-list-name');
    const checkEditPublic = document.getElementById('edit-is-public');
    const shareInput = document.getElementById('share-link-input');
    const btnCopy = document.getElementById('btn-copy-link');

    // Variáveis de Estado
    if (typeof GAME_CONFIGS === 'undefined') return;
    const config = GAME_CONFIGS[gameId];
    let userCapturedState = {}; 
    let userId = null;
    let currentListData = null;
    let currentSelectedPokemon = null;

    // ==========================================================
    // LÓGICA DE INTERAÇÃO
    // ==========================================================

    // --- 1. Clique Rápido (No Card) ---
    function toggleQuickCheck(slug) {
        if (!userCapturedState[slug]) userCapturedState[slug] = {};
        
        userCapturedState[slug].normal = !userCapturedState[slug].normal;

        if (!userCapturedState[slug].normal && !userCapturedState[slug].shiny) {
            delete userCapturedState[slug];
        }

        updateCardVisuals(slug);
        saveCapturedState();
    }

    // --- 2. Modal de Detalhes (Botão +) ---
    function openDetailModal(pokemon) {
        currentSelectedPokemon = pokemon;
        const slug = pokemon.slug;
        const state = userCapturedState[slug] || {};

        document.getElementById('detail-name').textContent = pokemon.name;
        document.getElementById('detail-id').textContent = `#${String(pokemon.regionalDex).padStart(3, '0')}`;

        const imgNormal = document.getElementById('img-normal');
        const imgShiny = document.getElementById('img-shiny');
        imgNormal.src = pokemon.imageNormal;
        imgShiny.src = pokemon.imageShiny;

        updateModalVisuals(state);

        const btnNormal = document.getElementById('variant-normal');
        const btnShiny = document.getElementById('variant-shiny');
        
        const newBtnNormal = btnNormal.cloneNode(true);
        const newBtnShiny = btnShiny.cloneNode(true);
        btnNormal.parentNode.replaceChild(newBtnNormal, btnNormal);
        btnShiny.parentNode.replaceChild(newBtnShiny, btnShiny);

        newBtnNormal.addEventListener('click', () => toggleVariant('normal'));
        newBtnShiny.addEventListener('click', () => toggleVariant('shiny'));

        modalDetails.classList.remove('hidden');
    }

    function closeDetailModal() {
        modalDetails.classList.add('hidden');
        currentSelectedPokemon = null;
    }

    function toggleVariant(type) {
        if (!currentSelectedPokemon) return;
        const slug = currentSelectedPokemon.slug;
        
        if (!userCapturedState[slug]) userCapturedState[slug] = {};
        
        userCapturedState[slug][type] = !userCapturedState[slug][type];

        if (!userCapturedState[slug].normal && !userCapturedState[slug].shiny) {
            delete userCapturedState[slug];
        }

        updateModalVisuals(userCapturedState[slug] || {});
        updateCardVisuals(slug);
        saveCapturedState();
    }

    function updateModalVisuals(state) {
        const btnNormal = document.getElementById('variant-normal');
        const btnShiny = document.getElementById('variant-shiny');

        if (state.normal) btnNormal.classList.add('selected');
        else btnNormal.classList.remove('selected');

        if (state.shiny) btnShiny.classList.add('selected');
        else btnShiny.classList.remove('selected');
    }

    // --- EVENT LISTENERS DOS MODAIS ---
    
    // Fechar modal de detalhes ao clicar no X
    if (btnCloseDetails) btnCloseDetails.addEventListener('click', closeDetailModal);
    
    // Fechar modal de detalhes ao clicar fora (Overlay)
    if (modalDetails) {
        modalDetails.addEventListener('click', (e) => {
            // Verifica se o elemento clicado é EXATAMENTE o overlay (fundo escuro)
            // e não o conteúdo interno (modal-content ou seus filhos)
            if (e.target === modalDetails) {
                closeDetailModal();
            }
        });
    }

    // Fechar modal de edição ao clicar fora (Overlay)
    if (modalEdit) {
        modalEdit.addEventListener('click', (e) => {
            if (e.target === modalEdit) {
                modalEdit.classList.add('hidden');
            }
        });
    }


    // --- 3. Filtro e Busca ---
    function applyFilters() {
        const term = searchBar.value.toLowerCase().trim();
        const showCapturedOnly = filterCaptured.checked;

        document.querySelectorAll('.pokemon-item').forEach(card => {
            const slug = card.dataset.slug;
            // Busca pelo nome no atributo alt da imagem (mais robusto que innerText)
            const img = card.querySelector('img:not(.shiny-indicator)');
            const name = img ? img.alt.toLowerCase() : '';
            
            const isCaptured = !!userCapturedState[slug];

            let visible = true;
            if (term && !name.includes(term)) visible = false;
            if (showCapturedOnly && !isCaptured) visible = false;

            card.style.display = visible ? 'flex' : 'none';
        });

        document.querySelectorAll('.box-group').forEach(group => {
            const hasVisible = Array.from(group.querySelectorAll('.pokemon-item'))
                                    .some(c => c.style.display !== 'none');
            group.style.display = hasVisible ? 'flex' : 'none';
        });
    }

    if (searchBar) searchBar.addEventListener('input', applyFilters);
    if (filterCaptured) filterCaptured.addEventListener('change', applyFilters);


    // --- Funções de Sistema ---
    function updateCardVisuals(slug) {
        const card = document.querySelector(`.pokemon-item[data-slug="${slug}"]`);
        if (!card) return;

        const state = userCapturedState[slug];
        const shinyIcon = card.querySelector('.shiny-indicator');

        if (state) {
            card.classList.add('captured-any');
            if (state.shiny) shinyIcon.classList.add('show');
            else shinyIcon.classList.remove('show');
        } else {
            card.classList.remove('captured-any');
            shinyIcon.classList.remove('show');
        }
    }

    function renderChecklist(pokedexData) {
        const mainContainer = document.getElementById('pokemon-checklist');
        mainContainer.innerHTML = ''; 
        const BOX_SIZE = 30;
        
        for (let i = 0; i < pokedexData.length; i += BOX_SIZE) {
            const chunk = pokedexData.slice(i, i + BOX_SIZE);
            const startNum = chunk[0].regionalDex;
            const endNum = chunk[chunk.length - 1].regionalDex;

            const boxGroup = document.createElement('div');
            boxGroup.className = 'box-group';
            boxGroup.style.display = 'flex';
            boxGroup.style.flexDirection = 'column';
            
            const boxHeader = document.createElement('div');
            boxHeader.className = 'box-header';
            boxHeader.textContent = `Box ${Math.floor(i/BOX_SIZE) + 1} (#${startNum} - #${endNum})`;
            
            const boxGrid = document.createElement('div');
            boxGrid.className = 'pc-box-grid';

            chunk.forEach(poke => {
                const slug = poke.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                poke.slug = slug;

                const card = document.createElement('div');
                card.className = 'pokemon-item';
                card.dataset.slug = slug;
                
                card.innerHTML = `
                    <span class="dex-num">#${poke.regionalDex}</span>
                    
                    <span class="shiny-indicator">⭐</span>
                    
                    <img src="${poke.imageNormal}" alt="${poke.name}">
                    <span class="more-options-icon" title="Detalhes">+</span>
                `;

                updateCardVisualsInRender(card, slug);

                card.addEventListener('click', (e) => {
                    if (e.target.classList.contains('more-options-icon')) {
                        e.stopPropagation();
                        openDetailModal(poke);
                    } else {
                        toggleQuickCheck(slug);
                    }
                });
                
                boxGrid.appendChild(card);
            });

            boxGroup.appendChild(boxHeader);
            boxGroup.appendChild(boxGrid);
            mainContainer.appendChild(boxGroup);
        }
    }

    function updateCardVisualsInRender(card, slug) {
        const state = userCapturedState[slug];
        if (state) {
            card.classList.add('captured-any');
            if (state.shiny) card.querySelector('.shiny-indicator').classList.add('show');
        }
    }

    async function saveCapturedState() {
        if (!userId) return;
        await db.collection('users').doc(userId).collection('my_checklists').doc(checklistId).update({
            captured: userCapturedState,
            progress: Object.keys(userCapturedState).length
        });
    }

    async function fetchGameData(gameId) {
        if (config.status === 'ready' || config.status === 'api-ready') {
            return await loadPokedex(config.regionApiId); 
        } else { throw new Error(`Dados indisponíveis.`); }
    }

    async function loadListMetadata(uid) {
        const doc = await db.collection('users').doc(uid).collection('my_checklists').doc(checklistId).get();
        if (doc.exists) {
            currentListData = doc.data();
            userCapturedState = currentListData.captured || {};
            document.querySelector('header h1').textContent = currentListData.title;
        } else { throw new Error("Lista não encontrada."); }
    }

    // Configuração dos botões de modal de edição
    if(btnSettings) btnSettings.addEventListener('click', () => {
        if(!currentListData) return;
        inputEditName.value = currentListData.title;
        checkEditPublic.checked = currentListData.isPublic;
        shareInput.value = window.location.href;
        modalEdit.classList.remove('hidden');
    });
    if(btnCloseEdit) btnCloseEdit.addEventListener('click', () => modalEdit.classList.add('hidden'));
    
    // Salvar Edição
    if(btnSaveEdit) {
        btnSaveEdit.addEventListener('click', async () => {
            const newName = inputEditName.value.trim();
            const newPublic = checkEditPublic.checked;
            if(!newName) return alert("Nome inválido");

            try {
                await db.collection('users').doc(userId).collection('my_checklists').doc(checklistId).update({
                    title: newName,
                    isPublic: newPublic
                });
                document.querySelector('header h1').textContent = newName;
                currentListData.title = newName;
                currentListData.isPublic = newPublic;
                modalEdit.classList.add('hidden');
                alert("Alterações salvas!");
            } catch(e) {
                alert("Erro ao salvar: " + e.message);
            }
        });
    }

    if(btnCopy) {
        btnCopy.addEventListener('click', () => {
            shareInput.select();
            document.execCommand('copy');
            alert("Link copiado!");
        });
    }

    if (btnDeleteList) {
        btnDeleteList.addEventListener('click', async () => {
            if (confirm('Tem certeza absoluta que deseja excluir esta lista?')) {
                btnDeleteList.textContent = "Excluindo...";
                btnDeleteList.disabled = true;
                try {
                    await db.collection('users').doc(userId).collection('my_checklists').doc(checklistId).delete();
                    alert('Lista excluída.');
                    window.location.href = 'hub.html';
                } catch (error) {
                    alert("Erro: " + error.message);
                    btnDeleteList.textContent = "Excluir";
                    btnDeleteList.disabled = false;
                }
            }
        });
    }
    
    // Inicialização
    auth.onAuthStateChanged(async user => {
        if (!user) { window.location.href = 'index.html'; return; }
        userId = user.uid;
        const container = document.getElementById('pokemon-checklist');
        container.innerHTML = '<p style="text-align:center; padding-top: 50px;">Carregando...</p>';
        try {
            await loadListMetadata(userId);
            const data = await fetchGameData(gameId);
            renderChecklist(data);
        } catch (error) {
            container.innerHTML = `<p style="text-align:center; color:red;">Erro: ${error.message}</p>`;
        }
    });
});