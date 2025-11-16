document.addEventListener('DOMContentLoaded', () => {

    // --- Referências dos Elementos ---
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const googleLoginButton = document.getElementById('google-login-button');

    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');

    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');
    
    // --- 1. VERIFICA SE O USUÁRIO JÁ ESTÁ LOGADO ---
    // Se já estiver, manda direto para o Hub
    auth.onAuthStateChanged(user => {
        if (user) {
            console.log("Usuário já está logado. Redirecionando para o hub...");
            window.location.href = 'hub.html';
        }
    });

    // --- 2. LÓGICA DE LOGIN COM EMAIL/SENHA ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede o formulário de recarregar a página
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Login bem-sucedido! O onAuthStateChanged vai cuidar do redirecionamento
            })
            .catch((error) => {
                loginError.textContent = "Email ou senha incorretos.";
                loginError.style.display = 'block';
            });
    });

    // --- 3. LÓGICA DE REGISTRO COM EMAIL/SENHA ---
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Registro bem-sucedido! O onAuthStateChanged vai cuidar do redirecionamento
            })
            .catch((error) => {
                if (error.code == 'auth/weak-password') {
                    registerError.textContent = 'A senha precisa ter no mínimo 6 caracteres.';
                } else if (error.code == 'auth/email-already-in-use') {
                    registerError.textContent = 'Este email já está em uso.';
                } else {
                    registerError.textContent = 'Erro ao registrar: ' + error.message;
                }
                registerError.style.display = 'block';
            });
    });

    // --- 4. LÓGICA DE LOGIN COM GOOGLE ---
    googleLoginButton.addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        
        auth.signInWithPopup(provider)
            .then((result) => {
                // Login com Google bem-sucedido! O onAuthStateChanged vai cuidar do redirecionamento
            })
            .catch((error) => {
                loginError.textContent = 'Erro ao logar com Google: ' + error.message;
                loginError.style.display = 'block';
            });
    });

    // --- 5. Lógica para alternar entre os formulários ---
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });
    
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });
});