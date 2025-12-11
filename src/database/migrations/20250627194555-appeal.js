'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable(
      'appeal',
      {
        appeal_id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
        },
        appeal_type:{
          type: Sequelize.STRING,
          allowNull: false,
        },
        protocol_number: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        protocol_date: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        response: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        response_date:{
          type: Sequelize.STRING,
          allowNull: true,
        },
        response_ctdop: {
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
        activated: {
          allownull: false,
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
      },
      {
        schema: 'juristic'
      }
    );

  },

  async down(queryInterface, Sequelize) {

    await queryInterface.dropTable('appeal', {
      schema: 'juristic',
    });

  }
};
