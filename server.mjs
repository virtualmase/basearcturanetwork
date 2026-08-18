import express from "express";
import { paymentMiddleware, x402ResourceServer } from "@x402/express";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));
const addressPattern = /^0x[0-9a-fA-F]{40}$/;

export function readConfig(env = process.env) {
  const config = {
    port: Number(env.PORT ?? 4021),
    network: env.X402_NETWORK ?? "eip155:84532",
    payTo: env.X402_PAY_TO,
    facilitatorUrl: env.X402_FACILITATOR_URL,
    marketAnalysisPrice: env.X402_MARKET_ANALYSIS_PRICE ?? "$0.01",
  };
  const errors = [];
  if (!Number.isInteger(config.port) || config.port < 1 || config.port > 65535) {
    errors.push("PORT must be an integer from 1 to 65535");
  }
  if (config.network !== "eip155:84532") {
    errors.push("canary deployment is restricted to Base Sepolia (eip155:84532)");
  }
  if (!config.payTo || !addressPattern.test(config.payTo) || /^0x0{40}$/i.test(config.payTo)) {
    errors.push("X402_PAY_TO must be an explicit non-zero EVM receiver address");
  }
  if (!config.facilitatorUrl) {
    errors.push("X402_FACILITATOR_URL is required");
  } else {
    try {
      if (new URL(config.facilitatorUrl).protocol !== "https:") {
        errors.push("X402_FACILITATOR_URL must use HTTPS");
      }
    } catch {
      errors.push("X402_FACILITATOR_URL must be a valid URL");
    }
  }
  if (!/^\$0\.0[01]$/.test(config.marketAnalysisPrice)) {
    errors.push("canary price must be $0.00 or $0.01");
  }
  if (errors.length) throw new Error(errors.join("; "));
  return config;
}

export function createApp(config) {
  const app = express();
  app.disable("x-powered-by");

  const facilitator = new HTTPFacilitatorClient({ url: config.facilitatorUrl });
  const resourceServer = new x402ResourceServer(facilitator).register(
    config.network,
    new ExactEvmScheme(),
  );

  app.get("/health", (_request, response) => {
    response.json({
      service: "Arctura x402 Resource Server",
      status: "ok",
      network: config.network,
      x402: "active",
      settlement: "facilitator",
    });
  });

  app.use(
    paymentMiddleware(
      {
        "GET /api/v1/market-analysis": {
          accepts: [
            {
              scheme: "exact",
              price: config.marketAnalysisPrice,
              network: config.network,
              payTo: config.payTo,
            },
          ],
          description: "Arctura Base market analysis canary",
          mimeType: "application/json",
        },
      },
      resourceServer,
    ),
  );

  app.get("/api/v1/market-analysis", (_request, response) => {
    response.json({
      status: "success",
      data: {
        market: "Base Sepolia",
        signal: "canary",
        generatedAt: new Date().toISOString(),
      },
    });
  });

  app.use(express.static(root, { index: "index.html", extensions: ["html"] }));
  return app;
}

export function start(env = process.env) {
  const config = readConfig(env);
  const app = createApp(config);
  return app.listen(config.port, () => {
    console.log(`Arctura x402 listening on http://127.0.0.1:${config.port}`);
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    start();
  } catch (error) {
    console.error(`Startup refused: ${error.message}`);
    process.exitCode = 1;
  }
}
