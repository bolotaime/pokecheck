// ==========================================================
// ARQUIVO: firebase-init.js
// FUNÇÃO: Inicializar a conexão com o Firebase uma única vez
// ==========================================================

const firebaseConfig = {
    apiKey: "AIzaSyB8WiFk5OCzA9wTOZoIVennX2xhW_nk_Kk",
    authDomain: "pokecheck-4e828.firebaseapp.com",
    projectId: "pokecheck-4e828",
    storageBucket: "pokecheck-4e828.firebasestorage.app",
    messagingSenderId: "845852208358",
    appId: "1:845852208358:web:820e4612660ca8e248df27",
    measurementId: "G-FCR8GF6V94"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// Cria as variáveis globais que os outros scripts vão usar
// Usamos 'window.' para garantir que elas sejam acessíveis em todos os arquivos
window.auth = firebase.auth();
window.db = firebase.firestore();

console.log("Firebase inicializado com sucesso.");