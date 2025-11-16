document.addEventListener('DOMContentLoaded', () => {

    // --- 1. VERIFICA SE O USUÁRIO ESTÁ LOGADO ---
    auth.onAuthStateChanged(user => {
        if (!user) {
            // Se não estiver logado, chuta de volta para a página de login
            console.log("Usuário não logado, redirecionando...");
            window.location.href = 'index.html';
        } else {
            // Usuário está logado, podemos ficar.
            console.log("Usuário logado:", user.email);
        }
    });

    // --- 2. LÓGICA DO BOTÃO DE LOGOFF ---
    const logoffButton = document.getElementById('logoff-button');
    
    if (logoffButton) {
        logoffButton.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja sair?')) {
                auth.signOut()
                    .then(() => {
                        // Sign-out successful. Redireciona para o login.
                        window.location.href = 'index.html';
                    })
                    .catch((error) => {
                        console.error('Erro ao fazer logoff:', error);
                    });
            }
        });
    }
});