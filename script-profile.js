document.addEventListener('DOMContentLoaded', () => {

    // Referências
    const userEmailDisplay = document.getElementById('user-email-display');
    const userIdDisplay = document.getElementById('user-id-display');
    const logoffButton = document.getElementById('logoff-button');
    const resetPasswordButton = document.getElementById('reset-password-button');
    const resetMessage = document.getElementById('reset-message');

    // --- 1. VERIFICA SE O USUÁRIO ESTÁ LOGADO ---
    auth.onAuthStateChanged(user => {
        if (user) {
            // Usuário está logado, preenche as informações
            userEmailDisplay.textContent = user.email;
            userIdDisplay.textContent = user.uid;
            
            // Esconde o botão de redefinir senha se for login social (Google)
            if (user.providerData.some(provider => provider.providerId === 'google.com')) {
                resetPasswordButton.style.display = 'none';
                resetMessage.textContent = 'Não é possível redefinir a senha de contas Google.';
                resetMessage.style.color = '#777';
                resetMessage.style.display = 'block';
            }

        } else {
            // Se não estiver logado, chuta de volta para a página de login
            console.log("Usuário não logado, redirecionando...");
            window.location.href = 'index.html';
        }
    });

    // --- 2. LÓGICA DO BOTÃO DE LOGOFF ---
    logoffButton.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja sair?')) {
            auth.signOut().then(() => {
                window.location.href = 'index.html';
            });
        }
    });

    // --- 3. LÓGICA DE REDEFINIR SENHA ---
    resetPasswordButton.addEventListener('click', () => {
        const user = auth.currentUser;
        if (user && user.email) {
            auth.sendPasswordResetEmail(user.email)
                .then(() => {
                    resetMessage.textContent = 'Email de redefinição de senha enviado para ' + user.email;
                    resetMessage.style.color = 'green';
                    resetMessage.style.display = 'block';
                })
                .catch((error) => {
                    resetMessage.textContent = 'Erro ao enviar email: ' + error.message;
                    resetMessage.style.color = 'red';
                    resetMessage.style.display = 'block';
                });
        }
    });

});