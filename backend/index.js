import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Simulamos una "wallet" interna
let wallet = {
  saldo: 10000 // saldo inicial de tu cuenta
};

// Simulamos una base de datos de alias (alias → saldo)
let cuentas = {
  "alias.test": 0,
  "usuario.demo": 0
};

let ultimoMontoMultiplicado = 0;

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("🚀 Backend Wallet funcionando");
});

// Ruta para multiplicar monto
app.post("/multiplicar", (req, res) => {
  const { monto } = req.body;

  if (!monto || isNaN(monto)) {
    return res.status(400).json({ error: "Monto inválido" });
  }

  const multiplicado = monto * 100;
  ultimoMontoMultiplicado = multiplicado;

  res.json({ resultado: multiplicado });
});

// Ruta para transferir
app.post("/transferir", (req, res) => {
  const { alias } = req.body;

  if (!alias || typeof alias !== "string") {
    return res.status(400).json({ error: "Alias inválido" });
  }

  if (wallet.saldo < ultimoMontoMultiplicado) {
    return res.status(400).json({ error: "Saldo insuficiente en tu wallet" });
  }

  // Descontamos de la wallet
  wallet.saldo -= ultimoMontoMultiplicado;

  // Si no existe el alias, lo creamos
  if (!cuentas[alias]) {
    cuentas[alias] = 0;
  }

  // Le sumamos al alias
  cuentas[alias] += ultimoMontoMultiplicado;

  res.json({
    exito: true,
    enviado: ultimoMontoMultiplicado,
    a: alias,
    nuevoSaldo: wallet.saldo
  });
});

// Ruta para ver saldos (solo para debug)
app.get("/saldos", (req, res) => {
  res.json({
    wallet,
    cuentas
  });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor wallet corriendo en puerto ${PORT}`);
});

