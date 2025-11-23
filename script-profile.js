document.addEventListener('DOMContentLoaded', () => {
    
    // --- Elementos da Tela ---
    const avatarList = document.getElementById('avatar-list');
    const displayNameInput = document.getElementById('display-name');
    const fcSwitchInput = document.getElementById('fc-switch');
    const fc3dsInput = document.getElementById('fc-3ds');
    const showZaCheckbox = document.getElementById('show-za');
    
    const saveButton = document.getElementById('save-profile-btn');
    const viewPublicBtn = document.getElementById('view-public-btn');
    const logoffButton = document.getElementById('logoff-button');
    const resetPassBtn = document.getElementById('reset-password-btn');
    const msgArea = document.getElementById('msg-area');

    // --- Configuração de Avatares ---
    let selectedAvatar = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'; // Default
    const avatars = [
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',   // Bulbasaur
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',   // Charmander
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',   // Squirtle
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',  // Pikachu
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png', // Eevee
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png', // Mewtwo
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png', // Mew
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png',  // Gengar
    ];

    // Renderiza as opções de avatar
    avatars.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        img.classList.add('avatar-option');
        img.addEventListener('click', () => {
            // Remove seleção dos outros e marca este
            document.querySelectorAll('.avatar-option').forEach(el => el.classList.remove('selected'));
            img.classList.add('selected');
            selectedAvatar = url;
        });
        avatarList.appendChild(img);
    });

    // ==========================================================
    // --- FUNÇÃO DE MÁSCARA PARA FRIEND CODES ---
    // ==========================================================
    function formatFCInput(input, prefix = '', groupSize = 4) {
        let value = input.value.toUpperCase().replace(/[^0-9A-Z]/g, '');
        let formatted = prefix;

        // Remove prefixo para contar apenas dígitos/letras
        if (prefix && value.startsWith(prefix.replace('-', ''))) {
             value = value.substring(prefix.replace('-', '').length);
        }
        
        let counter = 0;
        for (let i = 0; i < value.length; i++) {
            if (counter > 0 && counter % groupSize === 0) {
                formatted += '-';
            }
            formatted += value[i];
            counter++;
        }
        
        // Limita o tamanho total (sem contar o prefixo e traços) a 12 caracteres
        const maxLength = prefix === 'SW-' ? 14 + 3 : 13 + 1; // 12 dígitos + 3 traços ou 2 traços
        if (formatted.length > maxLength) {
            formatted = formatted.substring(0, maxLength);
        }

        input.value = formatted;
    }
    
    // --- Adiciona os Listeners para Formatação ---
    fc3dsInput.addEventListener('input', () => formatFCInput(fc3dsInput, '', 4));
    fcSwitchInput.addEventListener('input', () => formatFCInput(fcSwitchInput, 'SW-', 4));
    // ==========================================================


    // --- AUTENTICAÇÃO & CARREGAMENTO ---
    auth.onAuthStateChanged(async user => {
        if (!user) {
            window.location.href = 'index.html';
            return;
        }

        // 1. Carrega dados salvos no Firestore (Coleção 'users')
        const docRef = db.collection('users').doc(user.uid);
        
        try {
            const doc = await docRef.get();
            if (doc.exists) {
                const data = doc.data();
                
                // Preenche os campos
                displayNameInput.value = data.displayName || '';
                
                // Preenche os FCs já formatados
                fcSwitchInput.value = data.fcSwitch || '';
                fc3dsInput.value = data.fc3ds || '';
                
                // Checkbox de privacidade
                if (data.privacy) {
                    showZaCheckbox.checked = (data.privacy.showZa !== false);
                }

                // Seleciona o avatar salvo visualmente
                if (data.photoURL) {
                    selectedAvatar = data.photoURL;
                    // Procura a imagem na lista e adiciona a classe .selected
                    const savedImg = Array.from(document.querySelectorAll('.avatar-option')).find(img => img.src === data.photoURL);
                    if (savedImg) savedImg.classList.add('selected');
                }
            }
        } catch (error) {
            console.error("Erro ao carregar perfil:", error);
        }

        // --- AÇÃO: Ver Perfil Público ---
        viewPublicBtn.addEventListener('click', () => {
            // Redireciona para a página pública passando o ID do usuário logado
            window.location.href = `profile-public.html?uid=${user.uid}`;
        });
    });


    // --- AÇÃO: Salvar Alterações ---
    saveButton.addEventListener('click', async () => {
        const user = auth.currentUser;
        if (!user) return;

        const originalText = saveButton.textContent;
        saveButton.textContent = "Salvando...";
        saveButton.disabled = true;

        const profileData = {
            displayName: displayNameInput.value || 'Treinador',
            fcSwitch: fcSwitchInput.value, // Salva o valor formatado
            fc3ds: fc3dsInput.value,    // Salva o valor formatado
            photoURL: selectedAvatar,
            privacy: {
                showZa: showZaCheckbox.checked
            },
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        try {
            await db.collection('users').doc(user.uid).set(profileData, { merge: true });
            
            // Sucesso
            msgArea.textContent = 'Perfil salvo com sucesso!';
            msgArea.style.color = 'green';
            
        } catch (error) {
            // ERRO: Exibe o erro na tela
            console.error("Erro ao salvar:", error);
            msgArea.textContent = 'ERRO: Permissão Negada ou falha na conexão. Verifique as regras do Firebase.';
            msgArea.style.color = 'red';

        } finally {
            saveButton.textContent = originalText;
            saveButton.disabled = false;
        }
    });


    // --- AÇÃO: Logoff ---
    logoffButton.addEventListener('click', () => {
        if (confirm('Sair da conta?')) {
            auth.signOut().then(() => window.location.href = 'index.html');
        }
    });


    // --- AÇÃO: Redefinir Senha ---
    resetPassBtn.addEventListener('click', () => {
        const user = auth.currentUser;
        if (user && user.email) {
            auth.sendPasswordResetEmail(user.email)
                .then(() => {
                    msgArea.textContent = `Email enviado para ${user.email}. Verifique sua caixa de entrada (e spam).`;
                    msgArea.style.color = 'green';
                })
                .catch(err => {
                    msgArea.textContent = `Erro: ${err.message}`;
                    msgArea.style.color = 'red';
                });
        } else {
            msgArea.textContent = "Não foi possível identificar seu email.";
        }
    });

});