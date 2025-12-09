'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'field_comment', {
      fk_comment_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'comment',
            schema: 'juristic',
          },
          key: 'comment_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      commented_field: {
        type: Sequelize.STRING,
        allowNull: false
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
    await queryInterface.dropTable('field_comment', {
      schema: 'juristic',
    });
  }
};
