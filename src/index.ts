import { api } from './api';
import  dotenv from 'dotenv';

dotenv.config();

const port = Number(process.env.PORT) || 3000;

api.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost ${port}`)
});