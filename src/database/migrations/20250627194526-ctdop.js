'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'ctdop',
      {
        ctdop_id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
        },
        ctdop_number: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        receive_date: {
          type: Sequelize.DATEONLY
        },
        doc_type: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        response_date: {
          type: Sequelize.DATEONLY
        },
        ref_month: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        period: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        ref_year: {
          type: Sequelize.SMALLINT,
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
        active: {
          allownull: false,
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
      },
      {
        schema: 'juristic'
      }
    )
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.dropTable('ctdop', {
      schema: 'juristic',
    });

  }
};
