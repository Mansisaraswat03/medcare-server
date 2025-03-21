import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import User from './user.model.js';
import Doctor from './doctor.model.js';

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  patientId: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id'
    },
    allowNull: false
  },
  doctorId: {
    type: DataTypes.UUID,
    references: {
      model: Doctor,
      key: 'id'
    },
    allowNull: false
  },
  appointmentDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
    defaultValue: 'pending'
  },
  type: {
    type: DataTypes.ENUM('online', 'offline'),
    allowNull: false
  },
  problem: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  patientDetails: {
    type: DataTypes.JSONB,
    allowNull: false
  }
}, {
  timestamps: true
});

// Establish relationships
Appointment.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });

export default Appointment; 