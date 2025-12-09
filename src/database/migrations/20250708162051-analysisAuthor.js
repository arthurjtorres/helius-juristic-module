'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'analysis_author', {
      fk_analysis_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'analysis',
            schema: 'juristic',
          },
          key: 'analysis_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      fk_sector_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'sector',
            schema: 'registry',
          },
          key: 'sector_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      fk_user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'user',
            schema: 'access_control'
          },
          key: 'user_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
    await queryInterface.dropTable('analysis_author', {
      schema: 'juristic',
    });
  }
};
