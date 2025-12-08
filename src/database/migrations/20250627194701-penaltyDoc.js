'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'penalty_doc',
      {
        penalty_doc_id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
        },
        //Usa o enum DocType para definir se é auto ou notificação
        penalty_doc_type:{
          type: Sequelize.STRING,
          allowNull: false,
        },
        // Identificação disponível para o usuário
        penalty_doc_registration: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        penalty_doc_number: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        fk_ctdop_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: {
              tableName: 'ctdop',
              schema: 'juristic',
            },
            key: 'ctdop_id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        fk_appeal_id: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: {
              tableName: 'appeal',
              schema: 'juristic',
            },
            key: 'appeal_id',
          },
        },
        fk_penalty_info_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: {
              tableName: 'penalty_info',
              schema: 'juristic',
            },
            key: 'penalty_info_id',
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

      }, {
      schema: 'juristic',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('penalty_doc', {
      schema: 'juristic',
    });
  }
};
