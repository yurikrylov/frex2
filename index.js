var express = require('express');
var app = express();
const { Client } = require('pg');
const util = require ("util");
const fs = require ("fs");
const readFileAsync = util.promisify (fs.readFile); 
const Mustache = require ("mustache");

app.get('/', async function (req, res) {

	let data = await readFileAsync ("./public/index.html", "utf8");
	let content = "";

	var view = {
	  content
	};
	var output = Mustache.render(data, view);
  	res.send(output);
});
app.get('/public/allseasons.html', async function (req, res) {

	let data = await readFileAsync ("./public/allseasons.html", "utf8");
	let content = "";

	var view = {
	  content
	};
	var output = Mustache.render(data, view);
  	res.send(output);
});

app.get('/episodes/:episodeID', async function (req, res) {
	const p1 = req.params[0];
	const client = new Client("tcp://frex:1@127.0.0.1:5432/frex");
	await client.connect()
	const res2 = await client.query("select string_id, text_en, text_ru from ep_text where string_id=$1",[p1]);

	await client.end()

	let data = await readFileAsync ("./public/episode.html", "utf8");
	let content = "";

	res2.rows.forEach (row => {
		content += `<div>
						<a href="#" onClick="document.getElementById ('${row.string_id}').style.display = 'block';">${row.text_en}</a>
						<div id="${row.string_id}" style="display: none">${row.text_ru}</div>
					</div>`;
	});
	var view = {
	  content
	};
	var output = Mustache.render(data, view);
  	res.send(output);
});
app.get('/public/style/*', async function (req, res) {
	let data = await readFileAsync ("." + req.url, "utf8");

	res.set('Content-Type', 'text/css');
  	res.end(data);
});
app.get('/public/js/*', async function (req, res) {
	let data = await readFileAsync ("." + req.url, "utf8");

	res.set('Content-Type', ' application/javascript');
  	res.end(data);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

