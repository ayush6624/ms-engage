import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { getDashboardData, getServiceLogs, storeNetworkLogs } from './src/db';
import { pixelHelper, sendEmail } from './src/util';
import sockerServer from './src/socket';

const prisma = new PrismaClient();
const app = express();

app.set('port', process.env.PORT || 3001);
app.use(cors());
app.enable('trust proxy');
app.use(express.json());

const server = require('http').Server(app);

sockerServer(server);

app.get('/', (req, res) => {
	res.send({ message: 'Microsoft Teams Clone Server :)' });
});

app.post('/health', async (req, res) => {
	console.log(req.body);
	await storeNetworkLogs(req.body);
	res.send({ status: 'ok' });
});

app.post('/invite', async (req, res) => {
	const { email, id } = req.body;
	await sendEmail({ email, id });
	res.send({ success: 'true' });
});

app.get('/:id/hello.png', async (req, res) => {
	const service_id: string = req.params.id;
	await pixelHelper(service_id, req, res);
});

app.get('/service', async (req, res) => {
	const data = await getDashboardData();
	res.json({ data });
});

app.get('/service/:id/logs', async (req, res) => {
	if (typeof req.query.paginate === 'undefined') {
		res.send({ message: 'Include ?paginate=N in the query!' });
		res.end();
		return;
	}
	const data = await getServiceLogs(
		req.params.id,
		req.query.paginate!.toString()
	);
	res.send(data);
});

server.listen(app.get('port'), () => {
	console.log(`server started at http://localhost:${app.get('port')}`);
});

export { prisma };
