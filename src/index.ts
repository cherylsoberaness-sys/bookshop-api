import { api } from './api';
import  dotenv from 'dotenv';
import { environmentService } from './insfrastructure/EnvironmentService';

environmentService.load();

const { PORT } = environmentService.get();

const port = Number(process.env.PORT) || 3000;

api.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost ${PORT}`);
});