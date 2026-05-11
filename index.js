require("dotenv").config();
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());
app.use(express.static("front"));

app.post("/login", (req, res) => {
  const { email, senha } = req.body || {};
  if (email?.trim() === "calix@gmail.com" && senha?.trim() === "12345")
    return res.json({ sucesso: true });
  return res.json({ sucesso: false });
});

app.post("/plantas", async (req, res) => {
  const { especie, cuidado, regamento } = req.body || {};
  if (!especie || !cuidado || !regamento)
    return res.status(400).json({ erro: "Preencha tudo" });
  try {
    const planta = await prisma.planta.create({
      data: { especie: especie.toLowerCase(), cuidado, regamento },
    });
    return res.json(planta);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: "Erro ao salvar planta" });
  }
});

app.get("/plantas", async (req, res) => {
  const { especie } = req.query;
  const where = especie ? { especie: { contains: especie.toLowerCase() } } : {};
  const plantas = await prisma.planta.findMany({ where });
  return res.json(plantas);
});

app.get("/plantas/todas", async (req, res) => {
  const plantas = await prisma.planta.findMany();
  const agrupado = {};
  plantas.forEach((p) => {
    agrupado[p.especie] = agrupado[p.especie] || [];
    agrupado[p.especie].push(p);
  });
  return res.json(agrupado);
});

app.put("/plantas/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { especie, cuidado, regamento } = req.body || {};
  if (!id || !especie || !cuidado || !regamento)
    return res.status(400).json({ erro: "Dados inválidos" });
  try {
    const planta = await prisma.planta.update({
      where: { id },
      data: {
        especie: especie.toLowerCase(),
        cuidado,
        regamento,
      },
    });
    return res.json(planta);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: "Erro ao atualizar planta" });
  }
});

app.delete("/plantas/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ erro: "ID inválido" });
  try {
    await prisma.planta.delete({ where: { id } });
    return res.json({ sucesso: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: "Erro ao deletar planta" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Servidor rodando em http://localhost:${PORT}`),
);

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
