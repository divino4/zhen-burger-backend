const express = require("express");
const cors = require("cors");
const axios = require("axios");
const admin = require("firebase-admin");

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 Firebase
const serviceAccount = require("./firebase-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// 🔔 Rota teste
app.get("/", (req, res) => {
  res.send("Servidor Zhen Burger rodando 🚀");
});

// 💰 Criar pagamento PagBank
app.post("/criar-pagamento", async (req, res) => {
  try {
    const { nome, valor } = req.body;

    const response = await axios.post(
      "https://sandbox.api.pagseguro.com/orders",
      {
        reference_id: "pedido-zhen",
        customer: {
          name: nome,
        },
        items: [
          {
            name: "Pedido Zhen Burger",
            quantity: 1,
            unit_amount: valor,
          },
        ],
      },
      {
        headers: {
          Authorization: "Bearer COLOQUE_SEU_TOKEN_AQUI",
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ erro: "Erro ao criar pagamento" });
  }
});

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
