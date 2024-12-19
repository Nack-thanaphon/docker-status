const express = require('express');
const Docker = require('dockerode');

const app = express();
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

const cors = require('cors');
app.use(cors(
    {
        origin: [
            'http://localhost:8080',
            'http://localhost:3001',
            'http://localhost:3001',
            'https://0b9fb2441df5.ngrok.app/'

        ]
    }
));

// API endpoint to list all containers and their statuses
app.get('/containers', async (req, res) => {
    try {
        const containers = await docker.listContainers({ all: true });
        const containerStatuses = containers
            // .filter(container =>
            //     container.Names[0].includes('wonderland-phpmyadmin-1') ||
            //     container.Names[0].includes('phpmyadmin') ||
            //     container.Names[0].includes('app')
            // )
            .map(container => ({
                id: container.Id,
                name: container.Names[0].replace(/^\//, ''), // Remove leading slash
                image: container.Image,
                status: container.Status,
                state: container.State,
                health: container.Status.includes('(healthy)') ? 'healthy' :
                    container.Status.includes('(unhealthy)') ? 'unhealthy' :
                        container.Status.includes('Up') ? 'starting' : 'unknown'
            }));
        res.json(containerStatuses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch container statuses' });
    }
});

// API endpoint to check the status of a specific container by ID or name
// app.get('/containers/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const container = docker.getContainer(id);
//         const data = await container.inspect();
//         const containerStatuses = data.map(container => ({
//             id: container.Id,
//             name: container.Names[0].replace(/^\//, ''), // Remove leading slash
//             image: container.Image,
//             status: container.Status,
//             state: container.State,
//             health: container.Status.includes('(healthy)') ? 'healthy' :
//                    container.Status.includes('(unhealthy)') ? 'unhealthy' :
//                    container.Status.includes('Up') ? 'starting' : 'unknown'
//         }));
//         res.json(containerStatuses);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Failed to fetch container status' });
//     }
// });

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Docker status API running on http://localhost:${PORT}`);
});