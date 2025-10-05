import express from "express";
import bodyParser from "body-parser";

import { mouse, Point, Button, keyboard, Key, sleep, clipboard, screen, imageResource, centerOf } from "@nut-tree-fork/nut-js";
import { exec } from "child_process";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.render("home.ejs");
});

app.post("/submit", async (req, res) => {
	try {
		const linha = req.body.linha;
		const linhas = linha.split(" ");
		const linhaAtual = linhas[0];
		const btnSubmit = req.body.btnSubmit;
		const url = req.body.url;
		const camposDinamicos = Number(req.body.camposDinamicos);
		const camposPadroes = Number(req.body.camposPadroes);
		// const btns = Number(req.body.btns);

		console.log(linhaAtual);

		const inp = {};
		const colunas = {};

		const inpPadrao = {};
		const valorPadrao = {};

		// const botoes = {};
		// const cores = {};

		for (let i = 1; i <= camposDinamicos; i++) {
			inp[i] = req.body[`inp${i}`];
			colunas[i] = req.body[`valor${i}`];
		}

		for (let i = 1; i <= camposPadroes; i++) {
			inpPadrao[i] = req.body[`inpPadrao${i}`];
			valorPadrao[i] = req.body[`valorPadrao${i}`];
		}

		// for (let i = 1; i <= btns; i++) {
		// 	botoes[i] = req.body[`btn${i}`];
		// 	cores[i] = req.body[`cor${i}`];
		// }

		if (url) {
			exec(`open ${url}`);
			await sleep(5000);
		}

		const valores = linhaAtual.split("\t");
		console.log(valores);

		for (let i = 1; i <= camposPadroes; i++) {
			const x = inpPadrao[i].split("/")[0];
			const y = inpPadrao[i].split("/")[1];
			await mouse.setPosition(new Point(Number(x), Number(y)));
			await mouse.click(Button.LEFT);
			await mouse.click(Button.LEFT);

			const textoParaInserir = `${valorPadrao[i]}`;
			await clipboard.setContent(textoParaInserir);

			const commandKey = Key.LeftSuper;

			await keyboard.pressKey(commandKey, Key.V);
			await keyboard.releaseKey(commandKey, Key.V);
		}
		for (let i = 1; i <= camposDinamicos; i++) {
			const x = inp[i].split("/")[0];
			const y = inp[i].split("/")[1];

			await mouse.setPosition(new Point(Number(x), Number(y)));
			await mouse.click(Button.LEFT);
			await mouse.click(Button.LEFT);

			const textoParaInserir = `${valores[Number(colunas[i]) - 1]}`;
			await clipboard.setContent(textoParaInserir);

			const commandKey = Key.LeftSuper;

			await keyboard.pressKey(commandKey, Key.V);
			await keyboard.releaseKey(commandKey, Key.V);
		}

		if (btnSubmit) {
			const x = btnSubmit.split("/")[0];
			const y = btnSubmit.split("/")[1];

			await mouse.setPosition(new Point(Number(x), Number(y)));
			await mouse.click(Button.LEFT);
			await mouse.click(Button.LEFT);
		}
		res.status(200).send("OK"); // encerra a request
	} catch (err) {
		res.status(500).send(err.message);
	}
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

// (async () => {
// 	await mouse.setPosition(new Point(-809, 430));
// 	await mouse.click(Button.LEFT);
// 	await mouse.click(Button.LEFT);

// 	await keyboard.type("João");
// 	await keyboard.type(Key.Tab);

// 	await keyboard.type("Bispo");
// })();

// setInterval(async () => {
// 	const pos = await mouse.getPosition();
// 	console.clear();
// 	console.log(`X: ${pos.x}, Y: ${pos.y}`);
// }, 100);
