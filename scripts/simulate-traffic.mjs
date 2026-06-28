const BASE_URL = process.env.BASE_URL || "http://localhost:3001";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function request(path, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${path}`, options);
    console.log(`${options.method || "GET"} ${path} -> ${response.status}`);
  } catch (error) {
    console.error(`${options.method || "GET"} ${path} -> failed`);
  }
}

async function normalTraffic() {
  console.log("Running normal traffic scenario...");

  for (let i = 0; i < 10; i++) {
    await request("/");
    await request("/metrics");
    await delay(500);
  }
}

async function mobileTraffic() {
  console.log("Running mobile traffic scenario...");

  for (let i = 0; i < 10; i++) {
    await request("/", {
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)",
      },
    });
    await delay(500);
  }
}

async function errorTraffic() {
  console.log("Running error traffic scenario...");

  for (let i = 0; i < 10; i++) {
    await request("/api/unknown-route");
    await delay(300);
  }
}

const scenario = process.argv[2] || "normal";

if (scenario === "normal") {
  await normalTraffic();
} else if (scenario === "mobile") {
  await mobileTraffic();
} else if (scenario === "error") {
  await errorTraffic();
} else {
  console.log("Unknown scenario. Use: normal, mobile, or error");
}