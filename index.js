const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const port = process.env.SERVER_PORT || process.env.APP_ORIGIN;
const appOrigin = process.env.APP_ORIGIN;
const audience = process.env.AUTH0_AUDIENCE;
const issuer = process.env.AUTH0_ISSUER;

if (!issuer || !audience) {
    throw new Error("Please make sure that .env is in place and populated");
}

app.use(morgan("dev"));
app.use(helmet());
app.use(cors({ origin: appOrigin }));

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${issuer}.well-known/jwks.json`,
    }),

    audience: audience,
    issuer: issuer,
    algorithms: ["RS256"],
});

app.get("/api/messages/public-message", (req, res) => {
    return res.status(200).json({
        status: "success",
        mensaje: "Mensaje desde el back de un mensaje público",
        data: "hoola guapò"
    })
});

app.get("/api/messages/protected-message", checkJwt, (req, res) => {
    return res.status(200).json({
        status: "success",
        articulo: articuloActualizado,
        mensaje: "Metodo de editar completado"
    })
});

app.listen(appOrigin, () => console.log(`API Server listening on port ${appOrigin}`));