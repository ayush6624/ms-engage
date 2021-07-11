import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { getServiceLogs, storeNetworkLogs } from './src/db';
import { pixelHelper, sendEmail } from './src/util';
import sockerServer from './src/socket';

const prisma = new PrismaClient(); // Instantiate the prisma client
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
	await storeNetworkLogs(req.body); // Stores the Video Call Network quality in the DB
	res.send({ status: 'ok' });
});

app.post('/invite', async (req, res) => {
	const { email, id } = req.body;
	await sendEmail({ email, id }); // Sends an invitation email with the associated roomname
	res.send({ success: 'true' });
});

app.get('/:id/hello.png', async (req, res) => {
	// Pixel Tracking
	const service_id: string = req.params.id;
	await pixelHelper(service_id, req, res);
});

app.get('/service/:id/logs', async (req, res) => {
	// get logs of all the network events (paginated)
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
