async function login() {
  alert("clicou");

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    const resposta = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, senha }),
    });

    const dados = await resposta.json();

    console.log(dados);

    if (dados.sucesso) {
      window.location.href = "consulta.html";
    } else {
      alert("Login inválido");
    }
  } catch (erro) {
    console.error(erro);
    alert("Erro ao conectar com o servidor");
  }
}
