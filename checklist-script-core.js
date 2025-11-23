// Espera todo o conteúdo da página carregar
document.addEventListener('DOMContentLoaded', () => {

    // --- VARIÁVEL GLOBAL PARA O USUÁRIO ---
    // Precisamos saber quem está logado para salvar/carregar os dados corretos.
    let currentUser = null;
    let userId = null; // Vamos guardar o ID do usuário aqui

    // =================================================================
    // PASSO 1: VERIFICAR SE O USUÁRIO ESTÁ LOGADO (SUBSTITUI O INÍCIO)
    // =================================================================
    // O auth (definido no HTML) vai checar o estado do login
    auth.onAuthStateChanged(user => {
        if (user) {
        // --- CÓDIGO NOVO: ATUALIZAR O LINK DO PERFIL ---
        const profileLink = document.getElementById('profile-link');
        if (profileLink) {
            // Agora o botão "Perfil" leva para a visão pública do usuário
            profileLink.href = `profile-public.html?uid=${user.uid}`;
        }}

        if (user) {
            // --- O usuário ESTÁ logado ---
            currentUser = user;
            userId = user.uid; // ID único do usuário
            
            // Agora que sabemos quem é o usuário, carregamos o progresso dele
            loadCapturedState(userId);

            // E ativamos todos os botões e lógicas da página
            setupPageListeners();

        } else {
            // --- O usuário NÃO ESTÁ logado ---
            currentUser = null;
            userId = null;
            
            // Se não tem ninguém logado, manda para a página de login.
            // (No futuro, você criará a 'login.html')
            alert("Você não está logado! Redirecionando para o login...");
            // window.location.href = 'login.html'; // Descomente quando tiver a página
        }

    });

    // =================================================================
    // PASSO 2: REESCREVER A FUNÇÃO DE CARREGAR (loadCapturedState)
    // =================================================================
    
    async function loadCapturedState(userId) {
        if (!userId) return; // Segurança: não faz nada se o ID for nulo

        // 1. Define o "caminho" no banco de dados
        // Coleção 'checklists' -> Documento com o ID do usuário
        const docRef = db.collection('checklists').doc(userId);

        try {
            // 2. Tenta pegar o documento
            const doc = await docRef.get();

            if (doc.exists) {
                // 3. Se o documento existe, pega os dados
                const data = doc.data();
                // 4. Pega o mapa de capturados SÓ DESTE JOGO (ex: legends-za)
                const capturedList = data['legends-za'] || {}; // Usa {} se o mapa desse jogo ainda não existir

                // 5. Itera pela página e aplica a classe (igual ao código antigo)
                document.querySelectorAll('.pokemon-item').forEach(item => {
                    const pokemonName = item.dataset.name;
                    if (capturedList[pokemonName]) {
                        item.classList.add('captured');
                    } else {
                        item.classList.remove('captured'); // Garante que esteja limpo
                    }
                });

            } else {
                // Documento ainda não existe (primeiro login desse usuário)
                console.log("Nenhum dado salvo encontrado para este usuário. (Isso é normal)");
            }
        } catch (error) {
            console.error("Erro ao carregar dados: ", error);
        }
    }

    // =================================================================
    // PASSO 3: REESCREVER A FUNÇÃO DE SALVAR (saveCapturedState)
    // =================================================================
    
    async function saveCapturedState() {
        if (!userId) return; // Não salva se ninguém estiver logado

        const capturedList = {}; // Objeto que vamos salvar

        // 1. Constrói o objeto (igual ao código antigo)
        document.querySelectorAll('.pokemon-item.captured').forEach(item => {
            const pokemonName = item.dataset.name;
            capturedList[pokemonName] = true;
        });

        // 2. Define o "caminho" no banco
        const docRef = db.collection('checklists').doc(userId);

        try {
            // 3. Salva os dados!
            //    Usamos { merge: true } para não apagar dados de outros jogos
            //    que possam estar no mesmo documento.
            await docRef.set({
                'legends-za': capturedList // Salva o objeto dentro de um "mapa" com o nome do jogo
            }, { merge: true });

            console.log("Progresso salvo na nuvem!");

        } catch (error) {
            console.error("Erro ao salvar dados: ", error);
        }
    }

    // =================================================================
    // PASSO 4: AGRUPAR TODOS OS "OUVINTES" (Listeners)
    // =================================================================
    // Esta função só será chamada DEPOIS que o usuário for confirmado
    function setupPageListeners() {

        // Dentro da função setupPageListeners() ...

    // ... (aqui está o código do searchBar) ...

    // --- NOVO: LÓGICA DO BOTÃO DE LOGOFF ---
    const logoffButton = document.getElementById('logoff-button');
    if (logoffButton) {
        logoffButton.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja sair?')) {
                auth.signOut()
                    .then(() => {
                        // Sign-out successful.
                        window.location.href = 'index.html'; // Redirect to login
                    })
                    .catch((error) => {
                        console.error('Erro ao fazer logoff:', error);
                    });
            }
        });
    }
    // --- Fim da lógica do logoff ---

} // Fim da função setupPageListeners
        
        // --- Lógica de clique no Pokémon (igual, mas agora chama a nova save) ---
        const pokemonItems = document.querySelectorAll('.pokemon-item');
        pokemonItems.forEach(item => {
            item.addEventListener('click', () => {
                item.classList.toggle('captured');
                saveCapturedState(); // Chama a nova função async
            });
        });

        // --- Lógica do Botão de Reset (igual, mas agora chama a nova save) ---
        const resetButton = document.getElementById('reset-button');
        resetButton.addEventListener('click', () => {
            const capturedItems = document.querySelectorAll('.pokemon-item.captured');
            if (capturedItems.length > 0) {
                if (confirm('Tem certeza que deseja desmarcar TODOS os Pokémon capturados?')) {
                    capturedItems.forEach(item => {
                        item.classList.remove('captured');
                    });
                    saveCapturedState(); // Chama a nova função async
                }
            }
        });

        // --- Lógica da Barra de Busca (exatamente igual, não mexe com dados) ---
        const searchBar = document.getElementById('search-bar');
        const allPokemon = document.querySelectorAll('.pokemon-entry');
        searchBar.addEventListener('input', () => {
            const searchTerm = searchBar.value.toLowerCase().trim();
            allPokemon.forEach(entry => {
                const pokemonName = entry.querySelector('h3').textContent.toLowerCase();
                if (pokemonName.includes(searchTerm)) {
                    entry.classList.remove('hidden');
                } else {
                    entry.classList.add('hidden');
                }
            });
        });
    }
); // Fim do 'DOMContentLoaded'