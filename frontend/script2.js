async function salvar() {
  const especie = document.getElementById("nome").value.trim();
  const cuidado = document.getElementById("cuidados").value.trim();
  const regamento = document.getElementById("rega").value.trim();

  if (!especie || !cuidado || !regamento) {
    alert("Preencha todos os campos antes de salvar");
    return;
  }

  try {
    const resposta = await fetch("http://localhost:3000/plantas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ especie, cuidado, regamento }),
    });
    const data = await resposta.json();

    if (!resposta.ok) {
      alert(data.erro || "Erro ao salvar planta");
      return;
    }

    alert("Planta cadastrada com sucesso!");
    document.getElementById("nome").value = "";
    document.getElementById("cuidados").value = "";
    document.getElementById("rega").value = "";
  } catch (err) {
    console.error(err);
    alert("Erro de conexão ao salvar planta");
  }
}

async function listarPlantas(especie = "") {
  try {
    const url = especie
      ? `http://localhost:3000/plantas?especie=${encodeURIComponent(especie)}`
      : "http://localhost:3000/plantas";
    const resposta = await fetch(url);

    if (!resposta.ok) {
      console.error("Erro na API:", resposta.status);
      return [];
    }

    return await resposta.json();
  } catch (err) {
    console.error("Erro de conexão:", err);
    return [];
  }
}

async function verTodas() {
  const plantas = await listarPlantas();
  abrirDialog(plantas);
}

async function consultar() {
  const especie = document.getElementById("busca").value.trim();

  if (!especie) {
    alert("Digite a espécie para consultar");
    return;
  }

  const plantas = await listarPlantas(especie);
  abrirDialog(plantas);
}

function abrirDialog(plantas) {
  const dialogo = document.getElementById("meuDialogo");
  const lista = document.getElementById("listaPlantas");

  if (!plantas || plantas.length === 0) {
    lista.innerHTML = "<div>Nenhuma planta encontrada.</div>";
  } else {
    lista.innerHTML = plantas
      .map(
        (planta) => `
        <div style="margin-bottom: 15px; border-bottom: 1px solid #ccc; padding-bottom: 10px;">
          <strong>Planta: ${planta.especie}</strong><br>
          - Cuidados: ${planta.cuidado}<br>
          - Regamento: ${planta.regamento}<br><br>
          <button onclick="editar(${planta.id})">Editar</button>
          <button class="btn-delete" onclick="deletar(${planta.id})">Deletar</button>
        </div>
      `,
      )
      .join("");
  }

  if (dialogo.open) dialogo.close();
  dialogo.showModal();
}

function fecharDialog() {
  document.getElementById("meuDialogo").close();
}

async function editar(id) {
  try {
    const plantas = await listarPlantas();
    const planta = plantas.find((p) => p.id === Number(id));

    if (!planta) {
      alert("Planta não encontrada");
      return;
    }

    document.getElementById("dialogEditar").showModal();
    document.getElementById("editNomeAntigo").value = id;
    document.getElementById("editNome").value = planta.especie;
    document.getElementById("editCuidados").value = planta.cuidado;
    document.getElementById("editRega").value = planta.regamento;
  } catch (err) {
    console.error(err);
    alert("Erro ao carregar planta para edição");
  }
}

async function salvarEdicao() {
  const id = Number(document.getElementById("editNomeAntigo").value);
  const especie = document.getElementById("editNome").value.trim();
  const cuidado = document.getElementById("editCuidados").value.trim();
  const regamento = document.getElementById("editRega").value.trim();

  if (!id || !especie || !cuidado || !regamento) {
    alert("Preencha todos os campos para salvar a edição");
    return;
  }

  try {
    const resposta = await fetch(`http://localhost:3000/plantas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ especie, cuidado, regamento }),
    });
    const data = await resposta.json();

    if (!resposta.ok) {
      alert(data.erro || "Erro ao atualizar planta");
      return;
    }

    document.getElementById("dialogEditar").close();
    document.getElementById("meuDialogo").close();
    alert("Planta atualizada com sucesso!");
  } catch (err) {
    console.error(err);
    alert("Erro de conexão ao atualizar planta");
  }
}

function fecharEditar() {
  document.getElementById("dialogEditar").close();
}

async function deletar(id) {
  if (!confirm("Deseja deletar essa planta?")) return;

  try {
    const resposta = await fetch(`http://localhost:3000/plantas/${id}`, {
      method: "DELETE",
    });
    const data = await resposta.json();

    if (!resposta.ok) {
      alert(data.erro || "Erro ao deletar planta");
      return;
    }

    alert("Planta deletada com sucesso!");
    document.getElementById("meuDialogo").close();
  } catch (err) {
    console.error(err);
    alert("Erro de conexão ao deletar planta");
  }
}

window.addEventListener("load", () => {});
