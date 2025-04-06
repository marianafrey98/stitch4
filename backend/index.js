import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let saldoMultiplicado = 0;

app.get("/", (req, res) => {
  res.send("Servidor Stitch funcionando 🚀");
});

app.post("/multiplicar", (req, res) => {
  const { monto } = req.body;
  saldoMultiplicado = Number(monto) * 100;
  res.json({ saldoMultiplicado });
});

app.post("/transferir", async (req, res) => {
  const { alias } = req.body;

  try {
    const response = await axios.post(
      "https://api.mercadopago.com/v1/transfers",
      {
        transaction_amount: saldoMultiplicado,
        target: {
          type: "alias",
          value: alias
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error("Error al transferir:", error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
