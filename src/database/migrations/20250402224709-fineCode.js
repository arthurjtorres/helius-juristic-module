'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'fine_code',
      {
        fine_code_id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
        },
        fine_description: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        fine_km: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        fine_alias: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        fine_order: {
          type: Sequelize.STRING,
          allowNull: false,
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
      },
      {
        schema: 'juristic'
      }
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('fine_code', {
      schema: 'registry'
    })
  }
};