'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Booking extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Booking.init(
		{
			statusId: DataTypes.STRING,
			doctorId: DataTypes.INTEGER,
			patientId: DataTypes.INTEGER,
			date: DataTypes.STRING, // nên lưu timestamp vì khi lên react sẽ format ngày tháng theo đúng ý
			timeType: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: 'Booking',
		}
	);
	return Booking;
};

// create field in database
