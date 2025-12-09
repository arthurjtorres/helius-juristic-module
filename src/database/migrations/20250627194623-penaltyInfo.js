'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'penalty_info',
      {
        penalty_info_id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
        },
        fk_company_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: {
              tableName: 'company',
              schema: 'registry',
            },
            key: 'company_id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        fk_vehicle_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: {
              tableName: 'vehicle',
              schema: 'registry',
            },
            key: 'vehicle_id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        fk_bus_timetable_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: {
              tableName: 'bus_timetable',
              schema: 'registry',
            },
            key: 'bus_timetable_id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        date: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        time: {
          type: DataTypes.TIME,
          allowNull: false,
        },
        fk_agent_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: {
              tableName: 'agent',
              schema: 'juristic'
            },
            key: 'agent_id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        fk_fine_code_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: {
              tableName: 'fine_code',
              schema: 'juristic'
            },
            key: 'fine_code_id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        fk_location_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: {
              tableName: 'location',
              schema: 'registry',
            },
            key: 'location_id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        agent_annotation: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        penalty_info_status: {
          type: Sequelize.STRING,
          allowNull: false
        },
        fk_motive_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: {
              tableName: 'motive',
              schema: 'juristic',
            },
            key: 'motive_id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        internal_annotation: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        created_by: {
          allowNull: false,
          type: DataTypes.UUID,
          references: {
            model: {
              tableName: "user",
              schema: "access_control",
            },
            key: "user_id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updated_by: {
          allowNull: false,
          type: DataTypes.UUID,
          references: {
            model: {
              tableName: "user",
              schema: "access_control",
            },
            key: "user_id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        active: {
          allownull: false,
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
      }, {
      schema: 'juristic',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('penalty_info', {
      schema: 'juristic',
    });
  }
};
