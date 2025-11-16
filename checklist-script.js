// Espera todo o conteúdo da página carregar antes de rodar o script
document.addEventListener('DOMContentLoaded', () => {

    // --- NOVO: Nome da "chave" onde salvaremos os dados ---
    // Vamos guardar um registro de todos os pokémons capturados aqui
    const STORAGE_KEY = 'pokemonCapturedList';

    // --- NOVO: Função para Carregar o Estado Salvo ---
    function loadCapturedState() {
        // 1. Pega os dados salvos no localStorage. Pode ser que não exista nada (null).
        const capturedJSON = localStorage.getItem(STORAGE_KEY);

        // 2. Se houver dados, transforma o texto (JSON) de volta em um objeto
        if (capturedJSON) {
            const capturedList = JSON.parse(capturedJSON);
            
            // 3. Passa por cada item da página
            document.querySelectorAll('.pokemon-item').forEach(item => {
                const pokemonName = item.dataset.name;
                
                // 4. Se o nome deste item estiver na lista salva, aplica a classe 'captured'
                if (capturedList[pokemonName]) {
                    item.classList.add('captured');
                }
            });
        }
    }

    // --- NOVO: Função para Salvar o Estado Atual ---
    function saveCapturedState() {
        const capturedList = {}; // Cria um objeto vazio

        // Passa por todos os itens que TÊM a classe 'captured'
        document.querySelectorAll('.pokemon-item.captured').forEach(item => {
            // Adiciona o nome do Pokémon (do 'data-name') ao objeto
            const pokemonName = item.dataset.name;
            capturedList[pokemonName] = true;
        });

        // Converte o objeto para texto (JSON) e salva no localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(capturedList));
    }

    // --- MODIFICADO: Lógica de Clique ---
    
    // Seleciona TODOS os itens que têm a classe .pokemon-item
    const pokemonItems = document.querySelectorAll('.pokemon-item');

    // Itera (passa por) cada um desses itens
    pokemonItems.forEach(item => {
        
        // Adiciona um "ouvinte" de clique a cada item
        item.addEventListener('click', () => {
            
            // Alterna a classe 'captured' (como antes)
            item.classList.toggle('captured');
            
            // --- NOVO: Salva o estado ---
            // Após qualquer clique, salvamos o estado atual no localStorage
            saveCapturedState();
        });
    });

    // --- NOVO: Carrega o estado salvo ---
    // Assim que a página carregar, chama a função para carregar os dados
    loadCapturedState();
});

// --- NOVO: Lógica da Barra de Busca ---

    // 1. Encontra a barra de busca
    const searchBar = document.getElementById('search-bar');
    // 2. Encontra a lista de todos os "cards" de pokémon
    const allPokemon = document.querySelectorAll('.pokemon-entry');

    // 3. Adiciona um "ouvinte" ao evento 'input' (dispara a cada tecla digitada)
    searchBar.addEventListener('input', () => {
        
        // 4. Pega o valor da busca, remove espaços e converte para minúsculas
        const searchTerm = searchBar.value.toLowerCase().trim();

        // 5. Passa por cada "card" de Pokémon
        allPokemon.forEach(entry => {
            
            // 6. Pega o nome do Pokémon (que está no <h3>)
            const pokemonName = entry.querySelector('h3').textContent.toLowerCase();

            // 7. Verifica se o nome do Pokémon INCLUI o termo da busca
            if (pokemonName.includes(searchTerm)) {
                // Se incluir, mostra o card (remove a classe 'hidden')
                entry.classList.remove('hidden');
            } else {
                // Se não incluir, esconde o card (adiciona a classe 'hidden')
                entry.classList.add('hidden');
            }
        });
    });
    // --- Fim da lógica da Barra de Busca ---

// --- Lógica do Botão de Reset (MODIFICADA) ---
    
    // 1. Encontra o botão
    const resetButton = document.getElementById('reset-button');

    // 2. Adiciona o "ouvinte" de clique
    resetButton.addEventListener('click', () => {
        
        // 3. PRIMEIRO, encontramos os itens que já estão capturados
        const capturedItems = document.querySelectorAll('.pokemon-item.captured');

        // 4. SÓ executamos o resto se o número de itens for MAIOR QUE ZERO
        if (capturedItems.length > 0) {
            
            // 5. Agora sim, pedimos a confirmação
            if (confirm('Tem certeza que deseja desmarcar TODOS os Pokémon capturados?')) {
                
                // 6. Remove a classe 'captured' de cada um
                capturedItems.forEach(item => {
                    item.classList.remove('captured');
                });
                
                // 7. Salva o estado limpo
                saveCapturedState();
            }
        }
        // Se capturedItems.length for 0, o clique simplesmente não faz nada.
    });