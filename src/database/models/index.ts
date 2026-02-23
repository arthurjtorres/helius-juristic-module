import { Sequelize } from "sequelize";
import * as Config from '../config/DatabaseConfig';

export default new Sequelize(Config);

import { setupAssociations } from "./associations";

setupAssociations();